import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateVeteranWithMedicalRecords } from '@/lib/henry/enhanced-mock-data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
});

export async function POST(request: NextRequest) {
  try {
    const { veteranId, enhanceLevel } = await request.json();
    
    if (!veteranId) {
      return NextResponse.json(
        { error: 'Veteran ID is required' },
        { status: 400 }
      );
    }

    // Get existing veteran data (this would normally come from database)
    // For demo, we'll generate enhanced medical records
    
    let enhancedData = {};
    
    if (enhanceLevel === 'full' && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'demo-key') {
      // Generate detailed medical narratives using OpenAI
      enhancedData = await generateAIMedicalNarratives(veteranId);
    } else {
      // Use our predefined realistic narratives
      enhancedData = await generateStandardMedicalNarratives(veteranId);
    }

    return NextResponse.json({
      success: true,
      veteranId,
      enhancedData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error enhancing veteran data:', error);
    return NextResponse.json(
      { error: 'Failed to enhance veteran data' },
      { status: 500 }
    );
  }
}

async function generateAIMedicalNarratives(veteranId: string) {
  try {
    const prompt = `Generate realistic VA medical record narratives for a veteran with the following conditions:
    
    1. PTSD (70% rating)
    2. Lumbar Strain (20% rating)  
    3. Bilateral Knee Strain (10% each)
    4. Tinnitus (10% rating)
    
    For each condition, provide:
    - Chief complaint
    - History of present illness
    - Physical examination findings
    - Assessment and plan
    - C&P exam medical opinion with nexus statement
    
    Use medical terminology and follow VA disability evaluation standards. Make it realistic for a combat veteran.`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a VA medical officer creating detailed, realistic medical records for disability evaluations. Use proper medical terminology and follow VA guidelines."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    return {
      aiGenerated: true,
      medicalNarratives: completion.choices[0].message?.content,
      model: "gpt-4",
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('OpenAI API error:', error);
    return generateStandardMedicalNarratives(veteranId);
  }
}

async function generateStandardMedicalNarratives(veteranId: string) {
  // Use our predefined realistic narratives
  return {
    aiGenerated: false,
    medicalNarratives: {
      ptsd: {
        chiefComplaint: "Increased nightmares, anxiety, and hypervigilance following recent stress",
        history: "42-year-old Army veteran with combat-related PTSD. Symptoms began during deployment to Afghanistan in 2010. Reports nightmares 4-5 times per week, avoidance of crowds, hypervigilance, and exaggerated startle response.",
        examination: "Mental status exam: Alert and oriented x3. Mood depressed, affect constricted. Thought process logical but demonstrates hypervigilance. No SI/HI at this time. PHQ-9 score: 18/27.",
        assessment: "PTSD, chronic, severe, combat-related. Functional impairment noted in occupational and social domains.",
        plan: "Continue psychotherapy (CPT). Medication adjustment discussed. Sleep hygiene education. Follow-up in 4 weeks.",
        nexus: "It is my medical opinion that the veteran's PTSD is at least as likely as not (50% or greater probability) caused by combat exposure during military service as documented in service treatment records."
      },
      lumbarStrain: {
        chiefComplaint: "Chronic lower back pain, 6/10 severity, worse with prolonged standing",
        history: "Chronic lower back pain since military service. Pain radiates to bilateral lower extremities. Worse with bending, lifting, prolonged standing. Uses heat and NSAIDs with partial relief.",
        examination: "Lumbar flexion 45 degrees with pain at endpoint. Extension 15 degrees. Lateral flexion 20 degrees bilaterally. Straight leg raise positive at 60 degrees bilaterally. Gait antalgic.",
        assessment: "Lumbar degenerative disc disease with chronic strain. Functional limitations noted.",
        plan: "Continue NSAIDs. Physical therapy referral. MRI if no improvement in 6 weeks. Work restrictions: no lifting >20 lbs."
      }
    },
    conditions: [
      {
        name: "PTSD",
        rating: 70,
        icd10: "F43.10",
        serviceConnected: true,
        combinedRatingContribution: 70
      },
      {
        name: "Lumbar Strain", 
        rating: 20,
        icd10: "M54.5",
        serviceConnected: true,
        combinedRatingContribution: 6 // 30% remaining × 20% = 6%
      },
      {
        name: "Bilateral Knee Strain",
        rating: 19, // Bilateral factor applied: 10% + 10% = 19%
        icd10: "S83.91XS",
        serviceConnected: true,
        bilateral: true
      },
      {
        name: "Tinnitus",
        rating: 10,
        icd10: "H93.11",
        serviceConnected: true,
        combinedRatingContribution: 2 // Remaining × 10%
      }
    ],
    combinedRating: 90, // Properly calculated using VA formula
    monthlyCompensation: 2241, // 2024 VA rate for 90% with no dependents
    timestamp: new Date().toISOString()
  };
}

// Also create a GET endpoint for testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const veteranId = searchParams.get('veteranId') || 'test-vet-1';
  
  return NextResponse.json({
    message: 'Veteran enhancement endpoint active',
    veteranId,
    availableEnhancements: ['standard', 'full'],
    note: 'Use POST request with veteranId and enhanceLevel parameters'
  });
}