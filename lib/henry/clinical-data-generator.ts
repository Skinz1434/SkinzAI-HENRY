import { Veteran } from '../../types';

export function generateInflammatoryTrendData(veteran: Veteran) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const severity = veteran.disabilityRating >= 70 ? 'high' : veteran.disabilityRating >= 40 ? 'medium' : 'low';
  
  return months.map((month, index) => {
    const baseESR = severity === 'high' ? 40 : severity === 'medium' ? 25 : 15;
    const baseCRP = severity === 'high' ? 15 : severity === 'medium' ? 8 : 3;
    const baseRF = severity === 'high' ? 80 : severity === 'medium' ? 40 : 10;
    
    return {
      date: month,
      esr: baseESR + Math.random() * 20 - 10,
      crp: baseCRP + Math.random() * 10 - 5,
      rf: veteran.disabilityRating > 50 ? baseRF + Math.random() * 30 - 15 : undefined
    };
  });
}

export function generateJointAssessmentData() {
  const joints = ['Hands', 'Wrists', 'Shoulders', 'Knees', 'Ankles', 'Spine'];
  return joints.map(joint => ({
    joint,
    pain: Math.floor(Math.random() * 8) + 2,
    swelling: Math.floor(Math.random() * 7) + 1,
    stiffness: Math.floor(Math.random() * 8) + 2,
    function: Math.floor(Math.random() * 6) + 4
  }));
}

export function generateDiseaseActivityData(veteran: Veteran) {
  const severity = veteran.disabilityRating >= 70 ? 'high' : veteran.disabilityRating >= 40 ? 'medium' : 'low';
  const baseScore = severity === 'high' ? 4.5 : severity === 'medium' ? 3.2 : 2.1;
  
  return {
    score: baseScore + (Math.random() * 1.5 - 0.75),
    trend: Math.random() > 0.5 ? 'up' as const : Math.random() > 0.3 ? 'stable' as const : 'down' as const,
    components: {
      tjc: Math.floor(Math.random() * 10) + (severity === 'high' ? 10 : 5),
      sjc: Math.floor(Math.random() * 8) + (severity === 'high' ? 8 : 3),
      vas: Math.floor(Math.random() * 30) + (severity === 'high' ? 50 : 30),
      esr: Math.floor(Math.random() * 30) + (severity === 'high' ? 30 : 15)
    }
  };
}

export function generateMedicationAdherenceData() {
  const medications = [
    'Methotrexate',
    'Prednisone',
    'Hydroxychloroquine',
    'Sulfasalazine',
    'Adalimumab'
  ];
  
  return medications.map(medication => ({
    medication,
    prescribed: 30,
    taken: Math.floor(Math.random() * 8) + 22,
    adherence: Math.floor(Math.random() * 25) + 75
  }));
}

export function generateFunctionalAssessmentData() {
  const activities = ['Dressing', 'Walking', 'Eating', 'Hygiene', 'Gripping', 'Reaching'];
  
  return activities.map(activity => ({
    activity,
    baseline: Math.random() * 1.5 + 1.5,
    current: Math.random() * 1.5 + 0.5,
    target: Math.random() * 0.5 + 0.3
  }));
}

export function generateComorbidityData(veteran: Veteran) {
  const conditions = [];
  
  if (veteran.disabilityRating >= 70) {
    conditions.push(
      { name: 'Arthritis', severity: 35, connections: ['Chronic Pain', 'Depression'] },
      { name: 'Chronic Pain', severity: 30, connections: ['Arthritis', 'Depression', 'Insomnia'] },
      { name: 'Depression', severity: 20, connections: ['Chronic Pain', 'Insomnia'] },
      { name: 'Insomnia', severity: 15, connections: ['Depression', 'Chronic Pain'] }
    );
  } else {
    conditions.push(
      { name: 'Hypertension', severity: 25, connections: ['Diabetes'] },
      { name: 'Diabetes', severity: 20, connections: ['Hypertension'] },
      { name: 'Arthritis', severity: 30, connections: ['Chronic Pain'] },
      { name: 'Chronic Pain', severity: 25, connections: ['Arthritis'] }
    );
  }
  
  return conditions;
}

export function generateClinicalTimelineEvents(veteran: Veteran) {
  const events = [];
  const baseDate = new Date();
  
  // Add diagnosis events
  if (veteran.claims) {
    veteran.claims.forEach((claim, index) => {
      const monthsAgo = Math.floor(Math.random() * 24) + index * 6;
      events.push({
        id: `diagnosis-${claim.id}`,
        date: new Date(baseDate.getTime() - monthsAgo * 30 * 24 * 60 * 60 * 1000),
        type: 'diagnosis' as const,
        title: claim.description || 'Service-Connected Condition',
        description: `Diagnosed with ${claim.description || claim.type}. Rating: ${claim.rating || 'Pending'}%`,
        severity: claim.rating && claim.rating > 50 ? 'high' as const : 'medium' as const,
        icon: null,
        color: 'red',
        metadata: {
          rating: `${claim.rating || 0}%`,
          status: claim.status
        }
      });
    });
  }
  
  // Add treatment events
  const treatments = ['Physical Therapy', 'Pain Management', 'Surgery', 'Medication Adjustment'];
  treatments.forEach((treatment, index) => {
    const monthsAgo = Math.floor(Math.random() * 18) + index * 3;
    events.push({
      id: `treatment-${index}`,
      date: new Date(baseDate.getTime() - monthsAgo * 30 * 24 * 60 * 60 * 1000),
      type: 'treatment' as const,
      title: treatment,
      description: `${treatment} initiated for symptom management`,
      severity: 'low' as const,
      icon: null,
      color: 'blue'
    });
  });
  
  // Add deployment events if veteran has combat service
  if (veteran.combatService) {
    events.push({
      id: 'deployment-1',
      date: new Date(veteran.serviceStartDate),
      type: 'deployment' as const,
      title: 'Combat Deployment',
      description: 'Deployed to combat zone with potential environmental exposures',
      severity: 'high' as const,
      icon: null,
      color: 'indigo',
      metadata: {
        location: 'Iraq/Afghanistan',
        duration: '12 months'
      }
    });
  }
  
  return events;
}

export function generateMilitaryDeployments(veteran: Veteran) {
  const deployments = [];
  
  if (veteran.combatService) {
    const startYear = new Date(veteran.serviceStartDate).getFullYear();
    
    deployments.push({
      id: 'dep-1',
      location: 'Iraq',
      startDate: new Date(startYear, 2, 1),
      endDate: new Date(startYear + 1, 1, 1),
      branch: veteran.branch,
      unit: '1st Infantry Division',
      exposures: ['Burn Pits', 'IEDs'],
      combatService: true
    });
    
    if (veteran.disabilityRating >= 70) {
      deployments.push({
        id: 'dep-2',
        location: 'Afghanistan',
        startDate: new Date(startYear + 2, 5, 1),
        endDate: new Date(startYear + 3, 2, 1),
        branch: veteran.branch,
        unit: '82nd Airborne',
        exposures: ['Burn Pits', 'Combat Operations'],
        combatService: true
      });
    }
  } else {
    const startYear = new Date(veteran.serviceStartDate).getFullYear();
    deployments.push({
      id: 'dep-1',
      location: 'Germany',
      startDate: new Date(startYear, 0, 1),
      endDate: new Date(startYear + 2, 0, 1),
      branch: veteran.branch,
      unit: 'Support Battalion',
      exposures: [],
      combatService: false
    });
  }
  
  return deployments;
}

export function generateRiskPredictions(veteran: Veteran) {
  const baseRisk = veteran.disabilityRating / 100;
  
  return [
    {
      category: 'Mental Health',
      current: Math.min(95, baseRisk * 70 + Math.random() * 20),
      predicted30: Math.min(95, baseRisk * 75 + Math.random() * 20),
      predicted60: Math.min(95, baseRisk * 80 + Math.random() * 15),
      predicted90: Math.min(95, baseRisk * 85 + Math.random() * 10),
      factors: ['Combat exposure', 'Chronic pain', 'Social isolation'],
      interventions: ['Mental health counseling', 'Peer support groups', 'Medication management'],
      confidence: 85
    },
    {
      category: 'Cardiovascular',
      current: Math.min(95, baseRisk * 50 + Math.random() * 25),
      predicted30: Math.min(95, baseRisk * 52 + Math.random() * 25),
      predicted60: Math.min(95, baseRisk * 55 + Math.random() * 20),
      predicted90: Math.min(95, baseRisk * 58 + Math.random() * 20),
      factors: ['Hypertension', 'Diabetes', 'Sedentary lifestyle'],
      interventions: ['Cardiac rehabilitation', 'Dietary counseling', 'Exercise program'],
      confidence: 78
    },
    {
      category: 'Musculoskeletal',
      current: Math.min(95, baseRisk * 80 + Math.random() * 15),
      predicted30: Math.min(95, baseRisk * 82 + Math.random() * 15),
      predicted60: Math.min(95, baseRisk * 85 + Math.random() * 10),
      predicted90: Math.min(95, baseRisk * 88 + Math.random() * 10),
      factors: ['Service-related injuries', 'Degenerative changes', 'Overuse'],
      interventions: ['Physical therapy', 'Pain management', 'Activity modification'],
      confidence: 92
    }
  ];
}

export function generateCascadeRisks(veteran: Veteran) {
  const severity = veteran.disabilityRating >= 70 ? 'high' : 'medium';
  
  return {
    primaryCondition: 'Chronic Pain Syndrome',
    cascadeRisks: [
      {
        condition: 'Depression',
        probability: severity === 'high' ? 72 : 45,
        timeframe: '3-6 months',
        severity: severity === 'high' ? 'high' as const : 'medium' as const,
        preventable: true
      },
      {
        condition: 'Substance Use Disorder',
        probability: severity === 'high' ? 38 : 22,
        timeframe: '6-12 months',
        severity: 'medium' as const,
        preventable: true
      },
      {
        condition: 'Social Isolation',
        probability: severity === 'high' ? 65 : 40,
        timeframe: '3-6 months',
        severity: 'medium' as const,
        preventable: true
      },
      {
        condition: 'Functional Decline',
        probability: severity === 'high' ? 55 : 35,
        timeframe: '12-18 months',
        severity: severity === 'high' ? 'high' as const : 'low' as const,
        preventable: true
      }
    ]
  };
}

export function generateHealthProjections() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return {
    currentScore: 65,
    projections: {
      optimistic: months.map((month, i) => ({ 
        month, 
        score: Math.min(95, 65 + i * 5 + Math.random() * 3) 
      })),
      realistic: months.map((month, i) => ({ 
        month, 
        score: Math.max(45, 65 - i * 2 + Math.random() * 4 - 2) 
      })),
      pessimistic: months.map((month, i) => ({ 
        month, 
        score: Math.max(30, 65 - i * 6 + Math.random() * 3 - 1.5) 
      }))
    }
  };
}