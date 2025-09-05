// Temporary constants file to resolve build issues
// These should match the types in @/types/index.ts

export const BRANCHES = {
  ARMY: 'ARMY',
  NAVY: 'NAVY',
  AIR_FORCE: 'AIR_FORCE',
  MARINES: 'MARINES',
  COAST_GUARD: 'COAST_GUARD',
  SPACE_FORCE: 'SPACE_FORCE'
} as const;

export const DISCHARGE_STATUSES = {
  HONORABLE: 'HONORABLE',
  GENERAL: 'GENERAL',
  OTHER_THAN_HONORABLE: 'OTHER_THAN_HONORABLE',
  BAD_CONDUCT: 'BAD_CONDUCT',
  DISHONORABLE: 'DISHONORABLE',
  ENTRY_LEVEL_SEPARATION: 'ENTRY_LEVEL_SEPARATION',
  MEDICAL: 'MEDICAL'
} as const;

export type BranchType = typeof BRANCHES[keyof typeof BRANCHES];
export type DischargeStatusType = typeof DISCHARGE_STATUSES[keyof typeof DISCHARGE_STATUSES];