// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addUser } from "@/app/(dashboard)/config/addUser";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    console.log("Received user data:", userData);

    const newUser = await addUser(userData);
    console.log("Created user:", newUser);

    return NextResponse.json(
      {
        user: newUser,
        message: "User added successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return NextResponse.json(
      {
        error: "Failed to add user",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("usuario_servicio")
      .select("id, email, nombre, rol_sistema, telefono");

    if (error) throw error;

    return NextResponse.json(
      {
        users: data,
        message: "Users fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch users",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
