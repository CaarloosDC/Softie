import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LogoNeorisDark from "@/components/custom/logo-neoris-dark";
import LoginImage from "@/components/custom/login-image";

export default function PasswordRecoveryPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <LogoNeorisDark />
            <h1 className="text-2xl font-bold">Recuperación de cuenta</h1>
            <p className="text-balance text-muted-foreground">
              Ingresa una nueva contraseña para la recuperación de tu cuenta
            </p>
          </div>
          <div className="grid gap-4">

            {/* Contraseña */}
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" required />
            </div>

            {/* Confirmar contraseña */}
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirma tu contraseña</Label>
              <Input id="confirm-password" type="password" required />
            </div>

            {/* Botón para recuperar contraseña */}
            <Button type="submit" className="w-full bg-black">
              Recuperar contraseña
            </Button>
          </div>
        </div>
      </div>
      {/* Imagen*/}
      <LoginImage />
    </div>
  );
}
