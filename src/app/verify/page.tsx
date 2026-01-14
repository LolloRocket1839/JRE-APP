'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Check, Shield } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button, Input, Select, Checkbox, Card, CardContent, FileUpload } from '@/components/ui';
import { useLocale } from '@/hooks/useLocale';
import { submitVerification } from '@/actions/verification';

const verificationSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  address_line: z.string().min(2, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postal_code: z.string().min(2, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  id_doc_type: z.string().min(1, 'Document type is required'),
  id_doc_number: z.string().min(1, 'Document number is required'),
  consent_privacy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy',
  }),
  consent_marketing: z.boolean().optional(),
});

type VerificationData = z.infer<typeof verificationSchema>;

function VerifyContent() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get('lead');
  const verificationType = (searchParams.get('type') as 'student' | 'investor') || 'investor';

  const { locale, t } = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [idFiles, setIdFiles] = useState<File[]>([]);
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerificationData>({
    resolver: zodResolver(verificationSchema),
  });

  const onSubmit = async (data: VerificationData) => {
    if (!leadId) {
      setError('Missing lead ID');
      return;
    }

    if (idFiles.length === 0) {
      setError(locale === 'it' ? 'Carica il documento di identità' : 'Please upload ID document');
      return;
    }

    if (verificationType === 'investor' && proofFiles.length === 0) {
      setError(locale === 'it' ? 'Carica la prova di residenza' : 'Please upload proof of address');
      return;
    }

    setError(null);
    try {
      const result = await submitVerification({
        ...data,
        lead_id: leadId,
        verification_type: verificationType,
        id_files: idFiles,
        proof_files: proofFiles,
        consent_privacy: true,
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

  const docTypeOptions = [
    { value: 'passport', label: t.verification.idDocTypes.passport },
    { value: 'id_card', label: t.verification.idDocTypes.id_card },
    { value: 'driving_license', label: t.verification.idDocTypes.driving_license },
  ];

  if (!leadId) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Shield className="mx-auto h-12 w-12 text-[var(--color-foreground-muted)]" />
          <p className="mt-4 text-[var(--color-foreground-muted)]">
            {locale === 'it' ? 'Link non valido' : 'Invalid link'}
          </p>
          <Link href="/">
            <Button variant="outline" className="mt-6">
              {t.common.back}
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]/10">
            <Check className="h-8 w-8 text-[var(--color-success)]" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--color-foreground)]">
            {locale === 'it' ? 'Verifica inviata!' : 'Verification submitted!'}
          </h2>
          <p className="mt-4 text-[var(--color-foreground-muted)]">
            {locale === 'it'
              ? 'Riceverai una conferma entro 24-48 ore lavorative.'
              : 'You will receive confirmation within 24-48 business hours.'}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/">
              <Button variant="outline">{t.common.back}</Button>
            </Link>
            <Link href="/dashboard">
              <Button>{t.nav.dashboard}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
            <Shield className="h-6 w-6 text-[var(--color-primary)]" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[var(--color-foreground)]">
            {t.verification.title}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">
            {t.verification.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            {...register('full_name')}
            label={t.verification.fullName}
            error={errors.full_name?.message}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              {...register('dob')}
              type="date"
              label={t.verification.dob}
              error={errors.dob?.message}
              required
            />

            <Input
              {...register('nationality')}
              label={t.verification.nationality}
              error={errors.nationality?.message}
              required
            />
          </div>

          <Input
            {...register('address_line')}
            label={t.verification.address}
            error={errors.address_line?.message}
            required
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              {...register('city')}
              label={t.verification.city}
              error={errors.city?.message}
              required
            />

            <Input
              {...register('postal_code')}
              label={t.verification.postalCode}
              error={errors.postal_code?.message}
              required
            />

            <Input
              {...register('country')}
              label={t.verification.country}
              error={errors.country?.message}
              required
            />
          </div>

          <Select
            {...register('id_doc_type')}
            label={t.verification.idDocType}
            options={docTypeOptions}
            placeholder={locale === 'it' ? 'Seleziona...' : 'Select...'}
            error={errors.id_doc_type?.message}
            required
          />

          <Input
            {...register('id_doc_number')}
            label={t.verification.idDocNumber}
            error={errors.id_doc_number?.message}
            required
          />

          <FileUpload
            label={t.verification.idDocUpload}
            accept="image/*,.pdf"
            multiple
            maxFiles={2}
            maxSize={10}
            onFilesChange={setIdFiles}
            hint={locale === 'it' ? 'Fronte e retro del documento' : 'Front and back of document'}
          />

          {verificationType === 'investor' && (
            <FileUpload
              label={t.verification.proofOfAddress}
              accept="image/*,.pdf"
              multiple={false}
              maxFiles={1}
              maxSize={10}
              onFilesChange={setProofFiles}
              hint={t.verification.proofOfAddressNote}
            />
          )}

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
            {t.verification.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
  const { t } = useLocale();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.common.back}
          </Link>

          <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
