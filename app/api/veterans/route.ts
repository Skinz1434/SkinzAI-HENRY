import { NextResponse } from 'next/server';
import { generateMockVeterans } from '@/lib/henry/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const search = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || 'all';

  // Generate mock data (in production, this would query a database)
  const allVeterans = await generateMockVeterans(500);
  
  // Apply filters
  let filteredVeterans = allVeterans;
  
  if (search) {
    filteredVeterans = filteredVeterans.filter(v => 
      v.firstName.toLowerCase().includes(search.toLowerCase()) ||
      v.lastName.toLowerCase().includes(search.toLowerCase()) ||
      v.ssn.includes(search)
    );
  }
  
  if (filter !== 'all') {
    filteredVeterans = filteredVeterans.filter(v => v.vetProfileSyncStatus.status === filter);
  }
  
  // Paginate
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedVeterans = filteredVeterans.slice(start, end);
  
  return NextResponse.json({
    data: paginatedVeterans,
    total: filteredVeterans.length,
    page,
    totalPages: Math.ceil(filteredVeterans.length / limit)
  });
}