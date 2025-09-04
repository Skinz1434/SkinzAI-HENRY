import { NextRequest, NextResponse } from 'next/server';
import { debugVeteranGeneration, forceRegenerateVeteranData } from '@/lib/henry/debug-veteran-data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action') || 'debug';
  
  try {
    if (action === 'debug') {
      const debugInfo = debugVeteranGeneration();
      
      return NextResponse.json({
        success: true,
        action: 'debug',
        timestamp: new Date().toISOString(),
        summary: {
          enhanced: `${debugInfo.enhanced.length} veterans generated`,
          main: `${debugInfo.main.length} veterans generated`, 
          inconsistencies: `${debugInfo.inconsistencies.length} inconsistent veterans found`
        },
        details: debugInfo,
        message: debugInfo.inconsistencies.length === 0 
          ? '✅ All veterans have consistent data!'
          : `❌ Found ${debugInfo.inconsistencies.length} veterans with ratings but no conditions`
      });
      
    } else if (action === 'regenerate') {
      const freshData = forceRegenerateVeteranData();
      
      return NextResponse.json({
        success: true,
        action: 'regenerate',
        timestamp: new Date().toISOString(),
        veteransGenerated: freshData.length,
        sampleVeteran: {
          name: freshData[0].name,
          rating: freshData[0].disabilityRating,
          conditions: (freshData[0] as any).conditions?.length || 0,
          claims: freshData[0].claims?.length || 0
        }
      });
      
    } else {
      return NextResponse.json({
        error: 'Invalid action',
        validActions: ['debug', 'regenerate']
      }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      error: 'Failed to debug veteran data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { count = 10, enhanced = true } = await request.json();
    
    const { generateEnhancedMockVeterans } = await import('@/lib/henry/enhanced-mock-data');
    const { generateMockVeterans } = await import('@/lib/henry/mock-data');
    
    const veterans = enhanced 
      ? generateEnhancedMockVeterans(count)
      : generateMockVeterans(count);
    
    // Analyze the generated data
    const invalidRatings = veterans.filter(v => v.disabilityRating % 10 !== 0);
    const analysis = {
      total: veterans.length,
      withRatings: veterans.filter(v => v.disabilityRating > 0).length,
      withConditions: veterans.filter(v => (v as any).conditions?.length > 0).length,
      withClaims: veterans.filter(v => v.claims?.length > 0).length,
      inconsistent: veterans.filter(v => 
        v.disabilityRating > 0 && (!(v as any).conditions?.length || !v.claims?.length)
      ).length,
      invalidRatings: invalidRatings.length,
      invalidRatingsDetails: invalidRatings.map(v => `${v.name}: ${v.disabilityRating}%`)
    };
    
    return NextResponse.json({
      success: true,
      generator: enhanced ? 'enhanced' : 'legacy',
      analysis,
      sampleVeterans: veterans.slice(0, 3).map(v => ({
        name: v.name,
        rating: v.disabilityRating,
        conditions: (v as any).conditions?.length || 0,
        claims: v.claims?.length || 0,
        conditionDetails: (v as any).conditions?.map((c: any) => `${c.name}: ${c.rating}%`) || []
      }))
    });
    
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json({
      error: 'Failed to generate veteran data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}