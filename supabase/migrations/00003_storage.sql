-- Jungle Rent Storage Buckets
-- Version 1.0

-- ===========================================
-- CREATE STORAGE BUCKETS
-- ===========================================

-- ID Documents bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'id_docs',
  'id_docs',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Proof of Address bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'proof_of_address',
  'proof_of_address',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Listing Photos bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing_photos',
  'listing_photos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Property Images bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property_images',
  'property_images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- STORAGE POLICIES
-- ===========================================

-- ID Docs: Users can upload their own, only admins can read
CREATE POLICY "Users can upload ID docs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'id_docs');

CREATE POLICY "Admins can read ID docs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'id_docs' AND is_admin());

CREATE POLICY "Admins can delete ID docs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'id_docs' AND is_admin());

-- Proof of Address: Users can upload their own, only admins can read
CREATE POLICY "Users can upload proof of address"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'proof_of_address');

CREATE POLICY "Admins can read proof of address"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'proof_of_address' AND is_admin());

CREATE POLICY "Admins can delete proof of address"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'proof_of_address' AND is_admin());

-- Listing Photos: Public read, admin write
CREATE POLICY "Anyone can view listing photos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'listing_photos');

CREATE POLICY "Admins can manage listing photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'listing_photos' AND is_admin());

CREATE POLICY "Admins can update listing photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'listing_photos' AND is_admin());

CREATE POLICY "Admins can delete listing photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'listing_photos' AND is_admin());

-- Property Images: Public read, admin write
CREATE POLICY "Anyone can view property images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'property_images');

CREATE POLICY "Admins can manage property images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property_images' AND is_admin());

CREATE POLICY "Admins can update property images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'property_images' AND is_admin());

CREATE POLICY "Admins can delete property images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'property_images' AND is_admin());
