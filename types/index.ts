export interface Veteran {
  id: string;
  firstName: string;
  lastName: string;
  ssn: string;
  dateOfBirth: Date;
  serviceNumber: string;
  branch: Branch;
  serviceStartDate: Date;
  serviceEndDate: Date | null;
  dischargeStatus: DischargeStatus;
  disabilityRating: number;
  claims: Claim[];
  documents: Document[];
  vetProfileSyncStatus: VetProfileSyncStatus;
  lastSyncDate: Date | null;
  accuracy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Claim {
  id: string;
  veteranId: string;
  claimNumber: string;
  type: ClaimType;
  status: ClaimStatus;
  filingDate: Date;
  lastActionDate: Date;
  lastAction?: string;
  estimatedCompletionDate?: Date | null;
  estimatedCompletion?: Date;
  rating: number | null;
  description: string;
  evidence: Evidence[];
  notes: Note[];
}

export interface Document {
  id: string;
  veteranId: string;
  type: DocumentType;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
  metadata: Record<string, any>;
}

export interface Evidence {
  id: string;
  claimId: string;
  type: EvidenceType;
  description: string;
  dateSubmitted: Date;
  status: EvidenceStatus;
  documentId: string | null;
}

export interface Note {
  id: string;
  claimId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export interface VetProfileSyncStatus {
  status: 'pending' | 'syncing' | 'success' | 'error' | 'fallback';
  lastSync: Date | null;
  accuracy: number;
  errorMessage: string | null;
  fallbackToDD214: boolean;
  syncAttempts: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  permissions: Permission[];
  createdAt: Date;
  lastLogin: Date | null;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface DashboardMetrics {
  totalVeterans: number;
  activeClaiMs: number;
  averageProcessingTime: number;
  vetProfileAccuracy: number;
  dataAccuracy: number;
  systemHealth: SystemHealth;
  recentActivity: Activity[];
  claimsByStatus: Record<ClaimStatus, number>;
  veteransByBranch: Record<Branch, number>;
}

export interface SystemHealth {
  status: 'operational' | 'degraded' | 'down';
  vetProfileApi: ServiceStatus;
  verificationApi: ServiceStatus;
  profileService: ServiceStatus;
  database: ServiceStatus;
  responseTime: number;
  uptime: number;
}

export interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  responseTime: number;
  lastCheck: Date;
  errorRate: number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: Date;
  userId: string;
  veteranId: string | null;
  metadata: Record<string, any>;
}

export enum Branch {
  ARMY = 'ARMY',
  NAVY = 'NAVY',
  AIR_FORCE = 'AIR_FORCE',
  MARINES = 'MARINES',
  COAST_GUARD = 'COAST_GUARD',
  SPACE_FORCE = 'SPACE_FORCE'
}

export enum DischargeStatus {
  HONORABLE = 'HONORABLE',
  GENERAL = 'GENERAL',
  OTHER_THAN_HONORABLE = 'OTHER_THAN_HONORABLE',
  BAD_CONDUCT = 'BAD_CONDUCT',
  DISHONORABLE = 'DISHONORABLE',
  UNCHARACTERIZED = 'UNCHARACTERIZED'
}

export enum ClaimType {
  DISABILITY = 'DISABILITY',
  PENSION = 'PENSION',
  COMPENSATION = 'COMPENSATION',
  EDUCATION = 'EDUCATION',
  HEALTHCARE = 'HEALTHCARE',
  BURIAL = 'BURIAL',
  INSURANCE = 'INSURANCE'
}

export enum ClaimStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  GATHERING_EVIDENCE = 'GATHERING_EVIDENCE',
  PENDING_DECISION = 'PENDING_DECISION',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  APPEALED = 'APPEALED'
}

export enum DocumentType {
  DD214 = 'DD214',
  MEDICAL_RECORD = 'MEDICAL_RECORD',
  SERVICE_RECORD = 'SERVICE_RECORD',
  CLAIM_FORM = 'CLAIM_FORM',
  EVIDENCE = 'EVIDENCE',
  CORRESPONDENCE = 'CORRESPONDENCE',
  OTHER = 'OTHER'
}

export enum EvidenceType {
  MEDICAL = 'MEDICAL',
  SERVICE = 'SERVICE',
  LAY_STATEMENT = 'LAY_STATEMENT',
  EXPERT_OPINION = 'EXPERT_OPINION',
  OTHER = 'OTHER'
}

export enum EvidenceStatus {
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  ANALYST = 'ANALYST',
  VIEWER = 'VIEWER'
}

export enum Permission {
  VIEW_VETERANS = 'VIEW_VETERANS',
  EDIT_VETERANS = 'EDIT_VETERANS',
  DELETE_VETERANS = 'DELETE_VETERANS',
  VIEW_CLAIMS = 'VIEW_CLAIMS',
  EDIT_CLAIMS = 'EDIT_CLAIMS',
  APPROVE_CLAIMS = 'APPROVE_CLAIMS',
  SYNC_VET_PROFILE = 'SYNC_VET_PROFILE',
  GENERATE_REPORTS = 'GENERATE_REPORTS',
  MANAGE_USERS = 'MANAGE_USERS',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  EXPORT_DATA = 'EXPORT_DATA'
}

export enum ActivityType {
  VETERAN_CREATED = 'VETERAN_CREATED',
  VETERAN_UPDATED = 'VETERAN_UPDATED',
  CLAIM_SUBMITTED = 'CLAIM_SUBMITTED',
  CLAIM_UPDATED = 'CLAIM_UPDATED',
  CLAIM_APPROVED = 'CLAIM_APPROVED',
  CLAIM_DENIED = 'CLAIM_DENIED',
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  VET_PROFILE_SYNC = 'VET_PROFILE_SYNC',
  DD214_FALLBACK = 'DD214_FALLBACK',
  USER_LOGIN = 'USER_LOGIN',
  REPORT_GENERATED = 'REPORT_GENERATED'
}

export interface GridColumn {
  id: string;
  header: string;
  accessor: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  pinned?: 'left' | 'right' | null;
  visible?: boolean;
  cellRenderer?: (value: any, row: any) => React.ReactNode;
  headerRenderer?: () => React.ReactNode;
}

export interface GridOptions {
  columns: GridColumn[];
  data: any[];
  pageSize?: number;
  virtualScrolling?: boolean;
  rowSelection?: boolean;
  columnReordering?: boolean;
  columnResizing?: boolean;
  sorting?: boolean;
  filtering?: boolean;
  grouping?: boolean;
  exporting?: boolean;
  onRowClick?: (row: any) => void;
  onSelectionChange?: (selectedRows: any[]) => void;
}