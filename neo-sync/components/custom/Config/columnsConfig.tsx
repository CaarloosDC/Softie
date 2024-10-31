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

//* Defines the type
export type Users = {
  id: string;
  name: string;
  rol: "administrador" | "lider" | "usuario";
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
      const amount: string = row.getValue("rol");
      const formattedAmount =
        amount.charAt(0).toUpperCase() + amount.slice(1).toLowerCase();

      return <div className="text-right font-medium">{formattedAmount}</div>;
    },
  },
  {
    //* We add the column actions without column title (because there is no header). Here shows a button that shows a dropdown menu.
    id: "Acciones",
    cell: ({ row }) => {
      const user = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Editar rol
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
              Borrar Usuario
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
