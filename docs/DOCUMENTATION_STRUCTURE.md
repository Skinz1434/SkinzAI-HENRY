# Documentation Structure & Organization

## CodingAgent (QBit Dev) Documentation Standards

This document defines the organization of all documentation following QBit Dev operating standards.

---

## Directory Structure

```
docs/
├── DOCUMENTATION_STRUCTURE.md    # This file - master index
├── platform/                     # Platform-wide documentation
│   ├── PROJECT_STRUCTURE.md     # Overall project architecture
│   ├── PLATFORM_OVERVIEW.md     # Platform capabilities and features
│   └── README.md                # Platform quick start guide
│
├── hvec/                        # HVEC module specific docs
│   ├── README.md               # HVEC quick start
│   ├── TECHNICAL_SPEC.md       # Technical specifications
│   ├── API_REFERENCE.md        # API documentation
│   └── DEPLOYMENT.md           # Deployment guide
│
├── archive/                     # Deprecated/historical docs
│   ├── HVEC_CHANGELOG_DISASTER.md
│   └── HVEC_PRODUCTION_REQUIREMENTS.md
│
├── auth-config-guide.md        # Authentication configuration
├── CI-CD-TROUBLESHOOTING.md    # CI/CD troubleshooting guide
├── DEPLOYMENT_GUIDE.md         # General deployment procedures
├── REORGANIZATION_SUMMARY.md   # Project reorganization history
└── storage-bucket-setup.md     # Storage configuration
```

---

## Document Purposes

### Root Level Documents

| File | Purpose | Status |
|------|---------|--------|
| **hvecagent.md** | Master HVEC development guide with QBit Dev SOP | ACTIVE |
| **CHANGELOG.md** | Project-wide change history | ACTIVE |
| **README.md** | Main project introduction and setup | ACTIVE |
| **WARP.md** | Warp.dev IDE configuration | ACTIVE |
| **package.json** | Node.js dependencies and scripts | ACTIVE |

### Platform Documentation (`/docs/platform/`)

| File | Purpose | Status |
|------|---------|--------|
| **PROJECT_STRUCTURE.md** | Technical architecture overview | ACTIVE |
| **PLATFORM_OVERVIEW.md** | Business and functional overview | ACTIVE |

### HVEC Documentation (`/docs/hvec/`)

| File | Purpose | Status |
|------|---------|--------|
| **README.md** | HVEC module quick start | TO CREATE |
| **TECHNICAL_SPEC.md** | Component specifications | TO CREATE |
| **API_REFERENCE.md** | API endpoints and interfaces | TO CREATE |
| **DEPLOYMENT.md** | HVEC-specific deployment | TO CREATE |

### Archived Documentation (`/docs/archive/`)

| File | Purpose | Status |
|------|---------|--------|
| **HVEC_CHANGELOG_DISASTER.md** | Historical error documentation | ARCHIVED |
| **HVEC_PRODUCTION_REQUIREMENTS.md** | Old requirements doc | ARCHIVED |

---

## Documentation Guidelines (QBit Dev Standards)

### 1. File Naming Convention
- Use SCREAMING_SNAKE_CASE for primary docs (e.g., `PLATFORM_OVERVIEW.md`)
- Use kebab-case for guides (e.g., `auth-config-guide.md`)
- Use README.md for directory indexes

### 2. Document Structure
Every document must include:
- **Purpose** statement (1-2 sentences)
- **Inputs/Outputs** section if applicable
- **SOP** (Standard Operating Procedure) if procedural
- **Definition of Done** checklist
- **Self-Audit Prompts** for critical docs

### 3. Version Control
- Use semantic versioning in CHANGELOG.md
- Include timestamps (YYYY-MM-DD format)
- Reference commit hashes for major changes
- Track deployment versions separately

### 4. Content Standards
- **No `any`/`unknown`** types in code examples
- **Structured logging** examples where relevant
- **Error handling** patterns documented
- **Performance budgets** specified
- **Security considerations** highlighted

### 5. Maintenance Protocol
- Review quarterly for accuracy
- Update within 24 hours of breaking changes
- Archive deprecated docs with reason and date
- Maintain single source of truth (no duplicates)

---

## Active Conflicts Resolution

### Identified Conflicts
1. **Multiple agent configurations**: `hvecagent.md` vs `config/analysis-agent.md`
   - **Resolution**: `hvecagent.md` is master for HVEC, `analysis-agent.md` for VA claims
   
2. **Platform overviews**: Root `README.md` vs `docs/PLATFORM_OVERVIEW.md`
   - **Resolution**: README for quick start, PLATFORM_OVERVIEW for detailed architecture

3. **HVEC disaster docs**: Active development vs historical errors
   - **Resolution**: Archive disaster docs, maintain clean active documentation

### Migration Plan
1. ✅ Create organized directory structure
2. ⏳ Move archived docs to `/docs/archive/`
3. ⏳ Create clean HVEC documentation in `/docs/hvec/`
4. ⏳ Update all cross-references
5. ⏳ Remove duplicate/conflicting information

---

## Usage Instructions

### For Development
1. Always refer to `hvecagent.md` for HVEC development
2. Follow QBit Dev SOP for all changes
3. Update relevant docs BEFORE opening PR
4. Include doc updates in Definition of Done

### For Deployment
1. Check `DEPLOYMENT_VERSION.txt` for current version
2. Follow `docs/DEPLOYMENT_GUIDE.md` procedures
3. Update `CHANGELOG.md` after successful deployment
4. Verify Vercel cache invalidation if needed

### For New Features
1. Create ADR (Architecture Decision Record) if non-obvious
2. Update component documentation in relevant `/docs/` subdirectory
3. Add feature flags per QBit standards
4. Document rollout plan

---

## Self-Audit Checklist

Before considering documentation complete:

- [ ] Single source of truth established (no duplicates)
- [ ] All active docs follow QBit Dev standards
- [ ] Archived docs moved to `/docs/archive/`
- [ ] Cross-references updated and working
- [ ] HVEC module clearly separated
- [ ] Version numbers consistent across files
- [ ] No conflicting information between docs
- [ ] README files present in each major directory
- [ ] API contracts documented with TypeScript interfaces
- [ ] Rollback procedures documented

---

**Last Updated**: 2025-09-04  
**Version**: 1.0.0  
**Status**: Implementation in Progress