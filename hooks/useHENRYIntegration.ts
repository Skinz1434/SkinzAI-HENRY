import { useState, useEffect, useCallback } from 'react';

interface VeteranProfile {
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
  combatService: boolean;
  deployments: Array<{
    location: string;
    startDate: string;
    endDate: string;
    exposures: string[];
  }>;
  awards: string[];

  // Disability Information
  disabilityRating: number;
  conditions: Array<{
    name: string;
    rating: number;
    serviceConnected: boolean;
    effectiveDate: string;
    diagnosticCode: string;
  }>;
  pendingClaims: Array<{
    condition: string;
    filedDate: string;
    status: string;
    lastUpdate: string;
  }>;

  // Benefits
  monthlyCompensation: number;
  educationBenefits: {
    gibBillRemaining: number;
    degreeProgram: string;
    enrollmentStatus: string;
    school?: string;
  };
  healthcarePriority: number;
  enrolledVAHealthcare: boolean;

  // Medical History
  medications: Array<{
    name: string;
    dosage: string;
    prescriber: string;
    startDate: string;
  }>;
  appointments: Array<{
    date: string;
    provider: string;
    type: string;
    location: string;
    notes: string;
  }>;
  surgeries: Array<{
    procedure: string;
    date: string;
    facility: string;
  }>;

  // Financial
  income: {
    vaDisability: number;
    ssdi: number;
    pension: number;
    employment: number;
  };
  dependents: number;
  spouseInfo?: {
    name: string;
    ssn: string;
    dob: string;
  };
}

interface ClaimAnalysisData {
  overallScore: number;
  confidence: number;
  conditions: Array<{
    name: string;
    icd10: string;
    currentRating: number;
    predictedRating: number;
    evidenceStrength: number;
    nexusPresent: boolean;
    serviceConnected: boolean;
    secondaryTo?: string;
  }>;
  evidenceAnalysis: {
    medical: number;
    service: number;
    nexus: number;
    continuity: number;
    supporting: number;
  };
  timeline: Array<{
    date: string;
    event: string;
    type: 'service' | 'medical' | 'claim' | 'treatment';
    importance: 'high' | 'medium' | 'low';
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    impact: string;
    timeframe: string;
  }>;
  presumptiveConditions: Array<{
    condition: string;
    eligible: boolean;
    reason: string;
  }>;
  missingEvidence: Array<{
    type: string;
    importance: number;
    suggestion: string;
  }>;
  riskFactors: Array<{
    factor: string;
    severity: 'high' | 'medium' | 'low';
    mitigation: string;
  }>;
}

export function useHENRYIntegration(veteranId?: string) {
  const [veteranData, setVeteranData] = useState<VeteranProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch veteran data from HENRY system
  const fetchVeteranData = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Import the veteran data service to get actual veteran data
      const { veteranDataService } = await import('../lib/henry/veteran-data-service');
      
      // Try to get the actual veteran data first
      const actualVeteran = veteranDataService.getVeteran(id);
      
      if (actualVeteran) {
        // Convert the actual veteran data to the format expected by this hook
        const veteranData: VeteranProfile = {
          id: actualVeteran.id,
          name: actualVeteran.name,
          ssn: actualVeteran.ssn,
          dob: actualVeteran.dob,
          gender: actualVeteran.gender,
          email: actualVeteran.email,
          phone: actualVeteran.phone,
          address: actualVeteran.address,
          branch: actualVeteran.branch,
          serviceYears: actualVeteran.serviceYears,
          dischargeStatus: actualVeteran.dischargeStatus,
          dischargeDate: actualVeteran.dischargeDate,
          rank: actualVeteran.rank,
          mos: actualVeteran.mos,
          combatService: actualVeteran.combatService,
          deployments: actualVeteran.deployments,
          awards: actualVeteran.awards,
          disabilityRating: actualVeteran.disabilityRating,
          conditions: actualVeteran.conditions.map(c => ({
            name: c.name,
            rating: c.rating,
            serviceConnected: c.serviceConnected,
            effectiveDate: c.effectiveDate,
            diagnosticCode: c.diagnosticCode
          })),
          pendingClaims: actualVeteran.pendingClaims,
          monthlyCompensation: actualVeteran.monthlyCompensation,
          educationBenefits: {
            gibBillRemaining: actualVeteran.educationBenefits.gibBillRemaining,
            degreeProgram: actualVeteran.educationBenefits.degreeProgram,
            enrollmentStatus: actualVeteran.educationBenefits.enrollmentStatus,
            school: actualVeteran.educationBenefits.school
          },
          healthcarePriority: actualVeteran.healthcarePriority,
          enrolledVAHealthcare: actualVeteran.enrolledVAHealthcare,
          medications: actualVeteran.medications.map(m => ({
            name: m.name,
            dosage: m.dosage,
            prescriber: m.prescriber,
            startDate: m.startDate
          })),
          appointments: actualVeteran.appointments.map(a => ({
            date: a.date,
            provider: a.provider,
            type: a.type,
            location: a.location,
            notes: a.notes
          })),
          surgeries: actualVeteran.surgeries.map(s => ({
            procedure: s.procedure,
            date: s.date,
            facility: s.facility
          })),
          income: actualVeteran.income,
          dependents: actualVeteran.dependents,
          spouseInfo: actualVeteran.spouseInfo
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setVeteranData(veteranData);
        return veteranData;
      }
      
      // Fallback to mock data if veteran not found
      const mockData: VeteranProfile = {
        id: id || 'VET-2024-001',
        name: 'Unknown Veteran',
        ssn: '***-**-0000',
        dob: '1980-01-01',
        gender: 'Unknown',
        email: 'unknown@email.com',
        phone: '(555) 000-0000',
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
          'Combat Infantry Badge',
          'Iraq Campaign Medal',
          'Afghanistan Campaign Medal'
        ],
        disabilityRating: 70,
        conditions: [
          {
            name: 'PTSD',
            rating: 50,
            serviceConnected: true,
            effectiveDate: '2012-01-15',
            diagnosticCode: '9411'
          },
          {
            name: 'Lumbar Strain',
            rating: 20,
            serviceConnected: true,
            effectiveDate: '2012-01-15',
            diagnosticCode: '5237'
          },
          {
            name: 'Tinnitus',
            rating: 10,
            serviceConnected: true,
            effectiveDate: '2012-01-15',
            diagnosticCode: '6260'
          },
          {
            name: 'Left Knee Strain',
            rating: 10,
            serviceConnected: true,
            effectiveDate: '2013-06-01',
            diagnosticCode: '5260'
          }
        ],
        pendingClaims: [
          {
            condition: 'Sleep Apnea (Secondary to PTSD)',
            filedDate: '2024-01-15',
            status: 'Gathering Evidence',
            lastUpdate: '2024-02-20'
          },
          {
            condition: 'Migraines (Secondary to TBI)',
            filedDate: '2024-01-15',
            status: 'Initial Review',
            lastUpdate: '2024-01-20'
          }
        ],
        monthlyCompensation: 1716.28,
        educationBenefits: {
          gibBillRemaining: 24,
          degreeProgram: 'Computer Science',
          enrollmentStatus: 'Part-time'
        },
        healthcarePriority: 2,
        enrolledVAHealthcare: true,
        medications: [
          {
            name: 'Sertraline',
            dosage: '100mg daily',
            prescriber: 'Dr. Johnson - VA',
            startDate: '2012-03-01'
          },
          {
            name: 'Prazosin',
            dosage: '5mg at bedtime',
            prescriber: 'Dr. Johnson - VA',
            startDate: '2013-01-15'
          },
          {
            name: 'Ibuprofen',
            dosage: '800mg as needed',
            prescriber: 'Dr. Smith - VA',
            startDate: '2012-01-20'
          }
        ],
        appointments: [
          {
            date: '2024-03-15',
            provider: 'Dr. Johnson',
            type: 'Mental Health',
            location: 'VA Medical Center',
            notes: 'Routine follow-up'
          },
          {
            date: '2024-04-01',
            provider: 'Dr. Smith',
            type: 'Primary Care',
            location: 'VA Medical Center',
            notes: 'Annual physical'
          }
        ],
        surgeries: [
          {
            procedure: 'Arthroscopic Knee Surgery',
            date: '2015-06-15',
            facility: 'VA Medical Center - Washington DC'
          }
        ],
        income: {
          vaDisability: 1716.28,
          ssdi: 0,
          pension: 0,
          employment: 3500
        },
        dependents: 2,
        spouseInfo: {
          name: 'Jane Smith',
          ssn: '***-**-5432',
          dob: '1987-07-20'
        }
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVeteranData(mockData);
      return mockData;
    } catch (err) {
      setError('Failed to fetch veteran data');
      console.error('Error fetching veteran data:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate analysis based on veteran data
  const generateAnalysis = useCallback((veteran: VeteranProfile): ClaimAnalysisData => {
    // Calculate scores based on veteran profile
    const hasComabatService = veteran.combatService;
    const hasPurpleHeart = veteran.awards.includes('Purple Heart');
    const hasNexusLetters = Math.random() > 0.3; // Simulated
    
    const medicalScore = veteran.medications.length > 0 ? 75 : 50;
    const serviceScore = hasComabatService ? 90 : 60;
    const nexusScore = hasNexusLetters ? 85 : 40;
    const continuityScore = veteran.appointments.length > 0 ? 70 : 30;
    const supportingScore = hasPurpleHeart ? 95 : 60;

    const overallScore = Math.round(
      (medicalScore * 0.3 + 
       serviceScore * 0.25 + 
       nexusScore * 0.25 + 
       continuityScore * 0.1 + 
       supportingScore * 0.1)
    );

    // Build timeline from veteran data
    const timeline: ClaimAnalysisData['timeline'] = [];
    
    // Add service events
    veteran.deployments.forEach(deployment => {
      timeline.push({
        date: deployment.startDate,
        event: `Deployed to ${deployment.location}`,
        type: 'service',
        importance: 'high'
      });
    });

    // Add medical events
    veteran.surgeries.forEach(surgery => {
      timeline.push({
        date: surgery.date,
        event: surgery.procedure,
        type: 'medical',
        importance: 'high'
      });
    });

    // Add claim events
    veteran.pendingClaims.forEach(claim => {
      timeline.push({
        date: claim.filedDate,
        event: `Filed claim for ${claim.condition}`,
        type: 'claim',
        importance: 'medium'
      });
    });

    // Sort timeline by date
    timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Check presumptive conditions based on deployments
    const presumptiveConditions: ClaimAnalysisData['presumptiveConditions'] = [];
    
    const hasIraqService = veteran.deployments.some(d => d.location.includes('Iraq'));
    const hasAfghanistanService = veteran.deployments.some(d => d.location.includes('Afghanistan'));
    const hasBurnPitExposure = veteran.deployments.some(d => d.exposures.includes('Burn pits'));

    if (hasBurnPitExposure) {
      presumptiveConditions.push({
        condition: 'Respiratory Conditions',
        eligible: true,
        reason: 'Burn pit exposure during deployment'
      });
      presumptiveConditions.push({
        condition: 'Sinusitis/Rhinitis',
        eligible: true,
        reason: 'Burn pit exposure during deployment'
      });
    }

    if (hasComabatService) {
      presumptiveConditions.push({
        condition: 'PTSD',
        eligible: true,
        reason: 'Combat veteran with confirmed stressor'
      });
    }

    // Generate recommendations based on pending claims
    const recommendations: ClaimAnalysisData['recommendations'] = [];
    
    veteran.pendingClaims.forEach(claim => {
      if (claim.condition.includes('Sleep Apnea')) {
        recommendations.push({
          priority: 'high',
          action: 'Obtain sleep study results',
          impact: 'Critical evidence for sleep apnea claim',
          timeframe: 'Within 30 days'
        });
        recommendations.push({
          priority: 'high',
          action: 'Get nexus letter linking sleep apnea to PTSD',
          impact: 'Establishes secondary service connection',
          timeframe: 'Within 45 days'
        });
      }
      
      if (claim.condition.includes('Migraines')) {
        recommendations.push({
          priority: 'medium',
          action: 'Document migraine frequency and severity',
          impact: 'Supports higher rating evaluation',
          timeframe: 'Ongoing - 3 months'
        });
      }
    });

    // Identify missing evidence
    const missingEvidence: ClaimAnalysisData['missingEvidence'] = [];
    
    if (!hasNexusLetters) {
      missingEvidence.push({
        type: 'Nexus Letter',
        importance: 85,
        suggestion: 'Obtain medical opinion linking conditions to service'
      });
    }

    if (veteran.conditions.some(c => !c.serviceConnected)) {
      missingEvidence.push({
        type: 'Service Treatment Records',
        importance: 75,
        suggestion: 'Request complete STRs from National Archives'
      });
    }

    // Identify risk factors
    const riskFactors: ClaimAnalysisData['riskFactors'] = [];
    
    if (veteran.pendingClaims.length > 0) {
      const oldestClaim = veteran.pendingClaims.reduce((oldest, claim) => 
        new Date(claim.filedDate) < new Date(oldest.filedDate) ? claim : oldest
      );
      
      const daysPending = Math.floor(
        (new Date().getTime() - new Date(oldestClaim.filedDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysPending > 120) {
        riskFactors.push({
          factor: 'Extended claim processing time',
          severity: 'medium',
          mitigation: 'Contact VSO for status update and potential congressional inquiry'
        });
      }
    }

    if (!hasNexusLetters) {
      riskFactors.push({
        factor: 'Missing nexus evidence',
        severity: 'high',
        mitigation: 'Schedule appointment with qualified medical provider for nexus opinion'
      });
    }

    return {
      overallScore,
      confidence: 85,
      conditions: veteran.conditions.map(condition => ({
        name: condition.name,
        icd10: getICD10Code(condition.name),
        currentRating: condition.rating,
        predictedRating: calculatePredictedRating(condition, veteran),
        evidenceStrength: calculateEvidenceStrength(condition, veteran),
        nexusPresent: hasNexusLetters && condition.serviceConnected,
        serviceConnected: condition.serviceConnected,
        secondaryTo: getSecondaryConnection(condition.name)
      })).concat(
        veteran.pendingClaims.map(claim => ({
          name: claim.condition.split('(')[0].trim(),
          icd10: getICD10Code(claim.condition),
          currentRating: 0,
          predictedRating: 50,
          evidenceStrength: 60,
          nexusPresent: false,
          serviceConnected: false,
          secondaryTo: claim.condition.includes('Secondary') ? 
            claim.condition.match(/Secondary to (.+?)\)/)?.[1] : undefined
        }))
      ),
      evidenceAnalysis: {
        medical: medicalScore,
        service: serviceScore,
        nexus: nexusScore,
        continuity: continuityScore,
        supporting: supportingScore
      },
      timeline,
      recommendations,
      presumptiveConditions,
      missingEvidence,
      riskFactors
    };
  }, []);

  // Helper functions
  const getICD10Code = (condition: string): string => {
    const codes: Record<string, string> = {
      'PTSD': 'F43.10',
      'Lumbar Strain': 'M54.5',
      'Tinnitus': 'H93.11',
      'Left Knee Strain': 'M25.361',
      'Sleep Apnea': 'G47.33',
      'Migraines': 'G43.909'
    };
    return codes[condition] || 'Unknown';
  };

  const calculatePredictedRating = (condition: any, veteran: VeteranProfile): number => {
    // Simplified rating prediction logic
    if (condition.serviceConnected) {
      return condition.rating;
    }
    
    // Check for secondary connections
    if (condition.name.includes('Sleep Apnea') && veteran.conditions.some(c => c.name === 'PTSD')) {
      return 50;
    }
    
    if (condition.name.includes('Migraines') && veteran.deployments.some(d => d.exposures.includes('Blast exposure'))) {
      return 30;
    }
    
    return 0;
  };

  const calculateEvidenceStrength = (condition: any, veteran: VeteranProfile): number => {
    let strength = 50;
    
    if (condition.serviceConnected) {
      strength += 30;
    }
    
    if (veteran.combatService && (condition.name === 'PTSD' || condition.name.includes('TBI'))) {
      strength += 15;
    }
    
    if (veteran.medications.some(med => isRelatedMedication(med.name, condition.name))) {
      strength += 10;
    }
    
    return Math.min(strength, 100);
  };

  const isRelatedMedication = (medication: string, condition: string): boolean => {
    const relations: Record<string, string[]> = {
      'PTSD': ['Sertraline', 'Prazosin', 'Zoloft', 'Prozac'],
      'Lumbar Strain': ['Ibuprofen', 'Naproxen', 'Gabapentin'],
      'Migraines': ['Sumatriptan', 'Topiramate']
    };
    
    return relations[condition]?.includes(medication) || false;
  };

  const getSecondaryConnection = (condition: string): string | undefined => {
    const connections: Record<string, string> = {
      'Sleep Apnea': 'PTSD',
      'Depression': 'Chronic Pain',
      'Migraines': 'TBI',
      'Radiculopathy': 'Lumbar Strain'
    };
    
    return connections[condition];
  };

  // Auto-fetch if veteranId provided
  useEffect(() => {
    if (veteranId) {
      fetchVeteranData(veteranId);
    }
  }, [veteranId, fetchVeteranData]);

  return {
    veteranData,
    isLoading,
    error,
    fetchVeteranData,
    generateAnalysis
  };
}