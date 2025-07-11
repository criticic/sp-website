import { db } from "@/db";
import { updates } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { slugify } from '@/lib/utils';
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const UpdateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  author: z.string().min(1, 'Author is required.'),
  summary: z.string().min(10, 'Summary must be at least 10 characters.'),
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim()).filter(Boolean)),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
});

async function createUpdate(formData: FormData) {
    'use server';
    const validatedFields = UpdateSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) { 
        throw new Error('Validation failed: ' + JSON.stringify(validatedFields.error.flatten().fieldErrors)); 
    }
    const { title, author, summary, tags, content } = validatedFields.data;
    const slug = slugify(title);
    try {
        await db.insert(updates).values({ slug, title, author, summary, tags, content, pubDate: new Date() });
    } catch (error) { throw new Error('Failed to create update.' + error); }
    revalidatePath('/admin/updates');
    revalidatePath('/updates');
    redirect('/admin/updates');
}

export default function NewUpdatePage() {
    return (
        <div>
            <Link href="/admin/updates" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <FaArrowLeft className="w-5 h-5 mr-2" />
                Back to Updates
            </Link>
            <h1 className="text-3xl font-bold mb-6">Add New Update</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <form action={createUpdate}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block font-medium text-gray-700">Title</label>
                            <input type="text" name="title" id="title" required className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="author" className="block font-medium text-gray-700">Author</label>
                            <input type="text" name="author" id="author" required className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="summary" className="block font-medium text-gray-700">Summary</label>
                            <textarea name="summary" id="summary" rows={3} required className="w-full mt-1 border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                        <div>
                            <label htmlFor="tags" className="block font-medium text-gray-700">Tags (comma-separated)</label>
                            <input type="text" name="tags" id="tags" className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label htmlFor="content" className="block font-medium text-gray-700">Content (Markdown)</label>
                            <textarea name="content" id="content" rows={15} className="w-full mt-1 border-gray-300 rounded-md shadow-sm font-mono"></textarea>
                        </div>
                        <button type="submit" className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-primary hover:text-dark transition-colors">Save Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}