"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ArrowUpDown } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, useToast } from "@/hooks/use-toast";
import { deleteRol } from "@/app/(dashboard)/config/deleteRol";

//* Defines the type
export type Users = {
  id: string;
  name: string;
  rol: string;
  email: string;
};

//* Here we define the column of the data. Also, each function formatter that want to apply directly to all the column, goes here
export const columns: ColumnDef<Users>[] = [
  {
    //* Select column which allows to select a row
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    //* Here add a button in the header of the email to sort the emails shown
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          size={"sm"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    //* With amount set the text to the right and add format of USD currency
    accessorKey: "rol",
    header: () => <div className="text-right">Rol</div>,
    cell: ({ row }) => {
      const user = row.original;

      const handleRoleChange = async (newRole: string) => {
        try {
          const response = await fetch(`/api/users/${user.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ newRole }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          // Update will happen through table refresh
          toast({
            title: "Success",
            description: "User role updated successfully",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to update user role",
            variant: "destructive",
          });
        }
      };

      return (
        <div className="text-right">
          <Select defaultValue={user.rol} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usuario">Usuario</SelectItem>
              <SelectItem value="administrador">Administrador</SelectItem>
              <SelectItem value="gerente">Gerente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    },
  },
  {
    //* We add the column actions without column title (because there is no header). Here shows a button that shows a dropdown menu.
    id: "Acciones",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
              onClick={() => deleteRol(parseInt(row.original.id))} // Call function to delete the rol selected
            >
              Borrar Usuario
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
