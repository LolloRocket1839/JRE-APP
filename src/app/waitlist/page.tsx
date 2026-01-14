'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Check, Mail } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button, Input, Select } from '@/components/ui';
import { useLocale } from '@/hooks/useLocale';
import { submitWaitlist } from '@/actions/leads';

const waitlistSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  interest: z.enum(['investor', 'student', 'tourist']),
});

type WaitlistForm = z.infer<typeof waitlistSchema>;

export default function WaitlistPage() {
  const { locale, t } = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistForm>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      interest: 'student',
    },
  });

  const onSubmit = async (data: WaitlistForm) => {
    setError(null);
    try {
      const result = await submitWaitlist({
        ...data,
        language: locale,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || t.waitlist.error);
      }
    } catch {
      setError(t.waitlist.error);
    }
  };

  const interestOptions = [
    { value: 'investor', label: t.waitlist.interestOptions.investor },
    { value: 'student', label: t.waitlist.interestOptions.student },
    { value: 'tourist', label: t.waitlist.interestOptions.tourist },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.common.back}
          </Link>

          <div className="card p-8">
            {submitted ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]/10">
                  <Check className="h-8 w-8 text-[var(--color-success)]" />
                </div>
                <h2 className="font-serif text-2xl font-semibold text-[var(--color-foreground)]">
                  {t.waitlist.success}
                </h2>
                <div className="mt-6">
                  <Link href="/">
                    <Button variant="outline">{t.common.back}</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                    <Mail className="h-8 w-8 text-[var(--color-primary)]" />
                  </div>
                  <h1 className="font-serif text-2xl font-semibold text-[var(--color-foreground)]">
                    {t.waitlist.title}
                  </h1>
                  <p className="mt-2 text-[var(--color-foreground-muted)]">
                    {t.waitlist.subtitle}
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    {...register('name')}
                    label={t.waitlist.name}
                    error={errors.name?.message}
                    required
                  />

                  <Input
                    {...register('email')}
                    type="email"
                    label={t.waitlist.email}
                    error={errors.email?.message}
                    required
                  />

                  <Select
                    {...register('interest')}
                    label={t.waitlist.interest}
                    options={interestOptions}
                    error={errors.interest?.message}
                    required
                  />

                  {/* Honeypot */}
                  <input
                    type="text"
                    name="website"
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {error && (
                    <p className="text-sm text-[var(--color-error)]">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    loading={isSubmitting}
                    size="lg"
                  >
                    {t.waitlist.submit}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
