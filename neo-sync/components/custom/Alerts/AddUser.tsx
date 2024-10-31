import React, { useState } from 'react';
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, RefreshCw } from "lucide-react";

interface AddUserProps {
  onSubmit: (userData: any) => Promise<void>;
}

export function AddUser({ onSubmit }: AddUserProps) {
  const [password, setPassword] = useState('');

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let newPassword = '';
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userData = {
      email: formData.get('email') as string,
      password: password,
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      expertiseLevel: formData.get('expertiseLevel') as string,
      phone: formData.get('phone') as string,
    };
    console.log('Submitting user data:', userData);
    await onSubmit(userData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <AlertDialogHeader>
        <AlertDialogTitle>Agregar nuevo usuario</AlertDialogTitle>
        <AlertDialogDescription>
          <div className="space-y-4 mt-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <Input id="email" name="email" type="email" placeholder="usuario@ejemplo.com" required />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <Input id="name" name="name" type="text" placeholder="Nombre completo" required />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Rol
              </label>
              <Select name="role" required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="expertiseLevel" className="block text-sm font-medium text-gray-700">
                Nivel de experiencia
              </label>
              <Select name="expertiseLevel" required>
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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <Input id="phone" name="phone" type="tel" placeholder="Número de teléfono" required />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="flex space-x-2">
                <Input id="password" name="password" type="text" value={password} readOnly required />
                <Button size={"sm"} type="button" onClick={generatePassword} className="flex-shrink-0">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generar
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-4 mt-4">
            <AlertDialogAction type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar usuario
            </AlertDialogAction>
            <AlertDialogCancel className="w-full">Cancelar</AlertDialogCancel>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
    </form>
  );
}