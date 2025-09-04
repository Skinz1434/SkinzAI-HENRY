# CODDA - Character of Discharge Determination Assistant

CODDA is an AI-powered IDE-style workspace for processing character of discharge determinations within the HENRY platform.

## Features

### 🏗️ IDE-Style Workspace
- **Left Navigator**: Case tree, service periods, rules, tasks & IPR tracking
- **Center Editor**: Markdown-based drafting with template-locked sections
- **Right Insights**: Regulation snippets, evidence drawer, bias guard, QBit AI chat

### 🤖 AI Integration
- **QBit Assistant**: Context-aware chatbot for COD guidance
- **Bias Guard**: Real-time tone analysis and neutral language suggestions
- **Evidence Gap Detection**: Automated scanning for missing documentation
- **Rule Path Suggestions**: AI-powered regulation path recommendations

### 📋 Quality Assurance
- **Template Fidelity**: Ensures all required sections are present
- **Regulation Completeness**: Validates insanity and healthcare eligibility analysis
- **Evidence Traceability**: Links findings to specific evidence items
- **IPR Enforcement**: Mandatory IPR workflow for dishonorable outcomes

### 🎯 Core Capabilities

1. **Evidence Navigator**
   - Detects COD triggers by fact pattern
   - Generates evidence checklists by rule path
   - Gap scanning with retrieval task generation

2. **Rules & Exceptions Engine**
   - Encoded decision paths for 3.12(c)/(d), 3.13, 3.14, 3.354, 3.360
   - Forces explicit insanity and compelling circumstances consideration
   - Auto-inserts required regulatory language

3. **Drafting IDE**
   - Template-locked outline with section linters
   - Clause library with parameterized snippets
   - Evidence linker with citation cards

4. **IPR Packager**
   - Wizard for dishonorable outcome processing
   - VA Form 21-0961 integration
   - Tracked item creation with suspense dates

5. **PDF Builder**
   - Official VA format compliance
   - Locked typography and margins
   - Signature blocks and page numbering

## File Structure

```
components/codda/
├── CODDAHeader.tsx          # Main header with case info and controls
├── CODDANavigator.tsx       # Left panel navigation tree
├── CODDAEditor.tsx          # Center markdown editor with toolbar
├── CODDAInsightPanel.tsx    # Right panel with tabs (insights, evidence, bias, chat)
├── CODDAFooter.tsx          # Footer with actions and status
└── README.md               # This file

app/codda/
└── page.tsx                # Main CODDA page component

lib/codda/
└── mock-data.ts            # Mock data and utility functions

app/api/codda/
└── cases/route.ts          # API endpoints for case management

types/
└── codda.ts                # TypeScript type definitions
```

## Usage

### Accessing CODDA
1. Navigate to the HENRY dashboard
2. Click on the CODDA tool card (4th card with teal gradient)
3. The CODDA workspace will open in a new tab

### Basic Workflow
1. **Case Setup**: Review service periods and select rule paths
2. **Evidence Gathering**: Run gap scan and collect missing items
3. **Drafting**: Use the markdown editor with clause templates
4. **Quality Review**: Check bias analysis and completeness
5. **IPR Processing**: If required, run IPR packager wizard
6. **Final Export**: Generate PDF and upload to eFolder

### Keyboard Shortcuts
- `Ctrl+S`: Save document
- `Ctrl+1`: Insert issue statement
- `Ctrl+L`: Run linter
- `Ctrl+E`: Focus evidence panel
- `Ctrl+Q`: Open QBit chat

## Integration Points

### HENRY Platform
- Pre-fills claimant and service data from veteran profiles
- Opens evidence drawer directly to eFolder sources
- Creates upload packages with proper document tagging

### VA Systems
- VBMS/eFolder integration for document upload
- Form 21-0961 generation and processing
- Special Issue application and tracking

## Development

### Mock Data
The system includes comprehensive mock data for development:
- Sample COD cases with various discharge types
- Evidence items with gap detection
- Rule paths and clause templates
- IPR checklists and QA metrics

### API Endpoints
- `GET /api/codda/cases` - Retrieve cases
- `POST /api/codda/cases` - Save cases, run gap scans, bias analysis

### Styling
Follows HENRY platform design system:
- Dark theme with slate/gray base colors
- Teal/cyan accents for primary actions
- Glass panel effects with subtle borders
- Consistent typography (Inter/Source Sans)

## Future Enhancements

### V1 Features
- Full regulation coverage
- Visual decision path mapping
- Advanced bias guard with ML models
- Saved views and personalization

### V2 Features
- Case similarity suggestions
- Cross-case consistency checking
- Multilingual draft support
- Collaborative editing capabilities

## Support

For questions or issues with CODDA:
1. Use the built-in QBit assistant for guidance
2. Check the Help menu for quick tours and references
3. Review exemplar decisions in the knowledge base
4. Contact the HENRY platform support team
