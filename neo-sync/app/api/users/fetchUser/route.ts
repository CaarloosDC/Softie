import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('usuario_servicio')
      .select('id, email, nombre, rol_sistema, telefono');

    if (error) throw error;

    return NextResponse.json({ 
      users: data, 
      message: 'Users fetched successfully' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch users', 
      message: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}