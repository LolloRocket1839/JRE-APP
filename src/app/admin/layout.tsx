'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Home,
  Building,
  Users,
  Shield,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { t } = useLocale();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: '/admin', label: t.admin.overview, icon: LayoutDashboard },
    { href: '/admin/listings', label: t.admin.listings, icon: Home },
    { href: '/admin/properties', label: t.admin.properties, icon: Building },
    { href: '/admin/leads', label: t.admin.leads, icon: Users },
    { href: '/admin/verifications', label: t.admin.verifications, icon: Shield },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-[var(--color-card)] shadow-lg transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-[var(--color-card-border)] px-4">
            <Link href="/">
              <Image
                src="/brand/logo.svg"
                alt="Jungle Rent"
                width={120}
                height={28}
                className="h-7 w-auto"
              />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-subtle)] lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-subtle)] hover:text-[var(--color-foreground)]'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="border-t border-[var(--color-card-border)] p-4">
            <div className="mb-3 text-sm text-[var(--color-foreground-muted)]">
              {user?.email}
            </div>
            <button
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--color-foreground-muted)] transition-colors hover:bg-[var(--color-background-subtle)] hover:text-[var(--color-foreground)]"
            >
              <LogOut className="h-5 w-5" />
              {t.auth.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-16 items-center gap-4 border-b border-[var(--color-card-border)] bg-[var(--color-card)] px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-[var(--color-foreground-muted)] hover:bg-[var(--color-background-subtle)]"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Image
            src="/brand/logo.svg"
            alt="Jungle Rent"
            width={100}
            height={24}
            className="h-6 w-auto"
          />
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
