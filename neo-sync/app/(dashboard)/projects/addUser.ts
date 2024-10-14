import { createClient } from '@/utils/supabase/server'
import { getSupabaseAdminClient } from '@/utils/supabase/adminClient'

interface UserInput {
  email: string;
  password: string;
  // Add any additional fields you want to store for users
}

export async function addUser(userData: UserInput) {
  const supabase = createClient();
  const adminClient = getSupabaseAdminClient();
  
  try {
    // Create user without email confirmation using admin client
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true // This automatically confirms the email
    });
    
    if (authError) {
      console.error('Error creating user in Supabase Auth:', authError);
      throw new Error(`Failed to create user: ${authError.message}`);
    }
    
    if (!authData.user) {
      throw new Error('No user data returned from user creation');
    }

    // Add user data to your custom 'usuarios_servicios' table using regular client
    const { data, error } = await supabase
      .from('usuarios_servicios')
      .insert([
        {
          supabase_usuario: authData.user.id,
          // We'll discuss whether to include email here
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding user data to Supabase:', error);
      throw new Error(`Failed to add user data: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No data returned from user data insertion');
    }

    console.log('User created successfully:', data);

    return {
      id: data.id,
      email: authData.user.email,
      // Return any additional fields you want
    };
  } catch (error) {
    console.error('Detailed error:', error);
    throw error;
  }
}