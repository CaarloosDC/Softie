"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, RefreshCw, Loader2 } from "lucide-react";
import { format } from "path";

interface AddUserProps {
  onSubmit: (userData: any) => Promise<boolean>;
  onClose?: () => void; // Add this
}

export function AddUser({ onSubmit, onClose }: AddUserProps) {
  //* Where the userData will be stored
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    name: "",
    role: "",
    expertiseLevel: "",
    phone: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, seterror] = useState("");

  const handleSubmit = async () => {
    console.log("Submitting user data:", userData);
    try {
      setIsLoading(true);
      const success = await onSubmit(userData);
      console.log("succes? ", success);
      if (success) {
        onClose?.();
      }
    } catch (error) {
      console.log("error");
      seterror("Problema al agregar usuario");
    } finally {
      setIsLoading(false);
    }
  };

  const formInvalid =
    userData.email === "" ||
    userData.name === "" ||
    userData.role === "" ||
    userData.expertiseLevel === "" ||
    userData.phone === "";

  return (
    // <form onSubmit={handleSubmit}>
    <AlertDialogHeader>
      <AlertDialogTitle>Agregar nuevo usuario</AlertDialogTitle>
      <AlertDialogDescription>
        <div className="space-y-4 mt-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="usuario@ejemplo.com"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Nombre completo"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Rol
            </label>
            <Select
              name="role"
              value={userData.role}
              onValueChange={(value) =>
                setUserData({ ...userData, role: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="administrador">Administrador</SelectItem>
                <SelectItem value="usuario">Usuario</SelectItem>
                <SelectItem value="gerente">Gerente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label
              htmlFor="expertiseLevel"
              className="block text-sm font-medium text-gray-700"
            >
              Nivel de experiencia
            </label>
            <Select
              name="expertiseLevel"
              value={userData.expertiseLevel}
              onValueChange={(value) =>
                setUserData({ ...userData, expertiseLevel: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Principiante</SelectItem>
                <SelectItem value="intermediate">Intermedio</SelectItem>
                <SelectItem value="expert">Experto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Teléfono
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Número de teléfono"
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
              required
            />
          </div>
        </div>
        <div className="space-y-4 mt-4">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => handleSubmit()}
            disabled={formInvalid || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <UserPlus className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Agregando..." : "Agregar usuario"}
          </Button>
          <AlertDialogCancel className="w-full" onClick={() => onClose?.()}>
            Cancelar
          </AlertDialogCancel>
        </div>
      </AlertDialogDescription>
    </AlertDialogHeader>
    // </form>
  );
}
