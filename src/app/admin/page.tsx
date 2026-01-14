'use client';

import { useEffect, useState } from 'react';
import { Users, Home, Building, Shield, TrendingUp } from 'lucide-react';
import { Card, CardContent, Skeleton } from '@/components/ui';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';

interface Stats {
  totalLeads: number;
  newLeads: number;
  totalListings: number;
  totalProperties: number;
  pendingVerifications: number;
}

export default function AdminPage() {
  const { locale, t } = useLocale();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();

      const [leads, newLeads, listings, properties, verifications] = await Promise.all([
        supabase.from('leads').select('id', { count: 'exact', head: true }),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('listings').select('id', { count: 'exact', head: true }),
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('verifications').select('id', { count: 'exact', head: true }).eq('status', 'submitted'),
      ]);

      setStats({
        totalLeads: leads.count || 0,
        newLeads: newLeads.count || 0,
        totalListings: listings.count || 0,
        totalProperties: properties.count || 0,
        pendingVerifications: verifications.count || 0,
      });
      setLoading(false);
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      label: locale === 'it' ? 'Lead Totali' : 'Total Leads',
      value: stats?.totalLeads || 0,
      icon: Users,
      color: 'var(--color-primary)',
      bgColor: 'var(--color-primary)',
    },
    {
      label: locale === 'it' ? 'Nuovi Lead' : 'New Leads',
      value: stats?.newLeads || 0,
      icon: TrendingUp,
      color: 'var(--color-success)',
      bgColor: 'var(--color-success)',
    },
    {
      label: t.admin.listings,
      value: stats?.totalListings || 0,
      icon: Home,
      color: 'var(--color-info)',
      bgColor: 'var(--color-info)',
    },
    {
      label: t.admin.properties,
      value: stats?.totalProperties || 0,
      icon: Building,
      color: 'var(--color-accent)',
      bgColor: 'var(--color-accent)',
    },
    {
      label: locale === 'it' ? 'Verifiche in Attesa' : 'Pending Verifications',
      value: stats?.pendingVerifications || 0,
      icon: Shield,
      color: 'var(--color-warning)',
      bgColor: 'var(--color-warning)',
    },
  ];

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold text-[var(--color-foreground)]">
        {t.admin.title}
      </h1>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="mb-4 h-12 w-12 rounded-xl" />
                  <Skeleton className="mb-2 h-8 w-16" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))
          : statCards.map((stat, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${stat.bgColor}10` }}
                  >
                    <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                  </div>
                  <p className="text-3xl font-bold text-[var(--color-foreground)]">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[var(--color-foreground-muted)]">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-4 font-serif text-xl font-semibold text-[var(--color-foreground)]">
          {locale === 'it' ? 'Azioni Rapide' : 'Quick Actions'}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/leads"
            className="card flex items-center gap-4 p-4 transition-colors hover:border-[var(--color-primary)]"
          >
            <Users className="h-8 w-8 text-[var(--color-primary)]" />
            <div>
              <p className="font-medium text-[var(--color-foreground)]">
                {locale === 'it' ? 'Gestisci Lead' : 'Manage Leads'}
              </p>
              <p className="text-sm text-[var(--color-foreground-muted)]">
                {stats?.newLeads || 0} {locale === 'it' ? 'nuovi' : 'new'}
              </p>
            </div>
          </a>
          <a
            href="/admin/verifications"
            className="card flex items-center gap-4 p-4 transition-colors hover:border-[var(--color-primary)]"
          >
            <Shield className="h-8 w-8 text-[var(--color-warning)]" />
            <div>
              <p className="font-medium text-[var(--color-foreground)]">
                {locale === 'it' ? 'Revisiona Verifiche' : 'Review Verifications'}
              </p>
              <p className="text-sm text-[var(--color-foreground-muted)]">
                {stats?.pendingVerifications || 0} {locale === 'it' ? 'in attesa' : 'pending'}
              </p>
            </div>
          </a>
          <a
            href="/admin/listings"
            className="card flex items-center gap-4 p-4 transition-colors hover:border-[var(--color-primary)]"
          >
            <Home className="h-8 w-8 text-[var(--color-info)]" />
            <div>
              <p className="font-medium text-[var(--color-foreground)]">
                {locale === 'it' ? 'Gestisci Annunci' : 'Manage Listings'}
              </p>
              <p className="text-sm text-[var(--color-foreground-muted)]">
                {stats?.totalListings || 0} {locale === 'it' ? 'totali' : 'total'}
              </p>
            </div>
          </a>
          <a
            href="/admin/properties"
            className="card flex items-center gap-4 p-4 transition-colors hover:border-[var(--color-primary)]"
          >
            <Building className="h-8 w-8 text-[var(--color-accent)]" />
            <div>
              <p className="font-medium text-[var(--color-foreground)]">
                {locale === 'it' ? 'Gestisci Proprietà' : 'Manage Properties'}
              </p>
              <p className="text-sm text-[var(--color-foreground-muted)]">
                {stats?.totalProperties || 0} {locale === 'it' ? 'totali' : 'total'}
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
