'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Check, Shield, Upload } from 'lucide-react';
import Link from 'next/link';
import { Button, Input, Select, Textarea, Checkbox, Card, CardContent, FileUpload } from '@/components/ui';
import { useLocale } from '@/hooks/useLocale';
import { submitStudentRequest } from '@/actions/leads';
import { submitVerification } from '@/actions/verification';

const studentFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  university: z.string().min(2, 'University is required'),
  program: z.string().min(2, 'Program is required'),
  move_in_date: z.string().min(1, 'Move-in date is required'),
  budget: z.number().min(1, 'Budget must be positive'),
  guarantor: z.boolean(),
  message: z.string().optional(),
  consent_privacy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy',
  }),
  consent_marketing: z.boolean().optional(),
});

const verificationSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  id_doc_type: z.string().min(1, 'Document type is required'),
  id_doc_number: z.string().min(1, 'Document number is required'),
});

type StudentFormData = z.infer<typeof studentFormSchema>;
type VerificationData = z.infer<typeof verificationSchema>;

interface StudentRequestFormProps {
  listingId: string;
  listingTitle: string;
  requestType: 'viewing' | 'apply';
  onBack: () => void;
}

export function StudentRequestForm({
  listingId,
  listingTitle,
  requestType,
  onBack,
}: StudentRequestFormProps) {
  const { locale, t } = useLocale();
  const [step, setStep] = useState<'request' | 'verification' | 'success'>('request');
  const [leadId, setLeadId] = useState<string | null>(null);
  const [idFiles, setIdFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const requestForm = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      guarantor: false,
      consent_marketing: false,
    },
  });

  const verificationForm = useForm<VerificationData>({
    resolver: zodResolver(verificationSchema),
  });

  const onSubmitRequest = async (data: StudentFormData) => {
    setError(null);
    try {
      const result = await submitStudentRequest({
        ...data,
        listing_id: listingId,
        request_type: requestType,
        preferred_dates: [],
        language: locale,
      });

      if (result.success) {
        setLeadId(result.leadId || null);
        setStep('verification');
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  const onSubmitVerification = async (data: VerificationData) => {
    if (!leadId || idFiles.length === 0) {
      setError(locale === 'it' ? 'Carica il documento di identità' : 'Please upload ID document');
      return;
    }

    setError(null);
    try {
      const result = await submitVerification({
        ...data,
        lead_id: leadId,
        verification_type: 'student',
        address_line: '',
        city: '',
        postal_code: '',
        country: '',
        id_files: idFiles,
        proof_files: [],
        consent_privacy: true,
        consent_marketing: false,
        language: locale,
      });

      if (result.success) {
        setStep('success');
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

  if (step === 'success') {
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
                ? 'Ti contatteremo presto per confermare i dettagli.'
                : 'We will contact you soon to confirm the details.'}
            </p>
            <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">
              {listingTitle}
            </p>

            <div className="mt-8 flex justify-center gap-3">
              <Link href="/student">
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

  if (step === 'verification') {
    return (
      <div className="mx-auto max-w-lg">
        <button
          onClick={() => setStep('request')}
          className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.common.back}
        </button>

        <Card>
          <CardContent className="p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                <Shield className="h-6 w-6 text-[var(--color-primary)]" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-[var(--color-foreground)]">
                {t.student.verification.title}
              </h2>
              <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">
                {t.student.verification.subtitle}
              </p>
            </div>

            <form onSubmit={verificationForm.handleSubmit(onSubmitVerification)} className="space-y-5">
              <Input
                {...verificationForm.register('full_name')}
                label={t.verification.fullName}
                error={verificationForm.formState.errors.full_name?.message}
                required
              />

              <Input
                {...verificationForm.register('dob')}
                type="date"
                label={t.verification.dob}
                error={verificationForm.formState.errors.dob?.message}
                required
              />

              <Input
                {...verificationForm.register('nationality')}
                label={t.verification.nationality}
                error={verificationForm.formState.errors.nationality?.message}
                required
              />

              <Select
                {...verificationForm.register('id_doc_type')}
                label={t.verification.idDocType}
                options={docTypeOptions}
                placeholder={locale === 'it' ? 'Seleziona...' : 'Select...'}
                error={verificationForm.formState.errors.id_doc_type?.message}
                required
              />

              <Input
                {...verificationForm.register('id_doc_number')}
                label={t.verification.idDocNumber}
                error={verificationForm.formState.errors.id_doc_number?.message}
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

              {error && (
                <p className="text-sm text-[var(--color-error)]">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                loading={verificationForm.formState.isSubmitting}
                size="lg"
              >
                {t.verification.submit}
              </Button>
            </form>
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
            {requestType === 'viewing'
              ? t.student.listing.requestViewing
              : t.student.listing.apply}
          </h2>
          <p className="mb-6 text-sm text-[var(--color-foreground-muted)]">{listingTitle}</p>

          <form onSubmit={requestForm.handleSubmit(onSubmitRequest)} className="space-y-5">
            <Input
              {...requestForm.register('name')}
              label={t.student.form.name}
              error={requestForm.formState.errors.name?.message}
              required
            />

            <Input
              {...requestForm.register('email')}
              type="email"
              label={t.student.form.email}
              error={requestForm.formState.errors.email?.message}
              required
            />

            <Input
              {...requestForm.register('phone')}
              type="tel"
              label={t.student.form.phone}
              error={requestForm.formState.errors.phone?.message}
            />

            <Input
              {...requestForm.register('university')}
              label={t.student.form.university}
              error={requestForm.formState.errors.university?.message}
              required
            />

            <Input
              {...requestForm.register('program')}
              label={t.student.form.program}
              error={requestForm.formState.errors.program?.message}
              required
            />

            <Input
              {...requestForm.register('move_in_date')}
              type="date"
              label={t.student.form.moveInDate}
              error={requestForm.formState.errors.move_in_date?.message}
              required
            />

            <Input
              {...requestForm.register('budget', { valueAsNumber: true })}
              type="number"
              label={t.student.form.budget}
              error={requestForm.formState.errors.budget?.message}
              required
            />

            <Checkbox
              {...requestForm.register('guarantor')}
              label={t.student.form.guarantor}
            />

            <Textarea
              {...requestForm.register('message')}
              label={t.student.form.message}
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
                {...requestForm.register('consent_privacy')}
                label={
                  <span>
                    {t.verification.consent.privacy}{' '}
                    <Link href="/legal/privacy" className="text-[var(--color-primary)] underline">
                      *
                    </Link>
                  </span>
                }
                error={requestForm.formState.errors.consent_privacy?.message}
              />

              <Checkbox
                {...requestForm.register('consent_marketing')}
                label={t.verification.consent.marketing}
              />
            </div>

            {error && (
              <p className="text-sm text-[var(--color-error)]">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={requestForm.formState.isSubmitting}
              size="lg"
            >
              {t.common.next}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
