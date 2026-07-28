'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaNewspaper, FaFileAlt, FaUsers, FaShieldAlt, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';

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
        className="fixed top-4 left-4 z-50 lg:hidden bg-ink text-white p-2.5"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside className={cn(
        "w-64 bg-ink text-white p-6 flex flex-col fixed h-full z-40 transition-transform duration-300",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-1 mt-12 lg:mt-0">Admin</p>
        <h2 className="font-display text-2xl text-white mb-8">Panel</h2>

        <nav className="flex-grow">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2.5 text-sm font-body transition-colors border-l-2",
                      isActive
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-transparent text-white/70 hover:text-white hover:border-white/30"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 pt-4 space-y-1">
          <div className="flex items-center px-3 py-2.5 text-sm font-body text-white/50">
            <ThemeToggle />
            <span className="ml-3">Theme</span>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="flex w-full items-center px-3 py-2.5 text-sm font-body text-white/50 hover:text-red-400 border-l-2 border-transparent hover:border-red-400 transition-colors">
              <FaSignOutAlt className="w-4 h-4 mr-3 flex-shrink-0" />
              Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
