/**
 * Comprehensive Medical Record Generator for Veterans
 * Generates realistic medical documentation including STRs, C&P exams, and treatment records
 */

import { Veteran } from '@/types';

export interface MedicalRecord {
  id: string;
  veteranId: string;
  type: 'STR' | 'C&P' | 'VA_TREATMENT' | 'PRIVATE' | 'LAB' | 'IMAGING';
  date: Date;
  provider: string;
  facility: string;
  content: {
    chiefComplaint?: string;
    history?: string;
    examination?: string;
    assessment?: string;
    plan?: string;
    medications?: Medication[];
    labResults?: LabResult[];
    imagingResults?: ImagingResult[];
    vitalSigns?: VitalSigns;
  };
  diagnoses: Diagnosis[];
  procedureCodes?: string[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  prescriber: string;
  indication: string;
  status: 'active' | 'discontinued' | 'completed';
}

export interface LabResult {
  test: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  flag?: 'H' | 'L' | 'C'; // High, Low, Critical
  date: Date;
}

export interface ImagingResult {
  modality: 'XR' | 'CT' | 'MRI' | 'US';
  bodyPart: string;
  findings: string;
  impression: string;
  date: Date;
  radiologist: string;
}

export interface VitalSigns {
  bloodPressure: string;
  pulse: number;
  temperature: number;
  respirations: number;
  oxygenSaturation: number;
  height: string;
  weight: number;
  bmi: number;
  pain: number; // 0-10 scale
}

export interface Diagnosis {
  icd10: string;
  description: string;
  dateOfOnset?: Date;
  severity?: 'mild' | 'moderate' | 'severe';
  status: 'active' | 'resolved' | 'chronic';
}

export interface CPExamResult {
  examDate: Date;
  examiner: string;
  examinerCredentials: string;
  claimCondition: string;
  dbqType: string;
  
  // Medical Opinion
  opinion: {
    serviceConnection: 'direct' | 'secondary' | 'aggravation' | 'none';
    nexusStatement: string;
    rationaleBasis: string[];
    conflictingEvidence?: string[];
    probability: 'at least as likely as not' | 'more likely than not' | 'less likely than not';
  };
  
  // Functional Impact
  functionalImpact: {
    workImpact: string;
    adlImpact: string; // Activities of Daily Living
    socialImpact: string;
    flareUps?: {
      frequency: string;
      duration: string;
      severity: string;
      functionalLoss: string;
    };
  };
  
  // Specific measurements
  measurements?: {
    rangeOfMotion?: { [joint: string]: RangeOfMotion };
    strengthTesting?: { [muscle: string]: string }; // 0-5 scale
    sensoryExam?: { [area: string]: string };
    reflexes?: { [reflex: string]: string }; // 0-4+ scale
  };
  
  // Mental Health specific
  mentalHealthExam?: {
    gaf?: number; // Global Assessment of Functioning
    symptoms: string[];
    occupationalImpairment: string;
    socialImpairment: string;
    suicidalIdeation: boolean;
    homicidalIdeation: boolean;
    hospitalizationHistory: string[];
  };
}

export interface RangeOfMotion {
  flexion: number;
  extension: number;
  lateralFlexion?: { right: number; left: number };
  rotation?: { right: number; left: number };
  abduction?: number;
  adduction?: number;
  painOnMotion: boolean;
  additionalLossOnRepetition: number;
}

export interface ServiceTreatmentRecord {
  date: Date;
  location: string;
  unit: string;
  provider: string;
  type: 'sick_call' | 'annual_exam' | 'deployment_health' | 'separation_exam' | 'combat_injury';
  content: string;
  diagnoses: string[];
  medications?: string[];
  profiles?: MilitaryProfile[];
  lineOfDuty?: 'yes' | 'no' | 'pending';
}

export interface MilitaryProfile {
  code: string; // L2, L3, P2, etc.
  description: string;
  startDate: Date;
  endDate?: Date;
  limitations: string[];
}

/**
 * VA Medical Facilities
 */
const VA_FACILITIES = [
  'Washington DC VA Medical Center',
  'Atlanta VA Medical Center',
  'San Diego VA Healthcare System',
  'Miami VA Healthcare System',
  'Phoenix VA Health Care System',
  'Boston VA Healthcare System',
  'Chicago VA Medical Center',
  'Houston VA Medical Center',
  'Los Angeles VA Medical Center',
  'New York Harbor VA'
];

/**
 * Common VA Providers
 */
const VA_PROVIDERS = {
  primaryCare: ['Dr. Johnson, MD', 'Dr. Smith, MD', 'Dr. Williams, MD', 'Dr. Brown, MD'],
  mentalHealth: ['Dr. Davis, PhD', 'Dr. Miller, LCSW', 'Dr. Wilson, PsyD', 'Dr. Anderson, MD'],
  orthopedics: ['Dr. Martinez, MD', 'Dr. Garcia, MD', 'Dr. Rodriguez, MD'],
  neurology: ['Dr. Lee, MD', 'Dr. Chen, MD', 'Dr. Kim, MD'],
  rheumatology: ['Dr. Patel, MD', 'Dr. Singh, MD', 'Dr. Sharma, MD']
};

/**
 * Generate Service Treatment Records
 */
export function generateSTRs(veteran: Veteran, conditions: any[]): ServiceTreatmentRecord[] {
  const records: ServiceTreatmentRecord[] = [];
  const serviceYears = new Date(veteran.serviceEndDate || new Date()).getFullYear() - 
                       new Date(veteran.serviceStartDate).getFullYear();
  
  // Annual exams
  for (let i = 0; i < serviceYears; i++) {
    const examDate = new Date(veteran.serviceStartDate);
    examDate.setFullYear(examDate.getFullYear() + i);
    
    records.push({
      date: examDate,
      location: `${veteran.branch} Medical Clinic`,
      unit: '1st Battalion', // Default unit since not in Veteran interface
      provider: 'Military Medical Officer',
      type: 'annual_exam',
      content: `Annual Periodic Health Assessment. Service member in good general health. 
                No significant concerns reported. Fit for duty.`,
      diagnoses: [],
      medications: []
    });
  }
  
  // Add condition-specific sick calls
  conditions.forEach(condition => {
    const onsetDate = new Date(veteran.serviceStartDate);
    onsetDate.setMonth(onsetDate.getMonth() + Math.floor(Math.random() * 24));
    
    records.push({
      date: onsetDate,
      location: `${veteran.branch} Medical Clinic`,
      unit: '1st Battalion', // Default unit since not in Veteran interface
      provider: 'PA Johnson',
      type: 'sick_call',
      content: generateSickCallNote(condition.name),
      diagnoses: [condition.name],
      medications: generateMedicationsForCondition(condition.name),
      profiles: condition.name.includes('Knee') || condition.name.includes('Back') ? 
        [{
          code: 'L3',
          description: 'No running, jumping, marching',
          startDate: onsetDate,
          endDate: new Date(onsetDate.getTime() + 30 * 24 * 60 * 60 * 1000),
          limitations: ['No PT', 'No ruck marches', 'No prolonged standing']
        }] : undefined,
      lineOfDuty: 'yes'
    });
  });
  
  // Separation exam
  records.push({
    date: new Date(veteran.serviceEndDate || new Date()),
    location: `${veteran.branch} Medical Center`,
    unit: '1st Battalion', // Default unit since not in Veteran interface
    provider: 'Dr. Thompson, MD',
    type: 'separation_exam',
    content: `Separation Health Assessment completed. Member reports: ${conditions.map(c => c.name).join(', ')}. 
              Referred to VA for disability evaluation.`,
    diagnoses: conditions.map(c => c.name),
    medications: []
  });
  
  return records;
}

/**
 * Generate C&P Exam Results
 */
export function generateCPExam(veteran: Veteran, condition: any): CPExamResult {
  const examDate = new Date();
  examDate.setMonth(examDate.getMonth() - Math.floor(Math.random() * 6));
  
  const exam: CPExamResult = {
    examDate,
    examiner: VA_PROVIDERS.primaryCare[Math.floor(Math.random() * VA_PROVIDERS.primaryCare.length)],
    examinerCredentials: 'MD, Board Certified Internal Medicine',
    claimCondition: condition.name,
    dbqType: condition.dbq,
    
    opinion: {
      serviceConnection: 'direct',
      nexusStatement: generateNexusStatement(condition.name, veteran),
      rationaleBasis: generateRationaleBasis(condition.name),
      probability: 'at least as likely as not'
    },
    
    functionalImpact: {
      workImpact: generateWorkImpact(condition.rating),
      adlImpact: generateADLImpact(condition.rating),
      socialImpact: generateSocialImpact(condition.rating)
    }
  };
  
  // Add condition-specific measurements
  if (condition.name.includes('Knee') || condition.name.includes('Back') || condition.name.includes('Shoulder')) {
    exam.measurements = {
      rangeOfMotion: generateROMForCondition(condition.name, condition.rating)
    };
    
    exam.functionalImpact.flareUps = {
      frequency: '2-3 times per week',
      duration: '2-4 hours',
      severity: '7/10 pain',
      functionalLoss: '20% additional loss of motion during flare-ups'
    };
  }
  
  // Add mental health specific data
  if (condition.name === 'PTSD' || condition.name.includes('Depression') || condition.name.includes('Anxiety')) {
    exam.mentalHealthExam = {
      gaf: 100 - condition.rating + Math.floor(Math.random() * 10),
      symptoms: generateMentalHealthSymptoms(condition.rating),
      occupationalImpairment: generateOccupationalImpairment(condition.rating),
      socialImpairment: generateSocialImpact(condition.rating),
      suicidalIdeation: condition.rating >= 70,
      homicidalIdeation: false,
      hospitalizationHistory: condition.rating >= 50 ? ['VA Psychiatric Ward - 3 days, 2023'] : []
    };
  }
  
  return exam;
}

/**
 * Generate VA Treatment Records
 */
export function generateVATreatmentRecords(veteran: Veteran, conditions: any[]): MedicalRecord[] {
  const records: MedicalRecord[] = [];
  const currentDate = new Date();
  
  conditions.forEach((condition, index) => {
    // Generate 3-5 treatment records per condition
    const recordCount = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < recordCount; i++) {
      const recordDate = new Date(currentDate);
      recordDate.setMonth(recordDate.getMonth() - (i * 3)); // Every 3 months
      
      const provider = getProviderForCondition(condition.name);
      
      records.push({
        id: `med-rec-${veteran.id}-${index}-${i}`,
        veteranId: veteran.id,
        type: 'VA_TREATMENT',
        date: recordDate,
        provider: provider,
        facility: VA_FACILITIES[Math.floor(Math.random() * VA_FACILITIES.length)],
        content: {
          chiefComplaint: generateChiefComplaint(condition.name),
          history: generateHistoryOfPresentIllness(condition.name, veteran),
          examination: generatePhysicalExam(condition.name, condition.rating),
          assessment: generateAssessment(condition.name, condition.rating),
          plan: generateTreatmentPlan(condition.name),
          medications: generateMedicationList(condition.name),
          vitalSigns: generateVitalSigns()
        },
        diagnoses: [{
          icd10: condition.icd10,
          description: condition.description || condition.name,
          dateOfOnset: new Date(veteran.serviceStartDate),
          severity: condition.rating >= 50 ? 'severe' : condition.rating >= 30 ? 'moderate' : 'mild',
          status: 'chronic'
        }]
      });
    }
  });
  
  return records;
}

// Helper functions
function generateSickCallNote(condition: string): string {
  const notes = {
    'PTSD': 'SM reports nightmares, hypervigilance, and difficulty sleeping since recent deployment. Avoids crowded areas.',
    'Lumbar Strain': 'SM reports lower back pain after lifting heavy equipment. Pain 6/10, worse with bending and lifting.',
    'Knee': 'SM reports knee pain and swelling after PT. Difficulty with running and squatting.',
    'Tinnitus': 'SM reports constant ringing in both ears since weapons qualification. Worse in quiet environments.',
    'TBI': 'SM reports headaches and dizziness following IED blast exposure. Brief LOC reported.',
    'Sleep Apnea': 'SM reports excessive daytime fatigue and snoring per roommate. Wakes up gasping for air.'
  };
  
  for (const [key, value] of Object.entries(notes)) {
    if (condition.includes(key)) return value;
  }
  
  return 'SM presents with symptoms consistent with diagnosed condition. Treatment initiated.';
}

function generateMedicationsForCondition(condition: string): string[] {
  const meds: { [key: string]: string[] } = {
    'PTSD': ['Sertraline 50mg daily', 'Prazosin 2mg at bedtime'],
    'Depression': ['Escitalopram 10mg daily', 'Bupropion 150mg daily'],
    'Back': ['Ibuprofen 800mg TID', 'Cyclobenzaprine 10mg TID'],
    'Knee': ['Meloxicam 15mg daily', 'Acetaminophen 1000mg PRN'],
    'Migraine': ['Sumatriptan 100mg PRN', 'Topiramate 25mg daily'],
    'Sleep Apnea': ['CPAP machine prescribed'],
    'Hypertension': ['Lisinopril 10mg daily', 'Amlodipine 5mg daily']
  };
  
  for (const [key, value] of Object.entries(meds)) {
    if (condition.includes(key)) return value;
  }
  
  return ['Ibuprofen 600mg PRN'];
}

function generateNexusStatement(condition: string, veteran: Veteran): string {
  return `After reviewing the veteran's service treatment records, current medical evidence, and conducting a thorough examination, 
          it is my medical opinion that the veteran's ${condition} is at least as likely as not (50% or greater probability) 
          caused by or related to their military service. The veteran's service records document ${veteran.combatService ? 'combat exposure and ' : ''}
          repetitive trauma and physical demands consistent with the development of this condition.`;
}

function generateRationaleBasis(condition: string): string[] {
  return [
    'Review of service treatment records showing in-service complaints',
    'Continuity of symptomatology since service',
    'Current medical literature supporting service connection',
    'Veteran credible lay testimony regarding onset and progression',
    'Absence of intervening cause or injury'
  ];
}

function generateWorkImpact(rating: number): string {
  if (rating >= 70) return 'Severe occupational impairment with deficiencies in most areas';
  if (rating >= 50) return 'Reduced reliability and productivity due to symptoms';
  if (rating >= 30) return 'Occasional decrease in work efficiency during symptom exacerbation';
  return 'Mild or transient symptoms with minimal work impact';
}

function generateADLImpact(rating: number): string {
  if (rating >= 70) return 'Significant difficulty with daily activities, requires assistance';
  if (rating >= 50) return 'Moderate difficulty with ADLs, can perform with adaptations';
  if (rating >= 30) return 'Some difficulty with complex ADLs';
  return 'Minimal impact on activities of daily living';
}

function generateSocialImpact(rating: number): string {
  if (rating >= 70) return 'Severe social impairment, isolation, difficulty maintaining relationships';
  if (rating >= 50) return 'Moderate social impairment, limited social activities';
  if (rating >= 30) return 'Some social limitations, maintains close relationships';
  return 'Minimal social impact';
}

function generateROMForCondition(condition: string, rating: number): { [joint: string]: RangeOfMotion } {
  const romData: { [joint: string]: RangeOfMotion } = {};
  
  if (condition.includes('Back') || condition.includes('Lumbar')) {
    romData['Lumbar Spine'] = {
      flexion: Math.max(30, 90 - (rating * 1.5)),
      extension: Math.max(10, 30 - (rating * 0.5)),
      lateralFlexion: {
        right: Math.max(10, 30 - (rating * 0.5)),
        left: Math.max(10, 30 - (rating * 0.5))
      },
      rotation: {
        right: Math.max(10, 30 - (rating * 0.5)),
        left: Math.max(10, 30 - (rating * 0.5))
      },
      painOnMotion: true,
      additionalLossOnRepetition: 10
    };
  }
  
  if (condition.includes('Knee')) {
    romData['Knee'] = {
      flexion: Math.max(45, 140 - (rating * 2)),
      extension: Math.min(10, rating * 0.3),
      painOnMotion: true,
      additionalLossOnRepetition: 15
    };
  }
  
  if (condition.includes('Shoulder')) {
    romData['Shoulder'] = {
      flexion: Math.max(90, 180 - (rating * 3)),
      extension: Math.max(30, 60 - rating),
      abduction: Math.max(90, 180 - (rating * 3)),
      adduction: 40,
      painOnMotion: true,
      additionalLossOnRepetition: 20
    };
  }
  
  return romData;
}

function generateMentalHealthSymptoms(rating: number): string[] {
  const allSymptoms = [
    'Depressed mood',
    'Anxiety',
    'Panic attacks',
    'Sleep impairment',
    'Nightmares',
    'Hypervigilance',
    'Exaggerated startle response',
    'Memory problems',
    'Concentration difficulties',
    'Irritability',
    'Angry outbursts',
    'Social isolation',
    'Avoidance behaviors',
    'Flashbacks',
    'Dissociative symptoms'
  ];
  
  const symptomCount = Math.min(allSymptoms.length, Math.floor(rating / 10) + 2);
  return allSymptoms.slice(0, symptomCount);
}

function generateOccupationalImpairment(rating: number): string {
  if (rating >= 100) return 'Total occupational impairment';
  if (rating >= 70) return 'Deficiencies in most areas including work, school, family relations';
  if (rating >= 50) return 'Reduced reliability and productivity';
  if (rating >= 30) return 'Occasional decrease in work efficiency';
  return 'Mild symptoms with good functioning';
}

function getProviderForCondition(condition: string): string {
  if (condition.includes('PTSD') || condition.includes('Depression') || condition.includes('Anxiety')) {
    return VA_PROVIDERS.mentalHealth[Math.floor(Math.random() * VA_PROVIDERS.mentalHealth.length)];
  }
  if (condition.includes('Knee') || condition.includes('Back') || condition.includes('Shoulder')) {
    return VA_PROVIDERS.orthopedics[Math.floor(Math.random() * VA_PROVIDERS.orthopedics.length)];
  }
  if (condition.includes('TBI') || condition.includes('Migraine') || condition.includes('Neuropathy')) {
    return VA_PROVIDERS.neurology[Math.floor(Math.random() * VA_PROVIDERS.neurology.length)];
  }
  return VA_PROVIDERS.primaryCare[Math.floor(Math.random() * VA_PROVIDERS.primaryCare.length)];
}

function generateChiefComplaint(condition: string): string {
  const complaints: { [key: string]: string } = {
    'PTSD': 'Increased nightmares and anxiety',
    'Back': 'Chronic low back pain, 7/10',
    'Knee': 'Knee pain with swelling and instability',
    'Migraine': 'Severe headaches 3-4 times per week',
    'Sleep Apnea': 'CPAP compliance check and fatigue',
    'Tinnitus': 'Worsening bilateral tinnitus'
  };
  
  for (const [key, value] of Object.entries(complaints)) {
    if (condition.includes(key)) return value;
  }
  
  return 'Follow-up for chronic condition management';
}

function generateHistoryOfPresentIllness(condition: string, veteran: Veteran): string {
  return `${veteran.firstName} ${veteran.lastName} is a ${
    new Date().getFullYear() - new Date(veteran.dateOfBirth).getFullYear()
  }-year-old ${veteran.branch} veteran who presents today for management of ${condition}. 
  Symptoms first began during military service and have persisted since separation. 
  Current symptoms include ${generateChiefComplaint(condition).toLowerCase()}. 
  Previous treatments have provided partial relief but symptoms continue to impact daily functioning.`;
}

function generatePhysicalExam(condition: string, rating: number): string {
  if (condition.includes('Back') || condition.includes('Knee') || condition.includes('Shoulder')) {
    return `Musculoskeletal exam reveals tenderness to palpation, decreased range of motion, 
            and pain with movement. Strength ${5 - Math.floor(rating / 30)}/5. 
            Gait ${rating >= 40 ? 'antalgic' : 'normal'}. ${
            rating >= 30 ? 'Positive special tests noted.' : 'Special tests negative.'}`;
  }
  
  if (condition.includes('PTSD') || condition.includes('Depression')) {
    return `Mental status exam: Alert and oriented x3. Mood ${rating >= 50 ? 'depressed' : 'mildly dysphoric'}. 
            Affect ${rating >= 50 ? 'restricted' : 'appropriate'}. 
            Thought process logical and goal-directed. No SI/HI at this time.`;
  }
  
  return 'Physical examination consistent with documented chronic condition. See detailed findings above.';
}

function generateAssessment(condition: string, rating: number): string {
  const severity = rating >= 50 ? 'Severe' : rating >= 30 ? 'Moderate' : 'Mild';
  return `${condition} - ${severity}, chronic, stable on current regimen. 
          Functional impairment noted. Continue current management with modifications as discussed.`;
}

function generateTreatmentPlan(condition: string): string {
  const plans: { [key: string]: string } = {
    'PTSD': 'Continue psychotherapy (CPT/PE). Medication management. Sleep hygiene education.',
    'Back': 'Physical therapy 2x/week. Core strengthening. Pain management. Consider MRI if no improvement.',
    'Knee': 'Orthopedic referral. Continue NSAIDs. Ice and elevation. Activity modification.',
    'Migraine': 'Headache diary. Trigger avoidance. Prophylactic medication adjustment. Neurology follow-up.',
    'Sleep Apnea': 'CPAP compliance monitoring. Sleep study follow-up in 6 months. Weight management.',
    'Hypertension': 'Medication adjustment. DASH diet education. Exercise program. Home BP monitoring.'
  };
  
  for (const [key, value] of Object.entries(plans)) {
    if (condition.includes(key)) return value;
  }
  
  return 'Continue current treatment. Follow-up in 3 months or sooner if symptoms worsen.';
}

function generateMedicationList(condition: string): Medication[] {
  const meds: Medication[] = [];
  const currentDate = new Date();
  
  if (condition.includes('PTSD') || condition.includes('Depression')) {
    meds.push({
      name: 'Sertraline',
      dosage: '100mg',
      frequency: 'once daily',
      startDate: new Date(currentDate.getFullYear() - 1, 0, 1),
      prescriber: 'Dr. Davis, MD',
      indication: 'PTSD/Depression',
      status: 'active'
    });
  }
  
  if (condition.includes('Back') || condition.includes('Knee')) {
    meds.push({
      name: 'Meloxicam',
      dosage: '15mg',
      frequency: 'once daily',
      startDate: new Date(currentDate.getFullYear() - 2, 0, 1),
      prescriber: 'Dr. Martinez, MD',
      indication: 'Chronic pain',
      status: 'active'
    });
  }
  
  return meds;
}

function generateVitalSigns(): VitalSigns {
  return {
    bloodPressure: `${110 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)}`,
    pulse: 60 + Math.floor(Math.random() * 30),
    temperature: 98.6,
    respirations: 16 + Math.floor(Math.random() * 4),
    oxygenSaturation: 96 + Math.floor(Math.random() * 4),
    height: `${5 + Math.floor(Math.random() * 2)}'${Math.floor(Math.random() * 12)}"`,
    weight: 150 + Math.floor(Math.random() * 80),
    bmi: 22 + Math.floor(Math.random() * 10),
    pain: Math.floor(Math.random() * 6) + 2
  };
}