'use server';
import { z } from 'zod';
import { db } from '@/db';
import { profile, user } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { generateTotpSecret } from '@/lib/utils';
import { encrypt } from '@/lib/crypto';

const StudentSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Must be a valid email ending with @itbhu.ac.in').refine(email => email.endsWith('@itbhu.ac.in')),
  rollNumber: z.string().min(1, 'Roll number is required.'),
  branch: z.string().min(1, 'Branch is required.'),
  course: z.enum(["BTECH", "IDD", "MTECH", "PHD"]),
  hostelName: z.string().optional(),
  roomNumber: z.string().optional(),
  bloodGroup: z.string().optional(),
  homeAddress: z.string().optional(),
  photoPath: z.string().optional(),
});

export async function createStudent(formData: FormData) {
  const validatedFields = StudentSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    throw new Error('Validation failed: ' + JSON.stringify(validatedFields.error.flatten().fieldErrors));
  }
  
  const { email, name, ...profileData } = validatedFields.data;

  // Check if profile already exists with this email
  const [existingProfile] = await db.select().from(profile).where(eq(profile.email, email));
  
  if (existingProfile) {
    throw new Error('A student with this email already exists');
  }

  const totpSecret = generateTotpSecret();
  const encryptedSecret = await encrypt(totpSecret);

  try {
    // Create new profile (no user linking yet)
    await db.insert(profile).values({
      id: crypto.randomUUID(),
      email,
      name,
      ...profileData,
      totpSecret: encryptedSecret,
      role: 'STUDENT',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error('Failed to create or update student.');
  }

  revalidatePath('/admin/students');
  redirect('/admin/students');
}

export async function updateStudent(id: string, formData: FormData) {
    const validatedFields = StudentSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        throw new Error('Validation Failed');
    }

    const { email, name, ...profileData } = validatedFields.data;

    try {
        // Update profile
        await db.update(profile).set({
            email,
            name,
            ...profileData,
            updatedAt: new Date(),
        }).where(eq(profile.id, id));

        // If there's a linked user, update their basic info too
        const [profileRecord] = await db.select().from(profile).where(eq(profile.id, id));
        if (profileRecord?.userId) {
            await db.update(user).set({
                email,
                name,
                updatedAt: new Date(),
            }).where(eq(user.id, profileRecord.userId));
        }
    } catch {
        throw new Error('Failed to update student.');
    }

    revalidatePath('/admin/students');
    redirect('/admin/students');
}

export async function deleteStudent(id: string) {
    try {
        // Delete profile (user relationship will be set to null due to "set null" constraint)
        await db.delete(profile).where(eq(profile.id, id));
    } catch {
        throw new Error('Failed to delete student.');
    }
    revalidatePath('/admin/students');
}
