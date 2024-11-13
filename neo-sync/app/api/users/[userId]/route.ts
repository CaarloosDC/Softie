import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const supabase = createClient();

  try {
    const { newRole } = await request.json();
    
    // First verify the user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('usuario_servicio')
      .select()
      .eq('id', params.userId)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ 
          error: 'User not found',
          message: 'The specified user does not exist'
        }, { status: 404 });
      }
      throw checkError;
    }

    // Then update the role
    const { data, error } = await supabase
      .from('usuario_servicio')
      .update({ rol_sistema: newRole })
      .eq('id', params.userId)
      .select();

    if (error) {
      console.log('Supabase API Error:', {
        action: 'PATCH /api/users/[userId]',
        userId: params.userId,
        newRole,
        error
      });
      throw error;
    }

    console.log('API Role Update Success:', {
      action: 'PATCH /api/users/[userId]',
      userId: params.userId,
      newRole,
      updatedUser: data[0]
    });

    return NextResponse.json({ 
      user: data[0], 
      message: 'User role updated successfully' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ 
      error: 'Failed to update user role', 
      message: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}