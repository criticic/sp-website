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
}

export default async function UpdatesAdminPage() {
    const allUpdates = await db.select().from(updates).orderBy(desc(updates.pubDate));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Updates</h1>
                <Link href="/admin/updates/new" className="flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-primary hover:text-dark transition-colors">
                    <FaPlusCircle className="w-5 h-5 mr-2" />
                    Add New Update
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left font-semibold">Title</th>
                            <th className="p-4 text-left font-semibold">Author</th>
                            <th className="p-4 text-left font-semibold">Published</th>
                            <th className="p-4 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allUpdates.map((update) => (
                            <tr key={update.slug} className="border-b hover:bg-gray-50">
                                <td className="p-4">{update.title}</td>
                                <td className="p-4 text-gray-600">{update.author}</td>
                                <td className="p-4 text-gray-600">{formatDate(update.pubDate)}</td>
                                <td className="p-4 space-x-2 text-right">
                                    <Link href={`/admin/updates/edit/${update.slug}`} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md inline-flex">
                                        <FaEdit className="w-4 h-4"/>
                                    </Link>
                                    <form action={deleteUpdate.bind(null, update.slug)} className="inline-block">
                                        <button type="submit" className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md inline-flex">
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