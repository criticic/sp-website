import { db } from "@/db";
import { committees, members, committeeMembers } from "@/db/schema";
import { eq, asc } from 'drizzle-orm';
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import Link from "next/link";
import { FaArrowLeft, FaUserPlus, FaTrash, FaCrown } from "react-icons/fa";
import Image from "next/image";

const CommitteeSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  description: z.string().optional(),
  email: z.string().email('Invalid email.').optional().or(z.literal('')),
});

const CommitteeMemberSchema = z.object({
    memberId: z.coerce.number(),
    committeeName: z.string(),
    role: z.string().min(1, 'Role is required.'),
    isConvenor: z.coerce.boolean(),
});

async function updateCommittee(currentName: string, formData: FormData) {
    'use server';
    const validatedFields = CommitteeSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) { 
        throw new Error('Validation failed: ' + JSON.stringify(validatedFields.error.flatten().fieldErrors)); 
    }
    try {
        await db.update(committees).set(validatedFields.data).where(eq(committees.name, currentName));
    } catch (error) { throw new Error('Failed to update committee.' + error); }
    revalidatePath('/admin/committees');
    revalidatePath('/team');
    revalidatePath(`/admin/committees/edit/${currentName}`);
    revalidatePath(`/admin/committees/edit/${validatedFields.data.name}`);
    redirect(`/admin/committees/edit/${validatedFields.data.name}`);
}

async function addMemberToCommittee(formData: FormData) {
    'use server';
    const validatedFields = CommitteeMemberSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) { console.error(validatedFields.error); return; }
    try {
        await db.insert(committeeMembers).values(validatedFields.data);
    } catch (error) { throw new Error('Failed to add member to committee.' + error); }
    revalidatePath('/admin/committees');
    revalidatePath('/team');
    revalidatePath(`/admin/committees/edit/${validatedFields.data.committeeName}`);
}

async function removeMemberFromCommittee(id: number, committeeName: string) {
    'use server';
    try {
        await db.delete(committeeMembers).where(eq(committeeMembers.id, id));
    } catch (error) { throw new Error('Failed to remove member from committee.' + error); }
    revalidatePath('/admin/committees');
    revalidatePath('/team');
    revalidatePath(`/admin/committees/edit/${committeeName}`);
}

export default async function EditCommitteePage({ params }: { params: Promise<{ name: string }> }): Promise<React.JSX.Element> {
    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    const committee = await db.query.committees.findFirst({
        where: eq(committees.name, decodedName),
        with: {
            committeeMembers: {
                with: { member: true },
                orderBy: (cm, { desc }) => [desc(cm.isConvenor)],
            },
        },
    });

    if (committee) {
        committee.committeeMembers.sort((a, b) => {
            if (a.isConvenor && !b.isConvenor) return -1;
            if (!a.isConvenor && b.isConvenor) return 1;
            return a.member.name.localeCompare(b.member.name);
        });
    }

    if (!committee) { notFound(); }

    const allMembers = await db.select().from(members).orderBy(asc(members.name));
    const memberIdsInCommittee = new Set(committee.committeeMembers.map(cm => cm.member.id));
    const availableMembers = allMembers.filter(m => !memberIdsInCommittee.has(m.id));

    const updateCommitteeAction = updateCommittee.bind(null, committee.name);

    return (
        <div>
            <Link href="/admin/committees" className="inline-flex items-center gap-2 font-mono text-xs text-slate hover:text-gold transition-colors mb-8">
                <FaArrowLeft className="w-3 h-3" />
                Back to Committees
            </Link>
            <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-1">Admin</p>
            <h1 className="text-2xl md:text-3xl mb-8">{committee.name}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <h2 className="text-xl mb-4">Details</h2>
                    <div className="bg-light-parchment border border-slate/10 p-6">
                        <form action={updateCommitteeAction}>
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="name" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Name</label>
                                    <input type="text" name="name" id="name" defaultValue={committee.name} required className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Description</label>
                                    <textarea name="description" id="description" rows={4} defaultValue={committee.description || ''} className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors"></textarea>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Email</label>
                                    <input type="email" name="email" id="email" defaultValue={committee.email || ''} className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                                </div>
                                <button type="submit" className="w-full px-5 py-3 bg-ink text-white text-sm font-body font-medium hover:bg-gold hover:text-ink transition-colors">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <h2 className="text-xl mb-4">Members ({committee.committeeMembers.length})</h2>
                    <div className="bg-light-parchment border border-slate/10 p-6">
                        <form action={addMemberToCommittee} className="mb-8 p-5 border border-slate/10 bg-white">
                            <h3 className="font-body font-medium text-sm text-ink mb-4">Add Member</h3>
                            <input type="hidden" name="committeeName" value={committee.name} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                <div>
                                    <label htmlFor="memberId" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Member</label>
                                    <select name="memberId" id="memberId" required className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors">
                                        <option value="">Select...</option>
                                        {availableMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="role" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Role</label>
                                    <input type="text" name="role" id="role" defaultValue="Member" required className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" name="isConvenor" id="isConvenor" value="true" className="h-4 w-4 border-slate/30 text-gold focus:ring-gold" />
                                    <label htmlFor="isConvenor" className="font-mono text-xs text-slate">Convenor?</label>
                                </div>
                                <button type="submit" className="flex items-center justify-center w-full px-4 py-3 bg-ink text-white text-sm font-body font-medium hover:bg-gold hover:text-ink transition-colors">
                                    <FaUserPlus className="w-4 h-4 mr-2" /> Add Member
                                </button>
                            </div>
                        </form>

                        <ul className="space-y-2">
                            {committee.committeeMembers.map(cm => (
                                <li key={cm.id} className="flex items-center justify-between p-3 border border-slate/10 bg-white hover:bg-parchment transition-colors">
                                    <div className="flex items-center gap-3">
                                        {cm.member.image && <Image src={cm.member.image} alt={cm.member.name} width={36} height={36} className="rounded-full" unoptimized />}
                                        <div>
                                            <p className="font-body text-sm text-ink">{cm.member.name}</p>
                                            <p className="font-mono text-xs text-slate flex items-center gap-1">
                                                {cm.isConvenor && <FaCrown className="w-3 h-3 text-gold" />}
                                                {cm.role}
                                            </p>
                                        </div>
                                    </div>
                                    <form action={removeMemberFromCommittee.bind(null, cm.id, committee.name)}>
                                        <button type="submit" className="p-2 text-slate hover:text-red-400 transition-colors" aria-label="Remove member">
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </form>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
