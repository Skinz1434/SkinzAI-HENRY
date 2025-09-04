# CODDA — Character‑of‑Discharge Determination Assistant

**Mission:** An IDE‑style, Veteran‑centric yet unbiased workspace that guides processors end‑to‑end—from evidence intake → rules/exception analysis → drafting → mandatory IPR packaging → pristine PDF upload to the eFolder—seamlessly inside HENRY.

---

## 0) Skin + Personality (HENRY‑consistent)
- **Theme:** Dark mode by default; deep navy/graphite base, soft glass panels, subtle grid/pattern, micro‑particles, low‑contrast separators. Accent tokens: teal → success; amber → caution; fuchsia → AI assist; cyan → links.
- **Typography:** Inter/Source Sans; headings semi‑bold; monospaced for citations/IDs. Min 14px body (WCAG AA).
- **Iconography:** Thin‑line icons; clear status glyphs for bars/branches.
- **Motion:** 150–200ms easings; never distract during drafting.

---

## 1) User Roles & Personas
- **VSR:** Initiates COD, gathers evidence, runs checklists, drafts admin decision.
- **RVSR/DRO:** Reviews analysis, edits reasons/bases, clears quality gates.
- **Coach/QA:** Runs bias/quality audits, approves IPR packaging.
- **Admin:** Manages clause libraries, rules versions, integrations, analytics.

Permissions map to HENRY’s RBAC; CODDA scopes read/write per claim and service period(s).

---

## 2) Welcome + Onboarding
**First‑run modal (3 steps):**
1) **What you’re doing:** “We’ll walk you from service characterization → rule path → evidence gaps → decision.”
2) **Your guardrails:** “Mandatory IPR for dishonorable outcomes, template‑locked sections, neutral language linter.”
3) **Personalize:** Theme density, clause pack defaults, writing tone (neutral/clinical/warm), keyboard shortcuts.

**Always‑available Help Menu:** Quick tour, rule trees reference, exemplar decisions, ‘Explain my path’ guide.

---

## 3) IDE Layout
- **Left Rail – Navigator:** Case → Service Periods → Rules Tree → Tasks & IPR → Export/Upload.
- **Center – Drafting Surface:** Markdown editor with section anchors (ISSUE, EVIDENCE, LAWS/REGS, DECISION, REASONS & BASES, FAVORABLE FINDINGS). Real‑time completeness meter.
- **Right Rail – Insight Drawer:**
  - **Reg Snippets:** Contextual clauses based on selected branch.
  - **Evidence Drawer:** Indexed items with source, date, reliability tag; gap detector and retrieval tasks.
  - **Bias Guard:** Flags subjective/adversarial phrasing; suggests neutral rewrites.
- **Footer:** ‘Explain my path’, ‘Run IPR Packager’, ‘Preview PDF’, ‘Save’ (autosaves), ‘QA Checklist’.

---

## 4) Core Capabilities (Agent Tools)
1) **Evidence Navigator**
   - Detects COD triggers by fact pattern (e.g., OTH, BCD, dismissal, void enlistment, dropped from rolls).
   - Generates a checklist by rule path (e.g., AWOL duration timeline; in‑service offenses; separation packet; court‑martial docs; mental health evals; lay statements; performance reports; treatment notes).
   - **Gap Scan:** Emits retrieval jobs (records requests, subpoena prompts, follow‑ups).

2) **Rules & Exceptions Engine**
   - Encoded decision paths for 3.12(c)/(d), 3.13, 3.14, 3.354 (insanity), 3.360 (health‑care eligibility).
   - Forces explicit consideration of **insanity** and **compelling circumstances** where applicable.
   - Auto‑inserts required language when a bar is met; toggles **health‑care‑only** analysis when necessary.

3) **Drafting IDE (Markdown → PDF)**
   - Template‑locked outline; section linters (presence, clarity, prohibited phrases).
   - Clause Library with parameterized snippets and placeholders (see §10).
   - Evidence linker: `[[EVID#23]]` embeds a cite card in PDF (source/date/short description).

4) **IPR Packager (dishonorable outcomes)**
   - Wizard performs: attach draft decision + VA Form 21‑0961, apply Special Issue, create tracked item, set suspense **+4 business days**, add internal note; post‑IPR cleanup checklist.

5) **Bias Guard + Explainability**
   - Language model critiques tone; highlights exculpatory facts and counter‑evidence considered.
   - **Explain My Path:** Visual breadcrumb from facts → rule branch → conclusion, with evidence pins.

6) **PDF Builder**
   - One‑to‑one with VA admin decision format; locked typography, margins, headers/footers, page numbering, signature block.

7) **HENRY Integration**
   - Pre‑fills claimant, file no., service periods, prior determinations; opens Evidence Drawer directly to eFolder sources.
   - Creates an Upload Package (PDF + index sheet) with document type and contentions tagging.

---

## 5) End‑to‑End Workflows
### A) Full COD Determination
1) **Launch CODDA** from a claim with non‑honorable characterization.
2) **Scope Service Periods**; select periods to evaluate.
3) **Choose Candidate Rule Paths** prompted by fact pattern.
4) **Evidence Sweep** + **Gap Scan** (auto‑create retrieval tasks).
5) **Insanity & Compelling‑Circumstances Assessors** (structured Q&A that writes the section for you).
6) **Draft Decision** with outline lock + clause suggestions; complete LAWS/REGS; address **3.360** when required.
7) **Quality Gates** (see §12); fix flags.
8) **If dishonorable outcome** → run **IPR Packager**.
9) **Preview PDF** → **Export** → **Upload Package** → done.

### B) IPR‑Only Path
- When an existing draft concludes dishonorable‑for‑VA: open IPR Packager; the wizard verifies attachments, SI, tracked item, suspense, and logs completion steps.

---

## 6) Data Model (Types)
```ts
// packages/types/codda.ts
export type ServicePeriod = {
  id: string; branch: string; start: string; end: string;
  charOfDischarge: 'HON'|'GEN'|'OTH'|'BCD'|'DD'|'UNCHAR'|'DISMISSAL';
  notes?: string;
};

export type EvidenceItem = {
  id: string; kind: 'STR'|'SPR'|'ChargeSheet'|'CourtMartial'|'SeparationPacket'|'Lay'|'Treatment'|'Other';
  title: string; date?: string; source: 'eFolder'|'HENRY'|'Upload'|'External';
  reliability: 'high'|'medium'|'low'; url?: string; summary?: string;
};

export type RulePath = {
  id: string; label: string;
  branches: string[]; // e.g., ['3.12(d)(1)','3.354','3.360']
  requiresInsanityCheck?: boolean; requiresCompellingCircumstances?: boolean;
};

export type Finding = {
  insanityConsidered: boolean; insanityApplies?: boolean; rationaleInsanity?: string;
  compellingCircumstancesConsidered?: boolean; compellingRationale?: string;
  barMet?: boolean; healthcareOnlyConsidered?: boolean; healthcareOnlyRationale?: string;
};

export type Decision = {
  issue: string; evidenceIds: string[]; regs: string[]; decisionText: string;
  reasonsBases: string; favorableFindings?: string[];
};

export type IPRPacket = {
  required: boolean; draftDocId?: string; form210961Id?: string; specialIssueApplied?: boolean;
  trackedItemId?: string; suspenseDate?: string; status: 'pending'|'submitted'|'cleared';
};

export type CODCase = {
  id: string; fileNumber: string; claimant: string; station: string;
  service: ServicePeriod[]; evidence: EvidenceItem[];
  rulePath: RulePath; finding: Finding; decision: Decision; ipr: IPRPacket;
  qa: { completeness: number; lintFlags: string[] };
};
```

---

## 7) Integrations & Connectors
- **HENRY Data:** `/henry/api/cases/:id`, `/henry/api/efolder/search`, `/henry/api/profile/:fileNumber`.
- **Knowledge/RAG:** `henry://knowledge/cfr/3.12`, `henry://knowledge/cfr/3.354`, `henry://knowledge/cfr/3.360`, `henry://knowledge/m21-1/part-x`, etc.
- **VBMS/eFolder Upload:** `/henry/api/upload` → document type: Administrative Decision; tags: COD; linkage to contention.
- **Audit/Telemetry:** `/henry/api/audit` events for rule choices, linter fixes, IPR completion.

---

## 8) API Surface (Proposed)
**REST (internal):**
- `GET /codda/case/:id` → hydrate CODCase.
- `POST /codda/case/:id/scan` → run Evidence Gap Scan.
- `POST /codda/case/:id/rulepath` {facts} → suggest RulePath[].
- `POST /codda/case/:id/draft` {markdown} → linted draft + suggestions.
- `POST /codda/case/:id/ipr` {draftDocId, formId} → create SI, tracked item, suspense; return IPRPacket.
- `POST /codda/export/pdf` {caseId} → returns PDF artifact + index sheet.

**Agent Ops:**
- `POST /agents/codda/infer` {prompt, contextRefs[]} → structured answers.
- `POST /agents/codda/rewrite` {section, constraints} → neutralize tone/insert clause.

---

## 9) Repository Structure
```
henry-codda/
├─ apps/
│  ├─ web/                # Next.js app (App Router)
│  └─ api/                # FastAPI/Node handlers (adapter over HENRY services)
├─ packages/
│  ├─ ui/                 # Shadcn+Tailwind components (Editor, Drawers, Modals)
│  ├─ agents/             # QBit|CODDA tools + prompts + RAG pipelines
│  ├─ rules/              # Decision trees, YAML/JSON rules, validators
│  ├─ pdf/                # Markdown→PDF renderer, templates, index sheet
│  ├─ types/              # Shared TypeScript types (see §6)
│  ├─ lints/              # Decision linters, bias guard
│  └─ fixtures/           # Example cases, evidence sets, exemplar drafts
├─ scripts/               # Dev CLIs (seed rules, run checklists)
└─ docs/                  # Playbooks, onboarding, admin guides
```

---

## 10) Clause Library (Starter Pack)
> Parameter placeholders in `{braces}`; choose tone: `neutral|clinical|warm`.

- **Issue:**
  - "Character of discharge for the service period from {start} to {end}."
- **Evidence Lead‑in:**
  - "The evidence considered includes: {list}."
- **Insanity – Not at Issue:**
  - "Insanity is **not** raised by the record or argument."
- **Insanity – Considered/Applies:**
  - "The record reflects symptoms/diagnosis suggesting insanity at the time of the offense(s); the criteria are met because {rationale}."
- **Compelling Circumstances:**
  - "Compelling circumstances were considered, including {factors}. {Conclusion}."
- **Bar Met (General):**
  - "The discharge constitutes a bar to benefits under {branch} based on {facts}."
- **Health‑care Eligibility Paragraph:**
  - "Although a bar applies, eligibility for health care under chapter 17 is considered; {analysis}."
- **Decision Statement (Per Period):**
  - "For the period {start}–{end}, the service is {status} for VA purposes."
- **Favorable Findings:**
  - "The following favorable findings are made and are binding: {items}."

Admin can add/curate packs; writers can star favorites.

---

## 11) Personalization & Settings
- **Editor:** compact/comfortable density; show/hide side panels; ruler guide; distraction‑free mode.
- **Chat Persona:** QBit voice preset (plain/clinical/warm), verbosity, hint aggressiveness.
- **Clause Packs:** default set per station; personal starred snippets.
- **Shortcuts:** `/issue`, `/evidence`, `/insanity`, `/bars`, `/healthcare`, `/decision`, `/favorable` to insert blocks.
- **Saved Views:** persist navigator state, filters, and column setups.

**Settings JSON (per user):**
```json
{
  "theme":"dark",
  "editorDensity":"comfortable",
  "persona":"clinical",
  "snippetPacks":["core","mental-health","awol"],
  "shortcuts":{"insertIssue":"Ctrl+1","runLints":"Ctrl+L"}
}
```

---

## 12) Quality Gates (Hard Stops & Warnings)
- **Template Fidelity:** All sections present; no empty headers in final PDF.
- **Reg Completeness:** If a bar is found, health‑care eligibility analysis is present; insanity is explicitly addressed (Y/N + rationale).
- **Tone Lint:** Removes conclusory/judgmental words; suggests neutral alternatives.
- **Evidence Traceability:** Each finding maps to ≥1 EvidenceItem.
- **IPR Enforcement:** Dishonorable outcome cannot finalize without IPR checklist completion.

---

## 13) PDF Export Mapping
- Cover: Case metadata, service period table.
- Body: Section order locked; evidence cites rendered as footnotes/endnotes with source/date.
- Footer: Page X of Y, file number, generated‑by CODDA stamp.
- Signature: Name/Title/Station/Date block; optional reviewing official sign‑off.

---

## 14) Agentic Workflows (QBit|CODDA)
- **RAG Pipeline:** Service facts + selected branches → retrieve rule snippets + examples → produce section drafts with citations to knowledge store.
- **Evidence Extractor:** Reads uploaded PDFs for charge sheets/separation codes; emits structured fact cards.
- **Neutralizer:** Passes prose through bias guard; updates reasons/bases.
- **Explainer:** Produces a JSON of decision path → rendered as a visual map.

**Prompt Skeletons:**
```yaml
system: |
  You are CODDA, an IDE assistant for VA character-of-discharge decisions. Draft in neutral, precise language.
  Always fill required sections and require explicit handling of insanity and health-care eligibility when bars apply.
user (draft): |
  CONTEXT: {service facts + evidence summaries}
  TASK: Write the {section} using {tone} tone. Provide placeholders for missing facts.
user (rewrite): |
  TASK: Neutralize tone and fix structure; keep facts; return markdown only.
```

---

## 15) Search Recipes (Evidence)
- **Separation Packet:** search eFolder by doc types/codes; keywords: "Chapter", "Other Than Honorable", "BCD", "GCM".
- **Court‑Martial:** keywords: "CM charge sheet", "Findings", "Sentence".
- **AWOL Timeline:** personnel records + unit logs; derive duration; flag thresholds.
- **Mental Health:** STRs; look for contemporaneous evaluations; MH clinic notes near offense dates.
- **Lay/Command Statements:** parse for mitigation/exculpatory content.

---

## 16) Accessibility & Compliance
- WCAG 2.2 AA; full keyboard navigation; high‑contrast mode toggle.
- 508‑ready PDFs (tagged structure, reading order, alt‑text for tables/graphics).
- Immutable audit log of rule choices and IPR steps.

---

## 17) Testing Strategy
- **Unit:** rules parser; lints; PDF renderer.
- **Scenario:** AWOL w/compelling circumstances; OTH in lieu of GCM; BCD; dismissal; uncharacterized void enlistment.
- **Golden Files:** exemplar drafts → exakt byte‑match PDFs.
- **Chaos:** missing documents; conflicting dates; redacted pages.

---

## 18) Deployment & Telemetry
- Feature‑flag in HENRY; progressive rollout by station.
- Metrics: time‑to‑draft, lint error counts, IPR rework rate, PDF export failures, upload latency.
- Crash/trace: editor errors, rule engine mismatches, connector timeouts.

---

## 19) Roadmap
**MVP (6–8 weeks):**
- Template‑locked editor; core clause pack; rule paths for most common bars; IPR Packager; PDF export; Upload Package; analytics baseline.

**V1:**
- Full rule coverage; Explain‑My‑Path map; advanced bias guard; saved views; admin clause manager.

**V2:**
- Case similarity suggestions; cross‑case consistency check; multilingual drafts; collaborative editing.

---

## 20) Link & Doc Directory (placeholders)
- HENRY Knowledge Hub: `henry://knowledge/cfr/3.12`, `henry://knowledge/cfr/3.354`, `henry://knowledge/cfr/3.360`.
- HENRY How‑To: `henry://help/codda/walkthrough`, `henry://help/codda/ipr-packager`.
- Exemplar Decisions: `henry://samples/cod/awol`, `henry://samples/cod/oth-in-lieu-gcm`.
- Forms: `henry://forms/21-0961`.

---

## 21) Admin Console
- Rule versions (publish/diff/rollback).
- Clause library packs (create/edit/deprecate); station defaults.
- Quality dashboards; lint tuning; bias guard thresholds.
- Connector health (eFolder, knowledge index, PDF service).

---

## 22) Acceptance Criteria (Definition of Done)
- Dishonorable outcome cannot finalize without completed IPR checklist.
- Every decision addresses insanity (explicit statement) and health‑care eligibility when a bar applies.
- PDF matches template; all sections present; evidence traceability intact.
- Telemetry shows <15% rework on IPR review after two sprints of tuning.

---

## 23) Starter Artifacts
- **Markdown Template** (drop‑in): ISSUE → EVIDENCE → PERTINENT LAWS/REGS → DECISION → REASONS & BASES → FAVORABLE FINDINGS.
- **Clause JSON** pack seeded with the entries in §10.
- **Rule YAML** stubs for main branches with required questions and toggles.
- **IPR Checklist** JSON for the wizard flow.

---

## 24) Next Steps
1) Approve UX wireframe & color tokens.
2) Seed rule YAML + clause pack; import exemplar decisions.
3) Build editor + lints + PDF; wire IPR Packager.
4) Connect HENRY knowledge index + eFolder search.
5) Pilot with 2–3 processors; capture metrics; iterate.

