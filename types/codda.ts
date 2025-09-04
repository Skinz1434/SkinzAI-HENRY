// CODDA (Character-of-Discharge Determination Assistant) Types
// Based on specification v1.0

export type ServiceBranch = 'ARMY' | 'NAVY' | 'AIR_FORCE' | 'MARINES' | 'SPACE_FORCE' | 'COAST_GUARD' | 'PUBLIC_HEALTH_SERVICE' | 'NOAA';

export type CharacterOfDischarge = 'HON' | 'GEN' | 'OTH' | 'BCD' | 'DD' | 'UNCHAR' | 'DISMISSAL';

export type EvidenceKind = 'STR' | 'SPR' | 'ChargeSheet' | 'CourtMartial' | 'SeparationPacket' | 'Lay' | 'Treatment' | 'Other';

export type EvidenceSource = 'eFolder' | 'HENRY' | 'Upload' | 'External';

export type EvidenceReliability = 'high' | 'medium' | 'low';

export type IPRStatus = 'pending' | 'submitted' | 'cleared';

export interface ServicePeriod {
  id: string;
  branch: ServiceBranch;
  start: string;
  end: string;
  charOfDischarge: CharacterOfDischarge;
  notes?: string;
}

export interface EvidenceItem {
  id: string;
  kind: EvidenceKind;
  title: string;
  date?: string;
  source: EvidenceSource;
  reliability: EvidenceReliability;
  url?: string;
  summary?: string;
  tags?: string[];
  isGap?: boolean; // Indicates missing evidence
}

export interface RulePath {
  id: string;
  label: string;
  branches: string[]; // e.g., ['3.12(d)(1)','3.354','3.360']
  requiresInsanityCheck?: boolean;
  requiresCompellingCircumstances?: boolean;
  description?: string;
}

export interface Finding {
  insanityConsidered: boolean;
  insanityApplies?: boolean;
  rationaleInsanity?: string;
  compellingCircumstancesConsidered?: boolean;
  compellingRationale?: string;
  barMet?: boolean;
  healthcareOnlyConsidered?: boolean;
  healthcareOnlyRationale?: string;
}

export interface Decision {
  issue: string;
  evidenceIds: string[];
  regs: string[];
  decisionText: string;
  reasonsBases: string;
  favorableFindings?: string[];
  lastModified?: string;
}

export interface IPRChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
}

export interface IPRPacket {
  required: boolean;
  draftDocId?: string;
  form210961Id?: string;
  specialIssueApplied?: boolean;
  trackedItemId?: string;
  suspenseDate?: string;
  status: IPRStatus;
  completionChecklist?: IPRChecklistItem[];
}

export interface LintFlag {
  id: string;
  type: 'error' | 'warning' | 'info';
  section: string;
  message: string;
  suggestion?: string;
  line?: number;
}

export interface QualityAssurance {
  completeness: number; // 0-100
  lintFlags: LintFlag[];
  templateFidelity: boolean;
  regCompleteness: boolean;
  toneLint: string[];
  evidenceTraceability: boolean;
  iprEnforcement: boolean;
  biasScore: number; // 0-100, lower is better
  lastRun?: string;
}

export interface CODCase {
  id: string;
  fileNumber: string;
  claimant: string;
  station: string;
  service: ServicePeriod[];
  evidence: EvidenceItem[];
  rulePath?: RulePath;
  finding: Finding;
  decision: Decision;
  ipr: IPRPacket;
  qa: QualityAssurance;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'review' | 'completed' | 'cancelled';
  assignedTo?: string;
  dueDate?: string;
}

// Clause Library Types
export interface ClauseParameter {
  name: string;
  type: 'string' | 'date' | 'number' | 'select';
  required: boolean;
  options?: string[];
  defaultValue?: string;
}

export interface ClauseTemplate {
  id: string;
  category: 'issue' | 'evidence' | 'insanity' | 'compelling' | 'bar' | 'healthcare' | 'decision' | 'favorable';
  title: string;
  template: string;
  parameters: ClauseParameter[];
  tone: 'neutral' | 'clinical' | 'warm';
  tags: string[];
}

export interface ClausePack {
  id: string;
  name: string;
  description: string;
  clauses: ClauseTemplate[];
  isDefault: boolean;
  stationSpecific?: string;
}

// User Settings Types
export interface CODDASettings {
  theme: 'dark' | 'light';
  editorDensity: 'compact' | 'comfortable';
  persona: 'plain' | 'clinical' | 'warm';
  snippetPacks: string[];
  shortcuts: Record<string, string>;
  showSidePanels: boolean;
  rulerGuide: boolean;
  distractionFreeMode: boolean;
  autoSave: boolean;
  showLineNumbers: boolean;
  wordWrap: boolean;
}

// Chat/Agent Types
export interface CODDASuggestion {
  type: 'clause' | 'evidence' | 'rule' | 'action';
  title: string;
  content: string;
  action?: () => void;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  context?: {
    caseId?: string;
    section?: string;
    evidenceIds?: string[];
  };
  suggestions?: CODDASuggestion[];
}

export interface AgentContext {
  caseId: string;
  serviceFacts: string[];
  evidenceSummaries: string[];
  selectedBranches: string[];
  currentSection?: string;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  type: 'case' | 'service-period' | 'rule-tree' | 'task' | 'ipr' | 'export';
  children?: NavigationItem[];
  status?: 'pending' | 'in-progress' | 'completed' | 'error';
  metadata?: Record<string, any>;
}

// Draft Document Types
export interface DraftSection {
  id: string;
  title: string;
  content: string;
  required: boolean;
  completed: boolean;
  lintFlags: string[];
  evidenceLinks: string[];
}

export interface DraftDocument {
  id: string;
  caseId: string;
  sections: DraftSection[];
  completeness: number;
  lastSaved: string;
  version: number;
}

// API Response Types
export interface CODDAApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface EvidenceGapScanResult {
  detectedGaps: EvidenceItem[];
  recommendations: string[];
  completeness: number;
}

export interface RulePathSuggestion {
  rulePath: RulePath;
  confidence: number;
  reasoning: string;
}

export interface BiasIssue {
  section: string;
  text: string;
  type: 'subjective' | 'adversarial' | 'conclusory';
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface BiasAnalysisResult {
  overallScore: number;
  issues: BiasIssue[];
  suggestions: string[];
}

// Export and PDF Types
export interface PDFExportOptions {
  includeEvidence: boolean;
  includeSignatureBlock: boolean;
  watermark?: string;
  officialFormat: boolean;
}

export interface UploadPackage {
  pdfUrl: string;
  indexSheetUrl: string;
  documentType: string;
  contentions: string[];
  fileNumber: string;
}

// Audit and Telemetry
export interface CODDAAuditEvent {
  id: string;
  caseId: string;
  userId: string;
  action: string;
  timestamp: string;
  details: Record<string, any>;
}

export interface CODDAMetrics {
  avgDraftTime: number;
  lintErrorRate: number;
  iprReworkRate: number;
  pdfExportSuccessRate: number;
  userSatisfactionScore: number;
}