import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import Divider from "@/components/custom/divider";
import LoginImage from "@/components/custom/login-image";
import LogoNeoris from "@/components/custom/logo-neoris";

export default function CreateAccountPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <LogoNeoris />
            <h1 className="text-3xl font-bold pt-7">Crear cuenta</h1>
          </div>

          <div className="grid gap-4">
            {/* Nombre */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" type="text" placeholder="Tu nombre" required />
            </div>

            {/* Rol en la empresa */}
            <div className="grid gap-2">
              <Label htmlFor="role">Rol en la empresa</Label>
              <Select>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Selecciona rol en la empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nivel de expertiz*/}
            <div className="grid gap-2">
              <Label htmlFor="role">Nivel de expertiz</Label>
              <Select>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Selecciona nivel de expertiz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="middle">Middle</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Correo y teléfono */}
            <div className="grid gap-2">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" type="tel" placeholder="+52 123 4567890" />
                </div>
              </div>
            </div>

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

            {/* Botón para crear cuenta */}
            <Button type="submit" className="w-full bg-black">
              Crear cuenta
            </Button>

            <Divider />

            {/* Botón para crear cuenta con Google */}
            <Button variant="outline" className="w-full">
              Google
            </Button>
          </div>
        </div>
      </div>

      {/* Imagen*/}
      <LoginImage />
    </div>
  );
}
