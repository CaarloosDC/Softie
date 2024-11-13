import { Users, columns } from "./columnsConfig";
import { DataTable } from "../../global/data-table";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchUsers } from "@/app/(dashboard)/projects/fetchUser";
import { Toaster } from "@/components/ui/toaster";

export default function Config() {
  const [users, setUsers] = useState<Users[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      // Transform the data to match the Users type
      const transformedUsers: Users[] = data.map((user: any) => ({
        id: user.id,
        name: user.nombre,
        rol: user.rol_sistema,
        email: user.email,
      }));
      setUsers(transformedUsers);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full">
      <DataTable columns={columns} data={users} rows={10} />
      <Toaster />
    </div>
  );
}

