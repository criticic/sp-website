import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/db';
import { profile, scanLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { rollNumber, notes } = await request.json();

    if (!rollNumber) {
      return NextResponse.json({ error: 'Roll number is required' }, { status: 400 });
    }

    // Get current user session
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the scanner's profile
    const [scannerProfile] = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, session.user.id))
      .limit(1);

    if (!scannerProfile) {
      return NextResponse.json({ error: "Scanner profile not found" }, { status: 404 });
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

    // Create scan log entry with manual status
    const scanResult = await createScanLog(student, scannerProfile, 'MANUAL', notes);
    return NextResponse.json(scanResult);
  } catch (error) {
    console.error('Manual scan error:', error);
    return NextResponse.json({ error: 'Failed to create manual entry' }, { status: 500 });
  }
}

async function createScanLog(
  student: typeof profile.$inferSelect, 
  scanner: typeof profile.$inferSelect,
  status: 'SUCCESS' | 'MANUAL' | 'FAILURE', 
  notes?: string
) {
  const [scanLog] = await db
    .insert(scanLogs)
    .values({
      studentId: student.id,
      scannedById: scanner.id,
      location: 'Scanner Dashboard', // You can make this dynamic
      timestamp: new Date(),
      status,
      notes: notes || null,
    })
    .returning();

  return {
    id: scanLog.id.toString(),
    rollNumber: student.rollNumber || 'N/A',
    name: student.name || 'Unknown',
    branch: student.branch || 'N/A',
    timestamp: scanLog.timestamp,
    status: scanLog.status,
    student: {
      id: student.id,
      name: student.name,
      rollNumber: student.rollNumber,
      branch: student.branch,
    },
  };
}
