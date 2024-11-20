import { Users, columns } from "./columnsConfig";
import { DataTable, TableSkeleton } from "../../global/data-table";
import { fetchUsers } from "@/app/(dashboard)/projects/fetchUser";
import { Toaster } from "@/components/ui/toaster";
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from "react";

export default function Config() {
  const [users, setUsers] = useState<Users[]>([]);
  const [tableKey, setTableKey] = useState(0); // Add this to force table rerenders
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [isLoading, setIsLoading] = useState(true);

  //* Function to subscribe to real-time changes on supabase
  useEffect(() => {
    const loadInitialUsers = async () => {
      try {
        setIsLoading(true);
        const initialUsers = await fetchUsers();
        //* Give structure to data to show it in data-table
        const transformed = initialUsers.map((user: any) => ({
          id: user.id,
          name: user.nombre,
          rol: user.rol_sistema,
          email: user.email ? user.email : "",
        }));
        setUsers(transformed);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialUsers();

    //* Create real-time subscription to supabase
    const channel = supabase
      .channel("usuario_servicio_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "usuario_servicio",
        },
        //* Perform different actions depending on the type of change the table on supabase had
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
            console.error("Error handling:", error);
          }
        }
      )
      .subscribe((status) => {});

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <TableSkeleton />;
  }

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
