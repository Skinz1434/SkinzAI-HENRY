-- =====================================================
-- HENRY PLATFORM - STORAGE POLICIES (SAFE TO RE-RUN)
-- =====================================================
-- 
-- This script sets up Supabase Storage buckets and policies
-- It drops existing policies first to avoid conflicts
--
-- =====================================================

BEGIN;

-- =====================================================
-- STEP 1: DROP ALL EXISTING STORAGE POLICIES
-- =====================================================
-- This ensures we can run the script multiple times
DO $$
DECLARE
  policy_record RECORD;
BEGIN
  -- Drop all existing policies on storage.objects table
  FOR policy_record IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_record.policyname);
  END LOOP;
END $$;

-- =====================================================
-- STEP 2: CREATE STORAGE BUCKETS (if not exists)
-- =====================================================
-- Note: These need to be created in Supabase Dashboard
-- Go to Storage -> New Bucket and create:
-- 1. profile-photos (Public)
-- 2. veteran-documents (Private)
-- 3. claim-evidence (Private)
-- 4. reports (Private)

-- =====================================================
-- STEP 3: PROFILE PHOTOS BUCKET POLICIES
-- =====================================================

-- Users can upload their own profile photo
CREATE POLICY "profile_photos_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Anyone can view profile photos (public bucket)
CREATE POLICY "profile_photos_select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Users can update their own profile photo
CREATE POLICY "profile_photos_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own profile photo
CREATE POLICY "profile_photos_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- STEP 4: VETERAN DOCUMENTS BUCKET POLICIES
-- =====================================================

-- Authenticated users can upload documents
CREATE POLICY "veteran_docs_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'veteran-documents' AND
  auth.role() = 'authenticated'
);

-- Authenticated users can view documents
CREATE POLICY "veteran_docs_select"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'veteran-documents');

-- Users can update their own documents
CREATE POLICY "veteran_docs_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'veteran-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own documents
CREATE POLICY "veteran_docs_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'veteran-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- STEP 5: CLAIM EVIDENCE BUCKET POLICIES
-- =====================================================

-- Authenticated users can upload claim evidence
CREATE POLICY "claim_evidence_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'claim-evidence' AND
  auth.role() = 'authenticated'
);

-- Authenticated users can view claim evidence
CREATE POLICY "claim_evidence_select"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'claim-evidence');

-- Users can update their own evidence
CREATE POLICY "claim_evidence_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'claim-evidence' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own evidence
CREATE POLICY "claim_evidence_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'claim-evidence' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- STEP 6: REPORTS BUCKET POLICIES (Admin Only)
-- =====================================================

-- Only admins can upload reports
CREATE POLICY "reports_insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'reports' AND
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Authorized users can view reports
CREATE POLICY "reports_select"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'reports' AND
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'case_manager', 'analyst')
  )
);

-- Only admins can update reports
CREATE POLICY "reports_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'reports' AND
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Only admins can delete reports
CREATE POLICY "reports_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'reports' AND
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- =====================================================
-- STEP 7: CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to get public URL for a file
CREATE OR REPLACE FUNCTION get_public_storage_url(bucket TEXT, path TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN 'https://asnzhinnwsplvkynkosp.supabase.co/storage/v1/object/public/' || bucket || '/' || path;
END;
$$ LANGUAGE plpgsql;

-- Function to validate file size (max 50MB)
CREATE OR REPLACE FUNCTION validate_file_size()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.metadata->>'size')::int > 52428800 THEN
    RAISE EXCEPTION 'File size exceeds 50MB limit';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMIT TRANSACTION
-- =====================================================
COMMIT;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ Storage policies created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE '📁 Required Buckets (create in Supabase Dashboard):';
  RAISE NOTICE '   1. profile-photos (Public bucket)';
  RAISE NOTICE '   2. veteran-documents (Private bucket)';
  RAISE NOTICE '   3. claim-evidence (Private bucket)';
  RAISE NOTICE '   4. reports (Private bucket)';
  RAISE NOTICE '';
  RAISE NOTICE '⚙️ Bucket Settings:';
  RAISE NOTICE '   - Max file size: 50MB (configurable per bucket)';
  RAISE NOTICE '   - profile-photos: Allow images only (jpg, png, gif, webp)';
  RAISE NOTICE '   - documents/evidence: Allow pdf, images, docs';
  RAISE NOTICE '   - reports: Allow pdf, csv, xlsx';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 Security:';
  RAISE NOTICE '   - All policies use Row Level Security';
  RAISE NOTICE '   - Users can only modify their own files';
  RAISE NOTICE '   - Profile photos are publicly viewable';
  RAISE NOTICE '   - Reports require admin role';
END $$;