import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginImage from "@/components/custom/login-image";
import LogoNeoris from "@/components/custom/logo-neoris";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <LogoNeoris />
            <h1 className="text-2xl font-bold  pt-7">Recuperación de cuenta</h1>
            <p className="text-balance text-muted-foreground">
              Ingresa tu correo para la recuperación de tu cuenta
            </p>
          </div>
          <div className="grid gap-4">
            {/* Correo electrónico */}
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>

            {/* Botón para recuperar contraseña */}
            <Button type="submit" className="w-full">
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
