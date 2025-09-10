'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaUser } from "react-icons/fa";
import { deleteStudent } from "./StudentActions";

type StudentData = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  profile: {
    id: string;
    role: "STUDENT" | "ADMIN" | "SECURITY";
    rollNumber: string | null;
    branch: string | null;
    course: "BTECH" | "IDD" | "MTECH" | "PHD" | null;
    hostelName: string | null;
    roomNumber: string | null;
    bloodGroup: string | null;
    homeAddress: string | null;
    photoPath: string | null;
    totpSecret: string | null;
  };
};

export default function StudentsAdminPage() {
    const [allStudents, setAllStudents] = useState<StudentData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStudents() {
            try {
                const response = await fetch('/api/admin/students');
                if (response.ok) {
                    const students = await response.json();
                    setAllStudents(students);
                }
            } catch (error) {
                console.error('Failed to fetch students:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStudents();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">All Students</h1>
                <Link
                    href="/admin/students/new"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FaPlus />
                    Add New Student
                </Link>
            </div>

            {allStudents.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <FaUser className="mx-auto text-gray-400 text-4xl mb-4" />
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">No Students Found</h2>
                    <p className="text-gray-500 mb-4">Start by adding your first student to the system.</p>
                    <Link
                        href="/admin/students/new"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FaPlus />
                        Add First Student
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Roll Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Branch
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Hostel
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allStudents.map((student) => (
                                    <tr key={student.profile.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <FaUser className="text-gray-500" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {student.user?.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {student.user?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {student.profile.rollNumber || 'Not set'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {student.profile.course || 'Not set'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="max-w-xs truncate" title={student.profile.branch || 'Not set'}>
                                                {student.profile.branch || 'Not set'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {student.profile.hostelName || 'Not set'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/students/edit/${student.profile.id}`}
                                                    className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                                    title="Edit Student"
                                                >
                                                    <FaEdit />
                                                </Link>
                                                <form action={deleteStudent.bind(null, student.profile.id)} className="inline">
                                                    <button
                                                        type="submit"
                                                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                        title="Delete Student"
                                                        onClick={(e) => {
                                                            if (!confirm('Are you sure you want to delete this student?')) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
