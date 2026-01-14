-- Jungle Rent Database Schema
-- Version 1.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- CITIES TABLE (Future-proof for multi-city)
-- ===========================================
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_it VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'Italia',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure only one default city
CREATE UNIQUE INDEX idx_cities_default ON cities (is_default) WHERE is_default = TRUE;

-- ===========================================
-- PROPERTIES TABLE (Investment objects)
-- ===========================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  address_area VARCHAR(300) NOT NULL,
  description_it TEXT NOT NULL,
  description_en TEXT NOT NULL,
  min_ticket_eur INTEGER NOT NULL DEFAULT 100,
  target_raise_eur INTEGER NOT NULL,
  -- Progress is stored but NOT shown publicly in beta
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'live', 'closed')),
  cover_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_properties_city ON properties(city_id);
CREATE INDEX idx_properties_status ON properties(status);

-- ===========================================
-- LISTINGS TABLE (Jungle Rent rentals)
-- ===========================================
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  title_it VARCHAR(300) NOT NULL,
  title_en VARCHAR(300) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('room', 'apartment')),
  area INTEGER NOT NULL, -- square meters
  price_monthly INTEGER NOT NULL,
  price_nightly INTEGER, -- nullable for non-short-stay
  bills_included BOOLEAN NOT NULL DEFAULT FALSE,
  deposit INTEGER NOT NULL,
  contract_type VARCHAR(100) NOT NULL,
  distance_category VARCHAR(100) NOT NULL,
  verified_listing BOOLEAN NOT NULL DEFAULT TRUE,
  short_stay_eligible BOOLEAN NOT NULL DEFAULT FALSE,
  description_it TEXT NOT NULL,
  description_en TEXT NOT NULL,
  amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  availability_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_listings_city ON listings(city_id);
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_listings_short_stay ON listings(short_stay_eligible);
CREATE INDEX idx_listings_price ON listings(price_monthly);

-- ===========================================
-- PROFILES TABLE (User profiles)
-- ===========================================
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(200),
  phone VARCHAR(30),
  language VARCHAR(2) NOT NULL DEFAULT 'it' CHECK (language IN ('it', 'en')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================================
-- LEADS TABLE
-- ===========================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  lead_type VARCHAR(20) NOT NULL CHECK (lead_type IN ('investor', 'student', 'tourist', 'waitlist')),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  language VARCHAR(2) NOT NULL DEFAULT 'it' CHECK (language IN ('it', 'en')),
  status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'rejected')),
  source VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_type ON leads(lead_type);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_user ON leads(user_id);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- ===========================================
-- INVESTOR PROFILES TABLE
-- ===========================================
CREATE TABLE investor_profiles (
  lead_id UUID PRIMARY KEY REFERENCES leads(id) ON DELETE CASCADE,
  country VARCHAR(100) NOT NULL,
  investor_type VARCHAR(20) NOT NULL CHECK (investor_type IN ('retail', 'pro')),
  budget_range VARCHAR(50) NOT NULL,
  risk_tolerance VARCHAR(20) NOT NULL,
  timeframe VARCHAR(20) NOT NULL,
  notes TEXT,
  property_interest_id UUID REFERENCES properties(id) ON DELETE SET NULL
);

-- ===========================================
-- STUDENT REQUESTS TABLE
-- ===========================================
CREATE TABLE student_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  request_type VARCHAR(20) NOT NULL CHECK (request_type IN ('viewing', 'apply')),
  university VARCHAR(200) NOT NULL,
  program VARCHAR(200) NOT NULL,
  move_in_date DATE NOT NULL,
  budget INTEGER NOT NULL,
  guarantor BOOLEAN NOT NULL DEFAULT FALSE,
  message TEXT,
  preferred_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_student_requests_lead ON student_requests(lead_id);
CREATE INDEX idx_student_requests_listing ON student_requests(listing_id);
CREATE INDEX idx_student_requests_status ON student_requests(status);

-- ===========================================
-- TOURIST REQUESTS TABLE
-- ===========================================
CREATE TABLE tourist_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  guests INTEGER NOT NULL,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tourist_requests_lead ON tourist_requests(lead_id);
CREATE INDEX idx_tourist_requests_listing ON tourist_requests(listing_id);
CREATE INDEX idx_tourist_requests_dates ON tourist_requests(date_from, date_to);

-- ===========================================
-- VERIFICATIONS TABLE
-- ===========================================
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  verification_type VARCHAR(20) NOT NULL CHECK (verification_type IN ('student', 'investor')),
  full_name VARCHAR(200) NOT NULL,
  dob DATE NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  address_line VARCHAR(300) NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  id_doc_type VARCHAR(50) NOT NULL,
  id_doc_number VARCHAR(100) NOT NULL,
  id_doc_files JSONB NOT NULL DEFAULT '[]'::jsonb, -- storage paths
  proof_of_address_files JSONB NOT NULL DEFAULT '[]'::jsonb, -- storage paths (required for investors)
  consent_privacy BOOLEAN NOT NULL DEFAULT FALSE,
  consent_marketing BOOLEAN NOT NULL DEFAULT FALSE,
  consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'not_submitted' CHECK (status IN ('not_submitted', 'submitted', 'in_review', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_verifications_lead ON verifications(lead_id);
CREATE INDEX idx_verifications_status ON verifications(status);
CREATE INDEX idx_verifications_type ON verifications(verification_type);

-- ===========================================
-- CONSENT LOGS TABLE
-- ===========================================
CREATE TABLE consent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  consent_type VARCHAR(20) NOT NULL CHECK (consent_type IN ('privacy', 'marketing', 'terms')),
  version VARCHAR(20) NOT NULL,
  language VARCHAR(2) NOT NULL CHECK (language IN ('it', 'en')),
  ip_hash VARCHAR(64) NOT NULL,
  user_agent_hash VARCHAR(64) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consent_logs_email ON consent_logs(email);
CREATE INDEX idx_consent_logs_type ON consent_logs(consent_type);

-- ===========================================
-- UPDATED_AT TRIGGER
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ===========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, language)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'language', 'it')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
