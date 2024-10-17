import { createClient } from '@/utils/supabase/server'

interface RoleChangeInput {
  userId: string;
  newRole: string;
}

export async function changeUserRole({ userId, newRole }: RoleChangeInput) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('usuario_servicio')
      .update({ rol_sistema: newRole })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in changeUserRole:', error);
    throw error;
  }
}