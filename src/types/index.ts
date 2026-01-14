// Locale type
export type Locale = 'it' | 'en';

// Database types
export interface City {
  id: string;
  name_it: string;
  name_en: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface Property {
  id: string;
  city_id: string;
  name: string;
  address_area: string;
  description_it: string;
  description_en: string;
  min_ticket_eur: number;
  target_raise_eur: number;
  status: 'draft' | 'live' | 'closed';
  cover_image_url: string | null;
  created_at: string;
  city?: City;
}

export interface Listing {
  id: string;
  city_id: string;
  property_id: string | null;
  title_it: string;
  title_en: string;
  type: 'room' | 'apartment';
  area: number;
  price_monthly: number;
  price_nightly: number | null;
  bills_included: boolean;
  deposit: number;
  contract_type: string;
  distance_category: string;
  verified_listing: boolean;
  short_stay_eligible: boolean;
  description_it: string;
  description_en: string;
  amenities: string[];
  photos: string[];
  availability_note: string | null;
  created_at: string;
  updated_at: string;
  city?: City;
  property?: Property;
}

export interface Profile {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  language: Locale;
  created_at: string;
}

export type LeadType = 'investor' | 'student' | 'tourist' | 'waitlist';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'rejected';

export interface Lead {
  id: string;
  user_id: string | null;
  lead_type: LeadType;
  name: string;
  email: string;
  phone: string | null;
  language: Locale;
  status: LeadStatus;
  source: string | null;
  created_at: string;
}

export type InvestorType = 'retail' | 'pro';

export interface InvestorProfile {
  lead_id: string;
  country: string;
  investor_type: InvestorType;
  budget_range: string;
  risk_tolerance: string;
  timeframe: string;
  notes: string | null;
  property_interest_id: string | null;
}

export type RequestType = 'viewing' | 'apply';
export type RequestStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface StudentRequest {
  id: string;
  lead_id: string;
  listing_id: string;
  request_type: RequestType;
  university: string;
  program: string;
  move_in_date: string;
  budget: number;
  guarantor: boolean;
  message: string | null;
  preferred_dates: string[];
  status: RequestStatus;
  created_at: string;
  lead?: Lead;
  listing?: Listing;
}

export interface TouristRequest {
  id: string;
  lead_id: string;
  listing_id: string;
  guests: number;
  date_from: string;
  date_to: string;
  message: string | null;
  status: RequestStatus;
  created_at: string;
  lead?: Lead;
  listing?: Listing;
}

export type VerificationType = 'student' | 'investor';
export type VerificationStatus = 'not_submitted' | 'submitted' | 'in_review' | 'approved' | 'rejected';

export interface Verification {
  id: string;
  lead_id: string;
  verification_type: VerificationType;
  full_name: string;
  dob: string;
  nationality: string;
  address_line: string;
  city: string;
  postal_code: string;
  country: string;
  id_doc_type: string;
  id_doc_number: string;
  id_doc_files: string[];
  proof_of_address_files: string[];
  consent_privacy: boolean;
  consent_marketing: boolean;
  consent_timestamp: string;
  status: VerificationStatus;
  admin_notes: string | null;
  created_at: string;
  lead?: Lead;
}

export type ConsentType = 'privacy' | 'marketing' | 'terms';

export interface ConsentLog {
  id: string;
  user_id: string | null;
  lead_id: string | null;
  email: string;
  consent_type: ConsentType;
  version: string;
  language: Locale;
  ip_hash: string;
  user_agent_hash: string;
  timestamp: string;
}

// Form types
export interface WaitlistFormData {
  name: string;
  email: string;
  interest: LeadType;
  language: Locale;
}

export interface InvestorInterestFormData {
  name: string;
  email: string;
  phone?: string;
  country: string;
  investor_type: InvestorType;
  budget_range: string;
  risk_tolerance: string;
  timeframe: string;
  notes?: string;
  property_interest_id?: string;
  consent_privacy: boolean;
  consent_marketing?: boolean;
}

export interface StudentRequestFormData {
  name: string;
  email: string;
  phone?: string;
  university: string;
  program: string;
  move_in_date: string;
  budget: number;
  guarantor: boolean;
  message?: string;
  preferred_dates: string[];
  consent_privacy: boolean;
  consent_marketing?: boolean;
}

export interface TouristRequestFormData {
  name: string;
  email: string;
  phone?: string;
  guests: number;
  date_from: string;
  date_to: string;
  message?: string;
  consent_privacy: boolean;
  consent_marketing?: boolean;
}

export interface VerificationFormData {
  full_name: string;
  dob: string;
  nationality: string;
  address_line: string;
  city: string;
  postal_code: string;
  country: string;
  id_doc_type: string;
  id_doc_number: string;
  consent_privacy: boolean;
  consent_marketing?: boolean;
}
