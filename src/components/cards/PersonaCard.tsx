'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PersonaCardProps {
  icon: ReactNode;
  iconBgClass: string;
  title: string;
  description: string;
  bullets: string[];
  ctaText: string;
  ctaHref: string;
}

export function PersonaCard({
  icon,
  iconBgClass,
  title,
  description,
  bullets,
  ctaText,
  ctaHref,
}: PersonaCardProps) {
  return (
    <div className="card flex h-full flex-col p-8">
      {/* Icon */}
      <div className={`icon-container mb-6 h-16 w-16 ${iconBgClass}`}>
        {icon}
      </div>

      {/* Title */}
      <h3 className="mb-3 font-serif text-2xl font-semibold text-[var(--color-foreground)]">
        {title}
      </h3>

      {/* Description */}
      <p className="mb-6 text-[var(--color-foreground-muted)]">{description}</p>

      {/* Bullets */}
      <ul className="mb-8 flex-1 space-y-3">
        {bullets.map((bullet, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" />
            <span className="text-[var(--color-foreground-muted)]">{bullet}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link href={ctaHref} className="block">
        <Button className="w-full gap-2" size="lg">
          {ctaText}
          <ArrowRight className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
}
