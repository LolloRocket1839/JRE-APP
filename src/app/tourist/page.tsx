'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plane, MapPin, Home, Check, Euro, Moon, Users } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, Badge, ListingSkeleton } from '@/components/ui';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import { Listing } from '@/types';

export default function TouristPage() {
  const { locale, t } = useLocale();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      const supabase = createClient();
      const { data } = await supabase
        .from('listings')
        .select('*, city:cities(*)')
        .eq('short_stay_eligible', true)
        .order('created_at', { ascending: false });

      setListings(data || []);
      setLoading(false);
    }

    fetchListings();
  }, []);

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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
              <Plane className="h-8 w-8 text-[var(--color-accent)]" />
            </div>
            <h1 className="font-serif text-4xl font-bold text-[var(--color-foreground)]">
              {t.tourist.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--color-foreground-muted)]">
              {t.tourist.subtitle}
            </p>
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                <TouristListingCard key={listing.id} listing={listing} locale={locale} t={t} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface TouristListingCardProps {
  listing: Listing;
  locale: 'it' | 'en';
  t: ReturnType<typeof import('@/hooks/useLocale').useLocale>['t'];
}

function TouristListingCard({ listing, locale, t }: TouristListingCardProps) {
  const title = locale === 'it' ? listing.title_it : listing.title_en;
  const photos = listing.photos as string[];

  return (
    <Link href={`/tourist/listings/${listing.id}`}>
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
              <Euro className="h-4 w-4 text-[var(--color-accent)]" />
              <span className="text-xl font-semibold text-[var(--color-foreground)]">
                {listing.price_nightly}
              </span>
              <span className="text-sm text-[var(--color-foreground-muted)]">
                {t.tourist.listing.perNight}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-[var(--color-foreground-muted)]">
              <Users className="h-4 w-4" />
              <span>{Math.floor(listing.area / 15)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
