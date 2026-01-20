'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';

const navLinks = [
  { href: '/', label: 'Ranking' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/deportistas', label: 'Deportistas' },
];

export function Header() {
  const { user, isAdmin, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-green-700 shadow-lg">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo_bftc.png"
                alt="Ranking Field Target"
                width={200}
                height={56}
                className="h-14 w-auto"
                priority
              />
              <span className="hidden sm:block text-xl font-bold text-white">Ranking Interno FT</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 mx-5 h-full">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-4 py-4 transition-colors ${
                    isActive(href)
                      ? 'text-white font-medium'
                      : 'text-green-200 hover:text-white'
                  }`}
                >
                  {label}
                  {isActive(href) && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-white rounded-t-full" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {isAdmin ? (
              <>
                <span className="text-sm text-green-200 hidden sm:block">Admin</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={logout}
                  disabled={loading}
                >
                  Salir
                </Button>
              </>
            ) : (
              <Link href="/login" className="hidden md:block">
                <Button variant="secondary" size="sm">
                  Admin
                </Button>
              </Link>
            )}

            {/* Hamburger menu button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden pb-4 space-y-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block py-2 px-3 border-l-[3px] transition-colors ${
                  isActive(href)
                    ? 'border-white text-white font-medium bg-green-600/30'
                    : 'border-transparent text-green-200 hover:text-white hover:border-green-400'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            {!isAdmin && (
              <Link
                href="/login"
                className="block py-2 px-3 border-l-[3px] border-transparent text-green-200 hover:text-white hover:border-green-400 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
