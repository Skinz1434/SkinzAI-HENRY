import { NextResponse } from 'next/server';
import { generateMockVeterans } from '@/lib/henry/mock-data';
import { generateVeteranDetails } from '@/lib/henry/veteran-details';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // In production, this would query a database
  const resolvedParams = await params;
  const veterans = await generateMockVeterans(500);
  const veteran = veterans.find(v => v.id === resolvedParams.id);
  
  if (!veteran) {
    return NextResponse.json(
      { error: 'Veteran not found' },
      { status: 404 }
    );
  }
  
  // Generate detailed profile
  const detailedVeteran = generateVeteranDetails(veteran);
  
  return NextResponse.json(detailedVeteran);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const body = await request.json();

  // In production, this would update the database
  return NextResponse.json({
    id: resolvedParams.id,
    ...body,
    updatedAt: new Date().toISOString()
  });
}