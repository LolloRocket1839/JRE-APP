import { Locale } from '@/types';

export const translations = {
  it: {
    // Meta
    meta: {
      title: 'Jungle Rent - Investimenti immobiliari per studenti universitari',
      description: 'Investimenti immobiliari innovativi per studenti universitari a Torino.',
    },
    // Navigation
    nav: {
      investor: 'Investitori',
      student: 'Studenti',
      tourist: 'Turisti',
      login: 'Accedi',
      dashboard: 'Dashboard',
      joinWaitlist: 'Lista d\'attesa',
      admin: 'Admin',
    },
    // Hero
    hero: {
      title: 'Jungle Rent',
      subtitle: 'Investimenti immobiliari innovativi per studenti universitari.',
      incubator: 'Incubato da 2i3T - Università di Torino',
    },
    // Badges
    badges: {
      campaignComing: 'Campagna in arrivo',
      waitlistOpen: 'Waitlist aperta',
      city: 'Torino',
    },
    // Persona Cards
    personas: {
      investor: {
        title: 'Investitore',
        description: 'Rendimenti stabili e incentivi fiscali (de minimis, soggetti a requisiti).',
        bullet1: 'Investimento minimo €100',
        bullet2: 'Frazioni su singoli immobili',
        bullet3: 'Portfolio di proprietà',
        cta: 'Mostra Interesse',
      },
      student: {
        title: 'Studente',
        description: 'Alloggi vicino all\'università con sconti dedicati.',
        bullet1: 'Sconti studenti',
        bullet2: 'Vicino alle università',
        bullet3: 'Contratti flessibili',
        cta: 'Cerca Alloggio',
      },
      tourist: {
        title: 'Turista',
        description: 'Soggiorni brevi nel centro di Torino.',
        bullet1: 'Appartamenti verificati',
        bullet2: 'Check-in flessibile',
        bullet3: 'Supporto 24/7',
        cta: 'Prenota Ora',
      },
    },
    // Waitlist
    waitlist: {
      title: 'Unisciti alla Lista d\'Attesa',
      subtitle: 'Sii tra i primi a sapere quando lanceremo.',
      name: 'Nome completo',
      email: 'Email',
      interest: 'Sono interessato come',
      interestOptions: {
        investor: 'Investitore',
        student: 'Studente',
        tourist: 'Turista',
      },
      submit: 'Iscriviti',
      success: 'Grazie! Ti contatteremo presto.',
      error: 'Si è verificato un errore. Riprova.',
    },
    // Investor
    investor: {
      title: 'Investi in Immobili per Studenti',
      subtitle: 'Partecipa alla crescita del mercato degli alloggi universitari a Torino.',
      disclaimer: 'Incentivi fiscali soggetti a requisiti de minimis. Consulta un professionista prima di investire.',
      properties: 'Proprietà Disponibili',
      noProperties: 'Nessuna proprietà disponibile al momento.',
      showInterest: 'Mostra Interesse',
      form: {
        title: 'Registra il tuo Interesse',
        name: 'Nome completo',
        email: 'Email',
        phone: 'Telefono (opzionale)',
        country: 'Paese di residenza',
        investorType: 'Tipo di investitore',
        investorTypes: {
          retail: 'Privato',
          pro: 'Professionale',
        },
        budgetRange: 'Budget indicativo',
        budgetRanges: {
          '100-500': '€100 - €500',
          '500-1000': '€500 - €1.000',
          '1000-5000': '€1.000 - €5.000',
          '5000+': 'Oltre €5.000',
        },
        riskTolerance: 'Propensione al rischio',
        riskTolerances: {
          low: 'Bassa',
          medium: 'Media',
          high: 'Alta',
        },
        timeframe: 'Orizzonte temporale',
        timeframes: {
          short: '1-2 anni',
          medium: '3-5 anni',
          long: 'Oltre 5 anni',
        },
        notes: 'Note aggiuntive (opzionale)',
        submit: 'Invia Richiesta',
      },
      verification: {
        title: 'Verifica la tua Identità',
        subtitle: 'Per procedere, abbiamo bisogno di verificare la tua identità.',
        required: 'Richiesta per qualificazione',
      },
    },
    // Student
    student: {
      title: 'Trova il Tuo Alloggio',
      subtitle: 'Appartamenti e stanze verificate vicino alle università di Torino.',
      filters: {
        type: 'Tipo',
        priceRange: 'Prezzo',
        area: 'Zona',
      },
      listing: {
        perMonth: '/mese',
        perNight: '/notte',
        billsIncluded: 'Spese incluse',
        deposit: 'Deposito',
        verified: 'Verificato',
        area: 'Superficie',
        distance: 'Distanza',
        amenities: 'Servizi',
        requestViewing: 'Richiedi Visita',
        apply: 'Candidati',
      },
      form: {
        title: 'Richiedi Informazioni',
        name: 'Nome completo',
        email: 'Email',
        phone: 'Telefono (opzionale)',
        university: 'Università',
        program: 'Corso di studi',
        moveInDate: 'Data preferita di ingresso',
        budget: 'Budget mensile',
        guarantor: 'Ho un garante',
        message: 'Messaggio (opzionale)',
        preferredDates: 'Date preferite per la visita',
        submit: 'Invia Richiesta',
      },
      verification: {
        title: 'Verifica Documenti',
        subtitle: 'Carica un documento d\'identità per completare la richiesta.',
        required: 'Richiesto per inviare la richiesta',
      },
    },
    // Tourist
    tourist: {
      title: 'Soggiorni Brevi a Torino',
      subtitle: 'Appartamenti verificati per la tua vacanza o viaggio di lavoro.',
      listing: {
        perNight: '/notte',
        guests: 'ospiti',
        checkIn: 'Check-in',
        checkOut: 'Check-out',
        flexible: 'Flessibile',
      },
      form: {
        title: 'Richiedi Prenotazione',
        name: 'Nome completo',
        email: 'Email',
        phone: 'Telefono (opzionale)',
        guests: 'Numero di ospiti',
        dateFrom: 'Data arrivo',
        dateTo: 'Data partenza',
        message: 'Note (opzionale)',
        submit: 'Invia Richiesta',
      },
    },
    // Verification
    verification: {
      title: 'Verifica Identità',
      subtitle: 'Completa la verifica per procedere.',
      fullName: 'Nome completo (come sul documento)',
      dob: 'Data di nascita',
      nationality: 'Nazionalità',
      address: 'Indirizzo',
      city: 'Città',
      postalCode: 'CAP',
      country: 'Paese',
      idDocType: 'Tipo di documento',
      idDocTypes: {
        passport: 'Passaporto',
        id_card: 'Carta d\'identità',
        driving_license: 'Patente',
      },
      idDocNumber: 'Numero documento',
      idDocUpload: 'Carica documento (fronte e retro)',
      proofOfAddress: 'Prova di residenza (bolletta)',
      proofOfAddressNote: 'Richiesta solo per investitori',
      consent: {
        privacy: 'Accetto la Privacy Policy',
        marketing: 'Accetto di ricevere comunicazioni marketing (opzionale)',
      },
      submit: 'Invia Verifica',
      status: {
        not_submitted: 'Non inviato',
        submitted: 'In attesa di revisione',
        in_review: 'In revisione',
        approved: 'Approvato',
        rejected: 'Rifiutato',
      },
    },
    // Dashboard
    dashboard: {
      title: 'La Mia Dashboard',
      subtitle: 'Gestisci le tue richieste e verifiche.',
      requests: 'Le Mie Richieste',
      verification: 'Stato Verifica',
      noRequests: 'Nessuna richiesta ancora.',
      viewDetails: 'Vedi Dettagli',
    },
    // Auth
    auth: {
      login: 'Accedi',
      loginSubtitle: 'Accedi con il tuo indirizzo email.',
      email: 'Email',
      sendMagicLink: 'Invia Link Magico',
      checkEmail: 'Controlla la tua email per il link di accesso.',
      logout: 'Esci',
      createAccount: 'Crea un account per tracciare le tue richieste.',
    },
    // Admin
    admin: {
      title: 'Pannello Admin',
      overview: 'Panoramica',
      listings: 'Annunci',
      properties: 'Proprietà',
      leads: 'Lead',
      verifications: 'Verifiche',
      export: 'Esporta CSV',
      actions: {
        edit: 'Modifica',
        delete: 'Elimina',
        approve: 'Approva',
        reject: 'Rifiuta',
        view: 'Visualizza',
      },
    },
    // Legal
    legal: {
      privacy: 'Privacy Policy',
      terms: 'Termini e Condizioni',
      cookies: 'Cookie Policy',
    },
    // Common
    common: {
      loading: 'Caricamento...',
      error: 'Si è verificato un errore',
      retry: 'Riprova',
      cancel: 'Annulla',
      save: 'Salva',
      close: 'Chiudi',
      back: 'Indietro',
      next: 'Avanti',
      submit: 'Invia',
      required: 'Obbligatorio',
      optional: 'Opzionale',
      noResults: 'Nessun risultato',
      viewAll: 'Vedi tutti',
    },
    // Footer
    footer: {
      incubator: 'Incubato da 2i3T – Università di Torino',
      rights: 'Tutti i diritti riservati',
    },
  },
  en: {
    // Meta
    meta: {
      title: 'Jungle Rent - Real Estate Investments for University Students',
      description: 'Innovative real estate investments for university students in Turin.',
    },
    // Navigation
    nav: {
      investor: 'Investors',
      student: 'Students',
      tourist: 'Tourists',
      login: 'Login',
      dashboard: 'Dashboard',
      joinWaitlist: 'Join Waitlist',
      admin: 'Admin',
    },
    // Hero
    hero: {
      title: 'Jungle Rent',
      subtitle: 'Innovative real estate investments for university students.',
      incubator: 'Incubated by 2i3T - University of Turin',
    },
    // Badges
    badges: {
      campaignComing: 'Campaign coming soon',
      waitlistOpen: 'Waitlist open',
      city: 'Turin',
    },
    // Persona Cards
    personas: {
      investor: {
        title: 'Investor',
        description: 'Stable returns and tax incentives (de minimis, subject to eligibility).',
        bullet1: 'Minimum investment €100',
        bullet2: 'Fractions on individual properties',
        bullet3: 'Property portfolio',
        cta: 'Show Interest',
      },
      student: {
        title: 'Student',
        description: 'Housing near universities with dedicated discounts.',
        bullet1: 'Student discounts',
        bullet2: 'Near universities',
        bullet3: 'Flexible contracts',
        cta: 'Find Housing',
      },
      tourist: {
        title: 'Tourist',
        description: 'Short stays in Turin city center.',
        bullet1: 'Verified apartments',
        bullet2: 'Flexible check-in',
        bullet3: '24/7 support',
        cta: 'Book Now',
      },
    },
    // Waitlist
    waitlist: {
      title: 'Join the Waitlist',
      subtitle: 'Be among the first to know when we launch.',
      name: 'Full name',
      email: 'Email',
      interest: 'I\'m interested as',
      interestOptions: {
        investor: 'Investor',
        student: 'Student',
        tourist: 'Tourist',
      },
      submit: 'Sign Up',
      success: 'Thank you! We\'ll contact you soon.',
      error: 'An error occurred. Please try again.',
    },
    // Investor
    investor: {
      title: 'Invest in Student Housing',
      subtitle: 'Participate in the growth of the university housing market in Turin.',
      disclaimer: 'Tax incentives subject to de minimis requirements. Consult a professional before investing.',
      properties: 'Available Properties',
      noProperties: 'No properties available at the moment.',
      showInterest: 'Show Interest',
      form: {
        title: 'Register Your Interest',
        name: 'Full name',
        email: 'Email',
        phone: 'Phone (optional)',
        country: 'Country of residence',
        investorType: 'Investor type',
        investorTypes: {
          retail: 'Retail',
          pro: 'Professional',
        },
        budgetRange: 'Indicative budget',
        budgetRanges: {
          '100-500': '€100 - €500',
          '500-1000': '€500 - €1,000',
          '1000-5000': '€1,000 - €5,000',
          '5000+': 'Over €5,000',
        },
        riskTolerance: 'Risk tolerance',
        riskTolerances: {
          low: 'Low',
          medium: 'Medium',
          high: 'High',
        },
        timeframe: 'Investment timeframe',
        timeframes: {
          short: '1-2 years',
          medium: '3-5 years',
          long: 'Over 5 years',
        },
        notes: 'Additional notes (optional)',
        submit: 'Submit Request',
      },
      verification: {
        title: 'Verify Your Identity',
        subtitle: 'To proceed, we need to verify your identity.',
        required: 'Required for qualification',
      },
    },
    // Student
    student: {
      title: 'Find Your Housing',
      subtitle: 'Verified apartments and rooms near Turin universities.',
      filters: {
        type: 'Type',
        priceRange: 'Price',
        area: 'Area',
      },
      listing: {
        perMonth: '/month',
        perNight: '/night',
        billsIncluded: 'Bills included',
        deposit: 'Deposit',
        verified: 'Verified',
        area: 'Area',
        distance: 'Distance',
        amenities: 'Amenities',
        requestViewing: 'Request Viewing',
        apply: 'Apply',
      },
      form: {
        title: 'Request Information',
        name: 'Full name',
        email: 'Email',
        phone: 'Phone (optional)',
        university: 'University',
        program: 'Study program',
        moveInDate: 'Preferred move-in date',
        budget: 'Monthly budget',
        guarantor: 'I have a guarantor',
        message: 'Message (optional)',
        preferredDates: 'Preferred viewing dates',
        submit: 'Submit Request',
      },
      verification: {
        title: 'Document Verification',
        subtitle: 'Upload an ID document to complete your request.',
        required: 'Required to submit request',
      },
    },
    // Tourist
    tourist: {
      title: 'Short Stays in Turin',
      subtitle: 'Verified apartments for your vacation or business trip.',
      listing: {
        perNight: '/night',
        guests: 'guests',
        checkIn: 'Check-in',
        checkOut: 'Check-out',
        flexible: 'Flexible',
      },
      form: {
        title: 'Request Booking',
        name: 'Full name',
        email: 'Email',
        phone: 'Phone (optional)',
        guests: 'Number of guests',
        dateFrom: 'Arrival date',
        dateTo: 'Departure date',
        message: 'Notes (optional)',
        submit: 'Submit Request',
      },
    },
    // Verification
    verification: {
      title: 'Identity Verification',
      subtitle: 'Complete verification to proceed.',
      fullName: 'Full name (as on document)',
      dob: 'Date of birth',
      nationality: 'Nationality',
      address: 'Address',
      city: 'City',
      postalCode: 'Postal code',
      country: 'Country',
      idDocType: 'Document type',
      idDocTypes: {
        passport: 'Passport',
        id_card: 'ID Card',
        driving_license: 'Driving License',
      },
      idDocNumber: 'Document number',
      idDocUpload: 'Upload document (front and back)',
      proofOfAddress: 'Proof of address (utility bill)',
      proofOfAddressNote: 'Required for investors only',
      consent: {
        privacy: 'I accept the Privacy Policy',
        marketing: 'I accept to receive marketing communications (optional)',
      },
      submit: 'Submit Verification',
      status: {
        not_submitted: 'Not submitted',
        submitted: 'Awaiting review',
        in_review: 'In review',
        approved: 'Approved',
        rejected: 'Rejected',
      },
    },
    // Dashboard
    dashboard: {
      title: 'My Dashboard',
      subtitle: 'Manage your requests and verifications.',
      requests: 'My Requests',
      verification: 'Verification Status',
      noRequests: 'No requests yet.',
      viewDetails: 'View Details',
    },
    // Auth
    auth: {
      login: 'Login',
      loginSubtitle: 'Sign in with your email address.',
      email: 'Email',
      sendMagicLink: 'Send Magic Link',
      checkEmail: 'Check your email for the login link.',
      logout: 'Logout',
      createAccount: 'Create an account to track your requests.',
    },
    // Admin
    admin: {
      title: 'Admin Panel',
      overview: 'Overview',
      listings: 'Listings',
      properties: 'Properties',
      leads: 'Leads',
      verifications: 'Verifications',
      export: 'Export CSV',
      actions: {
        edit: 'Edit',
        delete: 'Delete',
        approve: 'Approve',
        reject: 'Reject',
        view: 'View',
      },
    },
    // Legal
    legal: {
      privacy: 'Privacy Policy',
      terms: 'Terms and Conditions',
      cookies: 'Cookie Policy',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      cancel: 'Cancel',
      save: 'Save',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      required: 'Required',
      optional: 'Optional',
      noResults: 'No results',
      viewAll: 'View all',
    },
    // Footer
    footer: {
      incubator: 'Incubated by 2i3T – University of Turin',
      rights: 'All rights reserved',
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.it;

export function getTranslation(locale: Locale) {
  return translations[locale];
}

export function t(locale: Locale, path: string): string {
  const keys = path.split('.');
  let value: unknown = translations[locale];

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  return typeof value === 'string' ? value : path;
}
