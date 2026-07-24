import { db } from "@/db";
import { committees } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const CommitteeSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  description: z.string().optional(),
  email: z.string().email('Invalid email.').optional().or(z.literal('')),
});

async function createCommittee(formData: FormData) {
    'use server';
    const validatedFields = CommitteeSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) { 
        throw new Error('Validation failed: ' + JSON.stringify(validatedFields.error.flatten().fieldErrors)); 
    }
    try {
        await db.insert(committees).values(validatedFields.data);
    } catch (error) { throw new Error('Failed to create committee. ' + error); }
    revalidatePath('/admin/committees');
    redirect('/admin/committees');
}

export default function NewCommitteePage() {
    return (
        <div>
            <Link href="/admin/committees" className="inline-flex items-center gap-2 font-mono text-xs text-slate hover:text-gold transition-colors mb-8">
                <FaArrowLeft className="w-3 h-3" />
                Back to Committees
            </Link>
            <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-1">Admin</p>
            <h1 className="text-2xl md:text-3xl mb-8">Add Committee</h1>
            <div className="bg-light-parchment border border-slate/10 p-8 max-w-xl">
                <form action={createCommittee}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Committee Name</label>
                            <input type="text" name="name" id="name" required className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Description</label>
                            <textarea name="description" id="description" rows={3} className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors"></textarea>
                        </div>
                        <div>
                            <label htmlFor="email" className="block font-mono text-xs text-slate uppercase tracking-wider mb-2">Email</label>
                            <input type="email" name="email" id="email" placeholder="committee@itbhu.ac.in" className="w-full px-4 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors" />
                        </div>
                        <button type="submit" className="px-6 py-3 bg-ink text-white text-sm font-body font-medium hover:bg-gold hover:text-ink transition-colors">Save Committee</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
