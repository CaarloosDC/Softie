// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import { createProject } from '@/app/(dashboard)/projects/createProject';

export async function POST(request: Request) {
  try {
    const projectData = await request.json();
    console.log('Received project data:', projectData); // Log received data

    const newProject = await createProject(projectData);
    console.log('Created project:', newProject); // Log created project

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    // Send more detailed error information
    return NextResponse.json({ 
      error: 'Failed to create project', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}