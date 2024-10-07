import { createClient } from '@/utils/supabase/server'
import { type Task } from "../../../components/custom/Overview/Kanban/TaskCard";

export async function getProjects() {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('proyecto')
      .select('id, nombre, descripcion, estatus');
    
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    
    return data.map(project => ({
      id: project.id,
      columnId: project.estatus,
      title: project.nombre,
      content: project.descripcion
    }));
  }