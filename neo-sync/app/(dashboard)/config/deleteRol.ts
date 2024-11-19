import { createClient } from "@/utils/supabase/client";

export async function deleteRol(id: number) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("usuario_servicio")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in deleteUser:", error);
    throw error;
  }
}
