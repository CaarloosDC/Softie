// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import { createRequirement } from '@/app/(dashboard)/projects/[idProject]/createRequirement';

export async function POST(request: Request) {
  try {
    const requirementData = await request.json();
    console.log('Received requirement data:', requirementData); // Log received data

    const newRequirement = await createRequirement(requirementData);
    console.log('Created requirement:', newRequirement); // Log created project

    return NextResponse.json(newRequirement, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/requirements:', error);
    // Send more detailed error information
    return NextResponse.json({ 
      error: 'Failed to create requirement', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}