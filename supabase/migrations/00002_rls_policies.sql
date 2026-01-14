-- Jungle Rent Row Level Security Policies
-- Version 1.0

-- Enable RLS on all tables
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourist_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- HELPER FUNCTION: Check if user is admin
-- ===========================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email = ANY(string_to_array(current_setting('app.admin_emails', true), ','))
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- CITIES: Public read, admin write
-- ===========================================
CREATE POLICY "Cities are publicly readable"
  ON cities FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage cities"
  ON cities FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ===========================================
-- PROPERTIES: Public read (live only), admin write
-- ===========================================
CREATE POLICY "Live properties are publicly readable"
  ON properties FOR SELECT
  TO anon, authenticated
  USING (status = 'live' OR is_admin());

CREATE POLICY "Admins can manage properties"
  ON properties FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ===========================================
-- LISTINGS: Public read, admin write
-- ===========================================
CREATE POLICY "Listings are publicly readable"
  ON listings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage listings"
  ON listings FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ===========================================
-- PROFILES: Users can read/update own, admin all
-- ===========================================
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ===========================================
-- LEADS: Users see own, anyone can insert, admin all
-- ===========================================
CREATE POLICY "Anyone can insert leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own leads"
  ON leads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admins can manage leads"
  ON leads FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ===========================================
-- INVESTOR PROFILES: Anyone insert, users see own, admin all
-- ===========================================
CREATE POLICY "Anyone can insert investor profiles"
  ON investor_profiles FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own investor profile"
  ON investor_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = investor_profiles.lead_id
      AND (leads.user_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "Admins can manage investor profiles"
  ON investor_profiles FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ===========================================
-- STUDENT REQUESTS: Anyone insert, users see own, admin all
-- ===========================================
CREATE POLICY "Anyone can insert student requests"
  ON student_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own student requests"
  ON student_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = student_requests.lead_id
      AND (leads.user_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "Admins can manage student requests"
  ON student_requests FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ===========================================
-- TOURIST REQUESTS: Anyone insert, users see own, admin all
-- ===========================================
CREATE POLICY "Anyone can insert tourist requests"
  ON tourist_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own tourist requests"
  ON tourist_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = tourist_requests.lead_id
      AND (leads.user_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "Admins can manage tourist requests"
  ON tourist_requests FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ===========================================
-- VERIFICATIONS: Anyone insert, users see own, admin all
-- ===========================================
CREATE POLICY "Anyone can insert verifications"
  ON verifications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own verifications"
  ON verifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = verifications.lead_id
      AND (leads.user_id = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "Users can update own verifications"
  ON verifications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = verifications.lead_id
      AND leads.user_id = auth.uid()
    )
    AND status = 'not_submitted' -- Can only update if not yet submitted
  );

CREATE POLICY "Admins can manage verifications"
  ON verifications FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ===========================================
-- CONSENT LOGS: Anyone insert, admin read
-- ===========================================
CREATE POLICY "Anyone can insert consent logs"
  ON consent_logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view consent logs"
  ON consent_logs FOR SELECT
  TO authenticated
  USING (is_admin());
