"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ReceiptText,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Divider from "../custom/divider";
import { GearIcon } from "@radix-ui/react-icons";
import LogoNeoris from "@/components/custom/logo-neoris";

// Definición de tipos para el menú
interface MenuItemProps {
  href: string;
  icon?: React.ComponentType<{ className: string }>;
  label: string;
  badge?: string | number;
  isActive?: boolean;
  onClick?: () => void;
}

interface MenuData {
  main: Array<MenuItemProps>;
  workspace: {
    title: string;
    iconClosed: React.ComponentType<{ className: string }>;
    iconOpened: React.ComponentType<{ className: string }>;
    projects: Array<Omit<MenuItemProps, "icon">>;
  };
  contracts: Array<MenuItemProps>;
  settings: Array<MenuItemProps>;
}

// Datos del menú organizados en un objeto tipado
const menuData: MenuData = {
  main: [
    {
      href: "/",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
  ],
  workspace: {
    title: "Proyectos de CEMEX",
    iconClosed: ChevronRight,
    iconOpened: ChevronDown,
    projects: [
      {
        href: "#",
        label: "App móvil",
        isActive: true,
      },
      {
        href: "#",
        label: "Rebranding web",
      },
    ],
  },
  contracts: [
    {
      href: "#",
      icon: ReceiptText,
      label: "Contratos Marco",
    },
  ],
  settings: [
    {
      href: "#",
      icon: GearIcon,
      label: "Configuración",
    },
  ],
};

// Componente reutilizable para los ítems del menú
function MenuItem({
  href,
  icon: Icon,
  label,
  badge,
  isActive,
  onClick,
}: MenuItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
        isActive
          ? "bg-muted text-primary"
          : "text-muted-foreground hover:text-primary"
      }`}
      onClick={onClick}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
      {badge && (
        <Badge className="ml-auto h-6 w-6 flex items-center justify-center rounded-full">
          {badge}
        </Badge>
      )}
    </Link>
  );
}

export function Sidebar() {
  const [isCemexOpen, setIsCemexOpen] = useState<boolean>(false);

  const toggleCemexMenu = () => {
    setIsCemexOpen(!isCemexOpen);
  };

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        {/* Logo y encabezado */}
        <div className="flex h-14 items-center justify-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 font-semibold"
          >
            <LogoNeoris />
          </Link>
        </div>

        <nav className="flex-1 px-2 text-sm font-medium lg:px-4">
          {/* Menú principal */}
          <h2 className="py-3">MENU</h2>
          {menuData.main.map((item) => (
            <MenuItem
              key={item.label}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}

          <Divider />

          {/* Espacio de trabajo con menú desplegable */}
          <h2 className="py-3">ESPACIO DE TRABAJO</h2>
          <div>
            <div onClick={toggleCemexMenu} className="cursor-pointer">
              <MenuItem
                href="#"
                icon={
                  isCemexOpen
                    ? menuData.workspace.iconOpened
                    : menuData.workspace.iconClosed
                }
                label={menuData.workspace.title}
              />
            </div>
            {isCemexOpen && (
              <div className="ml-6">
                {menuData.workspace.projects.map((project) => (
                  <MenuItem
                    key={project.label}
                    href={project.href}
                    label={project.label}
                    isActive={project.isActive}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Contratos Marco */}
          {menuData.contracts.map((item) => (
            <MenuItem
              key={item.label}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}

          <Divider />

          {/* Ajustes */}
          <h2 className="py-3">AJUSTES</h2>
          {menuData.settings.map((item) => (
            <MenuItem
              key={item.label}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
