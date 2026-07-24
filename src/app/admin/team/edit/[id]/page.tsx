import { db } from "@/db";
import { members } from "@/db/schema";
import { eq } from 'drizzle-orm';
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import ImageUploader from "@/components/ImageUploader";

const MemberSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  image: z.string().optional(),
  contactLink: z.string().optional(),
});

async function updateMember(id: number, formData: FormData) {
    'use server';
    const validatedFields = MemberSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) { 
        throw new Error('Validation failed: ' + JSON.stringify(validatedFields.error.flatten().fieldErrors)); 
    }
    try {
        await db.update(members).set(validatedFields.data).where(eq(members.id, id));
    } catch (error) { throw new Error('Failed to update member.' + error); }
    revalidatePath('/admin/team');
    revalidatePath(`/admin/team/edit/${id}`);
    revalidatePath('/team');
    redirect('/admin/team');
}

export default async function EditMemberPage({ params }: { params: Promise<{ id: number }>}) {
    const { id } = await params;
    const [member] = await db.select().from(members).where(eq(members.id, id));

    if (!member) { notFound(); }
    
    const updateMemberAction = updateMember.bind(null, member.id);

    return (
        <div>
            <Link href="/admin/team" className="inline-flex items-center gap-2 font-mono text-xs text-slate hover:text-gold transition-colors mb-8">
                <FaArrowLeft className="w-3 h-3" />
                Back to Team Members
            </Link>
            <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-1">Admin</p>
            <h1 className="text-2xl md:text-3xl mb-8">Edit Member</h1>
            <div className="bg-light-parchment border border-slate/10 p-8 max-w-xl">
                <form action={updateMemberAction}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Full Name</label>
                            <input type="text" name="name" id="name" defaultValue={member.name} required className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                        </div>
                        <ImageUploader name="image" defaultValue={member.image || undefined} />
                        <div>
                            <label htmlFor="contactLink" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Contact</label>
                            <input type="text" name="contactLink" id="contactLink" defaultValue={member.contactLink || ''} placeholder="mailto:example@itbhu.ac.in" className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                        </div>
                        <button type="submit" className="px-6 py-3 bg-ink text-white text-sm font-body font-medium hover:bg-gold hover:text-ink transition-colors">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
