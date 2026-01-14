'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, FileText, Shield, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLocale } from '@/hooks/useLocale';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Lead, Verification, StudentRequest, TouristRequest } from '@/types';

interface DashboardData {
  leads: Lead[];
  verifications: Verification[];
  studentRequests: (StudentRequest & { listing: { title_it: string; title_en: string } })[];
  touristRequests: (TouristRequest & { listing: { title_it: string; title_en: string } })[];
}

export default function DashboardPage() {
  const { locale, t } = useLocale();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      const supabase = createClient();

      // Fetch user's leads
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch verifications
      const { data: verifications } = await supabase
        .from('verifications')
        .select('*, lead:leads(*)')
        .in('lead_id', (leads || []).map(l => l.id));

      // Fetch student requests
      const { data: studentRequests } = await supabase
        .from('student_requests')
        .select('*, listing:listings(title_it, title_en)')
        .in('lead_id', (leads || []).map(l => l.id))
        .order('created_at', { ascending: false });

      // Fetch tourist requests
      const { data: touristRequests } = await supabase
        .from('tourist_requests')
        .select('*, listing:listings(title_it, title_en)')
        .in('lead_id', (leads || []).map(l => l.id))
        .order('created_at', { ascending: false });

      setData({
        leads: leads || [],
        verifications: verifications || [],
        studentRequests: studentRequests || [],
        touristRequests: touristRequests || [],
      });
      setLoading(false);
    }

    fetchData();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-[var(--color-success)]" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-[var(--color-error)]" />;
      case 'in_review':
      case 'confirmed':
        return <Clock className="h-4 w-4 text-[var(--color-warning)]" />;
      default:
        return <AlertCircle className="h-4 w-4 text-[var(--color-info)]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'success';
      case 'rejected':
      case 'cancelled':
        return 'error';
      case 'in_review':
      case 'confirmed':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.common.back}
          </Link>

          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-[var(--color-foreground)]">
                {t.dashboard.title}
              </h1>
              <p className="mt-2 text-[var(--color-foreground-muted)]">
                {t.dashboard.subtitle}
              </p>
            </div>
            <Button variant="outline" onClick={signOut}>
              {t.auth.logout}
            </Button>
          </div>

          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                      <User className="h-6 w-6 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <CardTitle>{user?.email}</CardTitle>
                      <p className="text-sm text-[var(--color-foreground-muted)]">
                        {data?.leads.length || 0} {t.dashboard.requests.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Verification Status */}
              {data?.verifications && data.verifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-[var(--color-primary)]" />
                      <CardTitle>{t.dashboard.verification}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.verifications.map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center justify-between rounded-lg border border-[var(--color-card-border)] bg-[var(--color-background)] p-4"
                        >
                          <div className="flex items-center gap-3">
                            {getStatusIcon(v.status)}
                            <div>
                              <p className="font-medium text-[var(--color-foreground)]">
                                {v.verification_type === 'investor'
                                  ? t.nav.investor
                                  : t.nav.student}{' '}
                                {t.verification.title}
                              </p>
                              <p className="text-sm text-[var(--color-foreground-muted)]">
                                {v.full_name}
                              </p>
                            </div>
                          </div>
                          <Badge variant={getStatusBadge(v.status) as 'success' | 'error' | 'warning' | 'info'}>
                            {t.verification.status[v.status as keyof typeof t.verification.status]}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Student Requests */}
              {data?.studentRequests && data.studentRequests.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[var(--color-primary)]" />
                      <CardTitle>{t.nav.student} {t.dashboard.requests}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.studentRequests.map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between rounded-lg border border-[var(--color-card-border)] bg-[var(--color-background)] p-4"
                        >
                          <div className="flex items-center gap-3">
                            {getStatusIcon(r.status)}
                            <div>
                              <p className="font-medium text-[var(--color-foreground)]">
                                {locale === 'it' ? r.listing?.title_it : r.listing?.title_en}
                              </p>
                              <p className="text-sm text-[var(--color-foreground-muted)]">
                                {r.request_type === 'viewing'
                                  ? t.student.listing.requestViewing
                                  : t.student.listing.apply}
                              </p>
                            </div>
                          </div>
                          <Badge variant={getStatusBadge(r.status) as 'success' | 'error' | 'warning' | 'info'}>
                            {r.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tourist Requests */}
              {data?.touristRequests && data.touristRequests.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[var(--color-primary)]" />
                      <CardTitle>{t.nav.tourist} {t.dashboard.requests}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.touristRequests.map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between rounded-lg border border-[var(--color-card-border)] bg-[var(--color-background)] p-4"
                        >
                          <div className="flex items-center gap-3">
                            {getStatusIcon(r.status)}
                            <div>
                              <p className="font-medium text-[var(--color-foreground)]">
                                {locale === 'it' ? r.listing?.title_it : r.listing?.title_en}
                              </p>
                              <p className="text-sm text-[var(--color-foreground-muted)]">
                                {r.date_from} - {r.date_to} ({r.guests} {t.tourist.listing.guests})
                              </p>
                            </div>
                          </div>
                          <Badge variant={getStatusBadge(r.status) as 'success' | 'error' | 'warning' | 'info'}>
                            {r.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Empty State */}
              {!data?.leads.length && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-[var(--color-foreground-muted)]" />
                    <p className="mt-4 text-[var(--color-foreground-muted)]">
                      {t.dashboard.noRequests}
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                      <Link href="/student">
                        <Button variant="outline">{t.personas.student.cta}</Button>
                      </Link>
                      <Link href="/investor">
                        <Button>{t.personas.investor.cta}</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
