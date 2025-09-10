import { NextResponse } from 'next/server';
import { db } from '@/db';
import { profile, scanLogs } from '@/db/schema';
import { count, isNotNull, and } from 'drizzle-orm';

export async function GET() {
  try {
    // Get total students (profiles)
    const [studentsResult] = await db
      .select({ count: count() })
      .from(profile);

    // Get total scans
    const [scansResult] = await db
      .select({ count: count() })
      .from(scanLogs);

    // Get complete profiles (profiles with all required fields filled)
    const [completedProfilesResult] = await db
      .select({ count: count() })
      .from(profile)
      .where(
        and(
          isNotNull(profile.name),
          isNotNull(profile.rollNumber),
          isNotNull(profile.branch),
          isNotNull(profile.course)
        )
      );

    const stats = {
      students: studentsResult.count,
      scans: scansResult.count,
      completedProfiles: completedProfilesResult.count,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
