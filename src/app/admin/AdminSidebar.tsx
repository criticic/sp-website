'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaNewspaper, FaFileAlt, FaUsers, FaShieldAlt, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: FaHome },
  { href: '/admin/updates', label: 'Updates', icon: FaFileAlt },
  { href: '/admin/newsletters', label: 'Newsletters', icon: FaNewspaper },
  { href: '/admin/team', label: 'Team Members', icon: FaUsers },
  { href: '/admin/committees', label: 'Committees', icon: FaShieldAlt },
];

export default function AdminSidebar({ logoutAction }: { logoutAction: () => Promise<void> }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-dark text-white p-2.5 rounded-lg shadow-lg"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "w-64 bg-dark text-white p-4 flex flex-col fixed h-full z-40 transition-transform duration-300",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <h2 className="text-2xl font-bold mb-8 text-primary mt-12 lg:mt-0">Admin Panel</h2>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center p-2 rounded transition-colors",
                      isActive
                        ? "bg-primary text-dark"
                        : "hover:bg-primary hover:text-dark"
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <form action={logoutAction}>
          <button type="submit" className="flex w-full items-center p-2 rounded hover:bg-red-500 transition-colors">
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            Logout
          </button>
        </form>
      </aside>
    </>
  );
}
