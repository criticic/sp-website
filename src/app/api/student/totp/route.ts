import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { profile } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getTotp } from '@/lib/utils';
import { decrypt } from '@/lib/crypto';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [userProfile] = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, session.user.id));

    if (!userProfile || !userProfile.totpSecret) {
      return NextResponse.json({ error: 'User profile or TOTP secret missing' }, { status: 404 });
    }

    // Decrypt the secret and generate TOTP
    const decryptedSecret = await decrypt(userProfile.totpSecret);
    const totp = getTotp(decryptedSecret);

    return NextResponse.json({ totp });
  } catch (error) {
    console.error('Error generating TOTP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
