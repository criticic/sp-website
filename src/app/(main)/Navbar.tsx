'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';

const menuitems = [
  { href: '/about', label: 'About' },
  { href: '/team', label: 'Our Team' },
  { href: '/newsletters', label: 'Newsletters' },
  { href: '/updates', label: 'Updates' },
];

const navButton = { href: '/contact', label: 'Contact' };

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="w-full top-0 left-0 z-50 fixed bg-parchment/90 backdrop-blur-sm border-b border-gold/10">
      <header className="flex items-center justify-between my-4 sm:my-5 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex flex-col">
          <span className="text-sm sm:text-base font-body font-medium text-ink leading-tight tracking-tight">Students Parliament</span>
          <span className="text-xs sm:text-sm font-mono text-slate leading-tight">IIT (BHU) Varanasi</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {menuitems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-body font-medium transition-colors duration-200 rounded-none",
                  isActive
                    ? "text-ink border-b-2 border-gold"
                    : "text-slate hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={navButton.href}
            className="ml-4 px-5 py-2 bg-ink text-white text-sm font-body font-medium hover:bg-gold hover:text-ink transition-colors duration-200"
          >
            {navButton.label}
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="block lg:hidden text-ink p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className={cn(
        "lg:hidden w-full bg-parchment border-b border-gold/10 transition-all duration-300 overflow-hidden",
        isOpen ? "max-h-96" : "max-h-0"
      )}>
        <ul className="flex flex-col px-6 pb-4 space-y-1">
          {menuitems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block py-3 px-3 text-sm font-body font-medium transition-colors duration-200 border-l-2",
                    isActive
                      ? "text-ink border-gold bg-gold/5"
                      : "text-slate border-transparent hover:text-ink hover:border-gold/50"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="pt-2">
            <Link
              href={navButton.href}
              onClick={() => setIsOpen(false)}
              className="block text-center w-full py-3 bg-ink text-white text-sm font-body font-medium hover:bg-gold hover:text-ink transition-colors"
            >
              {navButton.label}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
