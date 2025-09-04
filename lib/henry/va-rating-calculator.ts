/**
 * VA Combined Ratings Calculator
 * Implements the actual VA combined ratings table per 38 CFR 4.25
 */

/**
 * VA Combined Ratings Table - 38 CFR 4.25
 * This is the actual table used by the VA to calculate combined disability ratings
 */
const VA_COMBINED_RATINGS_TABLE: { [key: number]: { [key: number]: number } } = {
  10: { 10: 19, 20: 28, 30: 37, 40: 46, 50: 55, 60: 64, 70: 73, 80: 82, 90: 91 },
  20: { 10: 28, 20: 36, 30: 44, 40: 52, 50: 60, 60: 68, 70: 76, 80: 84, 90: 92 },
  30: { 10: 37, 20: 44, 30: 51, 40: 58, 50: 65, 60: 72, 70: 79, 80: 86, 90: 93 },
  40: { 10: 46, 20: 52, 30: 58, 40: 64, 50: 70, 60: 76, 70: 82, 80: 88, 90: 94 },
  50: { 10: 55, 20: 60, 30: 65, 40: 70, 50: 75, 60: 80, 70: 85, 80: 90, 90: 95 },
  60: { 10: 64, 20: 68, 30: 72, 40: 76, 50: 80, 60: 84, 70: 88, 80: 92, 90: 96 },
  70: { 10: 73, 20: 76, 30: 79, 40: 82, 50: 85, 60: 88, 70: 91, 80: 94, 90: 97 },
  80: { 10: 82, 20: 84, 30: 86, 40: 88, 50: 90, 60: 92, 70: 94, 80: 96, 90: 98 },
  90: { 10: 91, 20: 92, 30: 93, 40: 94, 50: 95, 60: 96, 70: 97, 80: 98, 90: 99 }
};

/**
 * Calculate combined VA disability rating using the official VA method
 * @param ratings Array of individual disability percentages
 * @returns Combined disability rating rounded to nearest 10%
 */
export function calculateCombinedRating(ratings: number[]): number {
  if (!ratings || ratings.length === 0) return 0;
  
  // Remove any 0% ratings as they don't affect the calculation
  const validRatings = ratings.filter(r => r > 0).sort((a, b) => b - a);
  
  if (validRatings.length === 0) return 0;
  if (validRatings.length === 1) return validRatings[0];
  
  // Use the VA's "whole person" concept
  let combinedValue = validRatings[0];
  
  for (let i = 1; i < validRatings.length; i++) {
    const currentRating = validRatings[i];
    
    // Find the combined value from the table
    if (VA_COMBINED_RATINGS_TABLE[combinedValue] && VA_COMBINED_RATINGS_TABLE[combinedValue][currentRating]) {
      combinedValue = VA_COMBINED_RATINGS_TABLE[combinedValue][currentRating];
    } else {
      // If not in table, use the formula: Combined = A + B - (A × B / 100)
      const remainingEfficiency = 100 - combinedValue;
      const additionalDisability = (remainingEfficiency * currentRating) / 100;
      combinedValue = Math.round(combinedValue + additionalDisability);
    }
  }
  
  // Round to nearest 10% per VA rules
  const rounded = Math.round(combinedValue / 10) * 10;
  // Ensure it's a valid VA percentage (0-100, increments of 10)
  return Math.max(0, Math.min(100, rounded));
}

/**
 * Bilateral factor calculation per 38 CFR 4.26
 * Applied when disabilities affect both arms, both legs, or paired skeletal muscles
 */
export function calculateBilateralFactor(leftRating: number, rightRating: number): number {
  const combined = calculateCombinedRating([leftRating, rightRating]);
  const withBilateralFactor = combined * 1.1;
  // Round to nearest 10% per VA rules
  return Math.round(withBilateralFactor / 10) * 10;
}

/**
 * Validate and fix VA disability rating to ensure it follows VA rules
 * @param rating Input rating percentage
 * @returns Valid VA rating (0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100)
 */
export function validateVARating(rating: number): number {
  if (rating < 0) return 0;
  if (rating > 100) return 100;
  
  // Round to nearest 10%
  const rounded = Math.round(rating / 10) * 10;
  return rounded;
}

/**
 * Common VA disability conditions with typical rating ranges
 */
export const VA_CONDITIONS = {
  // Mental Health
  'PTSD': { 
    icd10: 'F43.10', 
    ratingOptions: [0, 10, 30, 50, 70, 100],
    description: 'Post-Traumatic Stress Disorder',
    dbq: 'Mental Disorders DBQ'
  },
  'Major Depression': { 
    icd10: 'F33.1', 
    ratingOptions: [0, 10, 30, 50, 70, 100],
    description: 'Major Depressive Disorder, Recurrent',
    dbq: 'Mental Disorders DBQ'
  },
  'Generalized Anxiety': { 
    icd10: 'F41.1', 
    ratingOptions: [0, 10, 30, 50, 70, 100],
    description: 'Generalized Anxiety Disorder',
    dbq: 'Mental Disorders DBQ'
  },
  'TBI': { 
    icd10: 'S06.2X0S', 
    ratingOptions: [0, 10, 40, 70, 100],
    description: 'Traumatic Brain Injury, Residuals',
    dbq: 'TBI DBQ'
  },
  
  // Musculoskeletal
  'Lumbar Strain': { 
    icd10: 'M54.5', 
    ratingOptions: [0, 10, 20, 40],
    description: 'Lumbosacral Strain with DDD',
    dbq: 'Back (Thoracolumbar Spine) DBQ'
  },
  'Cervical Strain': { 
    icd10: 'M54.2', 
    ratingOptions: [0, 10, 20, 30],
    description: 'Cervical Spine Strain',
    dbq: 'Neck (Cervical Spine) DBQ'
  },
  'Right Knee Strain': { 
    icd10: 'S83.91XS', 
    ratingOptions: [0, 10, 20, 30],
    description: 'Right Knee Patellofemoral Pain Syndrome',
    dbq: 'Knee and Lower Leg DBQ'
  },
  'Left Knee Strain': { 
    icd10: 'S83.92XS', 
    ratingOptions: [0, 10, 20, 30],
    description: 'Left Knee Patellofemoral Pain Syndrome',
    dbq: 'Knee and Lower Leg DBQ'
  },
  'Right Shoulder Strain': { 
    icd10: 'M25.511', 
    ratingOptions: [0, 10, 20],
    description: 'Right Shoulder Impingement Syndrome',
    dbq: 'Shoulder and Arm DBQ'
  },
  'Left Shoulder Strain': { 
    icd10: 'M25.512', 
    ratingOptions: [0, 10, 20],
    description: 'Left Shoulder Impingement Syndrome',
    dbq: 'Shoulder and Arm DBQ'
  },
  'Bilateral Plantar Fasciitis': { 
    icd10: 'M72.2', 
    ratingOptions: [0, 10, 20, 30],
    description: 'Bilateral Plantar Fasciitis',
    dbq: 'Foot DBQ'
  },
  
  // Hearing/Tinnitus
  'Tinnitus': { 
    icd10: 'H93.11', 
    ratingOptions: [10], // Always 10% for tinnitus
    description: 'Tinnitus, Bilateral',
    dbq: 'Ear Conditions DBQ'
  },
  'Hearing Loss': { 
    icd10: 'H90.3', 
    ratingOptions: [0, 10, 20, 30, 40, 50],
    description: 'Bilateral Sensorineural Hearing Loss',
    dbq: 'Hearing Loss and Tinnitus DBQ'
  },
  
  // Respiratory
  'Sleep Apnea': { 
    icd10: 'G47.33', 
    ratingOptions: [0, 30, 50, 100],
    description: 'Obstructive Sleep Apnea',
    dbq: 'Sleep Apnea DBQ'
  },
  'Sinusitis': { 
    icd10: 'J32.9', 
    ratingOptions: [0, 10, 30, 50],
    description: 'Chronic Sinusitis',
    dbq: 'Sinusitis/Rhinitis DBQ'
  },
  'Asthma': { 
    icd10: 'J45.909', 
    ratingOptions: [0, 10, 30, 60, 100],
    description: 'Bronchial Asthma',
    dbq: 'Respiratory DBQ'
  },
  
  // Gastrointestinal
  'GERD': { 
    icd10: 'K21.9', 
    ratingOptions: [0, 10, 30, 60],
    description: 'Gastroesophageal Reflux Disease',
    dbq: 'Esophageal Conditions DBQ'
  },
  'IBS': { 
    icd10: 'K58.9', 
    ratingOptions: [0, 10, 30],
    description: 'Irritable Bowel Syndrome',
    dbq: 'Intestinal Conditions DBQ'
  },
  
  // Skin
  'Eczema': { 
    icd10: 'L30.9', 
    ratingOptions: [0, 10, 30, 60],
    description: 'Atopic Dermatitis/Eczema',
    dbq: 'Skin Diseases DBQ'
  },
  
  // Cardiovascular
  'Hypertension': { 
    icd10: 'I10', 
    ratingOptions: [0, 10, 20, 40, 60],
    description: 'Essential Hypertension',
    dbq: 'Hypertension DBQ'
  },
  
  // Neurological
  'Migraines': { 
    icd10: 'G43.909', 
    ratingOptions: [0, 10, 30, 50],
    description: 'Migraine Headaches',
    dbq: 'Headaches DBQ'
  },
  'Peripheral Neuropathy': { 
    icd10: 'G90.09', 
    ratingOptions: [0, 10, 20, 40],
    description: 'Peripheral Neuropathy',
    dbq: 'Peripheral Nerves DBQ'
  },
  'Radiculopathy Lumbar': { 
    icd10: 'M54.16', 
    ratingOptions: [0, 10, 20, 40],
    description: 'Lumbar Radiculopathy',
    dbq: 'Back (Thoracolumbar Spine) DBQ'
  },
  'Radiculopathy Cervical': { 
    icd10: 'M54.12', 
    ratingOptions: [0, 10, 20, 40],
    description: 'Cervical Radiculopathy',
    dbq: 'Neck (Cervical Spine) DBQ'
  }
};

/**
 * Generate realistic condition combinations based on common patterns
 */
export function generateRealisticConditions(serviceEra: string, combatService: boolean, branch: string) {
  const conditions: Array<{ name: string; rating: number; icd10: string; dbq: string }> = [];
  
  // Common condition patterns based on service
  if (combatService) {
    // Combat veterans often have PTSD/TBI
    if (Math.random() > 0.15) { // 85% chance for combat veterans
      const ptsd = VA_CONDITIONS['PTSD'];
      conditions.push({
        name: 'PTSD',
        rating: ptsd.ratingOptions[Math.floor(Math.random() * (ptsd.ratingOptions.length - 2)) + 2] || 30, // Skip 0 and 10, default to 30
        icd10: ptsd.icd10,
        dbq: ptsd.dbq
      });
    }
    
    if (Math.random() > 0.7) {
      const tbi = VA_CONDITIONS['TBI'];
      conditions.push({
        name: 'TBI',
        rating: tbi.ratingOptions[Math.floor(Math.random() * (tbi.ratingOptions.length - 1)) + 1],
        icd10: tbi.icd10,
        dbq: tbi.dbq
      });
    }
  }
  
  // Musculoskeletal conditions are very common
  if (Math.random() > 0.1) { // 90% chance
    const lumbar = VA_CONDITIONS['Lumbar Strain'];
    conditions.push({
      name: 'Lumbar Strain',
      rating: lumbar.ratingOptions[Math.floor(Math.random() * (lumbar.ratingOptions.length - 1)) + 1] || 10, // Skip 0%, minimum 10%
      icd10: lumbar.icd10,
      dbq: lumbar.dbq
    });
  }
  
  // Bilateral knee conditions (triggers bilateral factor)
  if (Math.random() > 0.5) {
    const rightKnee = VA_CONDITIONS['Right Knee Strain'];
    const leftKnee = VA_CONDITIONS['Left Knee Strain'];
    conditions.push(
      {
        name: 'Right Knee Strain',
        rating: rightKnee.ratingOptions[Math.floor(Math.random() * (rightKnee.ratingOptions.length - 1)) + 1] || 10,
        icd10: rightKnee.icd10,
        dbq: rightKnee.dbq
      },
      {
        name: 'Left Knee Strain',
        rating: leftKnee.ratingOptions[Math.floor(Math.random() * (leftKnee.ratingOptions.length - 1)) + 1] || 10,
        icd10: leftKnee.icd10,
        dbq: leftKnee.dbq
      }
    );
  }
  
  // Tinnitus is extremely common
  if (Math.random() > 0.2) { // 80% chance
    const tinnitus = VA_CONDITIONS['Tinnitus'];
    conditions.push({
      name: 'Tinnitus',
      rating: 10, // Always 10%
      icd10: tinnitus.icd10,
      dbq: tinnitus.dbq
    });
  }
  
  // Sleep apnea (often secondary to PTSD)
  if (conditions.some(c => c.name === 'PTSD') && Math.random() > 0.4) {
    const sleepApnea = VA_CONDITIONS['Sleep Apnea'];
    conditions.push({
      name: 'Sleep Apnea (Secondary to PTSD)',
      rating: sleepApnea.ratingOptions[Math.floor(Math.random() * (sleepApnea.ratingOptions.length - 1)) + 1],
      icd10: sleepApnea.icd10,
      dbq: sleepApnea.dbq
    });
  }
  
  // Ensure every veteran has at least one condition if they have any service time
  if (conditions.length === 0) {
    // Give them at least tinnitus (most common) or a minor musculoskeletal condition
    const fallbackConditions = ['Tinnitus', 'Lumbar Strain', 'Right Knee Strain'];
    const selectedCondition = fallbackConditions[Math.floor(Math.random() * fallbackConditions.length)];
    const condition = VA_CONDITIONS[selectedCondition as keyof typeof VA_CONDITIONS];
    
    conditions.push({
      name: selectedCondition,
      rating: selectedCondition === 'Tinnitus' ? 10 : condition.ratingOptions[1] || 10, // Skip 0% rating
      icd10: condition.icd10,
      dbq: condition.dbq
    });
  }
  
  return conditions;
}

/**
 * Calculate total combined rating including bilateral factor
 */
export function calculateTotalRating(conditions: Array<{ name: string; rating: number }>) {
  if (!conditions || conditions.length === 0) return 0;
  
  // Check for bilateral conditions
  const bilateralPairs = [
    ['Right Knee', 'Left Knee'],
    ['Right Shoulder', 'Left Shoulder'],
    ['Right Ankle', 'Left Ankle'],
    ['Right Hip', 'Left Hip']
  ];
  
  let ratings = conditions.map(c => c.rating);
  let hasBilateral = false;
  
  // Apply bilateral factor if applicable
  for (const [right, left] of bilateralPairs) {
    const rightCondition = conditions.find(c => c.name.includes(right));
    const leftCondition = conditions.find(c => c.name.includes(left));
    
    if (rightCondition && leftCondition) {
      hasBilateral = true;
      // Remove individual ratings
      ratings = ratings.filter(r => r !== rightCondition.rating && r !== leftCondition.rating);
      // Add combined bilateral rating
      const bilateralRating = calculateBilateralFactor(rightCondition.rating, leftCondition.rating);
      ratings.push(bilateralRating);
    }
  }
  
  return calculateCombinedRating(ratings);
}