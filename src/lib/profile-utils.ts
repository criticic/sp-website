import { db } from "@/db";
import { profile } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function linkUserToProfile(userId: string, email: string) {
  try {
    // Check if there's an existing profile for this email that isn't linked yet
    const existingProfile = await db
      .select()
      .from(profile)
      .where(eq(profile.email, email))
      .limit(1);

    if (existingProfile.length > 0 && !existingProfile[0].userId) {
      // Link the existing profile to this user
      await db
        .update(profile)
        .set({ 
          userId: userId,
          updatedAt: new Date()
        })
        .where(eq(profile.email, email));
      
      return existingProfile[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error linking user to profile:', error);
    return null;
  }
}

export async function getUserProfile(userId: string) {
  try {
    const userProfile = await db
      .select()
      .from(profile)
      .where(eq(profile.userId, userId))
      .limit(1);
    
    return userProfile.length > 0 ? userProfile[0] : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}
