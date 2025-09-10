import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { profile } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rollNumber = searchParams.get('rollNumber');

    if (!rollNumber) {
      return NextResponse.json({ error: 'Roll number is required' }, { status: 400 });
    }

    // Find student by roll number
    const [student] = await db
      .select()
      .from(profile)
      .where(eq(profile.rollNumber, rollNumber))
      .limit(1);

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({
      student: {
        id: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        branch: student.branch,
        course: student.course,
        hostelName: student.hostelName,
        roomNumber: student.roomNumber,
        bloodGroup: student.bloodGroup,
        photoPath: student.photoPath,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch student profile' }, { status: 500 });
  }
}
