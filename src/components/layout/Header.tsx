'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Globe, User } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Header() {
  const { locale, setLocale, t } = useLocale();
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLocale = () => {
    setLocale(locale === 'it' ? 'en' : 'it');
  };

  const navLinks = [
    { href: '/investor', label: t.nav.investor },
    { href: '/student', label: t.nav.student },
    { href: '/tourist', label: t.nav.tourist },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-card-border)] bg-[var(--color-background)]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/brand/logo.svg"
              alt="Jungle Rent"
              width={140}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-foreground-muted)] transition-colors hover:bg-[var(--color-card)] hover:text-[var(--color-foreground)]"
              aria-label={`Switch to ${locale === 'it' ? 'English' : 'Italian'}`}
            >
              <Globe className="h-4 w-4" />
              <span className="uppercase">{locale === 'it' ? 'EN' : 'IT'}</span>
            </button>

            {/* Auth */}
            {!loading && (
              <>
                {user ? (
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      {t.nav.dashboard}
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      {t.nav.login}
                    </Button>
                  </Link>
                )}
              </>
            )}

            {/* Waitlist CTA */}
            <Link href="/waitlist">
              <Button size="sm">{t.nav.joinWaitlist}</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-[var(--color-foreground-muted)] hover:bg-[var(--color-card)] md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'border-t border-[var(--color-card-border)] bg-[var(--color-background)] md:hidden',
          mobileMenuOpen ? 'block' : 'hidden'
        )}
      >
        <div className="space-y-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-4 py-3 text-base font-medium text-[var(--color-foreground-muted)] transition-colors hover:bg-[var(--color-card)] hover:text-[var(--color-foreground)]"
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-[var(--color-card-border)] pt-4 mt-4">
            <button
              onClick={toggleLocale}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-[var(--color-foreground-muted)] transition-colors hover:bg-[var(--color-card)]"
            >
              <Globe className="h-5 w-5" />
              {locale === 'it' ? 'Switch to English' : 'Passa all\'Italiano'}
            </button>

            {!loading && (
              <>
                {user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-[var(--color-foreground-muted)] transition-colors hover:bg-[var(--color-card)]"
                  >
                    <User className="h-5 w-5" />
                    {t.nav.dashboard}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-4 py-3 text-base font-medium text-[var(--color-foreground-muted)] transition-colors hover:bg-[var(--color-card)]"
                  >
                    {t.nav.login}
                  </Link>
                )}
              </>
            )}

            <div className="px-4 pt-2">
              <Link href="/waitlist" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">{t.nav.joinWaitlist}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
