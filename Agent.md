# VIS Service Verifier - Agent Instructions

## Project Overview
VIS Service Verifier is a comprehensive dashboard application for managing veteran information, claims, benefits, and services. Built with Next.js 14, TypeScript, and Tailwind CSS.

## IMPORTANT: Read Before Starting
1. **Always check CHANGELOG.md first** - Contains history of all changes and current status
2. **Project location**: `Z:\SkinzAI VIS\vis-service-verifier`
3. **Development server**: Runs on port 3000 (or 3003 if 3000 is busy)
4. **Main dashboard**: http://localhost:3000/dashboard-full

## Project Context
This is a Department of Veterans Affairs (VA) system integration tool that:
- Synchronizes data between MPD (Military Personnel Data) and Vet Profile
- Manages veteran profiles with comprehensive information
- Tracks claims through an 8-phase processing system
- Provides detailed analytics and reporting
- Handles documents, medical records, and benefits

## Key Technical Details

### Architecture
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict typing
- **Styling**: Tailwind CSS with custom SkinzAI dark theme
- **State Management**: React hooks (useState, useEffect)
- **Data Visualization**: Recharts library
- **Mock Data**: Comprehensive mock data generation for development

### Design System
- Dark theme with cyberpunk aesthetic
- Color scheme:
  - Primary: Cyan (#00ffff)
  - Secondary: Blue/Purple gradients
  - Background: Dark gray/black (#0a0a0a, #1a1a1a)
  - Borders: Subtle gray (#333)
  - Text: White primary, gray secondary

### Project Structure
```
Z:\SkinzAI VIS\
├── vis-service-verifier/      # Main application
│   ├── app/                   # Next.js pages and API routes
│   ├── components/            # React components
│   ├── lib/                   # Utilities and data
│   └── types/                 # TypeScript definitions
├── documentation/             # Project documentation
├── resources/                 # Excel files and HTML resources
├── CHANGELOG.md              # Session history and changes
├── Agent.md                  # This file - instructions
└── PROJECT_STRUCTURE.md      # Detailed structure guide
```

## Current Features

### 1. Veteran Profiles
- Personal information with SSN, DOB, contact details
- Military service history with proper branch-specific ranks
- Medical records and health information
- Benefits enrollment and tracking
- Financial information
- Legal documents and power of attorney
- Emergency contacts

### 2. Claims System
- **8-Phase Processing**: Tracks claims through complete VA process
- **Claim Types**: Compensation, Pension, Education, Insurance, Burial
- **Detailed Views**: 
  - Overview with current status
  - Timeline showing all updates
  - Evidence management
  - Contentions with disability ratings
  - C&P exam scheduling
  - Document attachments
- **Click-to-View**: All claims have "View Details" buttons that open modal

### 3. Data Consistency
- Every veteran has 2-4 claims minimum
- Military ranks are branch-specific (Army, Navy, Marines, Air Force, etc.)
- Benefits align with claims status
- All data properly typed with TypeScript

### 4. Analytics Dashboard
- Real-time metrics and KPIs
- Trend analysis for ratings and claims
- System health monitoring
- Processing time statistics

## Important Files to Know

### Core Components
- `components/VeteranDetailModalEnhanced.tsx` - Main veteran detail view (USE THIS, not the old modal)
- `components/ClaimsDetailModal.tsx` - Detailed claims view with 6 tabs
- `app/dashboard-full/page.tsx` - Main dashboard page

### Data Management
- `lib/veteran-profile-enhanced.ts` - Enhanced profile types and generation
- `lib/claims-types.ts` - Claims system TypeScript interfaces
- `lib/claims-data.ts` - Claims mock data generation
- `lib/military-data.ts` - Proper military ranks per branch
- `lib/mock-data.ts` - Main mock data generation

## Common Tasks

### Starting Development
```bash
cd "Z:\SkinzAI VIS\vis-service-verifier"
npm run dev
```

### Adding New Features
1. Check existing patterns in similar components
2. Use the established design system colors
3. Ensure TypeScript types are defined
4. Update mock data if needed
5. Test in dashboard-full page

### Fixing Issues
1. Check CHANGELOG.md for similar past issues
2. Verify you're using the enhanced components (not old versions)
3. Ensure all data has required properties
4. Check browser console for errors

## Known Gotchas
1. **Modal Versions**: Always use `VeteranDetailModalEnhanced`, not the old `VeteranDetailModal`
2. **Military Ranks**: Use branch-specific ranks from `military-data.ts`
3. **Claims Required**: Every veteran must have claims (2-4 minimum)
4. **Analytics Data**: Must include trends property with rating history
5. **File Location**: Project must be in `Z:\SkinzAI VIS`, not System32

## Next Session Checklist
1. [ ] Read this Agent.md file
2. [ ] Check CHANGELOG.md for recent changes
3. [ ] Verify project location is Z:\SkinzAI VIS
4. [ ] Run `npm run dev` to start server
5. [ ] Open http://localhost:3000/dashboard-full
6. [ ] Check for any console errors
7. [ ] Continue from "Next Steps" in CHANGELOG.md

## Contact & Issues
- Project uses SkinzAI design system
- Dashboard should maintain dark cyberpunk aesthetic
- All data is currently mock - ready for real API integration
- Focus on claims functionality and veteran profile management

## Current Status (August 28, 2025)
- ✅ Claims system fully functional with detailed modals
- ✅ Military data consistency fixed
- ✅ All veterans have proper claims
- ✅ Using enhanced modal system
- ✅ Analytics data integrated
- ✅ Project relocated to proper folder
- 🚀 Ready for next phase of development