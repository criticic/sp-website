import { db } from "@/db";
import { updates } from "@/db/schema";
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { formatDate } from "@/lib/utils";
import { FaPlusCircle, FaEdit, FaTrash } from "react-icons/fa";

async function deleteUpdate(slug: string) {
    'use server';
    try {
        await db.delete(updates).where(eq(updates.slug, slug));
    } catch (error) { throw new Error('Failed to delete update.' + error); }
    revalidatePath('/admin/updates');
    revalidatePath('/updates');
    revalidatePath(`/updates/${slug}`);
}

export default async function UpdatesAdminPage() {
    const allUpdates = await db.select().from(updates).orderBy(desc(updates.pubDate));

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-1">Admin</p>
                    <h1 className="text-2xl md:text-3xl">Updates</h1>
                </div>
                <Link href="/admin/updates/new" className="flex items-center px-5 py-2.5 bg-ink text-white text-sm font-body font-medium hover:bg-gold hover:text-ink transition-colors">
                    <FaPlusCircle className="w-4 h-4 mr-2" />
                    Add Update
                </Link>
            </div>
            <div className="bg-light-parchment border border-slate/10 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate/10">
                            <th className="p-4 text-left font-mono text-xs text-slate uppercase tracking-wider font-medium">Title</th>
                            <th className="p-4 text-left font-mono text-xs text-slate uppercase tracking-wider font-medium">Author</th>
                            <th className="p-4 text-left font-mono text-xs text-slate uppercase tracking-wider font-medium">Published</th>
                            <th className="p-4 text-right font-mono text-xs text-slate uppercase tracking-wider font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUpdates.map((update) => (
                            <tr key={update.slug} className="border-b border-slate/10 hover:bg-parchment transition-colors">
                                <td className="p-4 font-body text-sm text-ink">{update.title}</td>
                                <td className="p-4 font-mono text-xs text-slate">{update.author}</td>
                                <td className="p-4 font-mono text-xs text-slate">{formatDate(update.pubDate)}</td>
                                <td className="p-4 text-right">
                                    <Link href={`/admin/updates/edit/${update.slug}`} className="p-2 text-slate hover:text-gold transition-colors inline-flex">
                                        <FaEdit className="w-4 h-4"/>
                                    </Link>
                                    <form action={deleteUpdate.bind(null, update.slug)} className="inline-block">
                                        <button type="submit" className="p-2 text-slate hover:text-red-400 transition-colors inline-flex">
                                            <FaTrash className="w-4 h-4"/>
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
