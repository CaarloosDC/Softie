// app/api/requirements/[id]/update/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('Starting update process for requirement:', params.id);
  
  try {
    const supabase = createClient()
    const body = await request.json();
    
    console.log('Attempting to update requirement with data:', body);

    // First, let's get the current values
    const { data: currentData, error: fetchError } = await supabase
      .from('requerimiento')
      .select('*')
      .eq('id', params.id)
      .single();

    if (fetchError) {
      console.error('Error fetching current data:', fetchError);
      return NextResponse.json({ error: 'Error fetching requirement' }, { status: 500 });
    }

    console.log('Current requirement data:', currentData);

    // Now perform the update
    const { data, error } = await supabase
      .from('requerimiento')
      .update({
        esfuerzo_requerimiento: body.esfuerzo_requerimiento,
        tiempo_requerimiento: body.tiempo_requerimiento,
        costo_requerimiento: body.costo_requerimiento
      })
      .eq('id', params.id)
      .select();

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json(
        { error: `Update failed: ${error.message}` },
        { status: 500 }
      );
    }

    // Verify the update
    const { data: verifyData, error: verifyError } = await supabase
      .from('requerimiento')
      .select('*')
      .eq('id', params.id)
      .single();

    if (verifyError) {
      console.error('Error verifying update:', verifyError);
      return NextResponse.json({ error: 'Error verifying update' }, { status: 500 });
    }

    console.log('Verification data after update:', verifyData);

    return NextResponse.json({
      message: 'Requirement updated successfully',
      before: currentData,
      after: verifyData
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}