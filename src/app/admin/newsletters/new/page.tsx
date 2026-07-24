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
            <Link href="/admin/newsletters" className="inline-flex items-center gap-2 font-mono text-xs text-slate hover:text-gold transition-colors mb-8">
                <FaArrowLeft className="w-3 h-3" />
                Back to Newsletters
            </Link>
            <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-1">Admin</p>
            <h1 className="text-2xl md:text-3xl mb-8">Add Newsletter</h1>
            <div className="bg-light-parchment border border-slate/10 p-8 max-w-2xl">
                <form action={createNewsletter}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="id" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">ID</label>
                            <input type="text" name="id" id="id" placeholder="e.g., newsletter-2025-08" required className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                        </div>
                        <div>
                            <label htmlFor="title" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Title</label>
                            <input type="text" name="title" id="title" required className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Description</label>
                            <textarea name="description" id="description" rows={3} required className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors"></textarea>
                        </div>
                        <div>
                            <label htmlFor="publishDate" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Publish Date</label>
                            <input type="date" name="publishDate" id="publishDate" required className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                        </div>
                        <div>
                            <label htmlFor="pdfPath" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">PDF Embed Code</label>
                            <textarea name="pdfPath" id="pdfPath" rows={4} placeholder="Paste your PDF embed code here" required className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-mono text-sm focus:outline-none focus:border-gold transition-colors"></textarea>
                        </div>
                        <button type="submit" className="px-6 py-3 bg-ink text-white text-sm font-body font-medium hover:bg-gold hover:text-ink transition-colors">Save Newsletter</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
