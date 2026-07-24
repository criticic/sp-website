import { db } from "@/db";
import { newsletters } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const NewsletterSchema = z.object({
    id: z.string().min(1, 'ID is required.'),
    title: z.string().min(3, 'Title is required.'),
    description: z.string().min(10, 'Description is required.'),
    publishDate: z.string().min(1, 'Publish date is required.'),
    pdfPath: z.string().min(1, 'PDF embed code is required.'),
});

async function createNewsletter(formData: FormData) {
    'use server';
    const validatedFields = NewsletterSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) { 
        throw new Error('Validation failed: ' + JSON.stringify(validatedFields.error.flatten().fieldErrors)); 
    }
    const { id, title, description, publishDate, pdfPath } = validatedFields.data;
    try {
        await db.insert(newsletters).values({ id, title, description, publishDate: new Date(publishDate), pdfPath });
    } catch (error) { throw new Error('Failed to create newsletter.' + error); }
    revalidatePath('/admin/newsletters');
    revalidatePath('/newsletters');
    redirect('/admin/newsletters');
}

export default function NewNewsletterPage() {
    return (
        <div>
            <Link href="/admin/newsletters" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <FaArrowLeft className="w-5 h-5 mr-2" />
                Back to Newsletters
            </Link>
            <h1 className="text-3xl font-bold mb-6">Add New Newsletter</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form action={createNewsletter}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="id" className="block font-medium text-gray-700">ID</label>
                            <input type="text" name="id" id="id" placeholder="e.g., newsletter-2025-08" required className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                        </div>
                         <div>
                            <label htmlFor="title" className="block font-medium text-gray-700">Title</label>
                            <input type="text" name="title" id="title" required className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block font-medium text-gray-700">Description</label>
                            <textarea name="description" id="description" rows={3} required className="w-full mt-1 border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                        <div>
                            <label htmlFor="publishDate" className="block font-medium text-gray-700">Publish Date</label>
                            <input type="date" name="publishDate" id="publishDate" required className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="pdfPath" className="block font-medium text-gray-700">PDF Embed Code</label>
                            <textarea 
                                name="pdfPath" 
                                id="pdfPath" 
                                rows={4} 
                                placeholder="Paste your PDF embed code here (e.g., from Google Drive, OneDrive, etc.)" 
                                required 
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm font-mono text-sm"
                            ></textarea>
                            <p className="mt-2 text-sm text-gray-500">
                                For Google Drive: Share → Get link → Change to &quot;Anyone with the link&quot; → Embed Item
                            </p>
                        </div>
                        <button type="submit" className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-primary hover:text-dark transition-colors">Save Newsletter</button>
                    </div>
                </form>
            </div>
        </div>
    );
}