'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLocale } from '@/hooks/useLocale';

export default function TermsPage() {
  const { locale } = useLocale();

  const content = {
    it: {
      title: 'Termini e Condizioni',
      version: 'Versione 1.0 - Gennaio 2024',
      sections: [
        {
          title: '1. Accettazione dei Termini',
          content: `Utilizzando il sito web e i servizi di Jungle Rent, accetti di essere vincolato dai presenti Termini e Condizioni. Se non accetti questi termini, non utilizzare i nostri servizi.`,
        },
        {
          title: '2. Descrizione del Servizio',
          content: `Jungle Rent è una piattaforma che:
• Consente agli investitori di esprimere interesse per investimenti immobiliari frazionati
• Facilita la ricerca di alloggi per studenti universitari
• Offre opzioni di soggiorno breve per turisti

Nota: Siamo attualmente in fase beta. I servizi completi saranno disponibili al lancio ufficiale.`,
        },
        {
          title: '3. Requisiti di Età',
          content: `Devi avere almeno 18 anni per utilizzare i nostri servizi. Utilizzando la piattaforma, dichiari di avere l'età legale per stipulare contratti vincolanti.`,
        },
        {
          title: '4. Account Utente',
          content: `• Sei responsabile della riservatezza del tuo account
• Devi fornire informazioni accurate e complete
• Devi notificarci immediatamente qualsiasi uso non autorizzato
• Ci riserviamo il diritto di sospendere o terminare account che violano questi termini`,
        },
        {
          title: '5. Investimenti',
          content: `DISCLAIMER IMPORTANTE:
• Gli investimenti comportano rischi, inclusa la possibile perdita del capitale
• Le informazioni fornite non costituiscono consulenza finanziaria
• Gli incentivi fiscali sono soggetti a requisiti de minimis e alla legislazione vigente
• Consulta un professionista prima di investire
• Le performance passate non garantiscono risultati futuri`,
        },
        {
          title: '6. Alloggi',
          content: `• Jungle Rent è proprietario/gestore degli immobili offerti
• Tutti gli annunci sono verificati
• I prezzi e la disponibilità sono soggetti a variazioni
• I contratti di locazione sono regolati dalla legge italiana`,
        },
        {
          title: '7. Limitazione di Responsabilità',
          content: `Jungle Rent non sarà responsabile per:
• Danni indiretti, incidentali o consequenziali
• Perdite derivanti da decisioni di investimento
• Interruzioni del servizio
• Errori o omissioni nei contenuti`,
        },
        {
          title: '8. Proprietà Intellettuale',
          content: `Tutti i contenuti del sito, inclusi testi, grafiche, loghi e software, sono di proprietà di Jungle Rent e protetti dalle leggi sul copyright.`,
        },
        {
          title: '9. Modifiche ai Termini',
          content: `Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. Le modifiche saranno effettive dalla pubblicazione sul sito. L'uso continuato del servizio costituisce accettazione dei termini modificati.`,
        },
        {
          title: '10. Legge Applicabile',
          content: `Questi termini sono regolati dalla legge italiana. Per qualsiasi controversia sarà competente il Foro di Torino.`,
        },
        {
          title: '11. Contatti',
          content: `Per domande sui presenti termini:
Email: legal@junglerent.it
Indirizzo: Torino, Italia`,
        },
      ],
    },
    en: {
      title: 'Terms and Conditions',
      version: 'Version 1.0 - January 2024',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: `By using Jungle Rent's website and services, you agree to be bound by these Terms and Conditions. If you do not accept these terms, do not use our services.`,
        },
        {
          title: '2. Service Description',
          content: `Jungle Rent is a platform that:
• Allows investors to express interest in fractional real estate investments
• Facilitates housing search for university students
• Offers short-stay options for tourists

Note: We are currently in beta phase. Full services will be available at official launch.`,
        },
        {
          title: '3. Age Requirements',
          content: `You must be at least 18 years old to use our services. By using the platform, you represent that you are of legal age to enter into binding contracts.`,
        },
        {
          title: '4. User Account',
          content: `• You are responsible for maintaining account confidentiality
• You must provide accurate and complete information
• You must notify us immediately of any unauthorized use
• We reserve the right to suspend or terminate accounts that violate these terms`,
        },
        {
          title: '5. Investments',
          content: `IMPORTANT DISCLAIMER:
• Investments involve risks, including possible loss of capital
• Information provided does not constitute financial advice
• Tax incentives are subject to de minimis requirements and current legislation
• Consult a professional before investing
• Past performance does not guarantee future results`,
        },
        {
          title: '6. Accommodations',
          content: `• Jungle Rent is the owner/manager of the properties offered
• All listings are verified
• Prices and availability are subject to change
• Rental contracts are governed by Italian law`,
        },
        {
          title: '7. Limitation of Liability',
          content: `Jungle Rent shall not be liable for:
• Indirect, incidental, or consequential damages
• Losses arising from investment decisions
• Service interruptions
• Errors or omissions in content`,
        },
        {
          title: '8. Intellectual Property',
          content: `All site content, including text, graphics, logos, and software, is owned by Jungle Rent and protected by copyright laws.`,
        },
        {
          title: '9. Changes to Terms',
          content: `We reserve the right to modify these terms at any time. Changes will be effective upon posting on the site. Continued use of the service constitutes acceptance of the modified terms.`,
        },
        {
          title: '10. Governing Law',
          content: `These terms are governed by Italian law. The Court of Turin shall have exclusive jurisdiction for any disputes.`,
        },
        {
          title: '11. Contact',
          content: `For questions about these terms:
Email: legal@junglerent.it
Address: Turin, Italy`,
        },
      ],
    },
  };

  const c = content[locale];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-foreground-muted)] transition-colors hover:text-[var(--color-foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {locale === 'it' ? 'Indietro' : 'Back'}
          </Link>

          <div className="card p-8 sm:p-12">
            <h1 className="font-serif text-3xl font-bold text-[var(--color-foreground)]">
              {c.title}
            </h1>
            <p className="mt-2 text-sm text-[var(--color-foreground-muted)]">
              {c.version}
            </p>

            <div className="mt-8 space-y-8">
              {c.sections.map((section, index) => (
                <section key={index}>
                  <h2 className="font-serif text-xl font-semibold text-[var(--color-foreground)]">
                    {section.title}
                  </h2>
                  <div className="mt-3 whitespace-pre-line text-[var(--color-foreground-muted)]">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
