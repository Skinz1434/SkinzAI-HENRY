# VIS Service Verifier - Project Structure

## Project Location
Z:\SkinzAI VIS\vis-service-verifier

## Directory Structure

```
vis-service-verifier/
├── app/                      # Next.js 14 App Router
│   ├── api/                  # API Routes
│   │   ├── sync/            # Sync endpoints
│   │   └── veterans/        # Veterans data endpoints
│   ├── dashboard-full/      # Full dashboard page
│   ├── dashboard-static/    # Static dashboard page  
│   └── simple/             # Simple dashboard page
├── components/              # React Components
│   ├── charts/             # Chart components
│   ├── features/           # Feature components
│   └── profile-tabs/       # Profile tab components
├── lib/                    # Utilities and Libraries
│   ├── api/               # API client
│   ├── validators/        # Data validators
│   └── *.ts              # Data models and utilities
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── public/               # Static assets

## Key Files

### Configuration Files
- `next.config.ts` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Node.js dependencies

### Main Application Files
- `app/layout.tsx` - Root layout
- `app/page.tsx` - Home page
- `app/dashboard-full/page.tsx` - Main dashboard

### Components
- `components/VeteranDetailModalEnhanced.tsx` - Enhanced veteran detail modal
- `components/ClaimsDetailModal.tsx` - Claims detail modal
- `components/DocumentViewer.tsx` - Document viewer

### Data & Types
- `lib/veteran-profile-enhanced.ts` - Enhanced veteran profile types
- `lib/claims-types.ts` - Claims type definitions
- `lib/military-data.ts` - Military rank data
- `lib/mock-data.ts` - Mock data generation

## Running the Application

1. Navigate to project: `cd "Z:\SkinzAI VIS\vis-service-verifier"`
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Access at: `http://localhost:3000`

## Available Routes
- `/` - Home page
- `/dashboard-full` - Full featured dashboard
- `/dashboard-static` - Static dashboard
- `/simple` - Simple dashboard view