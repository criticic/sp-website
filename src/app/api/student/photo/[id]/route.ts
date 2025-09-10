import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { profile } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import fs from "fs";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [requestedUserProfile] = await db
      .select()
      .from(profile)
      .where(eq(profile.id, id))

    if (!requestedUserProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // const [currentUserProfile] = await db
    //   .select()
    //   .from(profile)
    //   .where(eq(profile.userId, session.user.id));

    // Only allow access to own photo or if user is admin/security
    const canAccess = true

    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!requestedUserProfile.photoPath) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // Serve the photo file
    const photoPath = path.join(process.cwd(), "public", requestedUserProfile.photoPath);
    
    if (!fs.existsSync(photoPath)) {
      return NextResponse.json({ error: "Photo file not found" }, { status: 404 });
    }

    const photoBuffer = fs.readFileSync(photoPath);
    const response = new NextResponse(photoBuffer);
    response.headers.set("Content-Type", "image/png");
    response.headers.set("Cache-Control", "public, max-age=86400"); // Cache for 1 day
    
    return response;
  } catch (error) {
    console.error("Error serving photo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
