'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaIdCard, FaShieldAlt, FaUserGraduate } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const menuitems = [
  { href: '/about', label: 'About System', icon: FaIdCard },
  { href: '/security', label: 'Security', icon: FaShieldAlt },
  { href: '/student', label: 'Student Portal', icon: FaUserGraduate },
];

const navButton = { href: '/admin', label: 'Admin Panel' };

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="w-full top-0 left-0 z-50 fixed bg-white shadow-sm border-b border-gray-100">
      <header className="flex items-center justify-between my-5 px-4 md:px-8 lg:px-16 xl:px-32 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3">
          <FaIdCard className="text-blue-600 text-2xl" />
          <div className="flex flex-col items-start">
            <span className="text-xl font-bold text-gray-900">Digital ID</span>
            <span className="text-sm font-medium text-blue-600">IIT (BHU) Varanasi</span>
          </div>
        </Link>
        
        <div className="hidden lg:flex items-center gap-4">
          <nav className="flex items-center">
            <ul className="flex items-center space-x-6 xl:space-x-8">
              {menuitems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link 
                      href={item.href} 
                      className={cn(
                        "font-medium transition-colors duration-200 relative pb-1 flex items-center gap-2",
                        isActive 
                          ? "text-blue-700" 
                          : "text-gray-700 hover:text-blue-700"
                      )}
                    >
                      <Icon className="text-sm" />
                      {item.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <Link href={navButton.href} className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white border transition-colors duration-200 inline-flex items-center">
            <span className="text-lg font-normal">{navButton.label}</span>
          </Link>
        </div>

        <div className="block lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-black" aria-label="Toggle menu">
            {isOpen ? <FaTimes className="w-8 h-8" /> : <FaBars className="w-8 h-8" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden w-full bg-white shadow-lg absolute top-full left-0 transition-transform duration-300 ease-in-out",
        isOpen ? "transform translate-y-0" : "transform -translate-y-[150%]"
      )}>
        <ul className="flex flex-col p-4">
          {menuitems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href} className="w-full">
                <Link 
                  href={item.href} 
                  onClick={() => setIsOpen(false)} 
                  className={cn(
                    "block py-3 px-3 transition-colors duration-200 rounded-lg relative flex items-center gap-2",
                    isActive 
                      ? "text-blue-700 bg-blue-50" 
                      : "text-gray-700 hover:text-blue-700"
                  )}
                >
                  <Icon className="text-sm" />
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-2 left-3 right-3 h-0.5 bg-blue-700"></span>
                  )}
                </Link>
              </li>
            );
          })}
          <li className="mt-4">
            <Link href={navButton.href} onClick={() => setIsOpen(false)} className="block text-center w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200">
              {navButton.label}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}