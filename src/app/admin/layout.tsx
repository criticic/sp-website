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
    <div className="flex min-h-screen bg-parchment">
      <AdminSidebar logoutAction={logout} />
      <main className="flex-1 p-6 md:p-10 lg:ml-64 pt-20 lg:pt-10 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}