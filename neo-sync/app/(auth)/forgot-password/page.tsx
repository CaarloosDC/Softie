"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginImage from "@/components/custom/login-image";
import LogoNeoris from "@/components/custom/logo-neoris";
import { requestPasswordReset } from "@/app/(auth)/login/actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email);
      setMessage("If an account exists for this email, a password reset link has been sent.");
    } catch (error) {
      console.error("Password reset request error:", error);
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
              Ingresa tu correo para la recuperación de tu cuenta
            </p>
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

            <Button size={"sm"} type="submit" className="w-full">
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