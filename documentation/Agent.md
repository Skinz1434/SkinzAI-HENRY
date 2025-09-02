The Ultimate VIS Service Verifier Enhancement Prompt for Claude Code
markdown# 🎯 Mission: Transform VIS Service Verifier into Production-Ready Enterprise Application

You are an elite full-stack architect tasked with elevating the VIS Service Verifier (Veteran Information System) into a world-class enterprise application. This system processes veteran data through Vadir APIs with 97% accuracy, manages claims processing, and provides critical service verification for the VA.

## 📋 Core Requirements & Context

### Current System Overview
- **Purpose**: Veteran service verification with Vadir data integration, claims processing, and PDF generation
- **Key Metric**: 97% Vadir accuracy rate (must be prominently displayed)
- **Fallback System**: DD-214 processing when API fails
- **Integration Points**: Profile Service API, PVMS updates, ATI returns comparison

### Your Enhancement Objectives
1. **Expand** the existing HTML/CSS/JS prototype into a full TypeScript/React/Next.js application
2. **Implement** complete backend with FastAPI (Python) and Node.js microservices
3. **Design** IBM-compliant REST API endpoint architecture with OpenAPI 3.0 documentation
4. **Deploy** to GitHub (with Actions CI/CD) and Vercel (production demo)
5. **Transform** the Excel viewer into a powerful data analytics dashboard with export capabilities

## 🎨 SkinzAI Design System Specifications

### Visual Requirements
```css
/* Core Design Tokens - MUST implement exactly */
--skinz-bg-primary: #0a0b0d;
--skinz-bg-secondary: #13151a;
--skinz-bg-tertiary: #1a1d23;
--skinz-surface-elevated: #1e2128;
--skinz-border-subtle: rgba(45, 49, 57, 0.6);
--skinz-border-strong: rgba(45, 49, 57, 1);

/* Gradient System - Apply subtly throughout */
--gradient-primary: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
--gradient-success: linear-gradient(135deg, #10b981 0%, #059669 100%);
--gradient-surface: linear-gradient(180deg, var(--skinz-bg-secondary) 0%, transparent 100%);

/* Shadow System - Layer depth */
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 20px rgba(59, 130, 246, 0.15);
Interactive Elements

Hover Effects: All interactive elements scale(1.02) with 0.2s ease, add subtle glow
Tooltips: Dark glass-morphism style, appear after 500ms hover
Background Texture: Subtle noise texture overlay at 3% opacity
Transitions: Everything uses cubic-bezier(0.4, 0, 0.2, 1) for smooth feel
Loading States: Skeleton screens with shimmer animation
Micro-animations: Subtle parallax on scroll, stagger animations on list items

🏗️ Technical Architecture Requirements
Frontend Stack (Next.js 14 + TypeScript)
typescript// Required project structure
/src
  /app
    /api           # Next.js API routes
    /(auth)        # Auth group routes
    /(dashboard)   # Main app routes
    /layout.tsx    # Root layout with providers
  /components
    /ui            # Shadcn/ui components (customize for SkinzAI theme)
    /features      # Feature-specific components
    /charts        # Recharts with custom dark theme
  /hooks           # Custom React hooks
  /lib
    /api           # API client with react-query
    /utils         # Helper functions
    /validators    # Zod schemas
  /stores          # Zustand state management
  /types           # TypeScript interfaces
Backend Architecture (Python FastAPI + Node.js)
python# FastAPI Structure Required
/backend
  /app
    /api
      /v1
        /endpoints
          /vadir.py      # Vadir sync endpoints
          /claims.py     # Claims processing
          /profile.py    # Profile service integration
          /documents.py  # PDF generation
        /deps.py         # Dependencies
        /security.py     # JWT + OAuth implementation
    /core
      /config.py         # Settings management
      /security.py       # Encryption utilities
    /services
      /vadir_service.py  # Vadir API integration
      /dd214_fallback.py # Fallback logic
      /pdf_generator.py  # Document generation
    /models              # SQLAlchemy models
    /schemas             # Pydantic schemas
    /tests               # Pytest test suite
📊 Enhanced Excel Dashboard Requirements
Transform the Excel view into a comprehensive analytics dashboard with:
Data Grid Features

Virtual Scrolling: Handle 100,000+ records smoothly using react-window
Advanced Filtering: Multi-column filters with regex support
Column Operations: Resize, reorder, pin, hide/show columns
Cell Editing: In-line editing with validation and undo/redo
Export Options: CSV, Excel (xlsx), PDF with formatting preserved
Real-time Updates: WebSocket integration for live data changes
Grouping & Aggregation: Group by any column with sum/avg/count

Visualization Components
javascript// Required chart implementations using Recharts
- Accuracy Trend Line Chart (97% target line highlighted)
- API Response Time Heatmap
- Claims Processing Funnel
- Veteran Distribution Map (US states)
- Real-time Performance Gauges
- Stacked Bar Chart for claim types
🔌 IBM-Compliant API Endpoint Architecture
RESTful Endpoint Structure
yaml# OpenAPI 3.0 Specification - MUST follow exactly
openapi: 3.0.0
info:
  title: VIS Service Verifier API
  version: 1.0.0
  description: Enterprise API for Veteran Information System

paths:
  /api/v1/veterans:
    get:
      summary: List veterans with pagination
      parameters:
        - name: page
        - name: limit
        - name: sort
        - name: filter
    post:
      summary: Create veteran record
      
  /api/v1/veterans/{id}:
    get:
      summary: Get veteran by ID
    put:
      summary: Update veteran
    patch:
      summary: Partial update
    delete:
      summary: Soft delete veteran

  /api/v1/vadir/sync:
    post:
      summary: Sync with Vadir API
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/VadirSyncRequest'
      responses:
        200:
          description: Sync successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/VadirSyncResponse'

  /api/v1/claims/{id}/process:
    post:
      summary: Process claim
      x-ratelimit: 100/hour
      
  /api/v1/documents/generate-pdf:
    post:
      summary: Generate PDF document
      
  /api/v1/metrics/realtime:
    get:
      summary: WebSocket endpoint for real-time metrics
      
  /api/v1/health:
    get:
      summary: Health check endpoint
Required Middleware & Security

Rate Limiting: 100 req/min per IP, 1000 req/min per authenticated user
CORS Configuration: Properly configured for Vercel deployment
Authentication: JWT with refresh tokens, OAuth2 for VA systems
Request Validation: Zod schemas with detailed error messages
Error Handling: Consistent error format with correlation IDs
Logging: Structured logging with winston/pino
Monitoring: OpenTelemetry integration ready

🚀 Deployment Configuration
GitHub Repository Structure
bash# Required GitHub setup
.github/
  workflows/
    ci.yml          # Run tests on PR
    deploy.yml      # Deploy to Vercel on main push
    codeql.yml      # Security scanning
  CODEOWNERS        # Define code ownership
  
# Branch Protection Rules
- main: Requires PR reviews, passing tests
- develop: Auto-deploy to staging
Vercel Deployment Configuration
json// vercel.json - MUST include
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url",
    "DATABASE_URL": "@database_url",
    "VADIR_API_KEY": "@vadir_api_key"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "s-maxage=60, stale-while-revalidate" }
      ]
    }
  ]
}
🧪 Testing Requirements
Test Coverage Targets

Unit Tests: 80% coverage minimum
Integration Tests: All API endpoints
E2E Tests: Critical user flows
Performance Tests: Load testing for 1000 concurrent users

Required Test Implementations
typescript// Example test structure needed
describe('VadirSyncService', () => {
  it('should maintain 97% accuracy threshold', async () => {
    // Implementation required
  });
  
  it('should fallback to DD-214 on API failure', async () => {
    // Implementation required
  });
  
  it('should handle retiree date discrepancy', async () => {
    // Implementation required
  });
});
📱 Responsive Design Breakpoints
css/* Must implement these exact breakpoints */
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
🔧 Performance Optimization Requirements
Core Web Vitals Targets

LCP: < 2.5s
FID: < 100ms
CLS: < 0.1
Time to Interactive: < 3.5s

Implementation Requirements

Code splitting with dynamic imports
Image optimization with next/image
Font optimization with next/font
API response caching with Redis
Database query optimization with indexes
CDN setup for static assets

📝 Documentation Requirements
Code Documentation

JSDoc comments for all functions
README.md with setup instructions
API documentation with Swagger UI
Architecture Decision Records (ADRs)
Component Storybook for UI library

🎯 Success Criteria
Your implementation will be considered complete when:

✅ All veteran data loads in < 2 seconds
✅ Vadir sync maintains 97%+ accuracy display
✅ Excel dashboard handles 10,000+ rows smoothly
✅ All API endpoints follow IBM REST standards
✅ Deployed successfully to Vercel with custom domain
✅ GitHub Actions CI/CD pipeline fully operational
✅ Mobile responsive down to 320px width
✅ Accessibility score > 95 (Lighthouse)
✅ All hover effects and tooltips working
✅ Background texture and gradients applied subtly

🔐 Environment Variables Template
Create .env.local with:
bash# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/vis_db
REDIS_URL=redis://localhost:6379

# APIs
NEXT_PUBLIC_API_URL=http://localhost:8000
VADIR_API_KEY=your_key_here
PROFILE_SERVICE_URL=https://profile.va.gov/api
DD214_FALLBACK_URL=https://dd214.va.gov/api

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl
JWT_SECRET=your_jwt_secret

# Features
ENABLE_VADIR_SYNC=true
ACCURACY_THRESHOLD=97.0
MAX_RETRY_ATTEMPTS=3
💡 Additional Enhancements to Implement

Smart Caching: Implement Redis caching with intelligent invalidation
Audit Logging: Complete audit trail for all data modifications
Notification System: Real-time alerts for accuracy drops below 97%
Batch Operations: Bulk sync capabilities for multiple veterans
Analytics Dashboard: Management metrics with drill-down capabilities
Dark Mode Toggle: System preference detection with manual override
Keyboard Shortcuts: Power user features (Cmd+K for search, etc.)
Data Export Scheduler: Automated reports generation
WebSocket Status Board: Live system health monitoring
Progressive Web App: Offline capability with service workers

🚦 Start Here

Initialize Next.js project with TypeScript
Set up GitHub repository with branch protection
Configure Vercel project with environment variables
Implement authentication system
Build core veteran data models
Create Vadir sync service
Design SkinzAI themed UI components
Implement Excel dashboard with virtual scrolling
Add WebSocket real-time updates
Deploy and test with production data

Remember: The 97% accuracy metric should be visible and prominent throughout the interface. Every design decision should reinforce the professional, sophisticated SkinzAI aesthetic with subtle dark gradients and smooth interactions.