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
            <Link href="/admin/updates" className="inline-flex items-center gap-2 font-mono text-xs text-slate hover:text-gold transition-colors mb-8">
                <FaArrowLeft className="w-3 h-3" />
                Back to Updates
            </Link>
            <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-1">Admin</p>
            <h1 className="text-2xl md:text-3xl mb-8">Add Update</h1>
            <div className="bg-light-parchment border border-slate/10 p-8 max-w-2xl">
                <form action={createUpdate}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Title</label>
                            <input type="text" name="title" id="title" required className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                        </div>
                        <div>
                            <label htmlFor="author" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Author</label>
                            <input type="text" name="author" id="author" required className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                        </div>
                        <div>
                            <label htmlFor="summary" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Summary</label>
                            <textarea name="summary" id="summary" rows={3} required className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors"></textarea>
                        </div>
                        <div>
                            <label htmlFor="tags" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Tags (comma-separated)</label>
                            <input type="text" name="tags" id="tags" className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                        </div>
                        <div>
                            <label htmlFor="content" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Content (Markdown)</label>
                            <textarea name="content" id="content" rows={15} className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-mono text-sm focus:outline-none focus:border-gold transition-colors"></textarea>
                        </div>
                        <button type="submit" className="px-6 py-3 bg-ink text-white text-sm font-body font-medium hover:bg-gold hover:text-ink transition-colors">Save Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
