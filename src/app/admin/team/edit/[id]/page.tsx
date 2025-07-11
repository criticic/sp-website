import { db } from "@/db";
import { members } from "@/db/schema";
import { eq } from 'drizzle-orm';
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const MemberSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  image: z.string().optional(),
  contactLink: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
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
    redirect('/admin/team');
}

export default async function EditMemberPage({ params }: { params: Promise<{ id: number }>}) {
    const { id } = await params;
    const [member] = await db.select().from(members).where(eq(members.id, id));

    if (!member) {
        notFound();
    }
    
    const updateMemberAction = updateMember.bind(null, member.id);

    return (
        <div>
            <Link href="/admin/team" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <FaArrowLeft className="w-5 h-5 mr-2" />
                Back to Team Members
            </Link>
            <h1 className="text-3xl font-bold mb-6">Edit Member</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form action={updateMemberAction}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block font-medium text-gray-700">Full Name</label>
                            <input type="text" name="name" id="name" defaultValue={member.name} required className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="image" className="block font-medium text-gray-700">Image Path</label>
                            <input type="text" name="image" id="image" defaultValue={member.image || ''} placeholder="/assets/people/Example Name.png" className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="contactLink" className="block font-medium text-gray-700">Email</label>
                            <input type="text" name="contactLink" id="contactLink" defaultValue={member.contactLink || ''} placeholder="example@itbhu.ac.in" className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <button type="submit" className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-primary hover:text-dark transition-colors">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}