# 🛠️ HENRY Platform - CI/CD Troubleshooting Guide

## 🚨 Common CI/CD Pipeline Issues & Solutions

### ❌ Build Application Step Failing

**Symptoms:**
- Build step fails with TypeScript errors
- Missing environment variables errors
- Next.js build errors

**Solutions:**

1. **Check Environment Variables:**
   ```bash
   # Ensure these GitHub Secrets are set:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - ENCRYPTION_KEY
   - OPENAI_API_KEY
   ```

2. **Verify TypeScript Types:**
   ```bash
   npm run type-check
   ```

3. **Test Build Locally:**
   ```bash
   npm run build
   ```

4. **Check Environment File:**
   - Ensure `.env.local` exists locally
   - Copy from `.env.example` if missing

---

### ❌ Security Scanning Step Failing

**Symptoms:**
- npm audit failures
- Dependency vulnerability errors
- Security action timeouts

**Solutions:**

1. **Update Dependencies:**
   ```bash
   npm update
   npm audit fix
   ```

2. **Check for High Severity Vulnerabilities:**
   ```bash
   npm audit --audit-level=high
   ```

3. **Review Security Reports:**
   - Download artifacts from failed runs
   - Check `audit-results.json` for details

---

### ❌ Deployment Steps Skipped

**Symptoms:**
- Deploy steps show "Skipped" status
- No deployment triggered

**Root Cause:**
- Deployment jobs depend on successful build + security jobs
- If either fails, deployment is automatically skipped

**Solutions:**

1. **Fix Upstream Jobs First:**
   - Resolve build failures
   - Fix security scanning issues

2. **Check Branch Conditions:**
   ```yaml
   # Production deployment only on main/master
   if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
   ```

---

### ❌ Vercel Deployment Issues

**Symptoms:**
- Vercel action fails
- Deployment timeout errors
- Missing Vercel secrets

**Solutions:**

1. **Verify Vercel Secrets:**
   ```bash
   # Required GitHub Secrets:
   - VERCEL_TOKEN
   - VERCEL_ORG_ID
   - VERCEL_PROJECT_ID
   ```

2. **Get Vercel Configuration:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and get project info
   vercel login
   vercel project ls
   ```

3. **Check Vercel Project Settings:**
   - Ensure project exists in Vercel dashboard
   - Verify environment variables in Vercel project settings

---

### ❌ GitHub Actions Workflow Syntax Errors

**Symptoms:**
- Workflow doesn't trigger
- YAML syntax errors
- Invalid workflow file

**Solutions:**

1. **Validate YAML Syntax:**
   ```bash
   # Use online YAML validator
   # Or install yamllint locally
   pip install yamllint
   yamllint .github/workflows/ci-cd.yml
   ```

2. **Check GitHub Actions Tab:**
   - Look for syntax error messages
   - Review workflow file changes

3. **Test Workflow Locally:**
   ```bash
   # Install act (GitHub Actions local runner)
   gh extension install https://github.com/nektos/act
   act push
   ```

---

## 🔧 Quick Fixes Checklist

### Before Pushing Code:

- [ ] ✅ Local build passes: `npm run build`
- [ ] ✅ TypeScript check passes: `npm run type-check`
- [ ] ✅ Linter passes: `npm run lint:check`
- [ ] ✅ No high severity vulnerabilities: `npm audit --audit-level=high`
- [ ] ✅ Environment variables documented in `.env.example`

### After Push (if CI fails):

- [ ] 🔍 Check GitHub Actions tab for detailed error logs
- [ ] 🔍 Download and review CI artifacts
- [ ] 🔍 Verify all required GitHub Secrets are set
- [ ] 🔍 Test the failing step locally
- [ ] 🔧 Apply appropriate fix from this guide
- [ ] 🚀 Push fix and monitor next CI run

---

## 📞 Emergency Procedures

### If Production Deployment Fails:

1. **Immediate Actions:**
   ```bash
   # Check if current production is still working
   curl -I https://henry-platform-url.vercel.app
   
   # If down, rollback via Vercel dashboard
   # Or trigger manual deployment
   ```

2. **Investigation:**
   - Check Vercel deployment logs
   - Review recent commits for breaking changes
   - Verify all secrets are still valid

3. **Recovery:**
   - Fix issue locally and test thoroughly
   - Push hotfix with priority
   - Monitor deployment closely

### If Multiple Jobs Failing:

1. **Check Service Status:**
   - GitHub Actions status: https://www.githubstatus.com/
   - Vercel status: https://www.vercel-status.com/
   - npm registry: https://status.npmjs.org/

2. **Temporary Workarounds:**
   ```yaml
   # Add to failing jobs temporarily:
   continue-on-error: true
   ```

3. **Escalation Path:**
   - Document all failures
   - Check with service providers
   - Consider manual deployment if critical

---

## 🚀 Performance Optimization

### Speed Up CI/CD Pipeline:

1. **Cache Dependencies:**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: 'npm'  # Already implemented
   ```

2. **Parallel Job Execution:**
   ```yaml
   # Build and security run in parallel (already implemented)
   needs: quality  # Both depend on quality check only
   ```

3. **Skip Redundant Steps:**
   ```yaml
   # Use continue-on-error for non-critical checks
   continue-on-error: true
   ```

---

## 📊 Monitoring CI/CD Health

### Key Metrics to Watch:

- **Build Success Rate:** Target >95%
- **Average Build Time:** Target <10 minutes
- **Security Vulnerability Count:** Target 0 high severity
- **Deployment Success Rate:** Target >99%

### Weekly Review Tasks:

- [ ] Review failed workflow runs
- [ ] Update dependencies (`npm update`)
- [ ] Rotate API keys if scheduled
- [ ] Check security audit reports
- [ ] Update CI/CD pipeline if needed

---

*Last Updated: September 2024*  
*For urgent issues, check recent commits or contact the development team.*
