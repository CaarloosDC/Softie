"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  ChevronRight,
  ChevronDown,
  CircleChevronLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Divider from "@/components/custom/divider";
import { GearIcon } from "@radix-ui/react-icons";
import LogoNeoris from "@/components/custom/logo-neoris";

// Tipos y datos del menú
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

// Datos del menú
const menuData: MenuData = {
  main: [
    {
      href: "/projects",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
  ],
  // workspace: {
  //   title: "CEMEX",
  //   iconClosed: ChevronRight,
  //   iconOpened: ChevronDown,
  //   projects: [
  //     {
  //       href: "#",
  //       label: "App móvil",
  //     },
  //     {
  //       href: "#",
  //       label: "Rebranding web",
  //     },
  //   ],
  // },
  contracts: [
    {
      href: "/contracts",
      icon: ReceiptText,
      label: "Contratos Marco",
    },
  ],
  settings: [
    {
      href: "/config",
      icon: GearIcon,
      label: "Configuración",
    },
  ],
};

// Componente MenuItem
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
      className={`flex items-center gap-3 rounded-lg px-4 py-2 transition-all ${
        isActive
          ? "bg-gray-900 text-white dark:bg-gray-700 dark:text-white"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600"
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

// Componente SidebarContent
export function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const [isCemexOpen, setIsCemexOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleCemexMenu = () => {
    setIsCemexOpen(!isCemexOpen);
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      {/* Logo y encabezado */}
      <div className="flex h-14 items-center justify-between px-4 lg:h-[60px] lg:px-6">
        <Link
          href="/"
          className="flex items-center justify-start mr-12 cursor-pointer"
          onClick={onItemClick}
        >
          <LogoNeoris />
        </Link>
        <CircleChevronLeft className="ml-4 cursor-pointer text-gray-600 dark:text-gray-300" />
      </div>

      <nav className="flex-1 pt-5 text-sm font-medium lg:px-4 dark:text-gray-400">
        {/* Menú principal */}
        <h2 className="py-3 dark:text-gray-300">MENU</h2>
        {menuData.main.map((item) => (
          <MenuItem
            key={item.label}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.href)}
            onClick={onItemClick}
          />
        ))}

        <Divider />

        {/* Espacio de trabajo con menú desplegable */}
        <h2 className="py-3 dark:text-gray-300">ESPACIO DE TRABAJO</h2>
        {/* <div>
          <div
            onClick={toggleCemexMenu}
            className="cursor-pointer flex items-center"
          >
            <MenuItem
              href="#"
              icon={
                isCemexOpen
                  ? menuData.workspace.iconOpened
                  : menuData.workspace.iconClosed
              }
              label={menuData.workspace.title}
              onClick={onItemClick}
            />
          </div>
          {isCemexOpen && (
            <div className="ml-6">
              {menuData.workspace.projects.map((project) => (
                <MenuItem
                  key={project.label}
                  href={project.href}
                  label={` • ${project.label}`}
                  isActive={isActive(project.href)}
                  onClick={onItemClick}
                />
              ))}
            </div>
          )}
        </div> */}

        {/* Contratos Marco */}
        {menuData.contracts.map((item) => (
          <MenuItem
            key={item.label}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.href)}
            onClick={onItemClick}
          />
        ))}

        <Divider />

        {/* Ajustes */}
        <h2 className="py-3 dark:text-gray-300">AJUSTES</h2>
        {menuData.settings.map((item) => (
          <MenuItem
            key={item.label}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.href)}
            onClick={onItemClick}
          />
        ))}

        <Divider />
      </nav>
    </div>
  );
}
