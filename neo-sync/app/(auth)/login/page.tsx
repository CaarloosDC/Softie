"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Divider from "@/components/custom/divider";
import LoginImage from "@/components/custom/login-image";
import LogoNeoris from "@/components/custom/logo-neoris";
import { login, googleLogin} from "./actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    try {
      await login(formData);
      router.push("/projects");
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("Initiating Google login...");
      const result = await googleLogin();
      console.log("Google login result:", result);
      
      if (result?.url) {
        // Redirect the user to the URL provided by Supabase
        window.location.href = result.url;
      } else {
        console.error("No URL returned from googleLogin");
        alert("An error occurred during Google login. Please try again.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("An error occurred during Google login. Please check the console for details.");
    }
  };


  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center justify-center items-center">
            <LogoNeoris />
            <h1 className="text-3xl font-bold pt-7">Inicio de sesión</h1>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

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
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Iniciar sesión
            </Button>
          </form>

          <Divider />

          <Button 
            type="button"
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleLogin}
          >
            Iniciar sesión con Google
          </Button>

          <div className="mt-4 text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/create-account" className="underline">
              Crea una
            </Link>
          </div>
        </div>
      </div>
      <LoginImage />
    </div>
  );
}