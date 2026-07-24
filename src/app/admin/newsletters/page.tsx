import { db } from "@/db";
import { newsletters } from "@/db/schema";
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { formatDate } from "@/lib/utils";
import { FaPlusCircle, FaTrash, FaEdit } from "react-icons/fa";

async function deleteNewsletter(id: string) {
    'use server';
    try {
        await db.delete(newsletters).where(eq(newsletters.id, id));
    } catch (error) { throw new Error('Failed to delete newsletter.' + error); }
    revalidatePath('/admin/newsletters');
    revalidatePath('/newsletters');
}

export default async function NewslettersAdminPage() {
    const allNewsletters = await db.select().from(newsletters).orderBy(desc(newsletters.publishDate));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Newsletters</h1>
                <Link href="/admin/newsletters/new" className="flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-primary hover:text-dark transition-colors">
                    <FaPlusCircle className="w-5 h-5 mr-2" />
                    Add New Newsletter
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left font-semibold">ID</th>
                            <th className="p-4 text-left font-semibold">Title</th>
                            <th className="p-4 text-left font-semibold">Published</th>
                            <th className="p-4 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allNewsletters.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-mono text-sm">{item.id}</td>
                                <td className="p-4">{item.title}</td>
                                <td className="p-4 text-gray-600">{formatDate(item.publishDate)}</td>
                                <td className="p-4 space-x-2 text-right">
                                    <Link href={`/admin/newsletters/edit/${item.id}`} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md inline-flex">
                                        <FaEdit className="w-4 h-4"/>
                                    </Link>
                                    <form action={deleteNewsletter.bind(null, item.id)} className="inline-block">
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