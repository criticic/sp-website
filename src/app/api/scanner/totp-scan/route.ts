import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/db';
import { profile, scanLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyTotp } from '@/lib/utils';
import { decrypt } from '@/lib/crypto';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { rollNumber, totpCode } = await request.json();

    if (!rollNumber || !totpCode) {
      return NextResponse.json({ error: 'Roll number and TOTP code are required' }, { status: 400 });
    }

    // Get current user session
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

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

    if (!student.totpSecret) {
      return NextResponse.json({ error: 'TOTP not configured for this student' }, { status: 400 });
    }

    // Decrypt the secret and verify TOTP
    const decryptedSecret = await decrypt(student.totpSecret);
    const isValid = verifyTotp(totpCode, decryptedSecret);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid TOTP code' }, { status: 400 });
    }

    // Create scan log entry
    const scanResult = await createScanLog(student, scannerProfile, 'SUCCESS', 'TOTP verified');
    return NextResponse.json(scanResult);
  } catch (error) {
    console.error('TOTP scan error:', error);
    return NextResponse.json({ error: 'Failed to verify TOTP' }, { status: 500 });
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
