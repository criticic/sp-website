'use client';
import { profile, user } from "@/db/schema";
import { createStudent, updateStudent } from "./StudentActions";
import { toast } from "sonner";

// Updated type to handle the new schema where profile is independent
type Student = typeof profile.$inferSelect & Partial<typeof user.$inferSelect>;

interface StudentFormProps {
  student?: Student;
  isEditing?: boolean;
}

export default function StudentForm({ student, isEditing = false }: StudentFormProps) {
  async function handleSubmit(formData: FormData) {
    try {
      if (isEditing && student) {
        await updateStudent(student.id, formData);
      } else {
        await createStudent(formData);
      }
      toast.success(isEditing ? 'Student updated successfully!' : 'Student created successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditing ? 'Edit Student' : 'Add New Student'}
      </h2>
      
      <form action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={student?.name || ''}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={student?.email || ''}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="student@itbhu.ac.in"
            />
          </div>

          <div>
            <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Roll Number *
            </label>
            <input
              type="text"
              id="rollNumber"
              name="rollNumber"
              defaultValue={student?.rollNumber || ''}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
              Branch *
            </label>
            <input
              type="text"
              id="branch"
              name="branch"
              defaultValue={student?.branch || ''}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Computer Science and Engineering"
            />
          </div>

          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
              Course *
            </label>
            <select
              id="course"
              name="course"
              defaultValue={student?.course || ''}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Course</option>
              <option value="BTECH">B.Tech</option>
              <option value="IDD">IDD</option>
              <option value="MTECH">M.Tech</option>
              <option value="PHD">PhD</option>
            </select>
          </div>

          <div>
            <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-2">
              Blood Group
            </label>
            <input
              type="text"
              id="bloodGroup"
              name="bloodGroup"
              defaultValue={student?.bloodGroup || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., O+, A-, AB+"
            />
          </div>

          {/* Hostel Information */}
          <div>
            <label htmlFor="hostelName" className="block text-sm font-medium text-gray-700 mb-2">
              Hostel Name
            </label>
            <input
              type="text"
              id="hostelName"
              name="hostelName"
              defaultValue={student?.hostelName || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Room Number
            </label>
            <input
              type="text"
              id="roomNumber"
              name="roomNumber"
              defaultValue={student?.roomNumber || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Home Address */}
        <div>
          <label htmlFor="homeAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Home Address
          </label>
          <textarea
            id="homeAddress"
            name="homeAddress"
            defaultValue={student?.homeAddress || ''}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Complete home address"
          />
        </div>

        {/* Photo Path */}
        <div>
          <label htmlFor="photoPath" className="block text-sm font-medium text-gray-700 mb-2">
            Photo Path
          </label>
          <input
            type="text"
            id="photoPath"
            name="photoPath"
            defaultValue={student?.photoPath || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., /assets/people/StudentName.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            Relative path to student photo in the public directory
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {isEditing ? 'Update Student' : 'Create Student'}
          </button>
        </div>
      </form>
    </div>
  );
}
