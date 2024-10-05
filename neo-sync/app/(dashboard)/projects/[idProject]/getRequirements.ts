import { createClient } from '@/utils/supabase/server'
import { type Task } from "../../../../components/custom/Overview/Kanban/TaskCard";

export async function getRequirements() {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('requerimiento')
      .select('id, nombre, descripcion, estatus')

    
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


