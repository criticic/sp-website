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
    revalidatePath(`/admin/committees/edit/${validatedFields.data.committeeName}`);
}

async function removeMemberFromCommittee(id: number, committeeName: string) {
    'use server';
    try {
        await db.delete(committeeMembers).where(eq(committeeMembers.id, id));
    } catch (error) { throw new Error('Failed to remove member from committee.' + error); }
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

    // Sort committee members by convenor status and then by member name
    if (committee) {
        committee.committeeMembers.sort((a, b) => {
            // First sort by convenor status (convenors first)
            if (a.isConvenor && !b.isConvenor) return -1;
            if (!a.isConvenor && b.isConvenor) return 1;
            // Then sort by member name
            return a.member.name.localeCompare(b.member.name);
        });
    }

    if (!committee) {
        notFound();
    }

    const allMembers = await db.select().from(members).orderBy(asc(members.name));
    const memberIdsInCommittee = new Set(committee.committeeMembers.map(cm => cm.member.id));
    const availableMembers = allMembers.filter(m => !memberIdsInCommittee.has(m.id));

    const updateCommitteeAction = updateCommittee.bind(null, committee.name);

    return (
        <div>
            <Link href="/admin/committees" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <FaArrowLeft className="w-5 h-5 mr-2" />
                Back to Committees
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Edit Committee Details */}
                <div className="lg:col-span-1">
                    <h2 className="text-2xl font-bold mb-4">Edit Details</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <form action={updateCommitteeAction}>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block font-medium text-gray-700">Committee Name</label>
                                    <input type="text" name="name" id="name" defaultValue={committee.name} required className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block font-medium text-gray-700">Description</label>
                                    <textarea name="description" id="description" rows={4} defaultValue={committee.description || ''} className="w-full mt-1 border-gray-300 rounded-md shadow-sm"></textarea>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block font-medium text-gray-700">Committee Email</label>
                                    <input type="email" name="email" id="email" defaultValue={committee.email || ''} className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <button type="submit" className="w-full px-6 py-2 bg-accent text-white rounded-lg hover:bg-primary hover:text-dark transition-colors">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: Manage Members */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">Manage Members ({committee.committeeMembers.length})</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {/* Add Member Form */}
                        <form action={addMemberToCommittee} className="mb-8 p-4 border rounded-lg bg-gray-50">
                            <h3 className="font-semibold mb-3">Add Member to Committee</h3>
                            <input type="hidden" name="committeeName" value={committee.name} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                <div>
                                    <label htmlFor="memberId" className="block text-sm font-medium text-gray-700">Member</label>
                                    <select name="memberId" id="memberId" required className="w-full mt-1 border-gray-300 rounded-md shadow-sm">
                                        <option value="">Select a member...</option>
                                        {availableMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                                    <input type="text" name="role" id="role" defaultValue="Member" required className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" name="isConvenor" id="isConvenor" value="true" className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent" />
                                    <label htmlFor="isConvenor" className="ml-2 block text-sm text-gray-900">Is Convenor?</label>
                                </div>
                                <button type="submit" className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <FaUserPlus className="w-5 h-5 mr-2" /> Add Member
                                </button>
                            </div>
                        </form>

                        {/* Current Members List */}
                        <ul className="space-y-3">
                            {committee.committeeMembers.map(cm => (
                                <li key={cm.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center">
                                        {cm.member.image && <Image src={cm.member.image} alt={cm.member.name} width={40} height={40} className="rounded-full mr-4" />}
                                        <div>
                                            <p className="font-medium">{cm.member.name}</p>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                {cm.isConvenor && <FaCrown className="w-4 h-4 mr-1.5 text-amber-500" />}
                                                {cm.role}
                                            </p>
                                        </div>
                                    </div>
                                    <form action={removeMemberFromCommittee.bind(null, cm.id, committee.name)}>
                                        <button type="submit" className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md" aria-label="Remove member">
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