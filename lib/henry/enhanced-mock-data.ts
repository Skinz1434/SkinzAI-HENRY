/**
 * Enhanced Mock Data Generator
 * Uses VA rating calculator and existing infrastructure for realistic veteran data
 */

import { Veteran, Claim, Branch, DischargeStatus, ClaimType, ClaimStatus } from '@/types';
import { getRankForBranch } from './military-data';
import { generateVeteranDetails } from './veteran-details';
import { 
  calculateCombinedRating, 
  generateRealisticConditions, 
  calculateTotalRating,
  validateVARating,
  VA_CONDITIONS 
} from './va-rating-calculator';

// Use existing EDIPI generator
function generateEDIPI(): string {
  const prefix = Math.random() < 0.8 ? '1' : '2';
  const remaining = Math.floor(Math.random() * 900000000) + 100000000;
  return prefix + remaining.toString();
}

/**
 * Enhanced veteran generator with realistic VA ratings and conditions
 */
export function generateEnhancedMockVeterans(count: number = 100): Veteran[] {
  const maleFirstNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher'];
  const femaleFirstNames = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const veterans: Veteran[] = [];
  
  console.log(`🔧 Enhanced Mock Data Generator v2.1: Creating ${count} veterans with proper VA ratings`);
  
  for (let i = 0; i < count; i++) {
    // Gender distribution (15% female veterans)
    const isFemale = Math.random() < 0.15;
    const firstName = isFemale 
      ? femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)]
      : maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Service era
    const eraRandom = Math.random();
    let serviceStartYear: number;
    let serviceEra: string;
    
    if (eraRandom < 0.1) {
      serviceStartYear = 1965 + Math.floor(Math.random() * 10);
      serviceEra = 'Vietnam';
    } else if (eraRandom < 0.3) {
      serviceStartYear = 1975 + Math.floor(Math.random() * 15);
      serviceEra = 'Post-Vietnam';
    } else if (eraRandom < 0.5) {
      serviceStartYear = 1990 + Math.floor(Math.random() * 10);
      serviceEra = 'Gulf War';
    } else {
      serviceStartYear = 2000 + Math.floor(Math.random() * 24);
      serviceEra = 'OIF/OEF';
    }
    
    const serviceYears = Math.random() < 0.4 ? (2 + Math.floor(Math.random() * 4)) : (4 + Math.floor(Math.random() * 16));
    const branch = Object.values(Branch)[Math.floor(Math.random() * Object.values(Branch).length)];
    const isOfficer = Math.random() < 0.2; // 20% chance of being an officer
    const rank = getRankForBranch(branch, isOfficer);
    
    // Combat service probability based on era and branch
    const combatService = (serviceEra === 'OIF/OEF' && Math.random() > 0.3) ||
                         (serviceEra === 'Gulf War' && Math.random() > 0.5) ||
                         (serviceEra === 'Vietnam' && Math.random() > 0.4);
    
    // Discharge status (85% honorable)
    const dischargeRandom = Math.random();
    let dischargeStatus: DischargeStatus;
    let eligibleForBenefits = true;
    
    if (dischargeRandom < 0.85) {
      dischargeStatus = DischargeStatus.HONORABLE;
    } else if (dischargeRandom < 0.95) {
      dischargeStatus = DischargeStatus.GENERAL;
    } else {
      dischargeStatus = DischargeStatus.OTHER_THAN_HONORABLE;
      eligibleForBenefits = false;
    }
    
    // Generate realistic conditions and calculate combined rating
    let conditions: any[] = [];
    let disabilityRating = 0;
    let claims: Claim[] = [];
    
    if (eligibleForBenefits) {
      // Generate conditions based on service
      conditions = generateRealisticConditions(serviceEra, combatService, branch);
      
      // Calculate actual combined rating using VA formula
      disabilityRating = validateVARating(calculateTotalRating(conditions));
      
      // Double-check: if we somehow still have an invalid rating, force it to valid
      if (disabilityRating % 10 !== 0) {
        console.warn(`Invalid VA rating detected: ${disabilityRating}%, fixing to ${validateVARating(disabilityRating)}%`);
        disabilityRating = validateVARating(disabilityRating);
      }
      
      // Generate claims from conditions
      claims = conditions.map((condition, idx) => ({
        id: `claim-${i}-${idx}`,
        veteranId: `vet-${i + 1}`,
        claimNumber: `${600000000 + i * 100 + idx}`,
        type: ClaimType.COMPENSATION,
        status: Math.random() > 0.2 ? ClaimStatus.APPROVED : ClaimStatus.PENDING,
        description: condition.name,
        filingDate: new Date(serviceStartYear + serviceYears, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        decisionDate: Math.random() > 0.3 ? new Date() : undefined,
        rating: condition.rating,
        effectiveDate: new Date(serviceStartYear + serviceYears, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        lastUpdated: new Date(),
        lastActionDate: new Date(),
        notes: [],
        documents: [],
        evidence: [] // Fix: evidence should be an array, not an object
      }));
    }
    
    const fullName = `${firstName} ${lastName}`;
    
    // Calculate monthly compensation based on actual VA rates (2024)  
    const dependents = Math.floor(Math.random() * 3);
    const monthlyCompensation = calculateMonthlyCompensation(disabilityRating, dependents);
    
    // Risk score calculation based on conditions
    let riskScore = calculateRiskScore(conditions, disabilityRating);
    let riskLevel: 'Minimal' | 'Low' | 'Moderate' | 'High' | 'Immediate';
    
    if (riskScore >= 85) riskLevel = 'Immediate';
    else if (riskScore >= 70) riskLevel = 'High';
    else if (riskScore >= 50) riskLevel = 'Moderate';
    else if (riskScore >= 25) riskLevel = 'Low';
    else riskLevel = 'Minimal';
    const dateOfBirth = new Date(1950 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));
    
    // Create veteran object
    const veteran: Veteran = {
      id: `vet-${i + 1}`,
      // Personal Information
      firstName,
      lastName,
      name: fullName,
      ssn: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000) + 1000}`,
      edipi: generateEDIPI(),
      dateOfBirth,
      gender: isFemale ? 'Female' : 'Male',
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      
      // Service Information
      branch,
      rank: typeof rank === 'string' ? rank : rank.rank,
      serviceStartDate: new Date(serviceStartYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      serviceEndDate: new Date(serviceStartYear + serviceYears, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      dischargeStatus,
      combatService,
      
      // Benefits
      disabilityRating,
      monthlyCompensation,
      enrolledVaHealthcare: eligibleForBenefits && (disabilityRating >= 50 || Math.random() > 0.3),
      
      // Risk Assessment
      riskScore,
      riskLevel,
      
      // Sync Information
      syncStatus: 'success',
      syncStatusDetails: {
        mpr: { status: 'success', lastSync: new Date(), accuracy: 99, errorMessage: null },
        mpd: { status: 'success', lastSync: new Date(), accuracy: 98, errorMessage: null },
        vbms: { status: 'success', lastSync: new Date(), accuracy: 97, errorMessage: null },
        cdw: { status: 'success', lastSync: new Date(), accuracy: 96, errorMessage: null }
      },
      lastSyncDate: new Date(),
      accuracy: 95 + Math.random() * 5,
      syncAccuracy: 95 + Math.random() * 5,
      fallbackToDD214: false,
      syncAttempts: 1,
      
      // Income
      incomeVaDisability: monthlyCompensation,
      incomeSsdi: disabilityRating === 100 ? Math.floor(Math.random() * 1500) + 1000 : 0,
      incomePension: 0,
      incomeEmployment: disabilityRating < 100 ? Math.floor(Math.random() * 3000) + 2000 : 0,
      
      // Family
      dependents: Math.floor(Math.random() * 3),
      
      // Related Data
      claims,
      documents: [],
      conditions: conditions.map(c => ({
        ...c,
        veteranId: `vet-${i + 1}`,
        id: `cond-${i}-${c.name}`,
        dateOfDiagnosis: new Date(serviceStartYear + serviceYears - Math.floor(Math.random() * 2), 
                                  Math.floor(Math.random() * 12), 
                                  Math.floor(Math.random() * 28)),
        lastTreated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      })),
      
      // Metadata
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      profileCompleteness: conditions.length > 0 ? 85 + Math.floor(Math.random() * 15) : 70 + Math.floor(Math.random() * 15)
    };
    
    veterans.push(veteran);
    
    // Debug first few veterans
    if (i < 3) {
      console.log(`👤 Veteran ${i + 1}: ${veteran.name} - Rating: ${veteran.disabilityRating}% - Conditions: ${veteran.conditions?.length || 0}`);
    }
  }
  
  const invalidRatings = veterans.filter(v => v.disabilityRating % 10 !== 0);
  if (invalidRatings.length > 0) {
    console.error(`❌ Found ${invalidRatings.length} veterans with invalid ratings:`, 
      invalidRatings.map(v => `${v.name}: ${v.disabilityRating}%`));
  } else {
    console.log(`✅ All ${veterans.length} veterans have valid VA ratings (10% increments)`);
  }
  
  return veterans;
}

/**
 * Calculate monthly VA compensation based on 2024 rates
 */
function calculateMonthlyCompensation(rating: number, dependents: number = 0): number {
  // 2024 VA Compensation Rates (veteran with spouse, no children)
  const baseRates: { [key: number]: number } = {
    0: 0,
    10: 171,
    20: 338,
    30: 524,
    40: 755,
    50: 1075,
    60: 1361,
    70: 1716,
    80: 1995,
    90: 2241,
    100: 3737
  };
  
  const dependentAddition = dependents * 50; // Simplified
  return (baseRates[rating] || 0) + dependentAddition;
}

/**
 * Calculate risk score based on conditions
 */
function calculateRiskScore(conditions: any[], disabilityRating: number): number {
  let score = Math.min(disabilityRating, 50); // Base from disability
  
  // Add risk for specific conditions
  conditions.forEach(condition => {
    if (condition.name.includes('PTSD') || condition.name.includes('TBI')) {
      score += 20;
    }
    if (condition.name.includes('Depression') || condition.name.includes('Anxiety')) {
      score += 15;
    }
    if (condition.rating >= 50) {
      score += 10;
    }
  });
  
  // Add random variation
  score += Math.floor(Math.random() * 20) - 10;
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate VA Priority Group
 */
function calculatePriorityGroup(disabilityRating: number, combatService: boolean): number {
  if (disabilityRating >= 50) return 1;
  if (disabilityRating >= 30) return 2;
  if (disabilityRating >= 10) return 3;
  if (combatService) return 6;
  return 7;
}

/**
 * Generate realistic unit names
 */
function generateUnit(branch: string): string {
  const units: { [key: string]: string[] } = {
    [Branch.ARMY]: ['1st Infantry Division', '82nd Airborne', '101st Airborne', '3rd Infantry Division', '10th Mountain Division'],
    [Branch.NAVY]: ['USS Enterprise', 'USS Nimitz', 'SEAL Team 3', 'USS George Washington', 'Naval Station Norfolk'],
    [Branch.AIR_FORCE]: ['1st Fighter Wing', '509th Bomb Wing', '355th Fighter Wing', '15th Wing', '18th Wing'],
    [Branch.MARINES]: ['1st Marine Division', '2nd Marine Division', '3rd Marine Division', 'I MEF', 'II MEF'],
    [Branch.COAST_GUARD]: ['USCGC Hamilton', 'Sector New York', 'District 7', 'Air Station Miami', 'USCGC Bertholf'],
    [Branch.SPACE_FORCE]: ['Space Delta 1', 'Space Delta 2', 'Space Operations Command', 'Space Systems Command']
  };
  
  const branchUnits = units[branch] || units[Branch.ARMY];
  return branchUnits[Math.floor(Math.random() * branchUnits.length)];
}

/**
 * Export functions to integrate with existing infrastructure
 */
export async function generateVeteranWithMedicalRecords(veteranBase: Veteran) {
  // This can be expanded to use OpenAI API for generating detailed narratives
  const details = generateVeteranDetails(veteranBase);
  
  // Add medical narratives to conditions
  if (veteranBase.conditions) {
    veteranBase.conditions = veteranBase.conditions.map(condition => ({
      ...condition,
      medicalNarrative: generateMedicalNarrative(condition),
      lastExamFindings: generateExamFindings(condition)
    }));
  }
  
  return { ...veteranBase, details };
}

function generateMedicalNarrative(condition: any): string {
  // These can be enhanced with OpenAI API calls when needed
  const narratives: { [key: string]: string } = {
    'PTSD': `Veteran experiences persistent re-experiencing of traumatic events through nightmares and flashbacks. 
             Demonstrates avoidance of trauma-related stimuli and significant alterations in mood and cognition. 
             Hyperarousal symptoms include hypervigilance and exaggerated startle response.`,
    'Lumbar Strain': `Chronic lower back pain with radiation to bilateral lower extremities. 
                      Pain increases with prolonged standing, walking, and lifting. 
                      MRI shows degenerative disc disease at L4-L5 and L5-S1 with mild canal stenosis.`,
    'Tinnitus': `Constant bilateral tinnitus described as high-pitched ringing. 
                 Onset during military service with exposure to aircraft engines and weapons fire. 
                 Significantly impacts sleep and concentration.`
  };
  
  for (const [key, value] of Object.entries(narratives)) {
    if (condition.name.includes(key)) return value;
  }
  
  return `Service-connected condition with ongoing symptoms requiring regular treatment and monitoring.`;
}

function generateExamFindings(condition: any): string {
  const findings: { [key: string]: string } = {
    'PTSD': 'PHQ-9 score: 18/27 (moderately severe). PCL-5 score: 48/80. GAD-7: 14/21.',
    'Lumbar Strain': 'Flexion 45 degrees (pain at endpoint), Extension 15 degrees, Lateral flexion 20 degrees bilaterally.',
    'Knee': 'Flexion 90 degrees with pain, Extension lacking 10 degrees, Moderate effusion present, McMurray test positive.',
    'Tinnitus': 'Audiometry shows mild high-frequency hearing loss bilaterally. Tinnitus matching at 4000 Hz.'
  };
  
  for (const [key, value] of Object.entries(findings)) {
    if (condition.name.includes(key)) return value;
  }
  
  return 'Physical examination findings consistent with diagnosed condition.';
}

// Export the main function as default
export default generateEnhancedMockVeterans;