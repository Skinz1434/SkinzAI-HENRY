/**
 * Veteran Data Version Control
 * Increment this version to force regeneration of all veteran data
 */

export const VETERAN_DATA_VERSION = '2.1.0-fixed-ratings';
export const LAST_UPDATED = '2025-09-04T15:30:00Z';

export const VERSION_CHANGES = {
  '2.1.0-fixed-ratings': [
    'Fixed VA ratings to proper 10% increments only',
    'Eliminated invalid percentages like 81%, 67%, 53%', 
    'Added bilateral factor rounding corrections',
    'Ensured all conditions have minimum 10% ratings',
    'Added validation for all generated ratings'
  ],
  '2.0.0-enhanced': [
    'Implemented actual VA combined ratings table',
    'Added realistic condition patterns based on service',
    'Created medical record generation',
    'Added service connection logic'
  ]
};

export function isDataUpToDate(currentVersion?: string): boolean {
  return currentVersion === VETERAN_DATA_VERSION;
}

export function getLatestVersionInfo() {
  return {
    version: VETERAN_DATA_VERSION,
    lastUpdated: LAST_UPDATED,
    changes: VERSION_CHANGES[VETERAN_DATA_VERSION as keyof typeof VERSION_CHANGES] || []
  };
}