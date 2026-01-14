'use client';

import { Clock, Users, MapPin } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PersonaCarousel } from '@/components/cards/PersonaCarousel';
import { useLocale } from '@/hooks/useLocale';

export default function HomePage() {
  const { t } = useLocale();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
          <div className="mx-auto max-w-7xl text-center">
            {/* Incubator Badge */}
            <div className="mb-8 flex justify-center">
              <div className="badge">
                <Clock className="h-4 w-4" />
                <span>{t.hero.incubator}</span>
              </div>
            </div>

            {/* Hero Title */}
            <h1 className="font-serif text-5xl font-bold italic text-[var(--color-foreground)] sm:text-6xl lg:text-7xl">
              {t.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-foreground-muted)] sm:text-xl">
              {t.hero.subtitle}
            </p>

            {/* Status Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <div className="badge">
                <Clock className="h-4 w-4" />
                <span>{t.badges.campaignComing}</span>
              </div>
              <div className="badge">
                <Users className="h-4 w-4" />
                <span>{t.badges.waitlistOpen}</span>
              </div>
              <div className="badge">
                <MapPin className="h-4 w-4" />
                <span>{t.badges.city}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Persona Cards Section */}
        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <PersonaCarousel />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
