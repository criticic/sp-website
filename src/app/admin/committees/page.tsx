import { db } from "@/db";
import { committees} from "@/db/schema";
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { FaPlusCircle, FaEdit, FaTrash } from "react-icons/fa";

async function deleteCommittee(name: string) {
    'use server';
    try {
        await db.delete(committees).where(eq(committees.name, name));
    } catch (error) { throw new Error('Failed to delete committee.' + error); }
    revalidatePath('/admin/committees');
}

export default async function CommitteesAdminPage() {
    const allCommittees = await db.query.committees.findMany({
        with: {
            committeeMembers: true,
        },
        orderBy: (committees, { asc }) => [asc(committees.name)],
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Committees</h1>
                <Link href="/admin/committees/new" className="flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-primary hover:text-dark transition-colors">
                    <FaPlusCircle className="w-5 h-5 mr-2" />
                    Add New Committee
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left font-semibold">Name</th>
                            <th className="p-4 text-left font-semibold">Members</th>
                            <th className="p-4 text-left font-semibold">Email</th>
                            <th className="p-4 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allCommittees.map((committee) => (
                            <tr key={committee.name} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{committee.name}</td>
                                <td className="p-4 text-gray-600">{committee.committeeMembers.length}</td>
                                <td className="p-4 text-gray-600">{committee.email}</td>
                                <td className="p-4 space-x-2 text-right">
                                    <Link href={`/admin/committees/edit/${encodeURIComponent(committee.name)}`} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md inline-flex">
                                        <FaEdit className="w-4 h-4"/>
                                    </Link>
                                    <form action={deleteCommittee.bind(null, committee.name)} className="inline-block">
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