import { createClient } from '@/utils/supabase/server'

interface RequirementInput {
  nombre: string;
  descripcion: string;
  tipo: string;
  fecha_inicio: string;
  estatus: string;
  proyecto_id: number;
  effort: string;
}

export async function createRequirement(requirementData: RequirementInput) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('requerimiento')
    .insert([requirementData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating requirement in Supabase:', error);
    throw new Error(`Failed to create requirement: ${error.message}`);
  }
  
  if (!data) {
    throw new Error('No data returned from requirement creation');
  }

  console.log('Requirement created successfully:', data);

  return {
    id: data.id,
    columnId: data.estatus,
    title: data.nombre,
    content: data.descripcion,
    proyecto_id: data.proyecto_id,
    effort: data.effort,
  };
}