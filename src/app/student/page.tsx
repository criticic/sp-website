'use client';
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import DigitalIdCard from "./DigitalIdCard";
import { profile, user } from "@/db/schema";

type Student = typeof profile.$inferSelect & typeof user.$inferSelect;

export default function StudentPage() {
  const { data: session, isPending } = useSession();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/student/profile`);
          if (response.ok) {
            const userData = await response.json();
            setStudent(userData);
          }
        } catch (error) {
          console.error("Failed to fetch student data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (!isPending && session?.user) {
      fetchStudentData();
    }
  }, [session, isPending]);

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome!</h1>
        <p className="mt-2 text-gray-600">Your profile is not yet complete.</p>
        <p className="mt-1 text-gray-500">Please contact the administration to update your details.</p>
      </div>
    );
  }

  // If admin has not filled details yet
  if (!student.rollNumber) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {student.name}!</h1>
        <p className="mt-2 text-gray-600">Your profile is not yet complete.</p>
        <p className="mt-1 text-gray-500">Please contact the administration to update your details.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <DigitalIdCard student={student} />
    </div>
  );
}
