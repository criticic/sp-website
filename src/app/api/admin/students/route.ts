import { NextResponse } from "next/server";
import { db } from "@/db";
import { profile, user } from "@/db/schema";
import { asc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allStudents = await db
      .select()
      .from(profile)
      .leftJoin(user, eq(profile.userId, user.id))
      .where(eq(profile.role, 'STUDENT'))
      .orderBy(asc(profile.rollNumber));

    return NextResponse.json(allStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
