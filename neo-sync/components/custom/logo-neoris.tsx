import Image from "next/image";

interface LogoNeorisProps {
  variant?: "dark" | "light"; // Define la prop que controlará la variante del logo
}

export default function LogoNeoris({ variant = "dark" }: LogoNeorisProps) {
  const logoSrc =
    variant === "light" ? "/NEORIS logo light.png" : "/NEORIS logo dark.png";

  return (
    <div className="relative w-full h-full max-h-[60px] flex items-center justify-center">
      <Image
        src={logoSrc}
        alt={`Logo Neoris ${variant}`}
        width={1920} // Definir el ancho de la imagen
        height={1080} // Definir la altura de la imagen
        className="h-auto max-h-full object-contain"
        priority
      />
    </div>
  );
}