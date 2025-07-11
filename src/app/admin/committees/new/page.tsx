import { db } from "@/db";
import { committees } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const CommitteeSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  description: z.string().optional(),
  email: z.string().email('Invalid email.').optional().or(z.literal('')),
});

async function createCommittee(formData: FormData) {
    'use server';
    const validatedFields = CommitteeSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) { 
        throw new Error('Validation failed: ' + JSON.stringify(validatedFields.error.flatten().fieldErrors)); 
    }
    try {
        await db.insert(committees).values(validatedFields.data);
    } catch (error) { throw new Error('Failed to create committee. ' + error); }
    revalidatePath('/admin/committees');
    redirect('/admin/committees');
}

export default function NewCommitteePage() {
    return (
        <div>
            <Link href="/admin/committees" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <FaArrowLeft className="w-5 h-5 mr-2" />
                Back to Committees
            </Link>
            <h1 className="text-3xl font-bold mb-6">Add New Committee</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form action={createCommittee}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block font-medium text-gray-700">Committee Name</label>
                            <input type="text" name="name" id="name" required className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block font-medium text-gray-700">Description</label>
                            <textarea name="description" id="description" rows={3} className="w-full mt-1 border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                        <div>
                            <label htmlFor="email" className="block font-medium text-gray-700">Committee Email</label>
                            <input type="email" name="email" id="email" placeholder="committee.name@itbhu.ac.in" className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <button type="submit" className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-primary hover:text-dark transition-colors">Save Committee</button>
                    </div>
                </form>
            </div>
        </div>
    );
}