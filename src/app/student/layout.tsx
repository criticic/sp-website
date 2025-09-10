'use client';
import { signOut } from "@/lib/auth-client";
import { FaSignOutAlt, FaIdCard } from "react-icons/fa";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <FaIdCard className="text-blue-600 text-2xl" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Digital ID</h1>
                <p className="text-sm text-gray-500">IIT (BHU) Varanasi</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaSignOutAlt />
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
