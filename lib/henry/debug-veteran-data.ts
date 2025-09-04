/**
 * Debug functions for veteran data generation
 */

import { generateEnhancedMockVeterans } from './enhanced-mock-data';
import { generateMockVeterans } from './mock-data';

export function debugVeteranGeneration() {
  console.log('=== DEBUGGING VETERAN GENERATION ===');
  
  // Test enhanced generator
  console.log('\n1. Testing Enhanced Generator (5 veterans):');
  const enhancedVets = generateEnhancedMockVeterans(5);
  enhancedVets.forEach((vet, i) => {
    console.log(`Vet ${i + 1}: ${vet.name}`);
    console.log(`  - Rating: ${vet.disabilityRating}%`);
    console.log(`  - Conditions: ${vet.conditions?.length || 0}`);
    if (vet.conditions && vet.conditions.length > 0) {
      vet.conditions.forEach(cond => {
        console.log(`    • ${cond.name}: ${cond.rating}%`);
      });
    }
    console.log(`  - Claims: ${vet.claims?.length || 0}`);
    console.log('');
  });
  
  // Test main function
  console.log('\n2. Testing Main generateMockVeterans Function (5 veterans):');
  const mainVets = generateMockVeterans(5);
  mainVets.forEach((vet, i) => {
    console.log(`Vet ${i + 1}: ${vet.name}`);
    console.log(`  - Rating: ${vet.disabilityRating}%`);
    console.log(`  - Conditions: ${(vet as any).conditions?.length || 0}`);
    if ((vet as any).conditions && (vet as any).conditions.length > 0) {
      (vet as any).conditions.forEach((cond: any) => {
        console.log(`    • ${cond.name}: ${cond.rating}%`);
      });
    }
    console.log(`  - Claims: ${vet.claims?.length || 0}`);
    console.log('');
  });
  
  // Check for inconsistencies
  console.log('\n3. Checking for Data Inconsistencies:');
  const inconsistentVets = mainVets.filter(vet => {
    const hasRating = vet.disabilityRating > 0;
    const hasConditions = (vet as any).conditions?.length > 0;
    const hasClaims = vet.claims?.length > 0;
    
    // Flag if they have a rating but no conditions or claims
    return hasRating && (!hasConditions || !hasClaims);
  });
  
  if (inconsistentVets.length > 0) {
    console.log(`❌ Found ${inconsistentVets.length} inconsistent veterans:`);
    inconsistentVets.forEach(vet => {
      console.log(`  - ${vet.name}: ${vet.disabilityRating}% rating, ${(vet as any).conditions?.length || 0} conditions, ${vet.claims?.length || 0} claims`);
    });
  } else {
    console.log('✅ All veterans have consistent data!');
  }
  
  return {
    enhanced: enhancedVets,
    main: mainVets,
    inconsistencies: inconsistentVets
  };
}

export function testVACalculations() {
  console.log('\n=== TESTING VA RATING CALCULATIONS ===');
  
  // Test some real VA calculations
  const testCases = [
    { conditions: [{ name: 'PTSD', rating: 70 }, { name: 'Tinnitus', rating: 10 }], expected: 73 },
    { conditions: [{ name: 'Back', rating: 20 }, { name: 'Knee', rating: 10 }], expected: 28 },
    { conditions: [{ name: 'PTSD', rating: 50 }, { name: 'Back', rating: 40 }, { name: 'Tinnitus', rating: 10 }], expected: 72 },
  ];
  
  testCases.forEach(({ conditions, expected }, i) => {
    // This would need the actual calculation function
    console.log(`Test ${i + 1}: ${conditions.map(c => `${c.name} ${c.rating}%`).join(' + ')} should = ${expected}%`);
  });
}

// Quick function to force regenerate data
export function forceRegenerateVeteranData() {
  console.log('Forcing veteran data regeneration...');
  
  // Clear any potential caches
  if (typeof window !== 'undefined') {
    localStorage.removeItem('veteranData');
    sessionStorage.removeItem('veteranData');
  }
  
  // Generate fresh data
  const freshData = generateEnhancedMockVeterans(10);
  console.log(`Generated ${freshData.length} fresh veterans`);
  
  return freshData;
}