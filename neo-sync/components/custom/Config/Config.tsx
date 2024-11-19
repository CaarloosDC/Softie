"use client";

import { Users, columns } from "./columnsConfig";
import { DataTable } from "../../global/data-table";
import { fetchUsers } from "@/app/(dashboard)/projects/fetchUser";
import { Toaster } from "@/components/ui/toaster";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function Config() {
  const [users, setUsers] = useState<Users[]>([]);
  const [tableKey, setTableKey] = useState(0); // Add this to force table rerenders
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadInitialUsers = async () => {
      try {
        const initialUsers = await fetchUsers();
        const transformed = initialUsers.map((user: any) => ({
          id: user.id,
          name: user.nombre,
          rol: user.rol_sistema,
          email: user.email ? user.email : "",
        }));
        setUsers(transformed);
      } catch (error) {
        console.log(error);
      }
    };

    loadInitialUsers();

    const channel = supabase
      .channel("usuario_servicio_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "usuario_servicio",
        },
        async (payload) => {
          try {
            switch (payload.eventType) {
              case "INSERT":
                setUsers((currentUsers) => [
                  ...currentUsers,
                  {
                    id: payload.new.id,
                    name: payload.new.nombre,
                    rol: payload.new.rol_sistema,
                    email: payload.new.email ? payload.new.email : "",
                  },
                ]);
                setTableKey((prev) => prev + 1); // Force table rerender
                break;

              case "UPDATE":
                setUsers((currentUsers) =>
                  currentUsers.map((user) =>
                    user.id === payload.new.id
                      ? {
                          id: payload.new.id,
                          name: payload.new.nombre,
                          rol: payload.new.rol_sistema,
                          email: payload.new.email ? payload.new.email : "",
                        }
                      : user
                  )
                );
                setTableKey((prev) => prev + 1); // Force table rerender
                break;

              case "DELETE":
                setUsers((currentUsers) =>
                  currentUsers.filter((user) => user.id !== payload.old.id)
                );
                setTableKey((prev) => prev + 1); // Force table rerender
                break;

              default:
            }
          } catch (error) {
            console.error("Error handling real-time update:", error);
          }
        }
      )
      .subscribe((status) => {});

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="w-full">
      <DataTable
        key={tableKey} // Add this key to force table rerenders
        columns={columns}
        data={users}
        rows={10}
      />
      <Toaster />
    </div>
  );
}
