import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profile } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose";
import { getTotp } from "@/lib/utils";
import { decrypt } from "@/lib/crypto";
import { headers } from "next/headers";

const secret = new TextEncoder().encode(process.env.QR_JWT_SECRET!);

export async function GET() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [userProfile] = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, session.user.id));

    if (!userProfile || !userProfile.totpSecret) {
      return NextResponse.json({ error: "User profile or TOTP secret missing" }, { status: 404 });
    }

    // Decrypt the secret before using it
    const decryptedSecret = await decrypt(userProfile.totpSecret);
    const totp = getTotp(decryptedSecret);

    // Payload for the JWT (all details except photo)
    const payload = {
      name: userProfile.name || session.user.name,
      rollNumber: userProfile.rollNumber,
      email: userProfile.email,
      branch: userProfile.branch,
      course: userProfile.course,
      hostelName: userProfile.hostelName,
      roomNumber: userProfile.roomNumber,
      bloodGroup: userProfile.bloodGroup,
      homeAddress: userProfile.homeAddress,
      totp: totp,
    };

    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer("urn:iitbhu:digital-id")
      .setAudience("urn:iitbhu:security-scanner")
      .setExpirationTime("60s") // A slightly longer expiry for tolerance
      .sign(secret);

    return NextResponse.json({ 
      token: jwt,
      totp: totp // Also return TOTP directly for convenience
    });
  } catch (error) {
    console.error("Error generating QR token:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
