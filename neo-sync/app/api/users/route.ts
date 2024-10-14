// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { addUser } from '@/app/(dashboard)/projects/addUser';

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    console.log('Received user data:', userData);

    const newUser = await addUser(userData);
    console.log('Created user:', newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return NextResponse.json({ 
      error: 'Failed to add user', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}