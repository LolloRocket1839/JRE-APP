'use client';

import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { TrendingUp, GraduationCap, Plane } from 'lucide-react';
import { PersonaCard } from './PersonaCard';
import { useLocale } from '@/hooks/useLocale';
import { cn } from '@/lib/utils';

export function PersonaCarousel() {
  const { t } = useLocale();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: 'trimSnaps',
    loop: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const personas = [
    {
      icon: <TrendingUp className="h-8 w-8 text-[var(--color-primary)]" />,
      iconBgClass: 'bg-[#E8EDE8]',
      title: t.personas.investor.title,
      description: t.personas.investor.description,
      bullets: [
        t.personas.investor.bullet1,
        t.personas.investor.bullet2,
        t.personas.investor.bullet3,
      ],
      ctaText: t.personas.investor.cta,
      ctaHref: '/investor',
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-[var(--color-primary)]" />,
      iconBgClass: 'bg-[#E8EDE8]',
      title: t.personas.student.title,
      description: t.personas.student.description,
      bullets: [
        t.personas.student.bullet1,
        t.personas.student.bullet2,
        t.personas.student.bullet3,
      ],
      ctaText: t.personas.student.cta,
      ctaHref: '/student',
    },
    {
      icon: <Plane className="h-8 w-8 text-[var(--color-accent)]" />,
      iconBgClass: 'bg-[#FDF5ED]',
      title: t.personas.tourist.title,
      description: t.personas.tourist.description,
      bullets: [
        t.personas.tourist.bullet1,
        t.personas.tourist.bullet2,
        t.personas.tourist.bullet3,
      ],
      ctaText: t.personas.tourist.cta,
      ctaHref: '/tourist',
    },
  ];

  return (
    <div className="w-full">
      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-6 lg:gap-8">
        {personas.map((persona, index) => (
          <PersonaCard key={index} {...persona} />
        ))}
      </div>

      {/* Mobile: Carousel Layout */}
      <div className="md:hidden">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {personas.map((persona, index) => (
              <div
                key={index}
                className="min-w-0 flex-shrink-0 flex-grow-0 basis-[85%] pl-4 first:pl-0"
              >
                <PersonaCard {...persona} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="mt-6 flex justify-center gap-2">
          {personas.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                'carousel-dot',
                selectedIndex === index && 'active'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
