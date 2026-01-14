'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, AlertTriangle, Building } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardSkeleton } from '@/components/ui';
import { InvestorInterestForm } from '@/components/forms/InvestorInterestForm';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import { Property } from '@/types';

export default function InvestorPage() {
  const { locale, t } = useLocale();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string | undefined>();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      const supabase = createClient();
      const { data } = await supabase
        .from('properties')
        .select('*, city:cities(*)')
        .eq('status', 'live')
        .order('created_at', { ascending: false });

      setProperties(data || []);
      setLoading(false);
    }

    fetchProperties();
  }, []);

  const handleShowInterest = (propertyId?: string) => {
    setSelectedProperty(propertyId);
    setShowForm(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.common.back}
          </Link>

          {/* Hero */}
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
              <TrendingUp className="h-8 w-8 text-[var(--color-primary)]" />
            </div>
            <h1 className="font-serif text-4xl font-bold text-[var(--color-foreground)]">
              {t.investor.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-foreground-muted)]">
              {t.investor.subtitle}
            </p>
          </div>

          {/* Disclaimer */}
          <Card className="mb-12 border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5">
            <CardContent className="flex items-start gap-4 py-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-warning)]" />
              <p className="text-sm text-[var(--color-foreground-muted)]">
                {t.investor.disclaimer}
              </p>
            </CardContent>
          </Card>

          {!showForm ? (
            <>
              {/* Properties */}
              <h2 className="mb-6 font-serif text-2xl font-semibold text-[var(--color-foreground)]">
                {t.investor.properties}
              </h2>

              {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              ) : properties.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Building className="mx-auto h-12 w-12 text-[var(--color-foreground-muted)]" />
                    <p className="mt-4 text-[var(--color-foreground-muted)]">
                      {t.investor.noProperties}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      locale={locale}
                      onShowInterest={() => handleShowInterest(property.id)}
                      ctaText={t.investor.showInterest}
                    />
                  ))}
                </div>
              )}

              {/* General Interest CTA */}
              <div className="mt-12 text-center">
                <p className="mb-4 text-[var(--color-foreground-muted)]">
                  {locale === 'it'
                    ? 'Non sei sicuro su quale proprietà investire?'
                    : 'Not sure which property to invest in?'}
                </p>
                <button
                  onClick={() => handleShowInterest()}
                  className="btn-primary rounded-xl px-8 py-3 text-lg font-medium"
                >
                  {t.investor.showInterest}
                </button>
              </div>
            </>
          ) : (
            <InvestorInterestForm
              propertyId={selectedProperty}
              onBack={() => setShowForm(false)}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface PropertyCardProps {
  property: Property;
  locale: 'it' | 'en';
  onShowInterest: () => void;
  ctaText: string;
}

function PropertyCard({ property, locale, onShowInterest, ctaText }: PropertyCardProps) {
  return (
    <Card variant="interactive" className="overflow-hidden" onClick={onShowInterest}>
      <div className="aspect-video bg-[var(--color-background-subtle)]">
        {property.cover_image_url ? (
          <img
            src={property.cover_image_url}
            alt={property.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Building className="h-12 w-12 text-[var(--color-foreground-muted)]" />
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="font-serif text-xl font-semibold text-[var(--color-foreground)]">
          {property.name}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">
          {property.address_area}
        </p>
        <p className="mt-3 line-clamp-2 text-sm text-[var(--color-foreground-muted)]">
          {locale === 'it' ? property.description_it : property.description_en}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-[var(--color-foreground-muted)]">
            {locale === 'it' ? 'Min.' : 'Min.'} €{property.min_ticket_eur}
          </span>
          <span className="font-medium text-[var(--color-primary)]">{ctaText} →</span>
        </div>
      </CardContent>
    </Card>
  );
}
