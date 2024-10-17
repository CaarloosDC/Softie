// components/global/navbar.tsx
"use client";

import React from "react";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Bell, Menu, Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Asegúrate de importar SheetContent
import { PersonIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "../custom/mode-toggle";
import { NotificationButton } from "../custom/notification-button";
import { SidebarContent } from "./sidebar-content";

interface NavbarProps {
  userName: string;
  userEmail: string;
}

export function Navbar({ userName, userEmail }: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error);
  } else {
    router.push('/login'); // Redirect to login page after successful logout
  }
};
  return (
    <header className="flex h-14 py-8 items-center gap-4 bg-muted/40 px-4 lg:h-[60px] lg:px-6 bg-white dark:bg-gray-800">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SidebarContent onItemClick={() => { /* Opcional: Cerrar el Sheet al hacer clic en un ítem */ }} />
        </SheetContent>
      </Sheet>

      <div className="flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-gray-300" />
            <Input
              type="search"
              placeholder="Buscar cualquier cosa..."
              className="w-full appearance-none bg-background pl-8 shadow-none border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>

      {/* Theme toggle de la página */}
      <ModeToggle />

      {/* Botón de notificaciones */}
      <NotificationButton />

      <div className="flex items-center gap-2">
        {/* Avatar y detalles del usuario */}
        <div className="flex items-center gap-3 hidden md:flex">
          <div className="bg-gray-300 dark:bg-gray-700 rounded-full w-8 h-8 flex justify-center items-center">
            <PersonIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <p className="text-sm font-medium dark:text-white">{userName}</p>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
            {userEmail}
            </p>
          </div>
        </div>

        {/* Menú desplegable */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-2">
              <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="dark:bg-gray-800 dark:border-gray-700"
          >
            <DropdownMenuLabel className="dark:text-gray-300">
              Mi cuenta
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:bg-gray-700" />
            <DropdownMenuItem className="dark:text-gray-300">
              Ajustes
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-gray-700" />
            <DropdownMenuItem className="dark:text-gray-300"
              onSelect={handleLogout}
            >
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}