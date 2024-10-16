import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const supabase = createClient();

  try {
    const { newRole } = await request.json();
    
    const { data, error } = await supabase
      .from('usuario_servicio')
      .update({ rol_sistema: newRole })
      .eq('id', params.userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      user: data, 
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