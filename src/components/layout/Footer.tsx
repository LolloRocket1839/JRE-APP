'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from '@/hooks/useLocale';

export function Footer() {
  const { t } = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-card-border)] bg-[var(--color-background-subtle)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          {/* Incubator Badge */}
          <div className="badge">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            <span>{t.footer.incubator}</span>
          </div>

          {/* Logo */}
          <Link href="/">
            <Image
              src="/brand/logo.svg"
              alt="Jungle Rent"
              width={120}
              height={28}
              className="h-7 w-auto opacity-60 transition-opacity hover:opacity-100"
            />
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              href="/investor"
              className="text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
            >
              {t.nav.investor}
            </Link>
            <Link
              href="/student"
              className="text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
            >
              {t.nav.student}
            </Link>
            <Link
              href="/tourist"
              className="text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
            >
              {t.nav.tourist}
            </Link>
            <span className="hidden sm:inline text-[var(--color-card-border)]">|</span>
            <Link
              href="/legal/privacy"
              className="text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
            >
              {t.legal.privacy}
            </Link>
            <Link
              href="/legal/terms"
              className="text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
            >
              {t.legal.terms}
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-[var(--color-foreground-muted)]">
            © {currentYear} Jungle Rent. {t.footer.rights}.
          </p>
        </div>
      </div>
    </footer>
  );
}
