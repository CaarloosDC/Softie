import { createClient } from '@/utils/supabase/server'


export async function getRequirements(projectId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('requerimiento')
    .select('id, nombre, descripcion, estatus')
    .eq('proyecto_id', projectId);
  
  if (error) {
    console.error('Error fetching requirements:', error);
    return [];
  }
  
  return data.map(requerimiento => ({
    id: requerimiento.id,
    columnId: requerimiento.estatus,
    title: requerimiento.nombre,
    content: requerimiento.descripcion
  }));
}