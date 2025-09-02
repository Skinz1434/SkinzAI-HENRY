export interface VeteranDetails {
  // Basic Information
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  suffix?: string;
  ssn: string;
  dateOfBirth: Date;
  placeOfBirth: string;
  gender: 'Male' | 'Female';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  
  // Contact Information
  contact: {
    phone: string;
    altPhone?: string;
    email: string;
    address: {
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    mailingAddress?: {
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };

  // Service Information (MPR - Military Personnel Record)
  mpr: {
    serviceNumber: string;
    dodId: string;
    branch: string;
    component: 'Active' | 'Reserve' | 'Guard';
    rank: string;
    payGrade: string;
    serviceStartDate: Date;
    serviceEndDate: Date | null;
    totalServiceYears: number;
    totalServiceMonths: number;
    
    deployments: Array<{
      location: string;
      startDate: Date;
      endDate: Date;
      operation: string;
      awards: string[];
    }>;
    
    units: Array<{
      unitName: string;
      location: string;
      assignedDate: Date;
      departedDate: Date | null;
      duty: string;
    }>;
    
    education: {
      militaryEducation: string[];
      civilianEducation: string;
    };
    
    specialties: Array<{
      code: string;
      title: string;
      dateAchieved: Date;
      status: 'Active' | 'Inactive';
    }>;
  };

  // Medical Profile Data (MPD)
  mpd: {
    disabilityRating: number;
    effectiveDate: Date;
    
    conditions: Array<{
      code: string;
      description: string;
      rating: number;
      serviceConnected: boolean;
      dateDiagnosed: Date;
      status: 'Active' | 'Resolved' | 'Chronic';
      treatment: string;
    }>;
    
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      prescribedDate: Date;
      prescribedBy: string;
      status: 'Active' | 'Discontinued';
    }>;
    
    appointments: Array<{
      date: Date;
      type: string;
      provider: string;
      facility: string;
      status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show';
      notes?: string;
    }>;
    
    labResults: Array<{
      date: Date;
      type: string;
      result: string;
      normalRange: string;
      status: 'Normal' | 'Abnormal' | 'Critical';
    }>;
  };

  // Benefits & Compensation
  benefits: {
    compensationType: 'Disability' | 'Pension' | 'Special Monthly';
    monthlyAmount: number;
    dependents: number;
    
    education: {
      giBlllRemaining: number;
      giBlllUsed: number;
      degreeProgram?: string;
      school?: string;
    };
    
    healthcare: {
      enrollmentDate: Date;
      priorityGroup: number;
      facility: string;
      copayStatus: 'Required' | 'Exempt';
    };
    
    housing: {
      hasVALoan: boolean;
      loanAmount?: number;
      propertyAddress?: string;
    };
  };

  // Claims History
  claims: Array<{
    claimNumber: string;
    type: string;
    filingDate: Date;
    status: string;
    lastAction: string;
    lastActionDate: Date;
    estimatedCompletion?: Date;
    rating?: number;
  }>;

  // Documents
  documents: Array<{
    id: string;
    type: string;
    name: string;
    uploadDate: Date;
    size: string;
    category: 'Service' | 'Medical' | 'Benefits' | 'Claims' | 'Other';
  }>;

  // Vet Profile Sync Status
  vetProfileStatus: {
    lastSync: Date;
    accuracy: number;
    status: 'Success' | 'Partial' | 'Failed';
    dataPoints: {
      name: boolean;
      ssn: boolean;
      dob: boolean;
      serviceData: boolean;
      medicalData: boolean;
      benefitsData: boolean;
    };
    discrepancies: string[];
    fallbackUsed: boolean;
  };
}

// Generate detailed mock data for a veteran
export function generateVeteranDetails(basicInfo: any): VeteranDetails {
  const states = ['CA', 'TX', 'FL', 'NY', 'PA', 'OH', 'IL', 'GA', 'NC', 'MI'];
  const cities = ['Los Angeles', 'Houston', 'Miami', 'New York', 'Philadelphia', 'Columbus', 'Chicago', 'Atlanta', 'Charlotte', 'Detroit'];
  
  // Import proper rank data and realistic generators
  const { getRankForBranch } = require('./military-data');
  const { 
    generateDeployments, 
    generateMedicalConditions, 
    calculateCombinedRating,
    calculateMonthlyCompensation,
    generateFinancialData,
    SERVICE_ERAS,
    MOS_EXPOSURES
  } = require('./veteran-data-generator');
  
  const rankData = getRankForBranch(basicInfo.branch, Math.random() > 0.8); // 20% chance of officer
  
  // Determine service era based on age
  const age = new Date().getFullYear() - new Date(basicInfo.dateOfBirth).getFullYear();
  let serviceStart, serviceEnd;
  
  if (age > 65) {
    // Vietnam era veteran
    serviceStart = new Date(1965 + Math.floor(Math.random() * 8), 0, 1);
    serviceEnd = new Date(serviceStart.getFullYear() + 2 + Math.floor(Math.random() * 4), 0, 1);
  } else if (age > 50) {
    // Gulf War era
    serviceStart = new Date(1985 + Math.floor(Math.random() * 10), 0, 1);
    serviceEnd = new Date(serviceStart.getFullYear() + 4 + Math.floor(Math.random() * 6), 0, 1);
  } else {
    // Post-9/11 era
    serviceStart = new Date(2001 + Math.floor(Math.random() * 15), 0, 1);
    serviceEnd = new Date(serviceStart.getFullYear() + 4 + Math.floor(Math.random() * 8), 0, 1);
  }
  
  const serviceYears = serviceEnd.getFullYear() - serviceStart.getFullYear();
  
  // Generate deployments first to use in medical conditions
  const deployments = generateDeployments(basicInfo.branch, serviceStart, serviceEnd);
  
  // Get primary MOS for medical condition generation
  const serviceEra = SERVICE_ERAS.find((era: any) => 
    serviceStart.getFullYear() >= era.startYear && serviceStart.getFullYear() <= era.endYear
  ) || SERVICE_ERAS[2];
  const primaryMOS = serviceEra.commonMOS[Math.floor(Math.random() * serviceEra.commonMOS.length)];
  
  // Generate realistic medical conditions based on service history
  const medicalConditions = generateMedicalConditions(deployments, primaryMOS, age);
  
  // Calculate realistic combined disability rating
  const individualRatings = medicalConditions
    .filter((condition: any) => condition.serviceConnected)
    .map((condition: any) => condition.rating);
  const combinedRating = calculateCombinedRating(individualRatings);
  
  // Generate realistic financial data
  const hasSpouse = ['Married', 'Widowed'].includes(['Single', 'Married', 'Divorced', 'Widowed'][Math.floor(Math.random() * 4)]);
  const numChildren = hasSpouse ? Math.floor(Math.random() * 3) : 0;
  const financialData = generateFinancialData(combinedRating, hasSpouse, numChildren, age);

  return {
    id: basicInfo.id,
    firstName: basicInfo.firstName,
    lastName: basicInfo.lastName,
    middleName: ['James', 'Michael', 'Robert', 'David', 'William'][Math.floor(Math.random() * 5)],
    suffix: Math.random() > 0.8 ? ['Jr.', 'Sr.', 'II', 'III'][Math.floor(Math.random() * 4)] : undefined,
    ssn: basicInfo.ssn,
    dateOfBirth: basicInfo.dateOfBirth,
    placeOfBirth: `${cities[Math.floor(Math.random() * cities.length)]}, ${states[Math.floor(Math.random() * states.length)]}`,
    gender: Math.random() > 0.2 ? 'Male' : 'Female',
    maritalStatus: ['Single', 'Married', 'Divorced', 'Widowed'][Math.floor(Math.random() * 4)] as any,
    
    contact: {
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `${basicInfo.firstName.toLowerCase()}.${basicInfo.lastName.toLowerCase()}@email.com`,
      address: {
        street1: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Elm', 'First', 'Second'][Math.floor(Math.random() * 5)]} Street`,
        street2: Math.random() > 0.7 ? `Apt ${Math.floor(Math.random() * 999) + 1}` : undefined,
        city: cities[Math.floor(Math.random() * cities.length)],
        state: states[Math.floor(Math.random() * states.length)],
        zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        country: 'USA'
      }
    },

    mpr: {
      serviceNumber: basicInfo.serviceNumber,
      dodId: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      branch: basicInfo.branch,
      component: ['Active', 'Reserve', 'Guard'][Math.floor(Math.random() * 3)] as any,
      rank: rankData.rank,
      payGrade: rankData.payGrade,
      serviceStartDate: serviceStart,
      serviceEndDate: serviceEnd,
      totalServiceYears: serviceYears,
      totalServiceMonths: serviceYears * 12 + Math.floor(Math.random() * 12),
      
      deployments: deployments,
      
      units: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, i) => {
        const unitStart = new Date(serviceStart.getFullYear() + i * 3, Math.floor(Math.random() * 12), 1);
        return {
          unitName: `${Math.floor(Math.random() * 900) + 100}th ${['Infantry Regiment', 'Airborne Division', 'Artillery Battalion', 'Support Brigade', 'Aviation Regiment', 'Engineer Battalion'][Math.floor(Math.random() * 6)]}`,
          location: `Fort ${['Bragg', 'Hood', 'Campbell', 'Stewart', 'Carson', 'Bliss', 'Lewis'][Math.floor(Math.random() * 7)]}, ${states[Math.floor(Math.random() * states.length)]}`,
          assignedDate: unitStart,
          departedDate: i < 2 ? new Date(unitStart.getFullYear() + 3, Math.floor(Math.random() * 12), 1) : null,
          duty: ['Squad Leader', 'Platoon Sergeant', 'Operations NCO', 'Training NCO', 'First Sergeant', 'Company Commander'][Math.floor(Math.random() * 6)]
        };
      }),
      
      education: {
        militaryEducation: [
          'Basic Combat Training - Fort Benning, GA',
          'Advanced Individual Training - Fort Gordon, GA',
          'Warrior Leader Course',
          'Advanced Leader Course',
          'Senior Leader Course',
          'Airborne School',
          'Air Assault School',
          'Ranger School',
          'Special Forces Qualification Course'
        ].filter(() => Math.random() > 0.4),
        civilianEducation: ['High School Diploma', 'Associate Degree - Criminal Justice', 'Bachelor Degree - Business Administration', 'Master Degree - Public Administration'][Math.floor(Math.random() * 4)]
      },
      
      specialties: [{
        code: primaryMOS.split(' ')[0],
        title: primaryMOS,
        dateAchieved: new Date(serviceStart.getFullYear(), Math.floor(Math.random() * 12), 1),
        status: 'Active' as any
      }]
    },

    mpd: {
      disabilityRating: combinedRating,
      effectiveDate: new Date(2020, Math.floor(Math.random() * 12), 1),
      
      conditions: medicalConditions.map((condition: any) => ({
        code: condition.icd10,
        description: condition.name,
        rating: condition.rating,
        serviceConnected: condition.serviceConnected,
        dateDiagnosed: condition.diagnosedDate,
        status: (['Mild', 'Moderate'].includes(condition.severity) ? 'Active' : 'Chronic') as any,
        treatment: condition.treatment
      })),
      
      medications: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => ({
        name: ['Ibuprofen', 'Gabapentin', 'Sertraline', 'Omeprazole'][Math.floor(Math.random() * 4)],
        dosage: `${Math.floor(Math.random() * 500) + 100}mg`,
        frequency: ['Daily', 'Twice Daily', 'As Needed'][Math.floor(Math.random() * 3)],
        prescribedDate: new Date(2023, Math.floor(Math.random() * 12), 1),
        prescribedBy: `Dr. ${['Smith', 'Johnson', 'Williams'][Math.floor(Math.random() * 3)]}`,
        status: Math.random() > 0.3 ? 'Active' : 'Discontinued' as any
      })),
      
      appointments: Array.from({ length: 5 }, () => ({
        date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        type: ['Primary Care', 'Mental Health', 'Orthopedic', 'Audiology'][Math.floor(Math.random() * 4)],
        provider: `Dr. ${['Anderson', 'Brown', 'Davis'][Math.floor(Math.random() * 3)]}`,
        facility: `VA Medical Center - ${cities[Math.floor(Math.random() * cities.length)]}`,
        status: ['Scheduled', 'Completed', 'Cancelled', 'No-Show'][Math.floor(Math.random() * 4)] as any,
        notes: Math.random() > 0.7 ? 'Follow-up required' : undefined
      })),
      
      labResults: Array.from({ length: 3 }, () => ({
        date: new Date(2024, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1),
        type: ['Blood Panel', 'Urinalysis', 'X-Ray', 'MRI'][Math.floor(Math.random() * 4)],
        result: `${Math.floor(Math.random() * 100) + 50}`,
        normalRange: '60-100',
        status: ['Normal', 'Abnormal', 'Critical'][Math.floor(Math.random() * 3)] as any
      }))
    },

    benefits: {
      compensationType: combinedRating > 0 ? 'Disability' as any : 'None' as any,
      monthlyAmount: financialData.monthlyIncome.vaCompensation,
      dependents: numChildren + (hasSpouse ? 1 : 0),
      
      education: {
        giBlllRemaining: serviceYears >= 3 ? Math.floor(Math.random() * 36) : Math.floor(serviceYears * 12),
        giBlllUsed: serviceYears >= 3 ? Math.floor(Math.random() * 12) : 0,
        degreeProgram: age < 50 && Math.random() > 0.5 ? ['Computer Science', 'Business Administration', 'Criminal Justice', 'Engineering'][Math.floor(Math.random() * 4)] : undefined,
        school: age < 50 && Math.random() > 0.5 ? ['State University', 'Community College', 'Technical Institute'][Math.floor(Math.random() * 3)] : undefined
      },
      
      healthcare: {
        enrollmentDate: new Date(2020, Math.floor(Math.random() * 12), 1),
        priorityGroup: Math.floor(Math.random() * 8) + 1,
        facility: `VA Medical Center - ${cities[Math.floor(Math.random() * cities.length)]}`,
        copayStatus: Math.random() > 0.5 ? 'Required' : 'Exempt' as any
      },
      
      housing: {
        hasVALoan: Math.random() > 0.6,
        loanAmount: Math.random() > 0.6 ? Math.floor(Math.random() * 300000) + 200000 : undefined,
        propertyAddress: Math.random() > 0.6 ? `${Math.floor(Math.random() * 9999) + 1} Residential Dr` : undefined
      }
    },

    claims: basicInfo.claims || [],
    documents: [
      // Service Documents
      {
        id: 'doc-dd214',
        type: 'DD-214',
        name: 'DD214_Certificate_of_Release.pdf',
        uploadDate: new Date(2023, 0, 15),
        size: '2.4MB',
        category: 'Service' as any
      },
      {
        id: 'doc-erb',
        type: 'Enlisted Record Brief',
        name: 'ERB_Personnel_Record.pdf',
        uploadDate: new Date(2023, 1, 10),
        size: '1.8MB',
        category: 'Service' as any
      },
      {
        id: 'doc-awards',
        type: 'Awards and Decorations',
        name: 'Military_Awards_Summary.pdf',
        uploadDate: new Date(2023, 2, 5),
        size: '3.1MB',
        category: 'Service' as any
      },
      {
        id: 'doc-ncoer',
        type: 'NCO Evaluation Reports',
        name: 'NCOER_Performance_Records.pdf',
        uploadDate: new Date(2023, 3, 20),
        size: '4.2MB',
        category: 'Service' as any
      },
      // Medical Documents
      {
        id: 'doc-med-summary',
        type: 'Medical Summary',
        name: 'Complete_Medical_History.pdf',
        uploadDate: new Date(2023, 4, 12),
        size: '5.6MB',
        category: 'Medical' as any
      },
      {
        id: 'doc-c-p-exam',
        type: 'C&P Exam Results',
        name: 'Compensation_Pension_Exam.pdf',
        uploadDate: new Date(2023, 5, 8),
        size: '2.9MB',
        category: 'Medical' as any
      },
      {
        id: 'doc-nexus',
        type: 'Nexus Letter',
        name: 'Nexus_Letter_PTSD.pdf',
        uploadDate: new Date(2023, 6, 15),
        size: '856KB',
        category: 'Medical' as any
      },
      // Benefits Documents
      {
        id: 'doc-rating',
        type: 'Rating Decision',
        name: 'VA_Rating_Decision_Letter.pdf',
        uploadDate: new Date(2023, 7, 22),
        size: '1.2MB',
        category: 'Benefits' as any
      },
      {
        id: 'doc-benefits-summary',
        type: 'Benefits Summary Letter',
        name: 'Benefits_Summary_2024.pdf',
        uploadDate: new Date(2023, 8, 10),
        size: '945KB',
        category: 'Benefits' as any
      },
      // Claims Documents
      {
        id: 'doc-claim-526',
        type: 'VA Form 21-526EZ',
        name: 'Disability_Compensation_Application.pdf',
        uploadDate: new Date(2023, 9, 5),
        size: '1.5MB',
        category: 'Claims' as any
      },
      {
        id: 'doc-claim-evidence',
        type: 'Supporting Evidence',
        name: 'Claim_Supporting_Documents.pdf',
        uploadDate: new Date(2023, 10, 18),
        size: '3.8MB',
        category: 'Claims' as any
      },
      // Additional Documents
      ...Array.from({ length: Math.floor(Math.random() * 5) + 3 }, (_, i) => ({
        id: `doc-additional-${i}`,
        type: ['Treatment Record', 'Lab Results', 'Prescription History', 'Appointment Summary', 'Insurance Card'][Math.floor(Math.random() * 5)],
        name: `Medical_Document_${2023}_${i + 1}.pdf`,
        uploadDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        size: `${Math.floor(Math.random() * 2000) + 500}KB`,
        category: 'Medical' as any
      }))
    ],

    vetProfileStatus: {
      lastSync: basicInfo.lastSyncDate || new Date(),
      accuracy: basicInfo.accuracy || (96 + Math.random() * 3),
      status: basicInfo.accuracy > 95 ? 'Success' : 'Partial' as any,
      dataPoints: {
        name: true,
        ssn: true,
        dob: true,
        serviceData: Math.random() > 0.1,
        medicalData: Math.random() > 0.15,
        benefitsData: Math.random() > 0.1
      },
      discrepancies: Math.random() > 0.8 ? ['Service end date mismatch', 'Disability rating pending update'] : [],
      fallbackUsed: basicInfo.vetProfileSyncStatus?.fallbackToDD214 || false
    }
  };
}