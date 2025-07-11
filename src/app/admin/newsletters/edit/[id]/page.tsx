import { db } from "@/db";
import { newsletters } from "@/db/schema";
import { eq } from 'drizzle-orm';
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const NewsletterSchema = z.object({
    title: z.string().min(3, 'Title is required.'),
    description: z.string().min(10, 'Description is required.'),
    publishDate: z.string().min(1, 'Publish date is required.'),
    pdfPath: z.string().min(1, 'PDF embed code is required.'),
});

async function updateNewsletter(id: string, formData: FormData) {
    'use server';
    const validatedFields = NewsletterSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) { 
        throw new Error('Validation failed: ' + JSON.stringify(validatedFields.error.flatten().fieldErrors)); 
    }
    const { title, description, publishDate, pdfPath } = validatedFields.data;
    try {
        await db.update(newsletters).set({ 
            title, 
            description, 
            publishDate: new Date(publishDate), 
            pdfPath 
        }).where(eq(newsletters.id, id));
    } catch (error) { 
        throw new Error('Failed to update newsletter.' + error); 
    }
    revalidatePath('/admin/newsletters');
    revalidatePath('/newsletters');
    redirect('/admin/newsletters');
}

export default async function EditNewsletterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    
    const [newsletter] = await db.select().from(newsletters).where(eq(newsletters.id, decodedId));

    if (!newsletter) {
        notFound();
    }
    
    const updateAction = updateNewsletter.bind(null, newsletter.id);

    return (
        <div>
            <Link href="/admin/newsletters" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <FaArrowLeft className="w-5 h-5 mr-2" />
                Back to Newsletters
            </Link>
            <h1 className="text-3xl font-bold mb-6">Edit Newsletter</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form action={updateAction}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="id" className="block font-medium text-gray-700">ID</label>
                            <input 
                                type="text" 
                                name="id" 
                                id="id" 
                                value={newsletter.id} 
                                disabled 
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500" 
                            />
                            <p className="mt-1 text-sm text-gray-500">Newsletter ID cannot be changed</p>
                        </div>
                        <div>
                            <label htmlFor="title" className="block font-medium text-gray-700">Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                id="title" 
                                defaultValue={newsletter.title} 
                                required 
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm" 
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block font-medium text-gray-700">Description</label>
                            <textarea 
                                name="description" 
                                id="description" 
                                rows={3} 
                                defaultValue={newsletter.description} 
                                required 
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="publishDate" className="block font-medium text-gray-700">Publish Date</label>
                            <input 
                                type="date" 
                                name="publishDate" 
                                id="publishDate" 
                                defaultValue={newsletter.publishDate.toISOString().split('T')[0]} 
                                required 
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm" 
                            />
                        </div>
                        <div>
                            <label htmlFor="pdfPath" className="block font-medium text-gray-700">PDF Embed Code</label>
                            <textarea 
                                name="pdfPath" 
                                id="pdfPath" 
                                rows={4} 
                                defaultValue={newsletter.pdfPath} 
                                placeholder="Paste your PDF embed code here (e.g., from Google Drive, OneDrive, etc.)" 
                                required 
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm font-mono text-sm"
                            ></textarea>
                            <p className="mt-2 text-sm text-gray-500">
                                For Google Drive: Share → Get link → Change to &quot;Anyone with the link&quot; → Embed Item
                            </p>
                        </div>
                        <button type="submit" className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-primary hover:text-dark transition-colors">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
