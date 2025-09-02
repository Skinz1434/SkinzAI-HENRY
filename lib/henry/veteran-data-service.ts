// Veteran Data Service - Central source of truth for all veteran data
// This service ensures consistent data across all platform components

export interface VeteranProfile {
  // Personal Information
  id: string;
  name: string;
  ssn: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };

  // Military Service
  branch: string;
  serviceYears: string;
  dischargeStatus: string;
  dischargeDate: string;
  rank: string;
  mos: string;
  unit?: string;
  combatService: boolean;
  deployments: Array<{
    location: string;
    startDate: string;
    endDate: string;
    exposures: string[];
  }>;
  awards: string[];

  // Disability & Claims
  disabilityRating: number;
  claimStatus: 'active' | 'pending' | 'approved' | 'denied';
  conditions: Array<{
    name: string;
    rating: number;
    serviceConnected: boolean;
    effectiveDate: string;
    diagnosticCode: string;
    status: 'active' | 'static' | 'improved' | 'pending';
  }>;
  pendingClaims: Array<{
    condition: string;
    filedDate: string;
    status: string;
    lastUpdate: string;
    expectedDecision?: string;
  }>;

  // E-Folder Documents
  documents: Array<{
    id: string;
    filename: string;
    type: string;
    uploadDate: string;
    source: 'va' | 'veteran' | 'provider' | 'vso';
    category: string;
    pages: number;
    tags: string[];
    isReviewed: boolean;
    relevantTo?: string[];
  }>;

  // Benefits & Compensation
  monthlyCompensation: number;
  educationBenefits: {
    gibBillRemaining: number;
    degreeProgram: string;
    enrollmentStatus: string;
    school?: string;
  };
  healthcarePriority: number;
  enrolledVAHealthcare: boolean;
  vaPension?: number;
  specialMonthlyCompensation?: number;

  // Medical History
  medications: Array<{
    name: string;
    dosage: string;
    prescriber: string;
    startDate: string;
    activeRx: boolean;
  }>;
  appointments: Array<{
    date: string;
    provider: string;
    type: string;
    location: string;
    notes: string;
    completed: boolean;
  }>;
  surgeries: Array<{
    procedure: string;
    date: string;
    facility: string;
    outcome?: string;
  }>;
  allergies: string[];
  
  // Financial
  income: {
    vaDisability: number;
    ssdi: number;
    pension: number;
    employment: number;
    other: number;
  };
  dependents: number;
  spouseInfo?: {
    name: string;
    ssn: string;
    dob: string;
  };
  childrenInfo?: Array<{
    name: string;
    dob: string;
    ssn?: string;
    inSchool: boolean;
  }>;

  // Activity & Engagement
  lastActivity: string;
  lastLogin?: string;
  communicationPreference: 'email' | 'phone' | 'mail' | 'text';
  vsoRepresentative?: {
    organization: string;
    representative: string;
    contact: string;
  };
  
  // Flags & Alerts
  flags: Array<{
    type: 'urgent' | 'review' | 'followup' | 'risk';
    message: string;
    date: string;
    resolvedDate?: string;
  }>;
  riskFactors?: string[];
  specialCircumstances?: string[];
}

class VeteranDataService {
  private veterans: Map<string, VeteranProfile> = new Map();
  private currentVeteranId: string | null = null;

  constructor() {
    // Initialize with sample data
    this.loadSampleData();
  }

  private loadSampleData() {
    const sampleVeterans: VeteranProfile[] = [
      {
        id: 'VET-2024-001',
        name: 'John Alexander Smith',
        ssn: '***-**-6789',
        dob: '1985-03-15',
        gender: 'Male',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        address: {
          street: '123 Veteran Way',
          city: 'Arlington',
          state: 'VA',
          zip: '22201'
        },
        branch: 'Army',
        serviceYears: '2003-2011',
        dischargeStatus: 'Honorable',
        dischargeDate: '2011-08-15',
        rank: 'Staff Sergeant (E-6)',
        mos: '11B - Infantry',
        unit: '1st Infantry Division',
        combatService: true,
        deployments: [
          {
            location: 'Iraq - Baghdad',
            startDate: '2004-03-01',
            endDate: '2005-03-01',
            exposures: ['Burn pits', 'IEDs', 'Combat operations']
          },
          {
            location: 'Afghanistan - Kandahar',
            startDate: '2009-06-01',
            endDate: '2010-06-01',
            exposures: ['Burn pits', 'Combat operations', 'Blast exposure']
          }
        ],
        awards: [
          'Purple Heart',
          'Bronze Star',
          'Army Commendation Medal (2)',
          'Combat Infantry Badge'
        ],
        disabilityRating: 70,
        claimStatus: 'active',
        conditions: [
          {
            name: 'PTSD',
            rating: 50,
            serviceConnected: true,
            effectiveDate: '2012-01-15',
            diagnosticCode: '9411',
            status: 'active'
          },
          {
            name: 'Lumbar Strain',
            rating: 20,
            serviceConnected: true,
            effectiveDate: '2012-01-15',
            diagnosticCode: '5237',
            status: 'static'
          },
          {
            name: 'Tinnitus',
            rating: 10,
            serviceConnected: true,
            effectiveDate: '2012-01-15',
            diagnosticCode: '6260',
            status: 'static'
          }
        ],
        pendingClaims: [
          {
            condition: 'Sleep Apnea (Secondary to PTSD)',
            filedDate: '2024-01-15',
            status: 'Gathering Evidence',
            lastUpdate: '2024-02-20',
            expectedDecision: '2024-04-15'
          }
        ],
        documents: [
          {
            id: 'DOC-BHSAHX',
            filename: '2015-07-04__DD214.txt',
            type: 'DD-214',
            uploadDate: '2015-07-04',
            source: 'veteran',
            category: 'Service Records',
            pages: 7,
            tags: ['discharge', 'service', 'PTSD', 'Sleep disturbance'],
            isReviewed: true,
            relevantTo: ['PTSD', 'Sleep disturbance']
          },
          {
            id: 'DOC-FYVNVQ',
            filename: '2024-01-28__C&P_Exam_Report.txt',
            type: 'C&P Exam',
            uploadDate: '2024-01-28',
            source: 'va',
            category: 'Medical Evidence',
            pages: 5,
            tags: ['PTSD', 'C&P exam', 'medical'],
            isReviewed: true,
            relevantTo: ['PTSD']
          },
          {
            id: 'DOC-NMMJBQ',
            filename: '2012-01-30__STR_1.txt',
            type: 'Service Treatment Record',
            uploadDate: '2012-01-30',
            source: 'va',
            category: 'Medical Evidence',
            pages: 2,
            tags: ['PTSD', 'service treatment', 'medical'],
            isReviewed: true,
            relevantTo: ['PTSD']
          },
          {
            id: 'DOC-G0FN9X',
            filename: '2024-03-29__VHA_Note_1.txt',
            type: 'VHA Progress Note',
            uploadDate: '2024-03-29',
            source: 'va',
            category: 'Medical Evidence',
            pages: 4,
            tags: ['PTSD', 'VHA', 'progress note'],
            isReviewed: true,
            relevantTo: ['PTSD']
          },
          {
            id: 'DOC-OH9SDB',
            filename: '2023-02-02__Buddy_Statement.txt',
            type: 'Buddy/Lay Statement',
            uploadDate: '2023-02-02',
            source: 'veteran',
            category: 'Supporting Evidence',
            pages: 2,
            tags: ['PTSD', 'buddy statement', 'witness'],
            isReviewed: true,
            relevantTo: ['PTSD']
          }
        ],
        monthlyCompensation: 1716.28,
        educationBenefits: {
          gibBillRemaining: 24,
          degreeProgram: 'Computer Science',
          enrollmentStatus: 'Part-time',
          school: 'George Mason University'
        },
        healthcarePriority: 2,
        enrolledVAHealthcare: true,
        medications: [
          {
            name: 'Sertraline',
            dosage: '100mg daily',
            prescriber: 'Dr. Johnson - VA',
            startDate: '2012-03-01',
            activeRx: true
          },
          {
            name: 'Prazosin',
            dosage: '5mg at bedtime',
            prescriber: 'Dr. Johnson - VA',
            startDate: '2013-01-15',
            activeRx: true
          }
        ],
        appointments: [
          {
            date: '2024-03-15',
            provider: 'Dr. Johnson',
            type: 'Mental Health',
            location: 'VA Medical Center',
            notes: 'Routine follow-up',
            completed: false
          }
        ],
        surgeries: [
          {
            procedure: 'Arthroscopic Knee Surgery',
            date: '2015-06-15',
            facility: 'VA Medical Center - Washington DC',
            outcome: 'Successful'
          }
        ],
        allergies: ['Penicillin'],
        income: {
          vaDisability: 1716.28,
          ssdi: 0,
          pension: 0,
          employment: 3500,
          other: 0
        },
        dependents: 2,
        spouseInfo: {
          name: 'Jane Smith',
          ssn: '***-**-5432',
          dob: '1987-07-20'
        },
        childrenInfo: [
          {
            name: 'Emily Smith',
            dob: '2012-09-10',
            inSchool: true
          }
        ],
        lastActivity: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        communicationPreference: 'email',
        vsoRepresentative: {
          organization: 'DAV',
          representative: 'Tom Johnson',
          contact: '(555) 987-6543'
        },
        flags: [],
        riskFactors: ['PTSD', 'Chronic Pain'],
        specialCircumstances: ['Combat Veteran', 'Purple Heart Recipient']
      },
      {
        id: 'VET-2024-002',
        name: 'Maria Elena Rodriguez',
        ssn: '***-**-4321',
        dob: '1990-07-22',
        gender: 'Female',
        email: 'maria.rodriguez@email.com',
        phone: '(555) 234-5678',
        address: {
          street: '456 Liberty Lane',
          city: 'San Antonio',
          state: 'TX',
          zip: '78201'
        },
        branch: 'Air Force',
        serviceYears: '2008-2016',
        dischargeStatus: 'Honorable',
        dischargeDate: '2016-12-01',
        rank: 'Technical Sergeant (E-6)',
        mos: '4N0X1 - Aerospace Medical',
        unit: '59th Medical Wing',
        combatService: false,
        deployments: [
          {
            location: 'Qatar - Al Udeid',
            startDate: '2012-01-01',
            endDate: '2012-07-01',
            exposures: ['Burn pits', 'Desert particulates']
          }
        ],
        awards: [
          'Air Force Commendation Medal',
          'Air Force Achievement Medal (2)',
          'National Defense Service Medal'
        ],
        disabilityRating: 40,
        claimStatus: 'pending',
        conditions: [
          {
            name: 'Asthma',
            rating: 30,
            serviceConnected: true,
            effectiveDate: '2017-02-01',
            diagnosticCode: '6602',
            status: 'active'
          },
          {
            name: 'Right Shoulder Strain',
            rating: 10,
            serviceConnected: true,
            effectiveDate: '2017-02-01',
            diagnosticCode: '5201',
            status: 'improved'
          }
        ],
        pendingClaims: [
          {
            condition: 'Sinusitis',
            filedDate: '2024-02-01',
            status: 'Initial Review',
            lastUpdate: '2024-02-15'
          }
        ],
        documents: [
          {
            id: 'doc-003',
            filename: 'DD214_Rodriguez_Maria.pdf',
            type: 'DD-214',
            uploadDate: '2017-01-01',
            source: 'veteran',
            category: 'Service Records',
            pages: 2,
            tags: ['discharge', 'service-verification'],
            isReviewed: true
          }
        ],
        monthlyCompensation: 635.77,
        educationBenefits: {
          gibBillRemaining: 36,
          degreeProgram: 'Nursing',
          enrollmentStatus: 'Full-time',
          school: 'University of Texas'
        },
        healthcarePriority: 3,
        enrolledVAHealthcare: true,
        medications: [
          {
            name: 'Albuterol Inhaler',
            dosage: 'As needed',
            prescriber: 'Dr. Martinez - VA',
            startDate: '2017-03-01',
            activeRx: true
          }
        ],
        appointments: [
          {
            date: '2024-03-20',
            provider: 'Dr. Martinez',
            type: 'Pulmonology',
            location: 'VA Clinic - San Antonio',
            notes: 'Asthma follow-up',
            completed: false
          }
        ],
        surgeries: [],
        allergies: [],
        income: {
          vaDisability: 635.77,
          ssdi: 0,
          pension: 0,
          employment: 4200,
          other: 0
        },
        dependents: 0,
        lastActivity: new Date(Date.now() - 86400000).toISOString(),
        communicationPreference: 'text',
        flags: [
          {
            type: 'followup',
            message: 'Pending claim requires additional evidence',
            date: '2024-02-15'
          }
        ]
      },
      {
        id: 'VET-2024-003',
        name: 'Robert James Wilson',
        ssn: '***-**-9876',
        dob: '1975-11-30',
        gender: 'Male',
        email: 'robert.wilson@email.com',
        phone: '(555) 345-6789',
        address: {
          street: '789 Honor Drive',
          city: 'Colorado Springs',
          state: 'CO',
          zip: '80901'
        },
        branch: 'Navy',
        serviceYears: '1993-2013',
        dischargeStatus: 'Honorable (Retired)',
        dischargeDate: '2013-11-30',
        rank: 'Chief Petty Officer (E-7)',
        mos: 'HM - Hospital Corpsman',
        unit: 'USS Theodore Roosevelt',
        combatService: true,
        deployments: [
          {
            location: 'Persian Gulf',
            startDate: '2003-01-01',
            endDate: '2003-08-01',
            exposures: ['Ship emissions', 'Combat operations']
          },
          {
            location: 'Afghanistan - Helmand',
            startDate: '2010-01-01',
            endDate: '2010-12-01',
            exposures: ['Combat operations', 'Blast exposure']
          }
        ],
        awards: [
          'Navy Commendation Medal (3)',
          'Navy Achievement Medal (2)',
          'Combat Action Ribbon'
        ],
        disabilityRating: 90,
        claimStatus: 'approved',
        conditions: [
          {
            name: 'TBI',
            rating: 40,
            serviceConnected: true,
            effectiveDate: '2014-01-01',
            diagnosticCode: '8045',
            status: 'static'
          },
          {
            name: 'PTSD',
            rating: 50,
            serviceConnected: true,
            effectiveDate: '2014-01-01',
            diagnosticCode: '9411',
            status: 'active'
          },
          {
            name: 'Bilateral Hearing Loss',
            rating: 20,
            serviceConnected: true,
            effectiveDate: '2014-01-01',
            diagnosticCode: '6100',
            status: 'static'
          }
        ],
        pendingClaims: [],
        documents: [
          {
            id: 'doc-004',
            filename: 'Retirement_DD214_Wilson.pdf',
            type: 'DD-214',
            uploadDate: '2014-01-01',
            source: 'va',
            category: 'Service Records',
            pages: 3,
            tags: ['retirement', 'service-verification'],
            isReviewed: true
          }
        ],
        monthlyCompensation: 2172.39,
        educationBenefits: {
          gibBillRemaining: 0,
          degreeProgram: 'Completed',
          enrollmentStatus: 'Graduated'
        },
        healthcarePriority: 1,
        enrolledVAHealthcare: true,
        vaPension: 0,
        specialMonthlyCompensation: 114.04,
        medications: [
          {
            name: 'Topiramate',
            dosage: '100mg twice daily',
            prescriber: 'Dr. Anderson - VA',
            startDate: '2014-02-01',
            activeRx: true
          }
        ],
        appointments: [
          {
            date: '2024-04-01',
            provider: 'Dr. Anderson',
            type: 'Neurology',
            location: 'VA Medical Center - Denver',
            notes: 'TBI follow-up',
            completed: false
          }
        ],
        surgeries: [],
        allergies: ['Sulfa drugs'],
        income: {
          vaDisability: 2172.39,
          ssdi: 1200,
          pension: 2500,
          employment: 0,
          other: 0
        },
        dependents: 3,
        spouseInfo: {
          name: 'Linda Wilson',
          ssn: '***-**-3456',
          dob: '1977-03-15'
        },
        childrenInfo: [
          {
            name: 'Michael Wilson',
            dob: '2005-06-20',
            inSchool: true
          },
          {
            name: 'Sarah Wilson',
            dob: '2008-09-15',
            inSchool: true
          }
        ],
        lastActivity: new Date(Date.now() - 172800000).toISOString(),
        communicationPreference: 'phone',
        flags: [],
        specialCircumstances: ['100% P&T Eligible', 'Combat Veteran']
      }
    ];

    sampleVeterans.forEach(veteran => {
      this.veterans.set(veteran.id, veteran);
    });
  }

  // Get all veterans
  getAllVeterans(): VeteranProfile[] {
    return Array.from(this.veterans.values());
  }

  // Get a specific veteran by ID
  getVeteran(id: string): VeteranProfile | null {
    return this.veterans.get(id) || null;
  }

  // Get current selected veteran
  getCurrentVeteran(): VeteranProfile | null {
    if (!this.currentVeteranId) return null;
    return this.getVeteran(this.currentVeteranId);
  }

  // Set current veteran
  setCurrentVeteran(id: string): void {
    this.currentVeteranId = id;
  }

  // Search veterans
  searchVeterans(query: string): VeteranProfile[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllVeterans().filter(veteran => 
      veteran.name.toLowerCase().includes(lowerQuery) ||
      veteran.ssn.includes(query) ||
      veteran.branch.toLowerCase().includes(lowerQuery) ||
      veteran.conditions.some(c => c.name.toLowerCase().includes(lowerQuery))
    );
  }

  // Get veterans by status
  getVeteransByStatus(status: 'active' | 'pending' | 'approved' | 'denied'): VeteranProfile[] {
    return this.getAllVeterans().filter(v => v.claimStatus === status);
  }

  // Get veterans with pending actions
  getVeteransWithPendingActions(): VeteranProfile[] {
    return this.getAllVeterans().filter(v => 
      v.pendingClaims.length > 0 || 
      v.flags.some(f => f.type === 'urgent' || f.type === 'followup')
    );
  }

  // Update veteran data
  updateVeteran(id: string, updates: Partial<VeteranProfile>): void {
    const veteran = this.getVeteran(id);
    if (veteran) {
      this.veterans.set(id, { ...veteran, ...updates, lastActivity: new Date().toISOString() });
    }
  }

  // Get veteran's e-folder documents
  getVeteranDocuments(id: string): VeteranProfile['documents'] {
    const veteran = this.getVeteran(id);
    return veteran?.documents || [];
  }

  // Add document to veteran's e-folder
  addDocument(veteranId: string, document: VeteranProfile['documents'][0]): void {
    const veteran = this.getVeteran(veteranId);
    if (veteran) {
      veteran.documents.push(document);
      this.updateVeteran(veteranId, { documents: veteran.documents });
    }
  }

  // Get aggregated statistics
  getStatistics() {
    const veterans = this.getAllVeterans();
    return {
      totalVeterans: veterans.length,
      averageRating: Math.round(veterans.reduce((sum, v) => sum + v.disabilityRating, 0) / veterans.length),
      byBranch: {
        army: veterans.filter(v => v.branch === 'Army').length,
        navy: veterans.filter(v => v.branch === 'Navy').length,
        airForce: veterans.filter(v => v.branch === 'Air Force').length,
        marines: veterans.filter(v => v.branch === 'Marines').length,
        coastGuard: veterans.filter(v => v.branch === 'Coast Guard').length,
        spaceForce: veterans.filter(v => v.branch === 'Space Force').length
      },
      byStatus: {
        active: veterans.filter(v => v.claimStatus === 'active').length,
        pending: veterans.filter(v => v.claimStatus === 'pending').length,
        approved: veterans.filter(v => v.claimStatus === 'approved').length,
        denied: veterans.filter(v => v.claimStatus === 'denied').length
      },
      pendingClaims: veterans.reduce((sum, v) => sum + v.pendingClaims.length, 0),
      totalDocuments: veterans.reduce((sum, v) => sum + v.documents.length, 0)
    };
  }
}

// Export singleton instance
export const veteranDataService = new VeteranDataService();