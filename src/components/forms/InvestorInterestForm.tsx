'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Check, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button, Input, Select, Textarea, Checkbox, Card, CardContent } from '@/components/ui';
import { useLocale } from '@/hooks/useLocale';
import { submitInvestorInterest } from '@/actions/leads';

const investorFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  investor_type: z.enum(['retail', 'pro']),
  budget_range: z.string().min(1, 'Budget is required'),
  risk_tolerance: z.string().min(1, 'Risk tolerance is required'),
  timeframe: z.string().min(1, 'Timeframe is required'),
  notes: z.string().optional(),
  consent_privacy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy',
  }),
  consent_marketing: z.boolean().optional(),
});

type InvestorFormData = z.infer<typeof investorFormSchema>;

interface InvestorInterestFormProps {
  propertyId?: string;
  onBack: () => void;
}

export function InvestorInterestForm({ propertyId, onBack }: InvestorInterestFormProps) {
  const { locale, t } = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvestorFormData>({
    resolver: zodResolver(investorFormSchema),
    defaultValues: {
      investor_type: 'retail',
      consent_marketing: false,
    },
  });

  const onSubmit = async (data: InvestorFormData) => {
    setError(null);
    try {
      const result = await submitInvestorInterest({
        ...data,
        property_interest_id: propertyId,
        language: locale,
      });

      if (result.success) {
        setLeadId(result.leadId || null);
        setSubmitted(true);
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  const investorTypeOptions = [
    { value: 'retail', label: t.investor.form.investorTypes.retail },
    { value: 'pro', label: t.investor.form.investorTypes.pro },
  ];

  const budgetOptions = [
    { value: '100-500', label: t.investor.form.budgetRanges['100-500'] },
    { value: '500-1000', label: t.investor.form.budgetRanges['500-1000'] },
    { value: '1000-5000', label: t.investor.form.budgetRanges['1000-5000'] },
    { value: '5000+', label: t.investor.form.budgetRanges['5000+'] },
  ];

  const riskOptions = [
    { value: 'low', label: t.investor.form.riskTolerances.low },
    { value: 'medium', label: t.investor.form.riskTolerances.medium },
    { value: 'high', label: t.investor.form.riskTolerances.high },
  ];

  const timeframeOptions = [
    { value: 'short', label: t.investor.form.timeframes.short },
    { value: 'medium', label: t.investor.form.timeframes.medium },
    { value: 'long', label: t.investor.form.timeframes.long },
  ];

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]/10">
              <Check className="h-8 w-8 text-[var(--color-success)]" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-[var(--color-foreground)]">
              {locale === 'it' ? 'Grazie per il tuo interesse!' : 'Thank you for your interest!'}
            </h2>
            <p className="mt-4 text-[var(--color-foreground-muted)]">
              {locale === 'it'
                ? 'Ti contatteremo presto per i prossimi passi.'
                : 'We will contact you soon with next steps.'}
            </p>

            {/* Verification CTA */}
            <div className="mt-8 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-background)] p-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                <Shield className="h-6 w-6 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--color-foreground)]">
                {t.investor.verification.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">
                {t.investor.verification.subtitle}
              </p>
              <Link href={`/verify?lead=${leadId}&type=investor`}>
                <Button className="mt-4 w-full">
                  {locale === 'it' ? 'Verifica la tua identità' : 'Verify your identity'}
                </Button>
              </Link>
            </div>

            <Button variant="outline" className="mt-6" onClick={onBack}>
              {t.common.back}
            </Button>
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
          <h2 className="mb-6 font-serif text-2xl font-semibold text-[var(--color-foreground)]">
            {t.investor.form.title}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              {...register('name')}
              label={t.investor.form.name}
              error={errors.name?.message}
              required
            />

            <Input
              {...register('email')}
              type="email"
              label={t.investor.form.email}
              error={errors.email?.message}
              required
            />

            <Input
              {...register('phone')}
              type="tel"
              label={t.investor.form.phone}
              error={errors.phone?.message}
            />

            <Input
              {...register('country')}
              label={t.investor.form.country}
              error={errors.country?.message}
              required
            />

            <Select
              {...register('investor_type')}
              label={t.investor.form.investorType}
              options={investorTypeOptions}
              error={errors.investor_type?.message}
              required
            />

            <Select
              {...register('budget_range')}
              label={t.investor.form.budgetRange}
              options={budgetOptions}
              placeholder={locale === 'it' ? 'Seleziona...' : 'Select...'}
              error={errors.budget_range?.message}
              required
            />

            <Select
              {...register('risk_tolerance')}
              label={t.investor.form.riskTolerance}
              options={riskOptions}
              placeholder={locale === 'it' ? 'Seleziona...' : 'Select...'}
              error={errors.risk_tolerance?.message}
              required
            />

            <Select
              {...register('timeframe')}
              label={t.investor.form.timeframe}
              options={timeframeOptions}
              placeholder={locale === 'it' ? 'Seleziona...' : 'Select...'}
              error={errors.timeframe?.message}
              required
            />

            <Textarea
              {...register('notes')}
              label={t.investor.form.notes}
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
              {t.investor.form.submit}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
