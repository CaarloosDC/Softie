// app/(dashboard)/projects/fetchUsers.ts
import { createClient } from "@/utils/supabase/client";

export async function fetchUsers() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("usuario_servicio")
      .select("id, email, nombre, rol_sistema");

    if (error) {
      console.error("Fetch error:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in fetchUsers:", error);
    throw error;
  }
}
