import { redirect } from 'next/navigation';
import { deleteSession } from '@/lib/auth';
import AdminSidebar from './AdminSidebar';

async function logout() {
  'use server';
  await deleteSession();
  redirect('/login');
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar logoutAction={logout} />
      <main className="flex-1 p-4 md:p-8 lg:ml-64 pt-16 lg:pt-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}