import { createClient } from '@/utils/supabase/server'

interface ProjectInput {
  nombre: string;
  descripcion: string;
  transcripcion?: string;
  giro_empresa: string;
  fecha_inicio: string;
  estatus: string;
}

export async function createProject(projectData: ProjectInput) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('proyecto')
    .insert([projectData])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating project in Supabase:', error);
    throw new Error(`Failed to create project: ${error.message}`);
  }
  
  if (!data) {
    throw new Error('No data returned from project creation');
  }

  console.log('Project created successfully:', data);

  return {
    id: data.id,
    columnId: data.estatus,
    title: data.nombre,
    content: data.descripcion,
  };
}