'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Home,
  Check,
  Euro,
  Users,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, Badge, Button, Skeleton } from '@/components/ui';
import { TouristRequestForm } from '@/components/forms/TouristRequestForm';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';
import { Listing } from '@/types';

export default function TouristListingPage() {
  const params = useParams();
  const { locale, t } = useLocale();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    async function fetchListing() {
      const supabase = createClient();
      const { data } = await supabase
        .from('listings')
        .select('*, city:cities(*)')
        .eq('id', params.id)
        .single();

      setListing(data);
      setLoading(false);
    }

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Skeleton className="mb-8 h-8 w-32" />
            <Skeleton className="mb-6 h-[400px] w-full rounded-2xl" />
            <Skeleton className="mb-4 h-10 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <Home className="mx-auto h-12 w-12 text-[var(--color-foreground-muted)]" />
              <p className="mt-4 text-[var(--color-foreground-muted)]">
                {locale === 'it' ? 'Annuncio non trovato' : 'Listing not found'}
              </p>
              <Link href="/tourist">
                <Button variant="outline" className="mt-6">
                  {t.common.back}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const title = locale === 'it' ? listing.title_it : listing.title_en;
  const description = locale === 'it' ? listing.description_it : listing.description_en;
  const photos = listing.photos as string[];
  const amenities = listing.amenities as string[];
  const maxGuests = Math.floor(listing.area / 15);

  if (showForm) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <TouristRequestForm
              listingId={listing.id}
              listingTitle={title}
              maxGuests={maxGuests}
              pricePerNight={listing.price_nightly || 0}
              onBack={() => setShowForm(false)}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/tourist"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.common.back}
          </Link>

          {/* Image Gallery */}
          <div className="relative mb-8 overflow-hidden rounded-2xl bg-[var(--color-background-subtle)]">
            <div className="aspect-[16/10]">
              {photos.length > 0 ? (
                <img
                  src={photos[currentImage]}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Home className="h-16 w-16 text-[var(--color-foreground-muted)]" />
                </div>
              )}
            </div>

            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage((i) => (i > 0 ? i - 1 : photos.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-transform hover:scale-110"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentImage((i) => (i < photos.length - 1 ? i + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-transform hover:scale-110"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        i === currentImage
                          ? 'w-4 bg-white'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Badges */}
              <div className="mb-4 flex flex-wrap gap-2">
                {listing.verified_listing && (
                  <Badge variant="success">
                    <Check className="mr-1 h-3 w-3" />
                    {t.student.listing.verified}
                  </Badge>
                )}
                <Badge>
                  <Users className="mr-1 h-3 w-3" />
                  {maxGuests} {t.tourist.listing.guests}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl font-bold text-[var(--color-foreground)]">
                {title}
              </h1>

              {/* Location */}
              <div className="mt-3 flex items-center gap-2 text-[var(--color-foreground-muted)]">
                <MapPin className="h-5 w-5" />
                <span>{listing.distance_category}</span>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="mb-3 font-serif text-xl font-semibold text-[var(--color-foreground)]">
                  {locale === 'it' ? 'Descrizione' : 'Description'}
                </h2>
                <p className="text-[var(--color-foreground-muted)] whitespace-pre-line">
                  {description}
                </p>
              </div>

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="mt-6">
                  <h2 className="mb-3 font-serif text-xl font-semibold text-[var(--color-foreground)]">
                    {t.student.listing.amenities}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity, i) => (
                      <Badge key={i} variant="default">
                        <Check className="mr-1 h-3 w-3" />
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Check-in Info */}
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card)] p-4">
                <Calendar className="mt-0.5 h-5 w-5 text-[var(--color-accent)]" />
                <div>
                  <p className="font-medium text-[var(--color-foreground)]">
                    {t.tourist.listing.checkIn}
                  </p>
                  <p className="text-sm text-[var(--color-foreground-muted)]">
                    {t.tourist.listing.flexible}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  {/* Price */}
                  <div className="mb-6 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <Euro className="h-6 w-6 text-[var(--color-accent)]" />
                      <span className="text-4xl font-bold text-[var(--color-foreground)]">
                        {listing.price_nightly}
                      </span>
                      <span className="text-[var(--color-foreground-muted)]">
                        {t.tourist.listing.perNight}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mb-6 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--color-foreground-muted)]">
                        {t.student.listing.area}
                      </span>
                      <span className="font-medium text-[var(--color-foreground)]">
                        {listing.area}m²
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-foreground-muted)]">
                        Max {t.tourist.listing.guests}
                      </span>
                      <span className="font-medium text-[var(--color-foreground)]">
                        {maxGuests}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full" size="lg" onClick={() => setShowForm(true)}>
                    {t.personas.tourist.cta}
                  </Button>

                  {/* Support Note */}
                  <p className="mt-4 text-center text-xs text-[var(--color-foreground-muted)]">
                    {t.personas.tourist.bullet3}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
