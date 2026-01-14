'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLocale } from '@/hooks/useLocale';

export default function PrivacyPage() {
  const { locale } = useLocale();

  const content = {
    it: {
      title: 'Privacy Policy',
      version: 'Versione 1.0 - Gennaio 2024',
      sections: [
        {
          title: '1. Titolare del Trattamento',
          content: `Jungle Rent S.r.l. (in fase di costituzione), con sede legale a Torino, Italia, è il titolare del trattamento dei dati personali raccolti attraverso questo sito web e i relativi servizi.`,
        },
        {
          title: '2. Dati Raccolti',
          content: `Raccogliamo i seguenti tipi di dati personali:
• Dati identificativi (nome, cognome, email, telefono)
• Documenti di identità (per la verifica dell'identità)
• Dati di navigazione (cookies, log di accesso)
• Preferenze di investimento/alloggio`,
        },
        {
          title: '3. Finalità del Trattamento',
          content: `I tuoi dati vengono trattati per:
• Gestione delle richieste di interesse per investimenti
• Gestione delle richieste di alloggio per studenti e turisti
• Verifica dell'identità come richiesto dalla normativa
• Comunicazioni relative ai nostri servizi
• Miglioramento dei nostri servizi`,
        },
        {
          title: '4. Base Giuridica',
          content: `Il trattamento dei dati è basato su:
• Consenso dell'interessato
• Esecuzione di un contratto o misure precontrattuali
• Adempimento di obblighi legali
• Legittimo interesse del titolare`,
        },
        {
          title: '5. Conservazione dei Dati',
          content: `I dati personali vengono conservati per il tempo necessario alle finalità per cui sono stati raccolti, nel rispetto dei termini di legge. I documenti di identità vengono conservati secondo le normative antiriciclaggio applicabili.`,
        },
        {
          title: '6. Diritti dell\'Interessato',
          content: `Hai il diritto di:
• Accedere ai tuoi dati personali
• Rettificare dati inesatti
• Cancellare i tuoi dati (diritto all'oblio)
• Limitare il trattamento
• Portabilità dei dati
• Opporti al trattamento
• Revocare il consenso

Per esercitare i tuoi diritti, contattaci a: privacy@junglerent.it`,
        },
        {
          title: '7. Sicurezza',
          content: `Adottiamo misure di sicurezza tecniche e organizzative per proteggere i tuoi dati personali, inclusa la crittografia dei dati in transito e a riposo, controlli di accesso rigorosi e monitoraggio continuo.`,
        },
        {
          title: '8. Contatti',
          content: `Per qualsiasi domanda relativa alla privacy, puoi contattarci a:
Email: privacy@junglerent.it
Indirizzo: Torino, Italia`,
        },
      ],
    },
    en: {
      title: 'Privacy Policy',
      version: 'Version 1.0 - January 2024',
      sections: [
        {
          title: '1. Data Controller',
          content: `Jungle Rent S.r.l. (in formation), with registered office in Turin, Italy, is the data controller for personal data collected through this website and related services.`,
        },
        {
          title: '2. Data Collected',
          content: `We collect the following types of personal data:
• Identification data (name, surname, email, phone)
• Identity documents (for identity verification)
• Browsing data (cookies, access logs)
• Investment/housing preferences`,
        },
        {
          title: '3. Purpose of Processing',
          content: `Your data is processed for:
• Managing investment interest requests
• Managing housing requests for students and tourists
• Identity verification as required by regulations
• Communications related to our services
• Improving our services`,
        },
        {
          title: '4. Legal Basis',
          content: `Data processing is based on:
• Consent of the data subject
• Execution of a contract or pre-contractual measures
• Compliance with legal obligations
• Legitimate interest of the controller`,
        },
        {
          title: '5. Data Retention',
          content: `Personal data is retained for the time necessary for the purposes for which it was collected, in compliance with legal requirements. Identity documents are retained according to applicable anti-money laundering regulations.`,
        },
        {
          title: '6. Data Subject Rights',
          content: `You have the right to:
• Access your personal data
• Rectify inaccurate data
• Delete your data (right to be forgotten)
• Restrict processing
• Data portability
• Object to processing
• Withdraw consent

To exercise your rights, contact us at: privacy@junglerent.it`,
        },
        {
          title: '7. Security',
          content: `We adopt technical and organizational security measures to protect your personal data, including encryption of data in transit and at rest, strict access controls, and continuous monitoring.`,
        },
        {
          title: '8. Contact',
          content: `For any privacy-related questions, you can contact us at:
Email: privacy@junglerent.it
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
