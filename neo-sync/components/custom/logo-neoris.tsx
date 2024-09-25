"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoNeorisProps {
  variant?: "dark" | "light";
}

export default function LogoNeoris({ variant }: LogoNeorisProps) {
  const { resolvedTheme } = useTheme(); // resolvedTheme asegura que el tema se haya cargado
  const [mounted, setMounted] = useState(false); // Estado para verificar si el componente está montado

  // Efecto para actualizar el estado de "mounted" una vez que el componente esté montado
  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar renderizar hasta que el componente esté montado
  if (!mounted) {
    return null;
  }

  // Si no se proporciona la prop `variant`, usamos el valor del tema actual
  const logoVariant = variant || (resolvedTheme === "dark" ? "light" : "dark");

  const logoSrc =
    logoVariant === "light"
      ? "/NEORIS logo light.png"
      : "/NEORIS logo dark.png";

  return (
    <div className="relative max-w-[200px] h-auto flex items-center">
      <Image
        src={logoSrc}
        alt={`Logo Neoris ${logoVariant}`}
        width={1920}
        height={1080}
        className="h-auto max-h-[60px] object-contain"
        priority
      />
    </div>
  );
}
