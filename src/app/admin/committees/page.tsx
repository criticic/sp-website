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
    revalidatePath('/team');
}

export default async function CommitteesAdminPage() {
    const allCommittees = await db.query.committees.findMany({
        with: { committeeMembers: true },
        orderBy: (committees, { asc }) => [asc(committees.name)],
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-1">Admin</p>
                    <h1 className="text-2xl md:text-3xl">Committees</h1>
                </div>
                <Link href="/admin/committees/new" className="flex items-center px-5 py-2.5 bg-ink text-white text-sm font-body font-medium hover:bg-gold hover:text-ink transition-colors">
                    <FaPlusCircle className="w-4 h-4 mr-2" />
                    Add Committee
                </Link>
            </div>
            <div className="bg-light-parchment border border-slate/10 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate/10">
                            <th className="p-4 text-left font-mono text-xs text-slate uppercase tracking-wider font-medium">Name</th>
                            <th className="p-4 text-left font-mono text-xs text-slate uppercase tracking-wider font-medium">Members</th>
                            <th className="p-4 text-left font-mono text-xs text-slate uppercase tracking-wider font-medium">Email</th>
                            <th className="p-4 text-right font-mono text-xs text-slate uppercase tracking-wider font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allCommittees.map((committee) => (
                            <tr key={committee.name} className="border-b border-slate/10 hover:bg-parchment transition-colors">
                                <td className="p-4 font-body text-sm text-ink font-medium">{committee.name}</td>
                                <td className="p-4 font-mono text-xs text-slate">{committee.committeeMembers.length}</td>
                                <td className="p-4 font-mono text-xs text-slate truncate max-w-xs">{committee.email}</td>
                                <td className="p-4 text-right">
                                    <Link href={`/admin/committees/edit/${encodeURIComponent(committee.name)}`} className="p-2 text-slate hover:text-gold transition-colors inline-flex">
                                        <FaEdit className="w-4 h-4"/>
                                    </Link>
                                    <form action={deleteCommittee.bind(null, committee.name)} className="inline-block">
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
