import { db } from "@/db";
import { profile, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import StudentForm from "../../StudentForm";

interface EditStudentPageProps {
  params:Promise<{id: string}>;
}

type StudentWithProfile = typeof profile.$inferSelect & Partial<typeof user.$inferSelect>;

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = await params;
  const [studentData] = await db
    .select()
    .from(profile)
    .leftJoin(user, eq(profile.userId, user.id))
    .where(eq(profile.id, id))

  if (!studentData || !studentData.profile) {
    notFound();
  }

  // Combine user and profile data, handling nullable user
  const student = {
    // Profile data (primary source of truth)
    id: studentData.profile.id,
    role: studentData.profile.role,
    name: studentData.profile.name,
    email: studentData.profile.email,
    rollNumber: studentData.profile.rollNumber,
    branch: studentData.profile.branch,
    course: studentData.profile.course,
    hostelName: studentData.profile.hostelName,
    roomNumber: studentData.profile.roomNumber,
    bloodGroup: studentData.profile.bloodGroup,
    homeAddress: studentData.profile.homeAddress,
    photoPath: studentData.profile.photoPath,
    totpSecret: studentData.profile.totpSecret,
    userId: studentData.profile.userId,
    createdAt: studentData.profile.createdAt,
    updatedAt: studentData.profile.updatedAt,
    // User data (nullable - only present if user has logged in)
    emailVerified: studentData.user?.emailVerified,
    image: studentData.user?.image,
  } as const;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Student</h1>
      <StudentForm student={student as StudentWithProfile} isEditing={true} />
    </div>
  );
}
