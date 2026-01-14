'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail, Check } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button, Input } from '@/components/ui';
import { useLocale } from '@/hooks/useLocale';
import { createClient } from '@/lib/supabase/client';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginContent() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const email = watch('email');

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSent(true);
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.common.back}
      </Link>

      <div className="card p-8">
        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]/10">
              <Check className="h-8 w-8 text-[var(--color-success)]" />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-[var(--color-foreground)]">
              {t.auth.checkEmail}
            </h2>
            <p className="mt-2 text-[var(--color-foreground-muted)]">
              {email}
            </p>
            <div className="mt-6">
              <Button variant="outline" onClick={() => setSent(false)}>
                {t.common.back}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary)]/10">
                <Mail className="h-8 w-8 text-[var(--color-primary)]" />
              </div>
              <h1 className="font-serif text-2xl font-semibold text-[var(--color-foreground)]">
                {t.auth.login}
              </h1>
              <p className="mt-2 text-[var(--color-foreground-muted)]">
                {t.auth.loginSubtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                {...register('email')}
                type="email"
                label={t.auth.email}
                placeholder="you@example.com"
                error={errors.email?.message}
                required
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
                {t.auth.sendMagicLink}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
