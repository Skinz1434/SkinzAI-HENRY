# 🚀 HENRY Platform - Complete Deployment Guide

## Heroes' Early Notification & Response Yesterday
### Multi-Tool Veteran Services Platform

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Local Development](#local-development)
4. [Vercel Deployment](#vercel-deployment)
5. [Production Checklist](#production-checklist)
6. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Tools
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Git** for version control
- **Supabase** account (free tier works)
- **Vercel** account (free tier works)

### Recommended Tools
- **VS Code** with extensions:
  - Prisma
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

---

## 🗄️ Supabase Setup

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Configure:
   - **Project Name**: `henry-platform`
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development

### Step 2: Configure Database

1. Navigate to **SQL Editor** in Supabase dashboard
2. Create a new query
3. Copy and run each SQL file in order:

```bash
# Run these SQL files in this exact order:
1. database/schema.sql      # Creates tables and types
2. database/seed.sql         # Populates with 500 veterans
3. database/storage-policies.sql  # Sets up storage rules
```

### Step 3: Enable Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (minimum requirement)
3. Optional providers:
   - Google OAuth
   - GitHub OAuth
   - Microsoft OAuth

### Step 4: Configure Storage

1. Go to **Storage** → **Buckets**
2. Create these buckets:
   - `veteran-documents` (Public)
   - `claim-evidence` (Private)
   - `profile-photos` (Public)
   - `reports` (Private)

### Step 5: Get Your API Keys

1. Go to **Settings** → **API**
2. Copy these values to your `.env.local`:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon/Public Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

---

## 💻 Local Development

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/SkinzAI-VIS.git
cd "SkinzAI VIS"
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# The file already contains placeholders - just replace them
```

### Step 4: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Step 5: Verify Installation

Check these routes:
- `/` - Landing page with 3 tools
- `/henry/dashboard-full` - HENRY Dashboard
- `/va-claims-ai` - VA Claims AI tool
- `/codda` - CODDA placeholder

---

## 🌐 Vercel Deployment

### Step 1: Import Project

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import from GitHub repository
4. Select `SkinzAI-VIS` repository

### Step 2: Configure Environment Variables

In Vercel dashboard, add ALL variables from `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
ENCRYPTION_KEY=your-encryption-key
```

### Step 3: Deploy

1. Click "Deploy"
2. Wait for build to complete (3-5 minutes)
3. Visit your deployment URL

### Step 4: Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your domain
3. Follow DNS configuration instructions

---

## ✅ Production Checklist

### Database
- [ ] All SQL scripts executed successfully
- [ ] RLS (Row Level Security) policies enabled
- [ ] Indexes created for performance
- [ ] Backup configured

### Security
- [ ] Environment variables secured
- [ ] SSL certificates active
- [ ] Authentication configured
- [ ] API rate limiting enabled
- [ ] CORS properly configured

### Performance
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Caching headers configured
- [ ] CDN enabled (automatic on Vercel)

### Monitoring
- [ ] Error tracking configured
- [ ] Analytics enabled
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured

### Testing
- [ ] All routes tested
- [ ] Database queries verified
- [ ] Authentication flow tested
- [ ] File upload tested
- [ ] Mobile responsive verified

---

## 🔨 Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Database
```bash
# Reset database (Supabase SQL Editor)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

# Then re-run all SQL files
```

### Deployment
```bash
vercel              # Deploy to Vercel
vercel --prod       # Deploy to production
vercel env pull     # Pull environment variables
```

---

## 🐛 Troubleshooting

### Issue: "Invalid API Key"
**Solution**: Check that your Supabase keys are correctly copied to `.env.local`

### Issue: "Database connection failed"
**Solution**: 
1. Verify Supabase project is running
2. Check network/firewall settings
3. Confirm database password is correct

### Issue: "Build failed on Vercel"
**Solution**:
1. Check build logs for specific error
2. Ensure all environment variables are set
3. Verify Node.js version compatibility

### Issue: "500 Internal Server Error"
**Solution**:
1. Check server logs in Vercel dashboard
2. Verify all API routes have proper error handling
3. Confirm database migrations completed

### Issue: "Authentication not working"
**Solution**:
1. Verify auth providers are enabled in Supabase
2. Check redirect URLs are configured
3. Confirm environment variables are set

---

## 📊 Performance Optimization

### Database
- Use connection pooling
- Implement query caching
- Add appropriate indexes
- Use database views for complex queries

### Frontend
- Enable static generation where possible
- Implement lazy loading
- Use Next.js Image optimization
- Enable compression

### API
- Implement rate limiting
- Use edge functions for global distribution
- Cache responses appropriately
- Minimize payload sizes

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Rotate keys regularly** in production
3. **Use RLS policies** for all tables
4. **Implement rate limiting** on all API routes
5. **Enable 2FA** on all admin accounts
6. **Regular security audits** of dependencies
7. **Monitor for suspicious activity**

---

## 📞 Support & Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)

### Platform Support
- GitHub Issues: [SkinzAI-VIS/issues](https://github.com/yourusername/SkinzAI-VIS/issues)
- Platform Demo: [henry-platform.vercel.app](https://henry-platform.vercel.app)

### Creator
**Michael Skinner**
- Marine Veteran & VA AI SME
- GitHub: [@Skinz1434](https://github.com/Skinz1434)

---

## 🎖️ In Memory Of

**Lance Corporal Christopher James Henry, USMC**

*"Every alert generated is potentially a life saved."*

---

**Last Updated**: September 2, 2025
**Version**: 1.0.0
**Status**: Production Ready