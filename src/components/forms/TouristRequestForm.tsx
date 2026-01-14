'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { Button, Input, Select, Textarea, Checkbox, Card, CardContent } from '@/components/ui';
import { useLocale } from '@/hooks/useLocale';
import { submitTouristRequest } from '@/actions/leads';

const touristFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  guests: z.number().min(1, 'Guests must be positive'),
  date_from: z.string().min(1, 'Arrival date is required'),
  date_to: z.string().min(1, 'Departure date is required'),
  message: z.string().optional(),
  consent_privacy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy',
  }),
  consent_marketing: z.boolean().optional(),
});

type TouristFormData = z.infer<typeof touristFormSchema>;

interface TouristRequestFormProps {
  listingId: string;
  listingTitle: string;
  maxGuests: number;
  pricePerNight: number;
  onBack: () => void;
}

export function TouristRequestForm({
  listingId,
  listingTitle,
  maxGuests,
  pricePerNight,
  onBack,
}: TouristRequestFormProps) {
  const { locale, t } = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<TouristFormData>({
    resolver: zodResolver(touristFormSchema),
    defaultValues: {
      guests: 1,
      consent_marketing: false,
    },
  });

  const dateFrom = watch('date_from');
  const dateTo = watch('date_to');
  const guests = watch('guests');

  // Calculate nights and total
  const calculateNights = () => {
    if (!dateFrom || !dateTo) return 0;
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const diff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const nights = calculateNights();
  const total = nights * pricePerNight;

  const onSubmit = async (data: TouristFormData) => {
    setError(null);
    try {
      const result = await submitTouristRequest({
        ...data,
        listing_id: listingId,
        language: locale,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  const guestOptions = Array.from({ length: maxGuests }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]/10">
              <Check className="h-8 w-8 text-[var(--color-success)]" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-[var(--color-foreground)]">
              {locale === 'it' ? 'Richiesta inviata!' : 'Request submitted!'}
            </h2>
            <p className="mt-4 text-[var(--color-foreground-muted)]">
              {locale === 'it'
                ? 'Ti contatteremo entro 24 ore per confermare la disponibilità.'
                : 'We will contact you within 24 hours to confirm availability.'}
            </p>
            <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">
              {listingTitle}
            </p>

            <div className="mt-8 flex justify-center gap-3">
              <Link href="/tourist">
                <Button variant="outline">{t.common.back}</Button>
              </Link>
              <Link href="/dashboard">
                <Button>{t.nav.dashboard}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.common.back}
      </button>

      <Card>
        <CardContent className="p-8">
          <h2 className="mb-2 font-serif text-2xl font-semibold text-[var(--color-foreground)]">
            {t.tourist.form.title}
          </h2>
          <p className="mb-6 text-sm text-[var(--color-foreground-muted)]">{listingTitle}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              {...register('name')}
              label={t.tourist.form.name}
              error={errors.name?.message}
              required
            />

            <Input
              {...register('email')}
              type="email"
              label={t.tourist.form.email}
              error={errors.email?.message}
              required
            />

            <Input
              {...register('phone')}
              type="tel"
              label={t.tourist.form.phone}
              error={errors.phone?.message}
            />

            <Select
              {...register('guests', { valueAsNumber: true })}
              label={t.tourist.form.guests}
              options={guestOptions}
              error={errors.guests?.message}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('date_from')}
                type="date"
                label={t.tourist.form.dateFrom}
                error={errors.date_from?.message}
                min={new Date().toISOString().split('T')[0]}
                required
              />

              <Input
                {...register('date_to')}
                type="date"
                label={t.tourist.form.dateTo}
                error={errors.date_to?.message}
                min={dateFrom || new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Price Summary */}
            {nights > 0 && (
              <div className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-background)] p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-foreground-muted)]">
                    €{pricePerNight} x {nights} {locale === 'it' ? 'notti' : 'nights'}
                  </span>
                  <span className="font-medium text-[var(--color-foreground)]">€{total}</span>
                </div>
              </div>
            )}

            <Textarea
              {...register('message')}
              label={t.tourist.form.message}
              rows={3}
            />

            {/* Honeypot */}
            <input
              type="text"
              name="website"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="space-y-3 pt-2">
              <Checkbox
                {...register('consent_privacy')}
                label={
                  <span>
                    {t.verification.consent.privacy}{' '}
                    <Link href="/legal/privacy" className="text-[var(--color-primary)] underline">
                      *
                    </Link>
                  </span>
                }
                error={errors.consent_privacy?.message}
              />

              <Checkbox
                {...register('consent_marketing')}
                label={t.verification.consent.marketing}
              />
            </div>

            {error && (
              <p className="text-sm text-[var(--color-error)]">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={isSubmitting}
              size="lg"
            >
              {t.tourist.form.submit}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
