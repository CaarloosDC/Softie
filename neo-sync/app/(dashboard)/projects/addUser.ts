import { createClient } from '@/utils/supabase/server'
import { getSupabaseAdminClient } from '@/utils/supabase/adminClient'


interface UserInput {
  email: string;
  password: string;
  name: string;
  role: string;
  expertiseLevel: string;
  phone: string;
}

export async function addUser(userData: UserInput) {
  const supabaseAdmin = getSupabaseAdminClient();
  
  try {
    // Create user without email confirmation using admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('No user data returned from user creation');
    }

    // Insert additional user data into the usuario_servicio table
    // Now including the email field
    const { data, error: insertError } = await supabaseAdmin
      .from('usuario_servicio')
      .insert({
        supabase_usuario: authData.user.id,
        nombre: userData.name,
        rol_sistema: userData.role,
        telefono: userData.phone,
        email: authData.user.email
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
    }

    console.log('User created successfully:', data);

    return {
      id: data.id,
      email: authData.user.email,
      nombre: data.name,
      rol_usuario: data.role,
      telefono: data.phone,
    };
  } catch (error) {
    console.error('Error in addUser:', error);
    throw error;
  }
}
