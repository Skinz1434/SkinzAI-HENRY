# Storage Bucket Setup for HENRY Platform

## Important: Storage buckets must be created through the Supabase Dashboard

Storage buckets cannot be created via SQL - they must be set up through the Supabase Dashboard UI or API.

## Step-by-Step Setup Instructions:

### 1. Navigate to Storage Section
1. Log in to your Supabase Dashboard
2. Click on **Storage** in the left sidebar

### 2. Create Each Bucket

Click **"New bucket"** and create each of these:

#### Bucket 1: veteran-documents
- **Name**: `veteran-documents`
- **Public bucket**: ❌ OFF (Private)
- **File size limit**: 10MB
- **Allowed MIME types**: 
  - application/pdf
  - image/jpeg
  - image/png
  - application/msword
  - application/vnd.openxmlformats-officedocument.wordprocessingml.document

#### Bucket 2: medical-records
- **Name**: `medical-records`
- **Public bucket**: ❌ OFF (Private)
- **File size limit**: 50MB
- **Allowed MIME types**:
  - application/pdf
  - image/jpeg
  - image/png
  - application/dicom
  - text/plain
  - application/json

#### Bucket 3: claim-evidence
- **Name**: `claim-evidence`
- **Public bucket**: ❌ OFF (Private)
- **File size limit**: 100MB
- **Allowed MIME types**:
  - application/pdf
  - image/jpeg
  - image/png
  - video/mp4
  - audio/mpeg
  - application/zip

#### Bucket 4: profile-photos
- **Name**: `profile-photos`
- **Public bucket**: ❌ OFF (Private)
- **File size limit**: 5MB
- **Allowed MIME types**:
  - image/jpeg
  - image/png
  - image/gif
  - image/webp

### 3. After Creating Buckets, Run This SQL for Policies:

Once your buckets are created in the Dashboard, run this SQL to set up access policies: