import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI (we'll use this for now since it's more accessible than Anthropic for demos)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const claimNumber = formData.get('claim_number') as string;
    const files = formData.getAll('files') as File[];
    const priority = formData.get('priority') as string || 'normal';

    // Simulate document processing
    const documents = await Promise.all(
      files.map(async (file) => {
        const text = await extractTextFromFile(file);
        const classification = await classifyDocument(text);
        
        return {
          id: generateId(),
          filename: file.name,
          type: classification.type,
          text: text,
          pages: Math.ceil(text.length / 3000), // Estimate pages
          confidence: classification.confidence,
        };
      })
    );

    // Analyze claim with AI
    const analysis = await analyzeClaimWithAI(claimNumber, documents);

    return NextResponse.json({
      success: true,
      claimId: generateId(),
      claimNumber,
      status: 'processing',
      documents: documents.length,
      analysis,
    });
  } catch (error) {
    console.error('Error processing claim:', error);
    return NextResponse.json(
      { error: 'Failed to process claim' },
      { status: 500 }
    );
  }
}

async function extractTextFromFile(file: File): Promise<string> {
  // For demo, just read text files directly
  // In production, would use proper PDF/DOCX parsing
  try {
    const text = await file.text();
    return text;
  } catch {
    // Return sample text for demo
    return generateSampleText(file.name);
  }
}

async function classifyDocument(text: string): Promise<{ type: string; confidence: number }> {
  const textLower = text.toLowerCase();
  
  if (textLower.includes('dd-214') || textLower.includes('dd214')) {
    return { type: 'DD-214', confidence: 0.95 };
  }
  if (textLower.includes('medical') || textLower.includes('diagnosis')) {
    return { type: 'Medical Record', confidence: 0.85 };
  }
  if (textLower.includes('nexus')) {
    return { type: 'Nexus Letter', confidence: 0.90 };
  }
  if (textLower.includes('buddy') || textLower.includes('statement')) {
    return { type: 'Buddy Statement', confidence: 0.80 };
  }
  if (textLower.includes('dbq')) {
    return { type: 'DBQ', confidence: 0.88 };
  }
  
  return { type: 'Other', confidence: 0.60 };
}

async function analyzeClaimWithAI(claimNumber: string, documents: any[]) {
  try {
    // Use OpenAI to analyze the claim
    const documentSummary = documents.map(d => 
      `${d.type}: ${d.text.substring(0, 500)}...`
    ).join('\n\n');

    const prompt = `Analyze this VA disability claim and provide:
1. Identified conditions
2. Evidence strength (0-100%)
3. Missing evidence
4. Recommendations

Claim ${claimNumber}
Documents:
${documentSummary}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a VA claims analyst. Analyze evidence and provide recommendations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content || '';
    
    // Parse AI response into structured format
    return parseAIResponse(response);
  } catch (error) {
    console.error('AI analysis error:', error);
    // Return mock analysis for demo
    return generateMockAnalysis();
  }
}

function parseAIResponse(response: string) {
  // For demo, return structured mock data
  // In production, would parse actual AI response
  return generateMockAnalysis();
}

function generateMockAnalysis() {
  return {
    conditions: [
      {
        name: 'PTSD',
        icd10Codes: ['F43.10'],
        evidenceCount: 12,
        strength: 0.85,
        hasNexus: true,
        hasInServiceEvent: true,
      },
      {
        name: 'Tinnitus',
        icd10Codes: ['H93.11'],
        evidenceCount: 8,
        strength: 0.72,
        hasNexus: false,
        hasInServiceEvent: true,
      },
      {
        name: 'Lower Back Pain',
        icd10Codes: ['M54.5'],
        evidenceCount: 10,
        strength: 0.68,
        hasNexus: true,
        hasInServiceEvent: true,
      },
    ],
    evidenceStrength: 0.75,
    missingEvidence: [
      'Nexus letter for tinnitus',
      'Continuity of care records 2011-2020',
      'Current treatment records for back condition',
    ],
    recommendations: [
      'Obtain nexus letter from audiologist for tinnitus claim',
      'Request VA treatment records from missing period',
      'Schedule C&P exam for back condition severity rating',
      'Consider filing for secondary conditions to PTSD (sleep apnea, depression)',
    ],
    dbqsNeeded: [
      'PTSD DBQ',
      'Hearing Loss and Tinnitus DBQ',
      'Back Conditions DBQ',
    ],
    presumptiveConditions: [
      'PTSD - Combat presumption may apply',
    ],
    confidenceScore: 0.82,
  };
}

function generateSampleText(filename: string): string {
  if (filename.toLowerCase().includes('dd214')) {
    return `DD FORM 214
CERTIFICATE OF RELEASE OR DISCHARGE FROM ACTIVE DUTY
Name: JOHN DOE
Service: US ARMY
Rank: SGT/E-5
Type of Separation: HONORABLE
Dates of Service: 2008-01-15 to 2012-01-14
Decorations: Army Commendation Medal, Army Achievement Medal, Iraq Campaign Medal
Primary Specialty: 11B Infantry`;
  }
  
  if (filename.toLowerCase().includes('medical')) {
    return `MEDICAL RECORD
Patient: John Doe
Date: 2023-10-15
Chief Complaint: Chronic lower back pain
History: Patient reports persistent lower back pain since military service. 
Pain began after lifting incident during deployment in 2010.
Diagnosis: Lumbar radiculopathy, Degenerative disc disease L4-L5
Plan: Continue physical therapy, consider MRI`;
  }
  
  return `Document content for ${filename}`;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}