import { redirect } from 'next/navigation';
import { deleteSession } from '@/lib/auth';
import { FaHome, FaNewspaper, FaFileAlt, FaUsers, FaShieldAlt, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';

async function logout() {
  'use server';
  await deleteSession();
  redirect('/login');
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: FaHome },
  { href: '/admin/updates', label: 'Updates', icon: FaFileAlt },
  { href: '/admin/newsletters', label: 'Newsletters', icon: FaNewspaper },
  { href: '/admin/team', label: 'Team Members', icon: FaUsers },
  { href: '/admin/committees', label: 'Committees', icon: FaShieldAlt },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-dark text-white p-4 flex flex-col fixed h-full">
        <h2 className="text-2xl font-bold mb-8 text-primary">Admin Panel</h2>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center p-2 rounded hover:bg-primary hover:text-dark transition-colors"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <form action={logout}>
            <button type="submit" className="flex w-full items-center p-2 rounded hover:bg-red-500 transition-colors">
                <FaSignOutAlt className="w-5 h-5 mr-3" />
                Logout
            </button>
        </form>
      </aside>
      <main className="flex-1 p-8 ml-64">
        {children}
      </main>
    </div>
  );
}