import { Veteran, Claim, Branch, DischargeStatus, ClaimType, ClaimStatus } from '@/types';
import { getRankForBranch } from './military-data';

// Generate realistic mock veteran data
export function generateMockVeterans(count: number = 100): Veteran[] {
  const firstNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Mary', 'Patricia', 'Jennifer', 'Linda'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const veterans: Veteran[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const serviceStartYear = 1970 + Math.floor(Math.random() * 40);
    const serviceYears = 2 + Math.floor(Math.random() * 20);
    const branch = Object.values(Branch)[Math.floor(Math.random() * Object.values(Branch).length)];
    
    // More realistic discharge distribution - 85% honorable, 10% general, 5% other
    const dischargeRandom = Math.random();
    let dischargeStatus: DischargeStatus;
    let eligibleForBenefits = true;
    
    if (dischargeRandom < 0.85) {
      dischargeStatus = DischargeStatus.HONORABLE;
    } else if (dischargeRandom < 0.95) {
      dischargeStatus = DischargeStatus.GENERAL;
    } else if (dischargeRandom < 0.97) {
      dischargeStatus = DischargeStatus.OTHER_THAN_HONORABLE;
      eligibleForBenefits = false;
    } else if (dischargeRandom < 0.99) {
      dischargeStatus = DischargeStatus.BAD_CONDUCT;
      eligibleForBenefits = false;
    } else {
      dischargeStatus = DischargeStatus.DISHONORABLE;
      eligibleForBenefits = false;
    }
    
    // Only veterans with eligible discharge status get claims and disability ratings
    const claimCount = eligibleForBenefits ? Math.floor(Math.random() * 3) + 2 : 0; // 2-4 claims for eligible, 0 for ineligible
    const disabilityRating = eligibleForBenefits ? Math.floor(Math.random() * 101) : 0;
    
    veterans.push({
      id: `vet-${i + 1}`,
      firstName,
      lastName,
      ssn: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000) + 1000}`,
      dateOfBirth: new Date(1950 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      serviceNumber: `SN${Math.floor(Math.random() * 9000000) + 1000000}`,
      branch,
      serviceStartDate: new Date(serviceStartYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      serviceEndDate: new Date(serviceStartYear + serviceYears, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      dischargeStatus,
      disabilityRating,
      claims: generateMockClaims(claimCount),
      documents: [],
      vetProfileSyncStatus: {
        status: Math.random() > 0.03 ? 'success' : 'fallback',
        lastSync: new Date(Date.now() - Math.floor(Math.random() * 86400000)),
        accuracy: 95 + Math.random() * 5,
        errorMessage: null,
        fallbackToDD214: Math.random() < 0.03,
        syncAttempts: Math.floor(Math.random() * 5) + 1
      },
      lastSyncDate: new Date(Date.now() - Math.floor(Math.random() * 86400000)),
      accuracy: 95 + Math.random() * 5,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 31536000000)),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 2592000000))
    });
  }
  
  return veterans;
}

function generateMockClaims(count: number): Claim[] {
  const claims: Claim[] = [];
  const lastActions = [
    'Evidence requested from veteran',
    'C&P exam scheduled',
    'Medical records under review',
    'Rating decision in progress',
    'Additional information needed',
    'Claim moved to review phase'
  ];
  
  for (let i = 0; i < count; i++) {
    claims.push({
      id: `claim-${Date.now()}-${i}`,
      veteranId: '',
      claimNumber: `CL${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
      type: Object.values(ClaimType)[Math.floor(Math.random() * Object.values(ClaimType).length)],
      status: Object.values(ClaimStatus)[Math.floor(Math.random() * Object.values(ClaimStatus).length)],
      filingDate: new Date(Date.now() - Math.floor(Math.random() * 31536000000)),
      lastActionDate: new Date(Date.now() - Math.floor(Math.random() * 2592000000)),
      lastAction: lastActions[Math.floor(Math.random() * lastActions.length)],
      estimatedCompletionDate: new Date(Date.now() + Math.floor(Math.random() * 7776000000)),
      estimatedCompletion: new Date(Date.now() + Math.floor(Math.random() * 7776000000)),
      rating: Math.random() > 0.5 ? Math.floor(Math.random() * 101) : null,
      description: 'Service-connected disability claim for evaluation',
      evidence: [],
      notes: []
    });
  }
  
  return claims;
}

// Mock API functions
export async function mockFetchVeterans(page: number = 1, limit: number = 20, filters?: any) {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  
  const allVeterans = generateMockVeterans(500);
  let filtered = [...allVeterans];
  
  // Apply filters
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(v => 
      v.firstName.toLowerCase().includes(search) ||
      v.lastName.toLowerCase().includes(search) ||
      v.ssn.includes(search) ||
      v.serviceNumber.toLowerCase().includes(search)
    );
  }
  
  if (filters?.branch) {
    filtered = filtered.filter(v => v.branch === filters.branch);
  }
  
  if (filters?.status) {
    filtered = filtered.filter(v => v.dischargeStatus === filters.status);
  }
  
  if (filters?.syncStatus) {
    filtered = filtered.filter(v => v.vetProfileSyncStatus.status === filters.syncStatus);
  }
  
  // Paginate
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);
  
  return {
    data: paginated,
    total: filtered.length,
    page,
    limit,
    hasMore: end < filtered.length
  };
}

export async function mockSyncVetProfile(veteranId: string) {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
  
  const success = Math.random() > 0.05; // 95% success rate
  const accuracy = success ? 96 + Math.random() * 3 : 0;
  
  return {
    success,
    accuracy,
    dataUpdated: success,
    fallbackUsed: !success,
    syncDate: new Date(),
    errors: success ? [] : ['Vet Profile API timeout - falling back to DD-214']
  };
}

export async function mockProcessClaim(claimId: string) {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const success = Math.random() > 0.1;
  return {
    success,
    message: success ? 'Claim processed successfully' : 'Processing failed - manual review required',
    nextStatus: success ? 'UNDER_REVIEW' : 'PENDING'
  };
}

export async function mockUploadDocument(file: File, veteranId: string) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    documentId: `doc-${Date.now()}`,
    url: URL.createObjectURL(file),
    message: 'Document uploaded successfully'
  };
}

export async function mockGeneratePDF(veteranId: string, type: string) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    url: `blob:pdf-${veteranId}-${type}`,
    message: 'PDF generated successfully'
  };
}

export async function mockExportData(format: 'csv' | 'xlsx', data: any[]) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create mock CSV content
  if (format === 'csv') {
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(item => Object.values(item).join(',')).join('\\n');
    const csv = `${headers}\\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    return URL.createObjectURL(blob);
  }
  
  // For Excel, we'd use a library like xlsx
  return 'mock-excel-file-url';
}