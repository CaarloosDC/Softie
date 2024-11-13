import { Users, columns } from "./columnsConfig";
import { DataTable } from "../../global/data-table";
import { fetchUsers } from "@/app/(dashboard)/projects/fetchUser";
import { Toaster } from "@/components/ui/toaster";

// Make this an async component
export default async function Config() {
  // Fetch users directly in the server component
  const users = await fetchUsers();
  
  // Transform the data to match the Users type
  const transformedUsers: Users[] = users.map((user: any) => ({
    id: user.id,
    name: user.nombre,
    rol: user.rol_sistema,
    email: user.email,
  }));

  return (
    <div className="w-full">
      <DataTable columns={columns} data={transformedUsers} rows={10} />
      <Toaster />
    </div>
  );
}
