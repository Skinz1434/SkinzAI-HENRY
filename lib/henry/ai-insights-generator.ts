import { Veteran } from '../../types';

interface AIInsight {
  type: 'risk' | 'pattern' | 'recommendation' | 'alert' | 'opportunity';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  confidence: number;
  dataPoints: string[];
  actionItems: string[];
  relatedConditions?: string[];
  predictedOutcome?: string;
}

export function generatePersonalizedAIInsights(veteran: Veteran): {
  insights: AIInsight[];
  riskPredictions: {
    condition: string;
    risk30Day: number;
    risk60Day: number;
    risk90Day: number;
    factors: string[];
  }[];
  patterns: {
    type: string;
    description: string;
    significance: string;
    recommendations: string[];
  }[];
  recommendations: {
    category: string;
    action: string;
    rationale: string;
    priority: string;
    expectedOutcome: string;
  }[];
} {
  const insights: AIInsight[] = [];
  
  // Generate insights based on veteran's specific data
  const disabilityRating = veteran.disabilityRating || 0;
  const claimsCount = veteran.claims?.length || 0;
  const pendingClaims = veteran.claims?.filter(c => 
    c.status === 'PENDING' || c.status === 'UNDER_REVIEW'
  ).length || 0;
  const approvedClaims = veteran.claims?.filter(c => c.status === 'APPROVED').length || 0;
  
  // Risk-based insights
  if (disabilityRating >= 70) {
    insights.push({
      type: 'risk',
      priority: 'high',
      title: 'High Disability Rating Pattern Detected',
      description: `With a ${disabilityRating}% disability rating, ${veteran.name} qualifies for enhanced VA benefits including CHAMPVA for dependents and potential TDIU eligibility.`,
      confidence: 0.92,
      dataPoints: [
        `Current disability rating: ${disabilityRating}%`,
        `Service-connected conditions: ${claimsCount}`,
        `Combat service: ${veteran.combatService ? 'Yes' : 'No'}`
      ],
      actionItems: [
        'Review TDIU eligibility criteria',
        'Assess for secondary service connections',
        'Evaluate need for Aid & Attendance benefits'
      ],
      relatedConditions: veteran.claims?.map(c => c.description || c.type) || []
    });
  }

  // Claims pattern insights
  if (pendingClaims > 2) {
    insights.push({
      type: 'alert',
      priority: 'high',
      title: 'Multiple Pending Claims Detected',
      description: `${pendingClaims} claims are currently pending review. Historical data suggests processing delays may impact benefit timeline.`,
      confidence: 0.85,
      dataPoints: [
        `Pending claims: ${pendingClaims}`,
        `Average processing time: 125 days`,
        `Approved claims: ${approvedClaims}`
      ],
      actionItems: [
        'Submit any missing evidence promptly',
        'Consider scheduling C&P examination',
        'Monitor claim status weekly'
      ],
      predictedOutcome: 'Expected resolution within 60-90 days with proper documentation'
    });
  }

  // Service-specific insights
  if (veteran.branch === 'MARINES' || veteran.branch === 'ARMY') {
    if (veteran.combatService) {
      insights.push({
        type: 'pattern',
        priority: 'medium',
        title: 'Combat Service Pattern Recognition',
        description: 'Combat veterans from ground forces show higher incidence of musculoskeletal and mental health conditions.',
        confidence: 0.88,
        dataPoints: [
          `Branch: ${veteran.branch}`,
          'Combat service confirmed',
          `Service period: ${new Date(veteran.serviceStartDate).getFullYear()}-${veteran.serviceEndDate ? new Date(veteran.serviceEndDate).getFullYear() : 'Present'}`
        ],
        actionItems: [
          'Screen for PTSD and related conditions',
          'Evaluate for hearing loss/tinnitus',
          'Assess musculoskeletal conditions'
        ]
      });
    }
  }

  // Age and service-related insights
  const age = veteran.dateOfBirth ? 
    Math.floor((Date.now() - new Date(veteran.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 
    null;
    
  if (age && age > 65) {
    insights.push({
      type: 'opportunity',
      priority: 'medium',
      title: 'Medicare/VA Healthcare Coordination Opportunity',
      description: 'Veteran is eligible for Medicare. Coordinating VA and Medicare benefits can maximize coverage.',
      confidence: 0.95,
      dataPoints: [
        `Age: ${age} years`,
        `VA healthcare enrollment: ${veteran.enrolledVaHealthcare ? 'Yes' : 'No'}`,
        `Healthcare priority group: ${veteran.healthcarePriority || 'Not assigned'}`
      ],
      actionItems: [
        'Review Medicare Part B enrollment',
        'Coordinate VA/Medicare benefits',
        'Evaluate prescription coverage options'
      ]
    });
  }

  // Generate risk predictions based on conditions
  const riskPredictions = generateRiskPredictions(veteran);
  
  // Generate pattern analysis
  const patterns = generatePatternAnalysis(veteran);
  
  // Generate personalized recommendations
  const recommendations = generateRecommendations(veteran, insights);

  return {
    insights,
    riskPredictions,
    patterns,
    recommendations
  };
}

function generateRiskPredictions(veteran: Veteran) {
  const predictions = [];
  const baseRisk = veteran.disabilityRating / 100;
  
  // Mental health risk prediction
  const hasMentalHealth = veteran.claims?.some(c => 
    c.type === 'DISABILITY' && 
    (c.description?.toLowerCase().includes('ptsd') || 
     c.description?.toLowerCase().includes('depression') ||
     c.description?.toLowerCase().includes('anxiety'))
  );
  
  if (hasMentalHealth) {
    predictions.push({
      condition: 'Mental Health Crisis',
      risk30Day: baseRisk * 0.15 + 0.12,
      risk60Day: baseRisk * 0.18 + 0.15,
      risk90Day: baseRisk * 0.22 + 0.18,
      factors: [
        'Existing mental health conditions',
        'Service-connected stressors',
        'Disability rating severity'
      ]
    });
  }

  // Cardiovascular risk
  const age = veteran.dateOfBirth ? 
    Math.floor((Date.now() - new Date(veteran.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 
    50;
    
  if (age > 50) {
    predictions.push({
      condition: 'Cardiovascular Event',
      risk30Day: (age - 50) * 0.005 + 0.08,
      risk60Day: (age - 50) * 0.008 + 0.12,
      risk90Day: (age - 50) * 0.01 + 0.15,
      factors: [
        `Age (${age} years)`,
        'Military service exposures',
        'Disability-related mobility issues'
      ]
    });
  }

  // Musculoskeletal deterioration
  if (veteran.claims?.some(c => c.description?.toLowerCase().includes('joint') || 
                              c.description?.toLowerCase().includes('back'))) {
    predictions.push({
      condition: 'Musculoskeletal Deterioration',
      risk30Day: 0.25,
      risk60Day: 0.35,
      risk90Day: 0.45,
      factors: [
        'Existing joint conditions',
        'Service-connected injuries',
        'Physical activity limitations'
      ]
    });
  }

  return predictions;
}

function generatePatternAnalysis(veteran: Veteran) {
  const patterns = [];
  
  // Claims approval pattern
  const approvalRate = veteran.claims?.length ? 
    (veteran.claims.filter(c => c.status === 'APPROVED').length / veteran.claims.length) : 0;
    
  patterns.push({
    type: 'Claims Processing',
    description: `${(approvalRate * 100).toFixed(0)}% approval rate on submitted claims`,
    significance: approvalRate > 0.7 ? 'Positive trend' : 'Needs attention',
    recommendations: approvalRate > 0.7 ? 
      ['Continue current documentation practices'] : 
      ['Improve medical evidence documentation', 'Consider VSO assistance']
  });

  // Service connection patterns
  if (veteran.combatService) {
    patterns.push({
      type: 'Combat Service Connection',
      description: 'Presumptive conditions likely applicable based on combat service',
      significance: 'High impact on claim success',
      recommendations: [
        'Review 38 CFR 3.309 presumptive conditions',
        'Document all deployment locations',
        'Screen for Gulf War Syndrome if applicable'
      ]
    });
  }

  // Healthcare utilization pattern
  patterns.push({
    type: 'Healthcare Utilization',
    description: veteran.enrolledVaHealthcare ? 
      'Active VA healthcare user' : 
      'Not utilizing VA healthcare benefits',
    significance: veteran.enrolledVaHealthcare ? 'Optimal' : 'Opportunity for improvement',
    recommendations: veteran.enrolledVaHealthcare ?
      ['Maintain regular appointments', 'Utilize preventive care services'] :
      ['Enroll in VA healthcare', 'Schedule initial evaluation']
  });

  return patterns;
}

function generateRecommendations(veteran: Veteran, insights: AIInsight[]) {
  const recommendations = [];
  
  // High-priority recommendations based on insights
  if (insights.some(i => i.type === 'risk' && i.priority === 'high')) {
    recommendations.push({
      category: 'Immediate Action',
      action: 'Schedule comprehensive medical evaluation',
      rationale: 'High-risk indicators detected requiring immediate assessment',
      priority: 'Critical',
      expectedOutcome: 'Early intervention to prevent condition deterioration'
    });
  }

  // Claims-based recommendations
  if (veteran.claims?.some(c => c.status === 'PENDING')) {
    recommendations.push({
      category: 'Claims Management',
      action: 'Submit supplemental evidence for pending claims',
      rationale: 'Strengthen claim with additional medical evidence',
      priority: 'High',
      expectedOutcome: 'Increased probability of favorable decision'
    });
  }

  // Benefits optimization
  if (veteran.disabilityRating >= 30 && !veteran.enrolledVaHealthcare) {
    recommendations.push({
      category: 'Benefits Optimization',
      action: 'Enroll in VA Healthcare System',
      rationale: `With ${veteran.disabilityRating}% disability rating, eligible for comprehensive care`,
      priority: 'Medium',
      expectedOutcome: 'Access to free or low-cost healthcare and prescriptions'
    });
  }

  // Education benefits
  if (veteran.gibBillRemaining > 0) {
    recommendations.push({
      category: 'Education Benefits',
      action: 'Utilize remaining GI Bill benefits',
      rationale: `${veteran.gibBillRemaining} months of education benefits available`,
      priority: 'Low',
      expectedOutcome: 'Career advancement through education or training'
    });
  }

  // Preventive care
  recommendations.push({
    category: 'Preventive Care',
    action: 'Schedule annual VA preventive care screening',
    rationale: 'Early detection and prevention of service-connected conditions',
    priority: 'Medium',
    expectedOutcome: 'Maintain health and document conditions for future claims'
  });

  return recommendations;
}