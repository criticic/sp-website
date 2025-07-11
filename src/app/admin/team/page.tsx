import { db } from "@/db";
import { members } from "@/db/schema";
import { asc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { FaPlusCircle, FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";

async function deleteMember(id: number) {
    'use server';
    try {
        await db.delete(members).where(eq(members.id, id));
    } catch (error) { throw new Error('Failed to delete member.' + error); }
    revalidatePath('/admin/team');
    revalidatePath('/admin/committees');
}

export default async function TeamAdminPage() {
    const allMembers = await db.select().from(members).orderBy(asc(members.name));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Team Members</h1>
                <Link href="/admin/team/new" className="flex items-center px-4 py-2 bg-accent text-white rounded-lg hover:bg-primary hover:text-dark transition-colors">
                    <FaPlusCircle className="w-5 h-5 mr-2" />
                    Add New Member
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left font-semibold">Name</th>
                            <th className="p-4 text-left font-semibold">Contact Link</th>
                            <th className="p-4 text-right font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allMembers.map((member) => (
                            <tr key={member.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 flex items-center">
                                    {member.image && <Image src={member.image} alt={member.name} width={40} height={40} className="rounded-full mr-4" />}
                                    {member.name}
                                </td>
                                <td className="p-4 text-gray-600 truncate max-w-xs">{member.contactLink}</td>
                                <td className="p-4 space-x-2 text-right">
                                    <Link href={`/admin/team/edit/${member.id}`} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md inline-flex">
                                        <FaEdit className="w-4 h-4"/>
                                    </Link>
                                    <form action={deleteMember.bind(null, member.id)} className="inline-block">
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