import { createClient } from '@/utils/supabase/server'
import { type Task } from "@/components/custom/Overview/Kanban/TaskCard";

/**
 * Fetches requirements for a specific project from the database
 * 
 * @param projectId - The unique identifier of the project
 * @returns {Promise<Task[]>} An array of requirements formatted as Task objects
 *                           Returns empty array if there's an error
 * 
 * @example
 * const requirements = await getRequirements('123');
 * // returns [{ id: '1', columnId: 'active', title: 'Requirement 1', content: 'Description...' }, ...]
 */
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