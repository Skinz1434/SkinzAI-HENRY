import { NextRequest, NextResponse } from 'next/server';
import { mockCODCases, getCaseById, runEvidenceGapScan, generateBiasAnalysis } from '@/lib/codda/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get('id');
    
    if (caseId) {
      const caseData = getCaseById(caseId);
      if (!caseData) {
        return NextResponse.json(
          { success: false, error: 'Case not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: caseData,
        timestamp: new Date().toISOString()
      });
    }
    
    // Return all cases
    return NextResponse.json({
      success: true,
      data: mockCODCases,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching CODDA cases:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, caseId, data } = body;
    
    switch (action) {
      case 'evidenceGapScan':
        const gaps = runEvidenceGapScan(caseId);
        return NextResponse.json({
          success: true,
          data: {
            detectedGaps: gaps,
            recommendations: [
              'Request command statement from unit records',
              'Obtain complete service treatment records',
              'Review personnel file for additional documentation'
            ],
            completeness: Math.max(0, 100 - (gaps.length * 25))
          },
          timestamp: new Date().toISOString()
        });
        
      case 'biasAnalysis':
        const analysis = generateBiasAnalysis(data.content || '');
        return NextResponse.json({
          success: true,
          data: analysis,
          timestamp: new Date().toISOString()
        });
        
      case 'saveCase':
        // Mock save operation
        const caseData = data.case;
        const existingCaseIndex = mockCODCases.findIndex(c => c.id === caseData.id);
        
        if (existingCaseIndex >= 0) {
          mockCODCases[existingCaseIndex] = {
            ...caseData,
            updatedAt: new Date().toISOString()
          };
        } else {
          mockCODCases.push({
            ...caseData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
        
        return NextResponse.json({
          success: true,
          data: caseData,
          timestamp: new Date().toISOString()
        });
        
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Error processing CODDA request:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
