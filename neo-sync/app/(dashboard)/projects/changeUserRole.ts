import { createClient } from '@/utils/supabase/server'

interface RoleChangeInput {
  userId: string;
  newRole: string;
}

export async function changeUserRole({ userId, newRole }: RoleChangeInput) {
  const supabase = createClient();
  
  try {
    // First verify the user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('usuario_servicio')
      .select()
      .eq('id', userId)
      .single();

    if (checkError || !existingUser) {
      throw new Error('User not found');
    }

    // Then update the role
    const { data, error } = await supabase
      .from('usuario_servicio')
      .update({ rol_sistema: newRole })
      .eq('id', userId)
      .select();

    if (error) {
      console.log('Supabase Error:', {
        action: 'changeUserRole',
        userId,
        newRole,
        error
      });
      throw error;
    }

    console.log('Role Updated Successfully:', {
      action: 'changeUserRole',
      userId,
      newRole,
      updatedUser: data[0]
    });

    return data[0]; // Return the first (and only) updated record
  } catch (error) {
    console.error('Error in changeUserRole:', error);
    throw error;
  }
}