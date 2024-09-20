import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LogoNeorisDark from "@/components/custom/logo-neoris-dark";
import Divider from "@/components/custom/divider";
import LoginImage from "@/components/custom/login-image";

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <LogoNeorisDark />
            <h1 className="text-3xl font-bold">Inicio de sesión</h1>
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

            {/* Contraseña */}
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>

            {/* Botón para iniciar sesión */}
            <Button type="submit" className="w-full">
              Iniciar sesión
            </Button>

            <Divider />

            {/* Botón para iniciar sesión con google*/}
            <Button variant="outline" className="w-full">
              Iniciar sesión con Google
            </Button>
          </div>

          {/* Crear cuenta */}
          <div className="mt-4 text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/create-account" className="underline">
              Crea una
            </Link>
          </div>
        </div>
      </div>
      {/* Imagen */}
      <LoginImage />
    </div>
  );
}