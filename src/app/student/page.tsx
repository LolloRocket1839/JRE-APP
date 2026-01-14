'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, GraduationCap, MapPin, Home, Check, Euro } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, Badge, Button, ListingSkeleton } from '@/components/ui';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import { Listing } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function StudentPage() {
  const { locale, t } = useLocale();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'room' | 'apartment'>('all');

  useEffect(() => {
    async function fetchListings() {
      const supabase = createClient();
      let query = supabase
        .from('listings')
        .select('*, city:cities(*)')
        .eq('short_stay_eligible', false)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('type', filter);
      }

      const { data } = await query;
      setListings(data || []);
      setLoading(false);
    }

    fetchListings();
  }, [filter]);

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
              <GraduationCap className="h-8 w-8 text-[var(--color-primary)]" />
            </div>
            <h1 className="font-serif text-4xl font-bold text-[var(--color-foreground)]">
              {t.student.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-foreground-muted)]">
              {t.student.subtitle}
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              {locale === 'it' ? 'Tutti' : 'All'}
            </Button>
            <Button
              variant={filter === 'room' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('room')}
            >
              {locale === 'it' ? 'Stanze' : 'Rooms'}
            </Button>
            <Button
              variant={filter === 'apartment' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('apartment')}
            >
              {locale === 'it' ? 'Appartamenti' : 'Apartments'}
            </Button>
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <ListingSkeleton />
              <ListingSkeleton />
              <ListingSkeleton />
              <ListingSkeleton />
              <ListingSkeleton />
              <ListingSkeleton />
            </div>
          ) : listings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Home className="mx-auto h-12 w-12 text-[var(--color-foreground-muted)]" />
                <p className="mt-4 text-[var(--color-foreground-muted)]">
                  {t.common.noResults}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} locale={locale} t={t} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface ListingCardProps {
  listing: Listing;
  locale: 'it' | 'en';
  t: ReturnType<typeof import('@/hooks/useLocale').useLocale>['t'];
}

function ListingCard({ listing, locale, t }: ListingCardProps) {
  const title = locale === 'it' ? listing.title_it : listing.title_en;
  const photos = listing.photos as string[];

  return (
    <Link href={`/student/listings/${listing.id}`}>
      <Card variant="interactive" className="h-full overflow-hidden">
        {/* Image */}
        <div className="aspect-[4/3] bg-[var(--color-background-subtle)]">
          {photos.length > 0 ? (
            <img
              src={photos[0]}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Home className="h-12 w-12 text-[var(--color-foreground-muted)]" />
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge>
              {listing.type === 'room'
                ? locale === 'it'
                  ? 'Stanza'
                  : 'Room'
                : locale === 'it'
                ? 'Appartamento'
                : 'Apartment'}
            </Badge>
            {listing.verified_listing && (
              <Badge variant="success">
                <Check className="mr-1 h-3 w-3" />
                {t.student.listing.verified}
              </Badge>
            )}
          </div>

          <h3 className="font-serif text-lg font-semibold text-[var(--color-foreground)] line-clamp-2">
            {title}
          </h3>

          <div className="mt-2 flex items-center gap-1 text-sm text-[var(--color-foreground-muted)]">
            <MapPin className="h-4 w-4" />
            <span>{listing.distance_category}</span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <Euro className="h-4 w-4 text-[var(--color-primary)]" />
              <span className="text-xl font-semibold text-[var(--color-foreground)]">
                {listing.price_monthly}
              </span>
              <span className="text-sm text-[var(--color-foreground-muted)]">
                {t.student.listing.perMonth}
              </span>
            </div>
            <span className="text-sm text-[var(--color-foreground-muted)]">
              {listing.area}m²
            </span>
          </div>

          {listing.bills_included && (
            <p className="mt-2 text-sm text-[var(--color-success)]">
              {t.student.listing.billsIncluded}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
