import { z } from 'zod';
import {
  Branch,
  DischargeStatus,
  ClaimType,
  ClaimStatus,
  DocumentType,
  EvidenceType,
  EvidenceStatus,
  UserRole,
  Permission
} from '@/types';

export const veteranSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/),
  dateOfBirth: z.date().or(z.string().transform((val) => new Date(val))),
  serviceNumber: z.string().min(1).max(20),
  branch: z.nativeEnum(Branch),
  serviceStartDate: z.date().or(z.string().transform((val) => new Date(val))),
  serviceEndDate: z.date().or(z.string().transform((val) => new Date(val))).nullable(),
  dischargeStatus: z.nativeEnum(DischargeStatus),
  disabilityRating: z.number().min(0).max(100),
  accuracy: z.number().min(0).max(100),
  createdAt: z.date().or(z.string().transform((val) => new Date(val))),
  updatedAt: z.date().or(z.string().transform((val) => new Date(val)))
});

export const createVeteranSchema = veteranSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  accuracy: true
});

export const updateVeteranSchema = veteranSchema.partial().required({
  id: true
});

export const claimSchema = z.object({
  id: z.string().uuid(),
  veteranId: z.string().uuid(),
  claimNumber: z.string().min(1).max(50),
  type: z.nativeEnum(ClaimType),
  status: z.nativeEnum(ClaimStatus),
  filingDate: z.date().or(z.string().transform((val) => new Date(val))),
  lastActionDate: z.date().or(z.string().transform((val) => new Date(val))),
  estimatedCompletionDate: z.date().or(z.string().transform((val) => new Date(val))).nullable(),
  rating: z.number().min(0).max(100).nullable(),
  description: z.string().max(1000)
});

export const createClaimSchema = claimSchema.omit({
  id: true
});

export const documentSchema = z.object({
  id: z.string().uuid(),
  veteranId: z.string().uuid(),
  type: z.nativeEnum(DocumentType),
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  size: z.number().positive(),
  url: z.string().url(),
  uploadedAt: z.date().or(z.string().transform((val) => new Date(val))),
  metadata: z.record(z.any()).optional()
});

export const evidenceSchema = z.object({
  id: z.string().uuid(),
  claimId: z.string().uuid(),
  type: z.nativeEnum(EvidenceType),
  description: z.string().max(500),
  dateSubmitted: z.date().or(z.string().transform((val) => new Date(val))),
  status: z.nativeEnum(EvidenceStatus),
  documentId: z.string().uuid().nullable()
});

export const noteSchema = z.object({
  id: z.string().uuid(),
  claimId: z.string().uuid(),
  content: z.string().min(1).max(5000),
  authorId: z.string().uuid(),
  authorName: z.string().min(1).max(100),
  createdAt: z.date().or(z.string().transform((val) => new Date(val)))
});

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.nativeEnum(UserRole),
  department: z.string().min(1).max(100),
  permissions: z.array(z.nativeEnum(Permission)),
  createdAt: z.date().or(z.string().transform((val) => new Date(val))),
  lastLogin: z.date().or(z.string().transform((val) => new Date(val))).nullable()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100)
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100),
  department: z.string().min(1).max(100)
});

export const vetProfileSyncRequestSchema = z.object({
  veteranId: z.string().uuid(),
  force: z.boolean().optional().default(false),
  fallbackToDD214: z.boolean().optional().default(true)
});

export const vetProfileSyncResponseSchema = z.object({
  success: z.boolean(),
  accuracy: z.number().min(0).max(100),
  dataUpdated: z.boolean(),
  fallbackUsed: z.boolean(),
  syncDate: z.date().or(z.string().transform((val) => new Date(val))),
  errors: z.array(z.string()).optional()
});

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
  filter: z.record(z.any()).optional()
});

export const exportRequestSchema = z.object({
  format: z.enum(['csv', 'xlsx', 'pdf']),
  filters: z.record(z.any()).optional(),
  columns: z.array(z.string()).optional(),
  includeHeaders: z.boolean().default(true)
});

export const bulkOperationSchema = z.object({
  operation: z.enum(['update', 'delete', 'sync']),
  ids: z.array(z.string().uuid()).min(1),
  data: z.record(z.any()).optional()
});

export const reportGenerationSchema = z.object({
  type: z.enum(['claims', 'veterans', 'accuracy', 'performance', 'audit']),
  startDate: z.date().or(z.string().transform((val) => new Date(val))),
  endDate: z.date().or(z.string().transform((val) => new Date(val))),
  format: z.enum(['pdf', 'xlsx']),
  includeCharts: z.boolean().default(true),
  filters: z.record(z.any()).optional()
});

export const webSocketMessageSchema = z.object({
  type: z.enum(['metrics', 'sync_status', 'notification', 'system_health']),
  data: z.any(),
  timestamp: z.date().or(z.string().transform((val) => new Date(val)))
});

export type VeteranInput = z.infer<typeof createVeteranSchema>;
export type VeteranUpdate = z.infer<typeof updateVeteranSchema>;
export type ClaimInput = z.infer<typeof createClaimSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type VetProfileSyncRequest = z.infer<typeof vetProfileSyncRequestSchema>;
export type VetProfileSyncResponse = z.infer<typeof vetProfileSyncResponseSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type ExportRequest = z.infer<typeof exportRequestSchema>;
export type BulkOperation = z.infer<typeof bulkOperationSchema>;
export type ReportGeneration = z.infer<typeof reportGenerationSchema>;
export type WebSocketMessage = z.infer<typeof webSocketMessageSchema>;