// Intelligent VA Forms Recommendation System
import { VeteranProfileEnhanced } from './veteran-profile-enhanced';

export interface FormRecommendation {
  formNumber: string;
  title: string;
  priority: 'Immediate' | 'High' | 'Medium' | 'Low';
  reason: string;
  deadline?: string;
  benefits?: string;
  estimatedProcessingTime?: string;
  requiredDocuments?: string[];
  tips?: string[];
}

export interface FormCategory {
  category: string;
  icon: string;
  forms: FormRecommendation[];
  description: string;
}

export class VAFormsRecommendationEngine {
  
  // Analyze veteran profile and recommend appropriate forms
  static getRecommendations(veteran: VeteranProfileEnhanced): FormCategory[] {
    const recommendations: FormCategory[] = [];
    
    // 1. Disability Compensation Forms
    const disabilityForms = this.analyzeDisabilityNeeds(veteran);
    if (disabilityForms.forms.length > 0) {
      recommendations.push(disabilityForms);
    }
    
    // 2. Healthcare Forms
    const healthcareForms = this.analyzeHealthcareNeeds(veteran);
    if (healthcareForms.forms.length > 0) {
      recommendations.push(healthcareForms);
    }
    
    // 3. Education Benefits
    const educationForms = this.analyzeEducationNeeds(veteran);
    if (educationForms.forms.length > 0) {
      recommendations.push(educationForms);
    }
    
    // 4. Housing & Homelessness Prevention
    const housingForms = this.analyzeHousingNeeds(veteran);
    if (housingForms.forms.length > 0) {
      recommendations.push(housingForms);
    }
    
    // 5. Mental Health & Crisis Support
    const mentalHealthForms = this.analyzeMentalHealthNeeds(veteran);
    if (mentalHealthForms.forms.length > 0) {
      recommendations.push(mentalHealthForms);
    }
    
    // 6. Appeals & Reviews
    const appealsForms = this.analyzeAppealsNeeds(veteran);
    if (appealsForms.forms.length > 0) {
      recommendations.push(appealsForms);
    }
    
    // 7. Financial & Pension
    const financialForms = this.analyzeFinancialNeeds(veteran);
    if (financialForms.forms.length > 0) {
      recommendations.push(financialForms);
    }
    
    // 8. Family & Survivor Benefits
    const familyForms = this.analyzeFamilyNeeds(veteran);
    if (familyForms.forms.length > 0) {
      recommendations.push(familyForms);
    }
    
    // Sort by priority
    recommendations.forEach(cat => {
      cat.forms.sort((a, b) => {
        const priorityOrder = { 'Immediate': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    });
    
    return recommendations;
  }
  
  private static analyzeDisabilityNeeds(veteran: VeteranProfileEnhanced): FormCategory {
    const forms: FormRecommendation[] = [];
    const disability = veteran.mpd?.disabilityRating || 0;
    
    // Check for unrated conditions
    const hasUnratedConditions = veteran.mpd?.conditions?.some(c => !c.rating) || false;
    if (hasUnratedConditions) {
      forms.push({
        formNumber: 'VA Form 21-526EZ',
        title: 'Application for Disability Compensation',
        priority: 'High',
        reason: 'You have service-connected conditions that may not be rated yet',
        benefits: 'Could increase your monthly compensation by $500-$2000',
        estimatedProcessingTime: '125 days average',
        requiredDocuments: [
          'DD-214',
          'Medical evidence',
          'Nexus letter from doctor',
          'Buddy statements'
        ],
        tips: [
          'File online for faster processing',
          'Include all medical evidence upfront',
          'Be specific about how conditions affect daily life'
        ]
      });
    }
    
    // Check for worsening conditions (increase claim)
    if (disability > 0 && disability < 100) {
      forms.push({
        formNumber: 'VA Form 21-526EZ',
        title: 'Application for Increased Evaluation',
        priority: 'Medium',
        reason: 'Your conditions may have worsened since last evaluation',
        benefits: 'Potential increase in monthly compensation',
        estimatedProcessingTime: '125 days average',
        requiredDocuments: [
          'Recent medical records',
          'Treatment records',
          'Impact statements'
        ]
      });
    }
    
    // Check for Individual Unemployability
    if (disability >= 60 && disability < 100) {
      forms.push({
        formNumber: 'VA Form 21-8940',
        title: 'Application for Increased Compensation Based on Unemployability',
        priority: 'High',
        reason: 'You may qualify for 100% compensation rate if unable to work',
        benefits: 'Receive 100% compensation rate (approximately $3,737/month)',
        estimatedProcessingTime: '4-6 months',
        requiredDocuments: [
          'Employment history',
          'Doctor\'s statement about work limitations',
          'VA Form 21-4192 from last employer'
        ]
      });
    }
    
    // Special Monthly Compensation
    if (disability >= 100 || (disability >= 70 && veteran.mpd?.conditions?.length > 3)) {
      forms.push({
        formNumber: 'VA Form 21-2680',
        title: 'Examination for Housebound Status or Permanent Need for Aid and Attendance',
        priority: 'Medium',
        reason: 'You may qualify for Special Monthly Compensation',
        benefits: 'Additional $200-$500 monthly compensation',
        estimatedProcessingTime: '3-4 months',
        requiredDocuments: [
          'Medical examination report',
          'Activities of daily living assessment'
        ]
      });
    }
    
    // Secondary conditions claim
    const hasPrimaryConditions = veteran.mpd?.conditions?.some(c => 
      c.description.toLowerCase().includes('back') || 
      c.description.toLowerCase().includes('knee') ||
      c.description.toLowerCase().includes('ptsd')
    );
    
    if (hasPrimaryConditions) {
      forms.push({
        formNumber: 'VA Form 21-526EZ',
        title: 'Secondary Conditions Claim',
        priority: 'Medium',
        reason: 'Your service-connected conditions may have caused other conditions',
        benefits: 'Additional compensation for secondary conditions',
        estimatedProcessingTime: '125 days average',
        tips: [
          'Common secondary: radiculopathy from back injuries',
          'Depression secondary to chronic pain',
          'Sleep apnea secondary to PTSD'
        ]
      });
    }
    
    return {
      category: 'Disability Compensation',
      icon: 'shield',
      description: 'Forms related to disability ratings and compensation',
      forms
    };
  }
  
  private static analyzeHealthcareNeeds(veteran: VeteranProfileEnhanced): FormCategory {
    const forms: FormRecommendation[] = [];
    
    // Healthcare enrollment
    if (!veteran.benefits?.healthcare?.enrollmentDate) {
      forms.push({
        formNumber: 'VA Form 10-10EZ',
        title: 'Application for Health Benefits',
        priority: 'Immediate',
        reason: 'You\'re not enrolled in VA healthcare',
        benefits: 'Free or low-cost healthcare, prescriptions, mental health services',
        estimatedProcessingTime: '1 week',
        requiredDocuments: [
          'DD-214',
          'Insurance information',
          'Financial information'
        ]
      });
    }
    
    // Dental care
    if (veteran.mpd?.disabilityRating >= 100 || 
        veteran.mpd?.conditions?.some(c => c.description.toLowerCase().includes('dental'))) {
      forms.push({
        formNumber: 'VA Form 10-10EZ',
        title: 'Application for Dental Benefits',
        priority: 'Medium',
        reason: 'You may qualify for VA dental care',
        benefits: 'Free dental care',
        estimatedProcessingTime: '2-3 weeks'
      });
    }
    
    // Caregiver program
    if (veteran.mpd?.disabilityRating >= 70) {
      forms.push({
        formNumber: 'VA Form 10-10CG',
        title: 'Application for Caregiver Benefits',
        priority: 'High',
        reason: 'Family caregivers may receive stipend and support',
        benefits: 'Monthly stipend for caregiver, training, respite care',
        estimatedProcessingTime: '45 days',
        requiredDocuments: [
          'Caregiver identification',
          'Medical documentation of need'
        ]
      });
    }
    
    // Travel reimbursement
    if (veteran.mpd?.appointments?.length > 0) {
      forms.push({
        formNumber: 'VA Form 10-3542',
        title: 'Beneficiary Travel Claim',
        priority: 'Low',
        reason: 'Get reimbursed for travel to VA appointments',
        benefits: '$0.415 per mile to VA facilities',
        estimatedProcessingTime: 'Immediate at facility'
      });
    }
    
    return {
      category: 'Healthcare & Medical',
      icon: 'heart',
      description: 'Healthcare enrollment and medical benefits',
      forms
    };
  }
  
  private static analyzeEducationNeeds(veteran: VeteranProfileEnhanced): FormCategory {
    const forms: FormRecommendation[] = [];
    
    // GI Bill benefits
    forms.push({
      formNumber: 'VA Form 22-1990',
      title: 'Application for VA Education Benefits',
      priority: 'Medium',
      reason: 'Use your GI Bill benefits for education',
      benefits: 'Full tuition, monthly housing allowance, book stipend',
      estimatedProcessingTime: '30 days',
      requiredDocuments: [
        'DD-214',
        'School enrollment certification'
      ]
    });
    
    // Vocational Rehabilitation
    if (veteran.mpd?.disabilityRating >= 20) {
      forms.push({
        formNumber: 'VA Form 28-1900',
        title: 'Application for Vocational Rehabilitation (Chapter 31)',
        priority: 'High',
        reason: 'Get education and training with employment assistance',
        benefits: 'Full tuition, supplies, monthly subsistence allowance',
        estimatedProcessingTime: '2 months',
        tips: [
          'Includes job placement assistance',
          'Covers certifications and licenses',
          'Can include self-employment track'
        ]
      });
    }
    
    // Transfer education benefits
    if (veteran.benefits?.dependents > 0) {
      forms.push({
        formNumber: 'VA Form 22-1990E',
        title: 'Transfer of Education Benefits to Dependents',
        priority: 'Low',
        reason: 'Transfer unused GI Bill benefits to family',
        benefits: 'Family members can use your education benefits',
        estimatedProcessingTime: '30 days'
      });
    }
    
    // Yellow Ribbon Program
    forms.push({
      formNumber: 'Yellow Ribbon Agreement',
      title: 'Yellow Ribbon Program Participation',
      priority: 'Low',
      reason: 'Additional funding for private schools',
      benefits: 'Covers tuition above GI Bill cap',
      estimatedProcessingTime: 'Varies by school'
    });
    
    return {
      category: 'Education & Training',
      icon: 'graduation-cap',
      description: 'Education benefits and vocational training',
      forms
    };
  }
  
  private static analyzeHousingNeeds(veteran: VeteranProfileEnhanced): FormCategory {
    const forms: FormRecommendation[] = [];
    
    // VA Home Loan
    forms.push({
      formNumber: 'VA Form 26-1880',
      title: 'Request for Certificate of Eligibility (COE)',
      priority: 'Medium',
      reason: 'Use VA home loan benefit with no down payment',
      benefits: 'No down payment, no PMI, competitive rates',
      estimatedProcessingTime: 'Instant online',
      tips: [
        'Can be used multiple times',
        'No prepayment penalties',
        'Can assume another VA loan'
      ]
    });
    
    // Specially Adapted Housing
    if (veteran.mpd?.disabilityRating >= 50 && 
        veteran.mpd?.conditions?.some(c => 
          c.description.toLowerCase().includes('amputation') ||
          c.description.toLowerCase().includes('paralysis') ||
          c.description.toLowerCase().includes('blindness')
        )) {
      forms.push({
        formNumber: 'VA Form 26-4555',
        title: 'Specially Adapted Housing (SAH) Grant',
        priority: 'High',
        reason: 'Get grant to adapt home for your disabilities',
        benefits: 'Up to $109,986 for home adaptations',
        estimatedProcessingTime: '3-4 months',
        requiredDocuments: [
          'Medical documentation',
          'Home ownership proof',
          'Contractor estimates'
        ]
      });
    }
    
    // Homeless prevention
    const housingRisk = veteran.mpd?.conditions?.some(c => 
      c.description.toLowerCase().includes('ptsd') ||
      c.description.toLowerCase().includes('substance')
    );
    
    if (housingRisk) {
      forms.push({
        formNumber: 'HUD-VASH Application',
        title: 'HUD-VASH Supportive Housing',
        priority: 'Immediate',
        reason: 'Housing assistance and case management',
        benefits: 'Rental assistance vouchers and support services',
        estimatedProcessingTime: '2-4 weeks',
        deadline: 'Apply immediately if at risk'
      });
      
      forms.push({
        formNumber: 'SSVF Application',
        title: 'Supportive Services for Veteran Families',
        priority: 'Immediate',
        reason: 'Rapid re-housing and homelessness prevention',
        benefits: 'Emergency financial assistance, housing counseling',
        estimatedProcessingTime: '48-72 hours for emergency assistance'
      });
    }
    
    return {
      category: 'Housing & Homelessness Prevention',
      icon: 'home',
      description: 'Housing assistance and adaptation programs',
      forms
    };
  }
  
  private static analyzeMentalHealthNeeds(veteran: VeteranProfileEnhanced): FormCategory {
    const forms: FormRecommendation[] = [];
    
    const hasMentalHealth = veteran.mpd?.conditions?.some(c => 
      c.description.toLowerCase().includes('ptsd') ||
      c.description.toLowerCase().includes('depression') ||
      c.description.toLowerCase().includes('anxiety')
    );
    
    if (hasMentalHealth) {
      // PTSD claim
      forms.push({
        formNumber: 'VA Form 21-0781',
        title: 'Statement in Support of Claim for PTSD',
        priority: 'High',
        reason: 'Document PTSD stressors for disability claim',
        benefits: 'Support for PTSD disability rating',
        estimatedProcessingTime: 'Part of 21-526EZ claim',
        requiredDocuments: [
          'Stressor statements',
          'Unit records',
          'Buddy statements'
        ]
      });
      
      // Mental health treatment
      forms.push({
        formNumber: 'VA Form 10-10EZ',
        title: 'Enrollment for Mental Health Services',
        priority: 'Immediate',
        reason: 'Access mental health treatment immediately',
        benefits: 'Free mental health care, therapy, medication',
        estimatedProcessingTime: 'Same day for crisis',
        tips: [
          'Walk-in mental health clinics available',
          'Telehealth options available',
          'Vet Centers offer counseling'
        ]
      });
      
      // MST claim
      forms.push({
        formNumber: 'VA Form 21-0781a',
        title: 'Statement in Support of Claim for MST',
        priority: 'High',
        reason: 'Document Military Sexual Trauma for benefits',
        benefits: 'Disability compensation and free treatment',
        estimatedProcessingTime: 'Expedited processing available',
        tips: [
          'No police report required',
          'Markers of MST accepted as evidence',
          'Free MST counseling regardless of claim'
        ]
      });
    }
    
    // Camp Lejeune
    forms.push({
      formNumber: 'VA Form 10-10068',
      title: 'Camp Lejeune Family Member Program',
      priority: 'Medium',
      reason: 'If stationed at Camp Lejeune 1953-1987',
      benefits: 'Healthcare reimbursement for related conditions',
      estimatedProcessingTime: '60 days'
    });
    
    return {
      category: 'Mental Health & Specialized Care',
      icon: 'brain',
      description: 'Mental health services and specialized programs',
      forms
    };
  }
  
  private static analyzeAppealsNeeds(veteran: VeteranProfileEnhanced): FormCategory {
    const forms: FormRecommendation[] = [];
    
    // Check for denied claims
    const hasDeniedClaims = veteran.claims?.some(c => 
      c.status === 'denied' || c.status === 'deferred'
    );
    
    if (hasDeniedClaims) {
      forms.push({
        formNumber: 'VA Form 20-0995',
        title: 'Supplemental Claim',
        priority: 'High',
        reason: 'Submit new evidence for denied claim',
        benefits: 'Preserve effective date with new evidence',
        estimatedProcessingTime: '125 days average',
        deadline: 'Within 1 year of decision',
        tips: [
          'Fastest appeal option',
          'Submit new and relevant evidence',
          'Can request same effective date'
        ]
      });
      
      forms.push({
        formNumber: 'VA Form 20-0996',
        title: 'Higher-Level Review',
        priority: 'High',
        reason: 'Request senior reviewer to look at claim',
        benefits: 'Error correction without new evidence',
        estimatedProcessingTime: '125 days average',
        deadline: 'Within 1 year of decision',
        tips: [
          'No new evidence allowed',
          'Informal conference available',
          'Good for clear errors'
        ]
      });
      
      forms.push({
        formNumber: 'VA Form 10182',
        title: 'Board Appeal',
        priority: 'Medium',
        reason: 'Appeal to Board of Veterans Appeals',
        benefits: 'Judge review with hearing option',
        estimatedProcessingTime: '12-18 months',
        deadline: 'Within 1 year of decision',
        tips: [
          'Three docket options',
          'Video hearing available',
          'Most thorough review'
        ]
      });
    }
    
    // Clear and unmistakable error
    if (veteran.claims?.some(c => c.lastActionDate)) {
      forms.push({
        formNumber: 'CUE Motion',
        title: 'Clear and Unmistakable Error Motion',
        priority: 'Low',
        reason: 'Challenge old decisions with obvious errors',
        benefits: 'Retroactive benefits to original date',
        estimatedProcessingTime: '6-12 months',
        tips: [
          'Very high burden of proof',
          'Consider attorney assistance',
          'No time limit for filing'
        ]
      });
    }
    
    return {
      category: 'Appeals & Reviews',
      icon: 'scale',
      description: 'Appeal options for denied or reduced benefits',
      forms
    };
  }
  
  private static analyzeFinancialNeeds(veteran: VeteranProfileEnhanced): FormCategory {
    const forms: FormRecommendation[] = [];
    
    // Pension for low income
    // Check if veteran served during wartime periods based on service dates
    const serviceStart = veteran.mpr?.serviceStartDate;
    const isVietnamEra = serviceStart && new Date(serviceStart) >= new Date('1961-08-05') && new Date(serviceStart) <= new Date('1975-05-07');
    const isKoreanWar = serviceStart && new Date(serviceStart) >= new Date('1950-06-25') && new Date(serviceStart) <= new Date('1955-01-31');
    const isElderly = isVietnamEra || isKoreanWar;
    
    // Check for low income (using benefit amount as proxy)
    if (isElderly && veteran.benefits?.monthlyAmount < 1500) {
      forms.push({
        formNumber: 'VA Form 21P-527EZ',
        title: 'Application for Pension',
        priority: 'High',
        reason: 'Low-income wartime veterans may qualify for pension',
        benefits: 'Up to $1,675/month tax-free',
        estimatedProcessingTime: '3-4 months',
        requiredDocuments: [
          'Financial records',
          'Medical expenses',
          'DD-214 showing wartime service'
        ]
      });
    }
    
    // Aid and Attendance
    if (veteran.mpd?.disabilityRating >= 70 || isElderly) {
      forms.push({
        formNumber: 'VA Form 21-2680',
        title: 'Aid and Attendance or Housebound Benefits',
        priority: 'High',
        reason: 'Additional compensation for daily living assistance',
        benefits: 'Up to $500 additional monthly',
        estimatedProcessingTime: '3-4 months',
        requiredDocuments: [
          'Doctor\'s statement',
          'Activities of daily living form'
        ]
      });
    }
    
    // Clothing allowance
    if (veteran.mpd?.conditions?.some(c => 
      c.description.toLowerCase().includes('prosthetic') ||
      c.description.toLowerCase().includes('skin')
    )) {
      forms.push({
        formNumber: 'VA Form 10-8678',
        title: 'Annual Clothing Allowance',
        priority: 'Low',
        reason: 'Compensation for clothing damaged by prosthetics',
        benefits: '$904.51 annual payment',
        estimatedProcessingTime: '60 days',
        deadline: 'Apply by August 1st each year'
      });
    }
    
    // Auto allowance
    if (veteran.mpd?.conditions?.some(c => 
      c.description.toLowerCase().includes('loss of') ||
      c.description.toLowerCase().includes('amputation')
    )) {
      forms.push({
        formNumber: 'VA Form 21-4502',
        title: 'Automobile Allowance and Adaptive Equipment',
        priority: 'Medium',
        reason: 'One-time payment for vehicle purchase',
        benefits: 'Up to $25,062.60 toward vehicle',
        estimatedProcessingTime: '2-3 months',
        tips: [
          'One-time grant',
          'Adaptive equipment covered separately',
          'Can be used for new or used vehicle'
        ]
      });
    }
    
    return {
      category: 'Financial & Pension Benefits',
      icon: 'dollar-sign',
      description: 'Financial assistance and pension programs',
      forms
    };
  }
  
  private static analyzeFamilyNeeds(veteran: VeteranProfileEnhanced): FormCategory {
    const forms: FormRecommendation[] = [];
    
    if (veteran.benefits?.dependents > 0) {
      // CHAMPVA
      if (veteran.mpd?.disabilityRating >= 100) {
        forms.push({
          formNumber: 'VA Form 10-10d',
          title: 'CHAMPVA Application',
          priority: 'High',
          reason: 'Healthcare for spouse and children',
          benefits: 'Comprehensive healthcare coverage for family',
          estimatedProcessingTime: '45 days',
          requiredDocuments: [
            'Marriage certificate',
            'Children\'s birth certificates',
            'Medicare information if applicable'
          ]
        });
      }
      
      // DEA Education
      if (veteran.mpd?.disabilityRating >= 100 || 
          veteran.mpd?.conditions?.some(c => c.description.includes('Total'))) {
        forms.push({
          formNumber: 'VA Form 22-5490',
          title: 'Dependents Educational Assistance (Chapter 35)',
          priority: 'Medium',
          reason: 'Education benefits for spouse and children',
          benefits: 'Up to 45 months of education benefits',
          estimatedProcessingTime: '30 days',
          tips: [
            'Children eligible ages 18-26',
            'Spouse eligible for 10 years',
            'Covers degree programs and certifications'
          ]
        });
      }
      
      // Dependency claims
      forms.push({
        formNumber: 'VA Form 21-686c',
        title: 'Add Dependents to VA Benefits',
        priority: 'High',
        reason: 'Increase compensation for dependents',
        benefits: 'Additional $100-300/month per dependent',
        estimatedProcessingTime: '2-3 months',
        requiredDocuments: [
          'Marriage certificate',
          'Birth certificates',
          'SSNs for all dependents'
        ]
      });
      
      // Pre-need burial
      forms.push({
        formNumber: 'VA Form 40-10007',
        title: 'Pre-Need Burial Eligibility',
        priority: 'Low',
        reason: 'Confirm burial benefits in advance',
        benefits: 'Peace of mind for family',
        estimatedProcessingTime: '60 days'
      });
    }
    
    // Survivor benefits info
    forms.push({
      formNumber: 'VA Form 21P-534EZ',
      title: 'DIC, Survivors Pension Information',
      priority: 'Low',
      reason: 'Information for survivors about benefits',
      benefits: 'Ensures family knows available benefits',
      estimatedProcessingTime: 'Informational only',
      tips: [
        'DIC pays $1,612.75/month minimum',
        'Additional for dependents',
        'No income limits for DIC'
      ]
    });
    
    return {
      category: 'Family & Survivor Benefits',
      icon: 'users',
      description: 'Benefits for spouses, children, and survivors',
      forms
    };
  }
  
  // Get priority forms that need immediate attention
  static getUrgentForms(recommendations: FormCategory[]): FormRecommendation[] {
    const urgentForms: FormRecommendation[] = [];
    
    recommendations.forEach(category => {
      category.forms.forEach(form => {
        if (form.priority === 'Immediate' || form.priority === 'High') {
          urgentForms.push(form);
        }
      });
    });
    
    return urgentForms.slice(0, 5); // Return top 5 urgent forms
  }
  
  // Calculate potential benefits value
  static calculatePotentialBenefits(recommendations: FormCategory[]): number {
    let totalPotential = 0;
    
    recommendations.forEach(category => {
      category.forms.forEach(form => {
        // Extract dollar amounts from benefits string
        const matches = form.benefits?.match(/\$[\d,]+/g);
        if (matches) {
          matches.forEach(match => {
            const amount = parseInt(match.replace(/[$,]/g, ''));
            if (!isNaN(amount)) {
              totalPotential += amount;
            }
          });
        }
      });
    });
    
    return totalPotential;
  }
  
  // Get forms by deadline
  static getFormsByDeadline(recommendations: FormCategory[]): FormRecommendation[] {
    const formsWithDeadlines: FormRecommendation[] = [];
    
    recommendations.forEach(category => {
      category.forms.forEach(form => {
        if (form.deadline) {
          formsWithDeadlines.push(form);
        }
      });
    });
    
    return formsWithDeadlines.sort((a, b) => {
      // Sort by urgency of deadline
      if (a.deadline?.includes('immediately')) return -1;
      if (b.deadline?.includes('immediately')) return 1;
      if (a.deadline?.includes('30 days')) return -1;
      if (b.deadline?.includes('30 days')) return 1;
      if (a.deadline?.includes('60 days')) return -1;
      if (b.deadline?.includes('60 days')) return 1;
      return 0;
    });
  }
}