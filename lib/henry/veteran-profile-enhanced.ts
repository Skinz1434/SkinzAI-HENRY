import { VeteranDetails } from './veteran-details';
import { 
  generateDeployments, 
  generateMedicalConditions, 
  calculateCombinedRating,
  calculateMonthlyCompensation,
  generateFinancialData,
  SERVICE_ERAS,
  MOS_EXPOSURES
} from './veteran-data-generator';

// Generate enhanced profile from basic veteran details
export function generateVeteranProfileEnhanced(details: VeteranDetails): VeteranProfileEnhanced {
  return {
    ...details,
    analytics: {
      trends: {
        ratingHistory: [
          { date: new Date(2020, 0, 1), rating: 30 },
          { date: new Date(2021, 0, 1), rating: 50 },
          { date: new Date(2022, 0, 1), rating: 70 },
          { date: new Date(2023, 0, 1), rating: details.mpd.disabilityRating || 70 }
        ],
        claimsSuccess: 0.75,
        avgProcessingDays: 127,
        benefitsUtilization: 0.82,
        healthScores: [
          { month: 'Jan', score: 75 },
          { month: 'Feb', score: 78 },
          { month: 'Mar', score: 82 },
          { month: 'Apr', score: 80 },
          { month: 'May', score: 85 },
          { month: 'Jun', score: 88 }
        ],
        benefitHistory: [
          { date: new Date(2023, 0, 1), amount: 1500 },
          { date: new Date(2023, 3, 1), amount: 1650 },
          { date: new Date(2023, 6, 1), amount: 1800 },
          { date: new Date(2023, 9, 1), amount: 2000 }
        ],
        claimHistory: [
          { date: new Date(2022, 0, 1), status: 'Approved' },
          { date: new Date(2022, 6, 1), status: 'Approved' },
          { date: new Date(2023, 0, 1), status: 'Pending' }
        ]
      },
      predictions: {
        nextAppointment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        claimCompletion: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        ratingIncreaseLikelihood: 0.65,
        nextClaimApprovalProbability: 0.75,
        appealSuccessProbability: 0.60,
        estimatedProcessingDays: 120
      },
      riskScores: {
        healthRisk: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        financialRisk: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
        housingRisk: Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
        mentalHealthRisk: Math.random() > 0.5 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
        suicideRisk: Math.random() > 0.9 ? 'high' : Math.random() > 0.7 ? 'medium' : 'low',
        homelessnessRisk: Math.random() > 0.85 ? 'high' : Math.random() > 0.6 ? 'medium' : 'low',
        substanceAbuseRisk: Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low'
      },
      engagement: {
        benefitUtilization: 60 + Math.random() * 35,  // 60-95% utilization
        appointmentCompliance: 70 + Math.random() * 25,  // 70-95% compliance
        portalUsage: 40 + Math.random() * 40,  // 40-80% portal usage
        claimsActivity: 30 + Math.random() * 50,  // 30-80% claims activity
        appointmentShowRate: 75 + Math.random() * 20,  // 75-95% show rate
        medicationAdherence: 80 + Math.random() * 15,  // 80-95% adherence
        portalUsageMinutes: Math.floor(Math.random() * 120) + 30,  // 30-150 minutes
        lastPortalLogin: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))  // Within last 30 days
      },
      comparisons: {
        vsNationalAverage: {
          rating: Math.random() * 40 - 20,  // -20 to +20 percentage points
          benefits: Math.random() * 30 - 15, // -15 to +15 percentage points
          healthcare: Math.random() * 25 - 10 // -10 to +15 percentage points
        },
        vsPeerGroup: {
          rating: Math.random() * 30 - 15,
          benefits: Math.random() * 20 - 10,
          healthcare: Math.random() * 20 - 10
        }
      }
    },
    profileServices: {
      eligibility: {
        vaHealthcare: { 
          eligible: true, 
          enrollmentGroup: 'Priority Group 1',
          enrollmentDate: new Date(2020, 0, 1), 
          copayRequired: false,
          catastrophicCap: 3000,
          medicareEligible: false,
          medicaidEligible: false
        },
        compensationBenefits: { 
          eligible: true, 
          currentRating: details.mpd.disabilityRating,
          combinedRating: details.mpd.disabilityRating,
          individualRatings: details.mpd.conditions.map(c => ({
            condition: c.description,
            rating: c.rating,
            effectiveDate: details.mpd.effectiveDate,
            static: true
          })),
          futureExams: []
        },
        educationBenefits: { 
          chapter33: true, 
          chapter30: false,
          monthsRemaining: details.benefits.education.giBlllRemaining,
          exhaustionDate: new Date(2030, 0, 1),
          certificateOfEligibility: 'COE-12345',
          yellowRibbon: false,
          stemExtension: false
        },
        homeLoan: { 
          eligible: true, 
          entitlement: 424100,
          used: details.benefits.housing.loanAmount || 0,
          available: 424100 - (details.benefits.housing.loanAmount || 0),
          coe: 'COE-HL-789',
          previousLoans: details.benefits.housing.hasVALoan ? 1 : 0
        },
        burialBenefits: { 
          eligible: true, 
          prePlanned: false,
          cemetery: 'Arlington National Cemetery',
          plotAllowance: 890
        },
        vocationalRehab: { 
          eligible: true, 
          chapter31: true,
          monthsRemaining: 36,
          counselorAssigned: 'Jane Smith',
          plan: 'Computer Science Degree'
        },
        pensionBenefits: { eligible: false },
        spouseBenefits: { eligible: true, enrollmentDate: new Date(2019, 0, 1), percentageUsed: 20 }
      },
      awards: [
        { name: 'Purple Heart', date: new Date(2008, 5, 15), citation: 'For wounds received in combat', image: '', precedence: 1, category: 'valor' },
        { name: 'Bronze Star Medal', date: new Date(2009, 2, 10), citation: 'For heroic service', image: '', precedence: 2, category: 'valor' }
      ],
      treatmentRecords: [
        { 
          date: new Date(2023, 10, 15), 
          facility: 'VA Medical Center', 
          provider: 'Dr. Smith', 
          chiefComplaint: 'Mental Health',
          diagnosis: 'PTSD',
          treatment: 'Cognitive Behavioral Therapy',
          followUp: 'Follow up in 4 weeks',
          documents: ['treatment-note-123.pdf']
        }
      ],
      dependents: [],
      financial: {
        monthlyIncome: 3500,
        creditScore: 720,
        directDeposit: {
          accountType: 'checking',
          routingNumber: '123456789',
          accountNumber: '987654321',
          bankName: 'Navy Federal Credit Union'
        },
        debts: [],
        payments: [
          { date: new Date(), amount: calculateMonthlyCompensation(details.mpd.disabilityRating || 0, false, 0), type: 'Disability', description: 'Monthly VA disability payment' }
        ],
        taxDocuments: [
          { year: 2023, type: '1099-G', available: true, downloadUrl: '/tax/2023/1099g' }
        ]
      },
      representation: {
        hasPOA: true,
        poaName: 'DAV',
        poaOrganization: 'Disabled American Veterans',
        poaPhone: '1-800-555-0100',
        poaEmail: 'dav@example.com'
      },
      exposures: details.mpr?.deployments?.map(d => ({
        type: 'Combat',
        location: d.location,
        startDate: d.startDate,
        endDate: d.endDate,
        confirmed: true,
        presumptive: false,
        relatedConditions: []
      })) || [],
      travel: {
        benefitEligible: true,
        specialMode: false,
        reimbursements: []
      },
      legalInfo: {
        powerOfAttorney: {
          name: 'DAV',
          type: 'Claims',
          date: new Date(2020, 0, 1)
        },
        powerOfAttorneyHistory: [
          {
            name: 'DAV',
            type: 'Claims',
            date: new Date(2020, 0, 1),
            status: 'Active',
            form2122: 'VA Form 21-22 Filed'
          }
        ],
        willStatus: true,
        willLastUpdated: new Date(2021, 0, 1),
        advanceDirectives: true,
        representation: {
          attorney: 'None',
          vso: 'DAV'
        },
        form2122History: [
          {
            formId: 'VA21-22-001',
            dateFiled: new Date(2020, 0, 1),
            representative: 'DAV',
            type: 'Claims',
            status: 'Active',
            effectiveDate: new Date(2020, 0, 15),
            expirationDate: new Date(2025, 0, 1)
          }
        ],
        pendingActions: [],
        beneficiaries: [
          { name: 'Jane Doe', relationship: 'Spouse', percentage: 100 }
        ]
      },
      integrations: {
        myHealtheVet: { connected: true, lastSync: new Date(), status: 'Active' },
        vaBenefits: { connected: true, lastSync: new Date(), status: 'Active' },
        communityCareCar: { connected: false, lastSync: null, status: 'Not Connected' },
        dodSelfService: { connected: true, lastSync: new Date(Date.now() - 86400000), status: 'Active' },
        tricare: { connected: true, lastSync: new Date(), status: 'Active' }
      },
      communications: {
        messages: [{ id: '1', date: new Date(), from: 'VA Benefits', subject: 'Claim Status Update', read: false, priority: 'high' }],
        notifications: [{ id: '1', date: new Date(), type: 'alert', message: 'New prescription ready', actionRequired: true }],
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          phoneCallsAllowed: true,
          preferredContactTime: '9AM - 5PM',
          language: 'English'
        }
      },
      auditTrail: [{ timestamp: new Date(), action: 'Profile Accessed', user: 'System Admin', details: 'Routine review', system: 'HENRY' }],
      qualityMetrics: {
        dataCompleteness: 92,
        lastVerification: new Date(),
        verificationMethod: 'Automated',
        discrepancies: [],
        confidenceScore: 97
      },
      insurancePlans: [{ provider: 'TRICARE', planType: 'Prime', policyNumber: 'TC123456', groupNumber: 'MIL001', effectiveDate: new Date(2015, 0, 1), status: 'Active', coverageLevel: 'Family' }],
      appeals: [],
      dischargeStatus: { type: 'Honorable', date: new Date(2010, 11, 31), characterOfService: 'Honorable', reenlistmentCode: 'RE-1' }
    },
    communications: {
      messages: [
        { id: '1', date: new Date(), from: 'VA Benefits', subject: 'Claim Update', body: 'Your claim has been updated', read: false, category: 'Claims', attachments: [] }
      ],
      notifications: [
        { id: '1', date: new Date(), type: 'info', message: 'New secure message', priority: 'medium', actionRequired: false }
      ],
      reminders: [],
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        phoneCallsAllowed: true,
        preferredContactTime: '9AM - 5PM',
        language: 'English'
      }
    },
    auditTrail: [
      { timestamp: new Date(), action: 'Profile Created', user: 'System', details: 'Initial profile creation', ipAddress: '127.0.0.1', userAgent: 'Mozilla/5.0', result: 'success' }
    ],
    integrations: {
      myHealtheVet: { connected: true, lastSync: new Date(), recordsAvailable: 150 },
      dod: { connected: true, lastSync: new Date(), tricare: true },
      ssa: { connected: false, lastSync: new Date(), ssdi: false, retirement: false },
      irs: { connected: true, lastSync: new Date(), taxExempt: false }
    },
    qualityMetrics: {
      dataCompleteness: 95,
      dataAccuracy: 98,
      lastVerification: new Date(),
      verificationMethod: 'Automated',
      outstandingIssues: []
    },
    legalInfo: {
      powersOfAttorney: [
        { type: 'Healthcare', representative: 'Jane Doe', dateAppointed: new Date(2020, 0, 1), status: 'Active' }
      ],
      appeals: [],
      courtCases: []
    },
    emergency: {
      contacts: [
        { name: 'Jane Doe', relationship: 'Spouse', phone: '555-0100', altPhone: '555-0101', address: '123 Main St, Anytown, USA', priority: 1 }
      ],
      bloodType: 'O+',
      allergies: ['Penicillin'],
      medications: [],
      conditions: [],
      advanceDirectives: {
        hasLivingWill: true,
        dnr: false,
        hasPowerOfAttorney: true,
        organDonor: false
      }
    }
  };
}

export interface VeteranProfileEnhanced extends VeteranDetails {
  // Analytics data
  analytics: {
    trends: {
      ratingHistory: Array<{ date: Date; rating: number }>;
      claimsSuccess: number;
      avgProcessingDays: number;
      benefitsUtilization: number;
      healthScores: Array<{ month: string; score: number }>;
      benefitHistory: Array<{ date: Date; amount: number }>;
      claimHistory: Array<{ date: Date; status: string }>;
    };
    predictions: {
      nextAppointment: Date;
      claimCompletion: Date;
      ratingIncreaseLikelihood: number;
      nextClaimApprovalProbability: number;
      appealSuccessProbability: number;
      estimatedProcessingDays: number;
    };
    riskScores: {
      healthRisk: 'low' | 'medium' | 'high';
      financialRisk: 'low' | 'medium' | 'high';
      housingRisk: 'low' | 'medium' | 'high';
      mentalHealthRisk: 'low' | 'medium' | 'high';
      suicideRisk: 'low' | 'medium' | 'high';
      homelessnessRisk: 'low' | 'medium' | 'high';
      substanceAbuseRisk: 'low' | 'medium' | 'high';
    };
    engagement: {
      benefitUtilization: number;
      appointmentCompliance: number;
      portalUsage: number;
      claimsActivity: number;
      appointmentShowRate: number;
      medicationAdherence: number;
      portalUsageMinutes: number;
      lastPortalLogin: Date;
    };
    comparisons: {
      vsNationalAverage: {
        rating: number;
        benefits: number;
        healthcare: number;
      };
      vsPeerGroup: {
        rating: number;
        benefits: number;
        healthcare: number;
      };
    };
  };
  
  // Profile Services API Data
  profileServices: {
    // Eligibility & Entitlements
    eligibility: {
      vaHealthcare: {
        eligible: boolean;
        enrollmentGroup: string;
        enrollmentDate: Date;
        copayRequired: boolean;
        catastrophicCap: number;
        medicareEligible: boolean;
        medicaidEligible: boolean;
      };
      compensationBenefits: {
        eligible: boolean;
        currentRating: number;
        combinedRating: number;
        individualRatings: Array<{
          condition: string;
          rating: number;
          effectiveDate: Date;
          static: boolean;
        }>;
        futureExams: Array<{
          condition: string;
          examDate: Date;
          location: string;
        }>;
      };
      educationBenefits: {
        chapter33: boolean;
        chapter30: boolean;
        monthsRemaining: number;
        exhaustionDate: Date;
        certificateOfEligibility: string;
        yellowRibbon: boolean;
        stemExtension: boolean;
      };
      homeLoan: {
        eligible: boolean;
        entitlement: number;
        used: number;
        available: number;
        coe: string;
        previousLoans: number;
      };
      burialBenefits: {
        eligible: boolean;
        prePlanned: boolean;
        cemetery: string;
        plotAllowance: number;
      };
      vocationalRehab: {
        eligible: boolean;
        chapter31: boolean;
        monthsRemaining: number;
        counselorAssigned: string;
        plan: string;
      };
      pensionBenefits: {
        eligible: boolean;
      };
      spouseBenefits: {
        eligible: boolean;
        enrollmentDate?: Date;
        percentageUsed?: number;
      };
    };

    // Awards & Decorations
    awards: Array<{
      name: string;
      date: Date;
      citation: string;
      image: string;
      precedence: number;
      category: 'valor' | 'achievement' | 'service' | 'campaign';
    }>;

    // Service Treatment Records
    treatmentRecords: Array<{
      date: Date;
      facility: string;
      provider: string;
      chiefComplaint: string;
      diagnosis: string;
      treatment: string;
      followUp: string;
      documents: string[];
    }>;

    // Dependent Information
    dependents: Array<{
      id: string;
      relationship: 'spouse' | 'child' | 'parent';
      firstName: string;
      lastName: string;
      dateOfBirth: Date;
      ssn: string;
      onAward: boolean;
      schoolEnrollment?: {
        school: string;
        startDate: Date;
        endDate: Date;
        fullTime: boolean;
      };
    }>;

    // Financial Information
    financial: {
      monthlyIncome: number;
      creditScore: number;
      directDeposit: {
        accountType: 'checking' | 'savings';
        routingNumber: string;
        accountNumber: string;
        bankName: string;
      };
      debts: Array<{
        type: string;
        amount: number;
        reason: string;
        dateIncurred: Date;
        status: 'active' | 'paid' | 'waived' | 'compromise';
        monthlyPayment: number;
      }>;
      payments: Array<{
        date: Date;
        amount: number;
        type: string;
        description: string;
      }>;
      taxDocuments: Array<{
        year: number;
        type: string;
        available: boolean;
        downloadUrl: string;
      }>;
    };

    // Power of Attorney / Fiduciary
    representation: {
      hasPOA: boolean;
      poaName?: string;
      poaOrganization?: string;
      poaPhone?: string;
      poaEmail?: string;
      fiduciary?: {
        name: string;
        relationship: string;
        appointmentDate: Date;
      };
    };

    // Appeals & Reviews
    appeals: Array<{
      id: string;
      type: 'supplemental' | 'higher-level' | 'board';
      issueDate: Date;
      status: string;
      issues: string[];
      docketNumber?: string;
      hearingDate?: Date;
    }>;

    // Environmental Exposures
    exposures: Array<{
      type: string;
      location: string;
      startDate: Date;
      endDate: Date;
      confirmed: boolean;
      presumptive: boolean;
      relatedConditions: string[];
    }>;

    // Travel & Mileage
    travel: {
      benefitEligible: boolean;
      specialMode: boolean;
      reimbursements: Array<{
        date: Date;
        miles: number;
        amount: number;
        status: string;
        claimNumber: string;
      }>;
    };

    // Legal Information
    legalInfo: {
      powerOfAttorney: {
        name: string;
        type: string;
        date: Date;
      };
      powerOfAttorneyHistory: Array<{
        name: string;
        type: string;
        date: Date;
        status: string;
        form2122: string;
      }>;
      willStatus: boolean;
      willLastUpdated: Date;
      advanceDirectives: boolean;
      representation: {
        attorney: string;
        vso: string;
        privateAttorney?: {
          name: string;
          firm: string;
          barNumber: string;
          address: string;
          phone: string;
          email: string;
          feeStructure: {
            type: 'percentage' | 'hourly';
            hourlyRate?: number;
            percentage?: number;
            monthlyRetainer?: number;
            isProblematic: boolean;
          };
          dateHired: Date;
          cases: string[];
          performance: {
            successRate: number;
            avgProcessingTime: number;
            clientSatisfaction: number;
          };
        };
      };
      form2122History: Array<{
        formId: string;
        dateFiled: Date;
        representative: string;
        type: string;
        status: string;
        effectiveDate: Date;
        expirationDate: Date;
      }>;
      pendingActions: Array<{
        type: string;
        status: string;
        description: string;
        filingDate: Date;
      }>;
      beneficiaries: Array<{
        name: string;
        relationship: string;
        percentage: number;
      }>;
    };
    
    // Quality Metrics
    qualityMetrics: {
      dataCompleteness: number;
      lastVerification: Date;
      verificationMethod: string;
      discrepancies: string[];
      confidenceScore: number;
    };
    
    // Insurance Plans
    insurancePlans: Array<{
      provider: string;
      planType: string;
      policyNumber: string;
      groupNumber: string;
      effectiveDate: Date;
      status: string;
      coverageLevel: string;
    }>;
    
    // Audit Trail
    auditTrail: Array<{
      timestamp: Date;
      action: string;
      user: string;
      details: string;
      system: string;
    }>;
    
    // Communications
    communications: {
      messages: Array<{
        id: string;
        date: Date;
        from: string;
        subject: string;
        read: boolean;
        priority: 'low' | 'medium' | 'high';
        body?: string;
      }>;
      notifications: Array<{
        id: string;
        date: Date;
        type: string;
        message: string;
        actionRequired: boolean;
      }>;
      preferences: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        phoneCallsAllowed: boolean;
        preferredContactTime: string;
        language: string;
      };
    };
    
    // Integrations
    integrations: {
      myHealtheVet: {
        connected: boolean;
        lastSync: Date | null;
        status: string;
        recordsAvailable?: number;
      };
      vaBenefits: {
        connected: boolean;
        lastSync: Date | null;
        status: string;
      };
      communityCareCar: {
        connected: boolean;
        lastSync: Date | null;
        status: string;
      };
      dodSelfService: {
        connected: boolean;
        lastSync: Date | null;
        status: string;
      };
      tricare: {
        connected: boolean;
        lastSync: Date | null;
        status: string;
      };
    };
    
    // Discharge Status
    dischargeStatus: {
      type: string;
      date: Date;
      characterOfService: string;
      reenlistmentCode: string;
    };
  };


  // Communication Center
  communications: {
    // Messages
    messages: Array<{
      id: string;
      date: Date;
      from: string;
      subject: string;
      body: string;
      read: boolean;
      category: string;
      attachments: string[];
    }>;

    // Notifications
    notifications: Array<{
      id: string;
      date: Date;
      type: string;
      message: string;
      priority: 'low' | 'medium' | 'high';
      actionRequired: boolean;
      actionUrl?: string;
    }>;

    // Appointments Reminders
    reminders: Array<{
      id: string;
      appointmentDate: Date;
      reminderDate: Date;
      method: 'email' | 'sms' | 'phone';
      sent: boolean;
      confirmed: boolean;
    }>;

    // Contact Preferences
    preferences: {
      emailNotifications: boolean;
      smsNotifications: boolean;
      phoneCallsAllowed: boolean;
      preferredContactTime: string;
      language: string;
    };
  };

  // Audit Trail
  auditTrail: Array<{
    timestamp: Date;
    action: string;
    user: string;
    details: string;
    ipAddress: string;
    userAgent: string;
    result: 'success' | 'failure';
  }>;

  // Integration Status
  integrations: {
    myHealtheVet: {
      connected: boolean;
      lastSync: Date;
      recordsAvailable: number;
    };
    dod: {
      connected: boolean;
      lastSync: Date;
      tricare: boolean;
    };
    ssa: {
      connected: boolean;
      lastSync: Date;
      ssdi: boolean;
      retirement: boolean;
    };
    irs: {
      connected: boolean;
      lastSync: Date;
      taxExempt: boolean;
    };
  };

  // Quality Metrics
  qualityMetrics: {
    dataCompleteness: number;
    dataAccuracy: number;
    lastVerification: Date;
    verificationMethod: string;
    outstandingIssues: Array<{
      field: string;
      issue: string;
      priority: string;
    }>;
  };

  // Legal Information
  legalInfo: {
    powersOfAttorney: Array<{
      type: string;
      representative: string;
      dateAppointed: Date;
      status: string;
    }>;
    appeals: Array<{
      id: string;
      type: string;
      status: string;
      filingDate: Date;
      issues: string[];
    }>;
    courtCases: Array<{
      caseNumber: string;
      court: string;
      status: string;
      filingDate: Date;
    }>;
  };

  // Emergency Information
  emergency: {
    contacts: Array<{
      name: string;
      relationship: string;
      phone: string;
      altPhone?: string;
      address: string;
      priority: number;
    }>;
    bloodType: string;
    allergies: string[];
    medications: string[];
    conditions: string[];
    advanceDirectives: {
      hasLivingWill: boolean;
      hasPowerOfAttorney: boolean;
      dnr: boolean;
      organDonor: boolean;
    };
  };


}

// Generate enhanced mock data
export function generateEnhancedVeteranProfile(basicProfile: VeteranDetails): VeteranProfileEnhanced {
  // Use the existing function that already has all the correct properties
  return generateVeteranProfileEnhanced(basicProfile);
}

/* // Old implementation - commented out as it has TypeScript errors and we're using the new one above
function generateEnhancedVeteranProfileOld(basicProfile: VeteranDetails): VeteranProfileEnhanced {
  const enhancedProfile: VeteranProfileEnhanced = {
    ...basicProfile,
    profileServices: {
      eligibility: {
        vaHealthcare: {
          eligible: true,
          enrollmentGroup: `Group ${Math.floor(Math.random() * 8) + 1}`,
          enrollmentDate: new Date(2020, Math.floor(Math.random() * 12), 1),
          copayRequired: Math.random() > 0.5,
          catastrophicCap: Math.floor(Math.random() * 5000) + 1000,
          medicareEligible: Math.random() > 0.3,
          medicaidEligible: Math.random() > 0.7,
        },
        compensationBenefits: {
          eligible: true,
          currentRating: basicProfile.mpd.disabilityRating,
          combinedRating: basicProfile.mpd.disabilityRating,
          individualRatings: basicProfile.mpd.conditions.map(c => ({
            condition: c.description,
            rating: c.rating,
            effectiveDate: new Date(2020, Math.floor(Math.random() * 12), 1),
            static: Math.random() > 0.7,
          })),
          futureExams: Array.from({ length: Math.floor(Math.random() * 3) }, () => ({
            condition: ['PTSD', 'Hearing Loss', 'Back Pain'][Math.floor(Math.random() * 3)],
            examDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            location: 'VA Medical Center',
          })),
        },
        educationBenefits: {
          chapter33: true,
          chapter30: Math.random() > 0.5,
          monthsRemaining: basicProfile.benefits.education.giBlllRemaining,
          exhaustionDate: new Date(2026, Math.floor(Math.random() * 12), 1),
          certificateOfEligibility: `COE-${Math.floor(Math.random() * 900000) + 100000}`,
          yellowRibbon: Math.random() > 0.6,
          stemExtension: Math.random() > 0.8,
        },
        homeLoan: {
          eligible: true,
          entitlement: 144000,
          used: Math.floor(Math.random() * 100000),
          available: 144000 - Math.floor(Math.random() * 100000),
          coe: `COE-${Math.floor(Math.random() * 900000) + 100000}`,
          previousLoans: Math.floor(Math.random() * 3),
        },
        burialBenefits: {
          eligible: true,
          prePlanned: Math.random() > 0.7,
          cemetery: 'Arlington National Cemetery',
          plotAllowance: 2000,
        },
        vocationalRehab: {
          eligible: Math.random() > 0.5,
          chapter31: Math.random() > 0.6,
          monthsRemaining: Math.floor(Math.random() * 48),
          counselorAssigned: `${['Smith', 'Johnson', 'Williams'][Math.floor(Math.random() * 3)]}, VRC`,
          plan: 'Computer Science Degree',
        },
        pensionBenefits: {
          eligible: Math.random() > 0.4,
        },
        spouseBenefits: {
          eligible: Math.random() > 0.5,
          enrollmentDate: new Date(2020, Math.floor(Math.random() * 12), 1),
          percentageUsed: Math.floor(Math.random() * 100),
        },
      },
      
      awards: Array.from({ length: Math.floor(Math.random() * 10) + 3 }, () => ({
        name: ['Bronze Star', 'Purple Heart', 'Good Conduct Medal', 'Combat Action Ribbon', 'Navy Achievement Medal'][Math.floor(Math.random() * 5)],
        date: new Date(2000 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), 1),
        citation: 'For exceptional service and valor in combat operations',
        image: '/medals/placeholder.png',
        precedence: Math.floor(Math.random() * 100) + 1,
        category: ['valor', 'achievement', 'service', 'campaign'][Math.floor(Math.random() * 4)] as any,
      })),

      treatmentRecords: Array.from({ length: 20 }, () => ({
        date: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        facility: `VA Medical Center - ${['Tampa', 'Miami', 'Orlando'][Math.floor(Math.random() * 3)]}`,
        provider: `Dr. ${['Smith', 'Johnson', 'Williams'][Math.floor(Math.random() * 3)]}`,
        chiefComplaint: ['Back pain', 'Headache', 'Joint pain', 'Anxiety'][Math.floor(Math.random() * 4)],
        diagnosis: ['Chronic pain', 'PTSD', 'Hypertension', 'Diabetes'][Math.floor(Math.random() * 4)],
        treatment: ['Physical therapy', 'Medication', 'Counseling', 'Surgery'][Math.floor(Math.random() * 4)],
        followUp: '3 months',
        documents: [`/documents/treatment-${Date.now()}.pdf`],
      })),

      dependents: Array.from({ length: Math.floor(Math.random() * 4) }, (_, i) => ({
        id: `dep-${i}`,
        relationship: i === 0 ? 'spouse' : 'child' as any,
        firstName: ['Jane', 'John', 'Sarah', 'Michael'][i] || 'Dependent',
        lastName: basicProfile.lastName,
        dateOfBirth: new Date(i === 0 ? 1970 : 2000 + (i * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        ssn: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000) + 1000}`,
        onAward: true,
        schoolEnrollment: i > 0 && Math.random() > 0.5 ? {
          school: 'State University',
          startDate: new Date(2023, 8, 1),
          endDate: new Date(2027, 5, 1),
          fullTime: true,
        } : undefined,
      })),

      financial: {
        monthlyIncome: Math.floor(Math.random() * 3000) + 2000,
        creditScore: Math.floor(Math.random() * 300) + 500,
        directDeposit: {
          accountType: Math.random() > 0.5 ? 'checking' : 'savings',
          routingNumber: `${Math.floor(Math.random() * 900000000) + 100000000}`,
          accountNumber: `****${Math.floor(Math.random() * 9000) + 1000}`,
          bankName: ['Bank of America', 'Wells Fargo', 'Chase', 'Navy Federal'][Math.floor(Math.random() * 4)],
        },
        debts: Math.random() > 0.7 ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
          type: ['Overpayment', 'Medical', 'Education'][Math.floor(Math.random() * 3)],
          amount: Math.floor(Math.random() * 5000) + 500,
          reason: 'Administrative error',
          dateIncurred: new Date(2023, Math.floor(Math.random() * 12), 1),
          status: ['active', 'paid', 'waived', 'compromise'][Math.floor(Math.random() * 4)] as any,
          monthlyPayment: Math.floor(Math.random() * 500) + 100,
        })) : [],
        payments: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(2024, i, 1),
          amount: basicProfile.benefits.monthlyAmount,
          type: 'Disability Compensation',
          description: `Monthly compensation payment`,
        })),
        taxDocuments: Array.from({ length: 3 }, (_, i) => ({
          year: 2024 - i,
          type: '1099-G',
          available: true,
          downloadUrl: `/tax/1099-${2024 - i}.pdf`,
        })),
      },

      representation: {
        hasPOA: Math.random() > 0.6,
        poaName: Math.random() > 0.6 ? 'Veterans Service Organization' : undefined,
        poaOrganization: Math.random() > 0.6 ? 'DAV' : undefined,
        poaPhone: Math.random() > 0.6 ? '(800) 555-0100' : undefined,
        poaEmail: Math.random() > 0.6 ? 'representative@vso.org' : undefined,
        fiduciary: Math.random() > 0.9 ? {
          name: 'John Doe',
          relationship: 'Spouse',
          appointmentDate: new Date(2022, 5, 1),
        } : undefined,
      },

      appeals: Math.random() > 0.5 ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
        id: `appeal-${Math.floor(Math.random() * 900000) + 100000}`,
        type: ['supplemental', 'higher-level', 'board'][Math.floor(Math.random() * 3)] as any,
        issueDate: new Date(2023, Math.floor(Math.random() * 12), 1),
        status: ['Pending', 'Under Review', 'Scheduled', 'Decided'][Math.floor(Math.random() * 4)],
        issues: ['Rating increase', 'Service connection', 'Effective date'][Math.floor(Math.random() * 3)].split(','),
        docketNumber: `${Math.floor(Math.random() * 900000) + 100000}`,
        hearingDate: Math.random() > 0.5 ? new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1) : undefined,
      })) : [],

      exposures: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
        type: ['Agent Orange', 'Burn Pits', 'Gulf War', 'Radiation'][Math.floor(Math.random() * 4)],
        location: ['Vietnam', 'Iraq', 'Afghanistan', 'Kuwait'][Math.floor(Math.random() * 4)],
        startDate: new Date(2000 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), 1),
        endDate: new Date(2001 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), 1),
        confirmed: Math.random() > 0.3,
        presumptive: Math.random() > 0.5,
        relatedConditions: ['Respiratory', 'Cancer', 'Neurological'].filter(() => Math.random() > 0.5),
      })),

      travel: {
        benefitEligible: Math.random() > 0.3,
        specialMode: Math.random() > 0.8,
        reimbursements: Array.from({ length: 10 }, () => ({
          date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          miles: Math.floor(Math.random() * 200) + 10,
          amount: (Math.floor(Math.random() * 200) + 10) * 0.415,
          status: ['Pending', 'Approved', 'Paid'][Math.floor(Math.random() * 3)],
          claimNumber: `TR${Math.floor(Math.random() * 900000) + 100000}`,
        })),
      },
    },

    analytics: {
      riskScores: {
        healthRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        financialRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        housingRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        mentalHealthRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        suicideRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        homelessnessRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        substanceAbuseRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      },
      predictions: {
        nextAppointment: new Date(Date.now() + Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000),
        claimCompletion: new Date(Date.now() + Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000),
        nextClaimApprovalProbability: Math.random() * 100,
        estimatedProcessingDays: Math.floor(Math.random() * 180) + 30,
        ratingIncreaseLikelihood: Math.random() * 100,
        appealSuccessProbability: Math.random() * 100,
      },
      engagement: {
        benefitUtilization: 50 + Math.random() * 50,
        appointmentCompliance: 70 + Math.random() * 30,
        portalUsage: 40 + Math.random() * 60,
        claimsActivity: 30 + Math.random() * 70,
        appointmentShowRate: 70 + Math.random() * 30,
        medicationAdherence: 60 + Math.random() * 40,
        portalUsageMinutes: Math.floor(Math.random() * 500) + 100,
        lastPortalLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      },
      comparisons: {
        vsNationalAverage: {
          rating: Math.random() * 40 - 20,
          benefits: Math.random() * 40 - 20,
          healthcare: Math.random() * 40 - 20,
        },
        vsPeerGroup: {
          rating: Math.random() * 30 - 15,
          benefits: Math.random() * 30 - 15,
          healthcare: Math.random() * 30 - 15,
        },
      },
      trends: {
        ratingHistory: Array.from({ length: 10 }, (_, i) => ({
          date: new Date(2020 + Math.floor(i / 2), (i * 2) % 12, 1),
          rating: Math.min(100, 30 + (i * 7) + Math.floor(Math.random() * 10)),
        })),
        benefitHistory: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(2023, i, 1),
          amount: 1500 + Math.floor(Math.random() * 500),
        })),
        healthScores: Array.from({ length: 12 }, (_, i) => ({
          month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i] + ' 2023',
          score: 60 + Math.floor(Math.random() * 30),
        })),
        claimHistory: Array.from({ length: 5 }, (_, i) => ({
          date: new Date(2020 + i, Math.floor(Math.random() * 12), 1),
          status: ['Submitted', 'Under Review', 'Approved', 'Denied'][Math.floor(Math.random() * 4)],
        })),
      },
    },

    communications: {
      messages: Array.from({ length: 15 }, (_, i) => ({
        id: `msg-${i}`,
        date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        from: ['VA Benefits', 'Healthcare Team', 'Claims Department'][Math.floor(Math.random() * 3)],
        subject: ['Appointment Reminder', 'Claim Update', 'Benefits Change'][Math.floor(Math.random() * 3)],
        body: 'Important information regarding your VA benefits...',
        read: Math.random() > 0.3,
        category: ['Medical', 'Benefits', 'Claims'][Math.floor(Math.random() * 3)],
        attachments: Math.random() > 0.7 ? [`attachment-${i}.pdf`] : [],
      })),
      notifications: Array.from({ length: 10 }, (_, i) => ({
        id: `notif-${i}`,
        date: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
        type: ['Payment', 'Appointment', 'Document'][Math.floor(Math.random() * 3)],
        message: 'Your monthly compensation has been deposited',
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        actionRequired: Math.random() > 0.6,
        actionUrl: Math.random() > 0.6 ? '/action' : undefined,
      })),
      reminders: Array.from({ length: 5 }, (_, i) => ({
        id: `rem-${i}`,
        appointmentDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        reminderDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        method: ['email', 'sms', 'phone'][Math.floor(Math.random() * 3)] as any,
        sent: Math.random() > 0.3,
        confirmed: Math.random() > 0.5,
      })),
      preferences: {
        emailNotifications: true,
        smsNotifications: Math.random() > 0.3,
        phoneCallsAllowed: Math.random() > 0.5,
        preferredContactTime: '9AM-5PM',
        language: 'English',
      },
    },

    auditTrail: Array.from({ length: 50 }, (_, i) => ({
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
      action: ['Login', 'View Benefits', 'Update Profile', 'Download Document'][Math.floor(Math.random() * 4)],
      user: ['Veteran', 'VSO Rep', 'VA Staff'][Math.floor(Math.random() * 3)],
      details: 'Action completed successfully',
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0...',
      result: Math.random() > 0.1 ? 'success' : 'failure' as any,
    })),

    integrations: {
      myHealtheVet: {
        connected: true,
        lastSync: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
        recordsAvailable: Math.floor(Math.random() * 1000) + 100,
      },
      dod: {
        connected: Math.random() > 0.3,
        lastSync: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        tricare: Math.random() > 0.5,
      },
      ssa: {
        connected: Math.random() > 0.4,
        lastSync: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        ssdi: Math.random() > 0.7,
        retirement: Math.random() > 0.5,
      },
      irs: {
        connected: Math.random() > 0.6,
        lastSync: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
        taxExempt: Math.random() > 0.5,
      },
    },

    qualityMetrics: {
      dataCompleteness: 70 + Math.random() * 30,
      dataAccuracy: 85 + Math.random() * 15,
      lastVerification: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      verificationMethod: ['Automated', 'Manual', 'Hybrid'][Math.floor(Math.random() * 3)],
      outstandingIssues: Array.from({ length: Math.floor(Math.random() * 5) }, () => ({
        field: ['SSN', 'Address', 'Phone', 'Email'][Math.floor(Math.random() * 4)],
        issue: 'Needs verification',
        priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      })),
    },

    emergency: {
      contacts: Array.from({ length: 2 }, (_, i) => ({
        name: `Emergency Contact ${i + 1}`,
        relationship: ['Spouse', 'Child', 'Parent', 'Sibling'][Math.floor(Math.random() * 4)],
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        altPhone: Math.random() > 0.5 ? `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : undefined,
        address: '123 Emergency St, City, ST 12345',
        priority: i + 1,
      })),
      bloodType: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'][Math.floor(Math.random() * 8)],
      allergies: ['Penicillin', 'Sulfa', 'None'].filter(() => Math.random() > 0.5),
      medications: basicProfile.mpd.medications.filter(m => m.status === 'Active').map(m => m.name),
      conditions: basicProfile.mpd.conditions.filter(c => c.status === 'Active').map(c => c.description),
      advanceDirectives: {
        hasLivingWill: Math.random() > 0.5,
        hasPowerOfAttorney: Math.random() > 0.5,
        dnr: Math.random() > 0.8,
        organDonor: Math.random() > 0.6,
      },
    },

    legal: {
      courtOrders: Math.random() > 0.9 ? Array.from({ length: Math.floor(Math.random() * 2) + 1 }, () => ({
        type: ['Divorce', 'Child Support', 'Garnishment'][Math.floor(Math.random() * 3)],
        court: 'Circuit Court',
        date: new Date(2022, Math.floor(Math.random() * 12), 1),
        description: 'Court order details',
        documents: [`court-order-${Date.now()}.pdf`],
      })) : [],
      guardianship: {
        hasGuardian: Math.random() > 0.95,
        guardianName: Math.random() > 0.95 ? 'Guardian Name' : undefined,
        guardianContact: Math.random() > 0.95 ? '(555) 555-5555' : undefined,
        courtAppointed: Math.random() > 0.95,
      },
      incarceration: {
        currentlyIncarcerated: false,
        facility: undefined,
        releaseDate: undefined,
      },
    },
  };

  return enhancedProfile;
} */