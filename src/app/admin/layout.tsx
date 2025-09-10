'use client';
import { useState } from 'react';
import Sidebar from "@/app/admin/Sidebar";
import { FaUserPlus, FaUsers, FaTachometerAlt, FaQrcode, FaBars } from "react-icons/fa";

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: FaTachometerAlt },
  { href: '/admin/students', label: 'All Students', icon: FaUsers },
  { href: '/admin/students/new', label: 'Add Student', icon: FaUserPlus },
  { href: '/admin/scanner', label: 'Scanner', icon: FaQrcode },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-md shadow-md border"
      >
        <FaBars size={20} className="text-gray-600" />
      </button>

      <Sidebar 
        navItems={adminNavItems} 
        title="Admin Panel" 
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 pt-16 lg:pt-4">
        {children}
      </main>
    </div>
  );
}