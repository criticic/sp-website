import { db } from "@/db";
import { members } from "@/db/schema";
import { asc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { FaPlusCircle, FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getPublicId(url: string): string | null {
  const match = url.match(/\/v\d+\/(.+?)\.(jpg|jpeg|png|gif|webp)/);
  return match ? match[1] : null;
}

async function deleteMember(id: number) {
    'use server';
    try {
        const [member] = await db.select().from(members).where(eq(members.id, id));
        if (member?.image) {
            const publicId = getPublicId(member.image);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId).catch(() => {});
            }
        }
        await db.delete(members).where(eq(members.id, id));
    } catch (error) { throw new Error('Failed to delete member.' + error); }
    revalidatePath('/admin/team');
    revalidatePath('/admin/committees');
    revalidatePath('/team');
}

export default async function TeamAdminPage() {
    const allMembers = await db.select().from(members).orderBy(asc(members.name));

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-1">Admin</p>
                    <h1 className="text-2xl md:text-3xl">Team Members</h1>
                </div>
                <Link href="/admin/team/new" className="flex items-center px-5 py-2.5 bg-ink text-white text-sm font-body font-medium hover:bg-gold hover:text-ink transition-colors">
                    <FaPlusCircle className="w-4 h-4 mr-2" />
                    Add Member
                </Link>
            </div>
            <div className="bg-light-parchment border border-slate/10 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate/10">
                            <th className="p-4 text-left font-mono text-xs text-slate uppercase tracking-wider font-medium">Name</th>
                            <th className="p-4 text-left font-mono text-xs text-slate uppercase tracking-wider font-medium">Contact</th>
                            <th className="p-4 text-right font-mono text-xs text-slate uppercase tracking-wider font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allMembers.map((member) => (
                            <tr key={member.id} className="border-b border-slate/10 hover:bg-parchment transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                    {member.image && <Image src={member.image} alt={member.name} width={32} height={32} className="rounded-full" unoptimized />}
                                    <span className="font-body text-sm text-ink">{member.name}</span>
                                </td>
                                <td className="p-4 font-mono text-xs text-slate truncate max-w-xs">{member.contactLink}</td>
                                <td className="p-4 text-right">
                                    <Link href={`/admin/team/edit/${member.id}`} className="p-2 text-slate hover:text-gold transition-colors inline-flex">
                                        <FaEdit className="w-4 h-4"/>
                                    </Link>
                                    <form action={deleteMember.bind(null, member.id)} className="inline-block">
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
