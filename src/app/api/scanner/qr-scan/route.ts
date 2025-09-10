import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/db';
import { profile, scanLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { jwtVerify } from 'jose';
import { auth } from '@/lib/auth';

const secret = new TextEncoder().encode(process.env.QR_JWT_SECRET!);

export async function POST(request: NextRequest) {
  try {
    const { qrData } = await request.json();

    if (!qrData) {
      return NextResponse.json({ error: 'QR data is required' }, { status: 400 });
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

    let studentInfo: { rollNumber?: string; [key: string]: unknown };
    
    try {
      // Try to verify as JWT token first (from the existing QR token system)
      const { payload } = await jwtVerify(qrData, secret);
      studentInfo = payload;
    } catch {
      // If JWT verification fails, try to parse as JSON or plain text
      try {
        const parsed = JSON.parse(qrData);
        studentInfo = parsed;
      } catch {
        // If not JSON, treat as plain text (roll number or ID)
        studentInfo = { rollNumber: qrData.trim() };
      }
    }

    // Find student by roll number (primary identifier)
    const rollNumber = studentInfo.rollNumber;
    if (!rollNumber) {
      return NextResponse.json({ error: 'Roll number not found in QR data' }, { status: 400 });
    }

    const [student] = await db
      .select()
      .from(profile)
      .where(eq(profile.rollNumber, rollNumber))
      .limit(1);

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Create scan log entry
    const scanResult = await createScanLog(student, scannerProfile, 'SUCCESS', 'QR Code scanned');
    return NextResponse.json(scanResult);
  } catch (error) {
    console.error('QR scan error:', error);
    return NextResponse.json({ error: 'Failed to process QR scan' }, { status: 500 });
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
