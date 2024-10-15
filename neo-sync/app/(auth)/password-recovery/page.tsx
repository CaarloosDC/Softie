"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginImage from "@/components/custom/login-image";
import LogoNeoris from "@/components/custom/logo-neoris";
import { updatePassword } from "@/app/(auth)/login/actions";

export default function PasswordRecoveryPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      await updatePassword(password);
      setMessage("Password updated successfully.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      console.error("Password update error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="flex flex-col items-center text-center gap-2">
            <LogoNeoris />
            <h1 className="text-2xl font-bold pt-7">Recuperación de cuenta</h1>
            <p className="text-balance text-muted-foreground">
              Ingresa una nueva contraseña para la recuperación de tu cuenta
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirma tu contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full bg-black">
              Recuperar contraseña
            </Button>
          </form>
          {message && <p className="text-center text-sm">{message}</p>}
        </div>
      </div>
      <LoginImage />
    </div>
  );
}