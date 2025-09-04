# HVEC Module - Quick Start Guide

## Purpose
The HVEC (Henry Veterans Enhanced Care) module provides advanced clinical decision support for veteran healthcare providers through AI-driven insights, predictive analytics, and comprehensive diagnostic tools.

---

## Quick Start

### Prerequisites
- Node.js 20+ 
- npm 10+
- Environment variables configured (see `.env.example`)

### Installation
```bash
npm install
npm run dev
```

### Access HVEC Module
Navigate to: `http://localhost:3000/hvec`

---

## Module Structure

```
app/hvec/
├── page.tsx                    # Main dashboard (refactored to 305 lines)

components/hvec/
├── AIInsightsEnhanced.tsx      # AI insights & predictions
├── DiagnosticsEnhanced.tsx     # Diagnostic dashboard
├── ClinicalCharts.tsx          # Data visualizations
├── ClinicalTimeline.tsx        # Timeline views
└── RiskPredictionModels.tsx    # Predictive analytics

lib/henry/
├── va-rating-calculator.ts     # VA rating calculations
├── medical-record-generator.ts # Medical record generation
└── enhanced-mock-data.ts       # Data generation with conditions
```

---

## Key Features

### 1. AI-Powered Insights
- Risk assessment with confidence scoring (0-100%)
- Service connection probability analysis
- Condition interaction mapping
- 30-60 day predictive modeling

### 2. Comprehensive Diagnostics
- Lab results with trend analysis
- Imaging integration (X-ray, MRI, CT)
- Clinical scoring tools (DAS28, SLEDAI, HAQ-DI)
- Biomarker tracking

### 3. VA Rating System
- 38 CFR 4.25 compliant calculations
- 10% increment enforcement
- Bilateral factor calculations
- Automatic condition matching

### 4. Medical Records
- Service Treatment Records (STRs)
- C&P exam generation with nexus
- VA treatment records
- Range of motion assessments

---

## Development Workflow

### 1. Pre-Flight Check
```bash
npm run type-check  # Verify TypeScript
npm run lint        # Check code standards
```

### 2. Feature Development
Follow QBit Dev SOP (see `hvecagent.md`):
- Create feature branch
- Write tests first
- Implement incrementally
- Update documentation

### 3. Testing
```bash
npm run test        # Run test suite
npm run test:e2e    # E2E tests (when available)
```

### 4. Deployment
```bash
npm run build       # Production build
vercel             # Deploy to Vercel
```

---

## API Endpoints

### Get Veteran Data
```typescript
GET /api/veterans/:id
Response: VeteranProfile
```

### Generate AI Insights
```typescript
POST /api/veterans/:id/insights
Response: AIInsights[]
```

### Calculate VA Rating
```typescript
POST /api/va-rating/calculate
Body: { ratings: number[] }
Response: { combinedRating: number }
```

---

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=       # Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Public key
SUPABASE_SERVICE_ROLE_KEY=      # Service key
OPENAI_API_KEY=                 # For AI insights
```

### Feature Flags
```typescript
// lib/feature-flags.ts
{
  'ff.hvec.ai-insights.enabled': true,
  'ff.hvec.predictive-models.beta': false,
}
```

---

## Common Tasks

### Add New Clinical Chart
1. Create component in `components/hvec/`
2. Import in `ClinicalCharts.tsx`
3. Add to dashboard layout
4. Update documentation

### Modify Risk Calculations
1. Edit `lib/henry/ai-insights-generator.ts`
2. Update confidence thresholds
3. Test with mock data
4. Verify F2 score maintained

### Update VA Rating Logic
1. Modify `lib/henry/va-rating-calculator.ts`
2. Ensure 10% increments enforced
3. Test bilateral calculations
4. Update related conditions

---

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Vercel Deployment Stuck
1. Check DEPLOYMENT_VERSION.txt
2. Clear Vercel cache in dashboard
3. Trigger manual deployment
4. Use latest commit from CHANGELOG

### TypeScript Errors
```bash
# Check for type issues
npm run type-check

# Common fixes:
# - Ensure Veteran interface matches types/index.ts
# - Use proper icon names from lucide-react
# - Check for any/unknown types
```

---

## Support

- **Master Guide**: `hvecagent.md`
- **Changelog**: `CHANGELOG.md`
- **Platform Docs**: `docs/PLATFORM_OVERVIEW.md`
- **QBit Dev SOP**: See hvecagent.md

---

**Module Version**: 0.2.1  
**Last Updated**: 2025-09-04  
**Status**: Production Ready