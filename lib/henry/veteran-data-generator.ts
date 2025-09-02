// Comprehensive veteran data generator with realistic service-based logic

export interface ServiceEra {
  name: string;
  startYear: number;
  endYear: number;
  locations: string[];
  operations: string[];
  exposures: string[];
  commonMOS: string[];
}

export const SERVICE_ERAS: ServiceEra[] = [
  {
    name: 'Vietnam Era',
    startYear: 1962,
    endYear: 1975,
    locations: ['Vietnam', 'Thailand', 'Laos', 'Cambodia', 'Guam', 'Philippines'],
    operations: ['Operation Rolling Thunder', 'Operation Ranch Hand', 'Tet Offensive', 'Operation Linebacker'],
    exposures: ['Agent Orange', 'Agent Blue', 'Agent White', 'Dioxin', 'Herbicides'],
    commonMOS: ['11B Infantry', '13B Artillery', '68W Medic', '88M Motor Transport', '12B Combat Engineer']
  },
  {
    name: 'Gulf War',
    startYear: 1990,
    endYear: 1991,
    locations: ['Iraq', 'Kuwait', 'Saudi Arabia', 'Bahrain', 'Qatar', 'UAE'],
    operations: ['Desert Shield', 'Desert Storm', 'Desert Sabre'],
    exposures: ['Oil Well Fires', 'Depleted Uranium', 'Chemical Weapons', 'Pesticides', 'PB Pills'],
    commonMOS: ['19K Tank Crewman', '11B Infantry', '15T Blackhawk Mechanic', '88M Motor Transport', '92G Food Service']
  },
  {
    name: 'Post-9/11',
    startYear: 2001,
    endYear: 2021,
    locations: ['Afghanistan', 'Iraq', 'Syria', 'Djibouti', 'Somalia', 'Pakistan'],
    operations: ['Enduring Freedom', 'Iraqi Freedom', 'New Dawn', 'Inherent Resolve', 'Freedom\'s Sentinel'],
    exposures: ['Burn Pits', 'Depleted Uranium', 'Sand/Dust', 'Chemical Weapons', 'IED Blast'],
    commonMOS: ['11B Infantry', '68W Combat Medic', '31B Military Police', '15W UAV Operator', '35S Signals Intelligence']
  },
  {
    name: 'Korea',
    startYear: 1950,
    endYear: 1953,
    locations: ['South Korea', 'North Korea', 'Japan'],
    operations: ['Korean War', 'DMZ Operations'],
    exposures: ['Cold Injuries', 'Chemical Weapons', 'Radiation'],
    commonMOS: ['11B Infantry', '13B Artillery', '91B Medical', '94B Cook']
  },
  {
    name: 'Cold War',
    startYear: 1945,
    endYear: 1989,
    locations: ['Germany', 'Japan', 'Korea DMZ', 'Fort McClellan', 'Nevada Test Site'],
    operations: ['Berlin Airlift', 'DMZ Patrol', 'Nuclear Testing', 'REFORGER'],
    exposures: ['Radiation', 'Asbestos', 'Lead Paint', 'PCBs', 'Chemical Weapons Testing'],
    commonMOS: ['11B Infantry', '13B Artillery', '19K Tank Crewman', '67N Helicopter Mechanic']
  }
];

// VA Disability Compensation Rates 2024 (Monthly)
export const COMPENSATION_RATES_2024 = {
  '10': 171.23,
  '20': 338.49,
  '30': 524.31,
  '40': 755.28,
  '50': 1075.16,
  '60': 1361.88,
  '70': 1716.28,
  '80': 1995.01,
  '90': 2241.91,
  '100': 3737.85,
  // With dependents (spouse only)
  '30_spouse': 586.31,
  '40_spouse': 838.28,
  '50_spouse': 1179.16,
  '60_spouse': 1486.88,
  '70_spouse': 1861.28,
  '80_spouse': 2161.01,
  '90_spouse': 2428.91,
  '100_spouse': 3946.25
};

// Realistic MOS to exposure mappings
export const MOS_EXPOSURES: Record<string, string[]> = {
  // Combat Arms
  '11B Infantry': ['Combat Trauma', 'Burn Pits', 'IED Blast', 'Small Arms Fire'],
  '11C Indirect Fire Infantry': ['Combat Trauma', 'Burn Pits', 'Mortar Fumes'],
  '13B Artillery': ['Hearing Loss', 'TBI', 'Chemical Exposure'],
  '19D Cavalry Scout': ['Combat Trauma', 'Burn Pits', 'Vehicle Accidents'],
  '19K Tank Crewman': ['Depleted Uranium', 'Hearing Loss', 'Carbon Monoxide'],
  
  // Aviation
  '15T Blackhawk Mechanic': ['JP-8 Fuel', 'Hydraulic Fluids', 'Noise Exposure'],
  '15W UAV Operator': ['Carpal Tunnel', 'Eye Strain', 'PTSD'],
  '67N Helicopter Mechanic': ['Asbestos', 'JP-8 Fuel', 'Vibration Injuries'],
  
  // Support
  '68W Combat Medic': ['Infectious Diseases', 'Blood Borne Pathogens', 'Combat Trauma'],
  '88M Motor Transport': ['Diesel Exhaust', 'Vehicle Accidents', 'Burn Pits'],
  '92G Food Service': ['Burns', 'Slip/Fall Injuries', 'Chemical Cleaners'],
  '91B Wheeled Vehicle Mechanic': ['Asbestos', 'Solvents', 'Heavy Metals'],
  
  // Engineers
  '12B Combat Engineer': ['Explosives', 'Asbestos', 'Lead', 'Demolition Dust'],
  '12N Horizontal Construction': ['Asbestos', 'Silica Dust', 'Heavy Equipment'],
  
  // Military Police
  '31B Military Police': ['Combat Trauma', 'Riot Control Agents', 'K9 Injuries'],
  
  // Intelligence
  '35S Signals Intelligence': ['Carpal Tunnel', 'Eye Strain', 'Classified Exposures'],
  
  // Medical
  '68K Medical Laboratory': ['Infectious Diseases', 'Chemical Exposure', 'Formaldehyde'],
  
  // Chemical
  '74D CBRN Specialist': ['Chemical Weapons', 'Radiation', 'Biological Agents']
};

// Common service-connected conditions by exposure type
export const EXPOSURE_CONDITIONS: Record<string, string[]> = {
  'Agent Orange': [
    'Type 2 Diabetes',
    'Ischemic Heart Disease',
    'Parkinson\'s Disease',
    'Prostate Cancer',
    'Respiratory Cancers',
    'Soft Tissue Sarcomas',
    'B-cell Leukemias',
    'Hodgkin\'s Disease',
    'Peripheral Neuropathy'
  ],
  'Burn Pits': [
    'Asthma',
    'Chronic Bronchitis',
    'COPD',
    'Chronic Rhinitis',
    'Chronic Sinusitis',
    'Constrictive Bronchiolitis',
    'Emphysema',
    'Granulomatous Disease',
    'Interstitial Lung Disease',
    'Pleuritis',
    'Pulmonary Fibrosis',
    'Rare Respiratory Cancers'
  ],
  'Gulf War': [
    'Chronic Fatigue Syndrome',
    'Fibromyalgia',
    'Functional GI Disorders',
    'IBS',
    'Chronic Headaches',
    'Joint Pain',
    'Neurological Symptoms',
    'Respiratory Disorders',
    'Skin Conditions',
    'Sleep Disturbances'
  ],
  'Radiation': [
    'Leukemia',
    'Thyroid Cancer',
    'Breast Cancer',
    'Lung Cancer',
    'Colon Cancer',
    'Multiple Myeloma',
    'Lymphomas',
    'Kidney Cancer',
    'Liver Cancer'
  ],
  'Asbestos': [
    'Mesothelioma',
    'Lung Cancer',
    'Asbestosis',
    'Pleural Plaques',
    'Pleural Thickening',
    'COPD'
  ],
  'Camp Lejeune Water': [
    'Bladder Cancer',
    'Kidney Cancer',
    'Liver Cancer',
    'Multiple Myeloma',
    'Non-Hodgkin\'s Lymphoma',
    'Parkinson\'s Disease',
    'Aplastic Anemia',
    'Birth Defects'
  ],
  'Depleted Uranium': [
    'Kidney Disease',
    'Lung Cancer',
    'Bone Cancer',
    'Neurological Effects',
    'Reproductive Issues'
  ],
  'TBI/Blast': [
    'Headaches',
    'Memory Problems',
    'Concentration Issues',
    'Depression',
    'Anxiety',
    'Irritability',
    'Sleep Problems',
    'Tinnitus',
    'Vision Problems'
  ],
  'PTSD': [
    'Depression',
    'Anxiety',
    'Substance Abuse',
    'Sleep Disorders',
    'Hyper-vigilance',
    'Avoidance',
    'Intrusive Thoughts',
    'Emotional Numbing'
  ]
};

// Calculate combined disability rating using VA math
export function calculateCombinedRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  
  // Sort ratings from highest to lowest
  const sorted = ratings.sort((a, b) => b - a);
  
  // VA math: start with 100% efficiency
  let efficiency = 100;
  
  for (const rating of sorted) {
    // Apply each rating to remaining efficiency
    const impact = (efficiency * rating) / 100;
    efficiency -= impact;
  }
  
  // Combined rating is what's taken away from 100%
  const combined = 100 - efficiency;
  
  // Round to nearest 10
  return Math.round(combined / 10) * 10;
}

// Generate realistic deployment history based on service dates
export function generateDeployments(
  branch: string, 
  serviceStartDate: Date, 
  serviceEndDate: Date
): any[] {
  const deployments = [];
  const serviceStartYear = serviceStartDate.getFullYear();
  const serviceEndYear = serviceEndDate.getFullYear();
  
  // Find applicable service eras
  const applicableEras = SERVICE_ERAS.filter(era => 
    (serviceStartYear <= era.endYear && serviceEndYear >= era.startYear)
  );
  
  if (applicableEras.length === 0) {
    // Default to most recent era if no match
    applicableEras.push(SERVICE_ERAS[2]); // Post-9/11
  }
  
  // Generate 1-3 deployments based on service length
  const numDeployments = Math.min(3, Math.floor((serviceEndYear - serviceStartYear) / 3) + 1);
  
  for (let i = 0; i < numDeployments; i++) {
    const era = applicableEras[Math.floor(Math.random() * applicableEras.length)];
    const location = era.locations[Math.floor(Math.random() * era.locations.length)];
    const operation = era.operations[Math.floor(Math.random() * era.operations.length)];
    
    const deploymentStart = new Date(
      serviceStartYear + i * 2,
      Math.floor(Math.random() * 12),
      1
    );
    const deploymentEnd = new Date(
      deploymentStart.getFullYear() + (Math.random() > 0.5 ? 1 : 0),
      (deploymentStart.getMonth() + 6 + Math.floor(Math.random() * 6)) % 12,
      1
    );
    
    deployments.push({
      location,
      operation,
      startDate: deploymentStart,
      endDate: deploymentEnd,
      unit: `${Math.floor(Math.random() * 9) + 1}${['st', 'nd', 'rd', 'th'][Math.min(3, Math.floor(Math.random() * 4))]} ${['Infantry', 'Cavalry', 'Artillery', 'Aviation', 'Support'][Math.floor(Math.random() * 5)]} ${['Division', 'Brigade', 'Battalion', 'Regiment'][Math.floor(Math.random() * 4)]}`,
      role: ['Squad Leader', 'Team Leader', 'Platoon Sergeant', 'Operations NCO', 'Specialist'][Math.floor(Math.random() * 5)]
    });
  }
  
  return deployments;
}

// Generate realistic medical conditions based on service history
export function generateMedicalConditions(
  deployments: any[], 
  mos: string,
  age: number
): any[] {
  const conditions = [];
  const exposures = new Set<string>();
  
  // Identify exposures from deployments
  deployments.forEach(deployment => {
    const era = SERVICE_ERAS.find(e => 
      e.locations.includes(deployment.location) || 
      e.operations.includes(deployment.operation)
    );
    if (era) {
      era.exposures.forEach(exp => exposures.add(exp));
    }
  });
  
  // Add MOS-specific exposures
  const mosExposures = MOS_EXPOSURES[mos] || ['General Military Hazards'];
  mosExposures.forEach(exp => exposures.add(exp));
  
  // Generate conditions based on exposures
  exposures.forEach(exposure => {
    const possibleConditions = EXPOSURE_CONDITIONS[exposure] || [];
    // 30-70% chance of having a condition from each exposure
    if (Math.random() > 0.3 && possibleConditions.length > 0) {
      const condition = possibleConditions[Math.floor(Math.random() * possibleConditions.length)];
      const severity = ['Mild', 'Moderate', 'Severe'][Math.floor(Math.random() * 3)];
      const rating = severity === 'Mild' ? 10 : severity === 'Moderate' ? 30 : 50;
      
      conditions.push({
        name: condition,
        icd10: `${['F', 'G', 'I', 'J', 'K', 'M'][Math.floor(Math.random() * 6)]}${Math.floor(Math.random() * 90) + 10}.${Math.floor(Math.random() * 10)}`,
        diagnosedDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1),
        severity,
        treatment: 'Ongoing',
        medications: ['Medication A', 'Medication B'],
        serviceConnected: true,
        rating,
        lastExam: new Date(2024, Math.floor(Math.random() * 12), 1)
      });
    }
  });
  
  // Add common age-related conditions
  if (age > 50) {
    conditions.push({
      name: 'Hypertension',
      icd10: 'I10',
      diagnosedDate: new Date(2018, 5, 1),
      severity: 'Moderate',
      treatment: 'Medication',
      medications: ['Lisinopril'],
      serviceConnected: Math.random() > 0.5,
      rating: 10
    });
  }
  
  if (age > 60) {
    conditions.push({
      name: 'Type 2 Diabetes',
      icd10: 'E11.9',
      diagnosedDate: new Date(2019, 3, 1),
      severity: 'Moderate',
      treatment: 'Medication and Diet',
      medications: ['Metformin'],
      serviceConnected: exposures.has('Agent Orange'),
      rating: 20
    });
  }
  
  // Always add tinnitus and hearing loss for combat veterans
  if (deployments.length > 0) {
    conditions.push({
      name: 'Tinnitus',
      icd10: 'H93.1',
      diagnosedDate: new Date(2015, 7, 1),
      severity: 'Mild',
      treatment: 'Sound Therapy',
      medications: [],
      serviceConnected: true,
      rating: 10
    });
  }
  
  return conditions;
}

// Calculate accurate monthly compensation based on rating and dependents
export function calculateMonthlyCompensation(
  combinedRating: number,
  hasSpouse: boolean = false,
  numChildren: number = 0
): number {
  // Round to nearest 10
  const roundedRating = Math.round(combinedRating / 10) * 10;
  
  // Get base rate
  let baseRate = (COMPENSATION_RATES_2024 as any)[roundedRating.toString()] || 0;
  
  // Add dependent rates (simplified - actual VA rates are more complex)
  if (hasSpouse && roundedRating >= 30) {
    baseRate = (COMPENSATION_RATES_2024 as any)[`${roundedRating}_spouse`] || baseRate;
  }
  
  // Add for children (approximately $31-$100 per child depending on rating)
  if (numChildren > 0 && roundedRating >= 30) {
    const childRate = roundedRating >= 70 ? 100 : roundedRating >= 50 ? 65 : 31;
    baseRate += childRate * numChildren;
  }
  
  return Math.round(baseRate * 100) / 100;
}

// Generate realistic financial data based on disability rating
export function generateFinancialData(
  combinedRating: number,
  hasSpouse: boolean,
  numChildren: number,
  age: number
): any {
  const monthlyCompensation = calculateMonthlyCompensation(combinedRating, hasSpouse, numChildren);
  const annualCompensation = monthlyCompensation * 12;
  
  // Realistic savings based on compensation level
  const savings = Math.round(annualCompensation * (0.5 + Math.random() * 2));
  
  // Retirement accounts if older
  const retirement = age > 40 ? Math.round((age - 40) * 5000 * (1 + Math.random())) : 0;
  
  return {
    monthlyIncome: {
      vaCompensation: monthlyCompensation,
      socialSecurity: age >= 62 ? Math.round(1200 + Math.random() * 800) : 0,
      retirement: age >= 60 ? Math.round(retirement / 240) : 0, // Monthly from retirement
      other: Math.random() > 0.7 ? Math.round(500 + Math.random() * 1500) : 0
    },
    assets: {
      checking: Math.round(2000 + Math.random() * 5000),
      savings,
      retirement,
      property: age > 30 && Math.random() > 0.4 ? Math.round(150000 + Math.random() * 200000) : 0
    },
    debts: {
      mortgage: age > 30 && Math.random() > 0.4 ? Math.round(50000 + Math.random() * 150000) : 0,
      auto: Math.random() > 0.5 ? Math.round(5000 + Math.random() * 25000) : 0,
      credit: Math.round(Math.random() * 5000),
      medical: Math.random() > 0.7 ? Math.round(500 + Math.random() * 5000) : 0,
      vaDebt: Math.random() > 0.9 ? Math.round(1000 + Math.random() * 10000) : 0
    }
  };
}