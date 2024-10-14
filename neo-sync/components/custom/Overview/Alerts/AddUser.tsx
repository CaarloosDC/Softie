import React from 'react';
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, RefreshCw } from "lucide-react";

interface AddUserProps {
  onSubmit: (userData: any) => Promise<void>;
}

export function AddUser({ onSubmit }: AddUserProps) {
  const [password, setPassword] = React.useState('');

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
      email: formData.get('email'),
      password: password,
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="flex space-x-2">
                <Input id="password" name="password" type="text" value={password} readOnly required />
                <Button type="button" onClick={generatePassword} className="flex-shrink-0">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generar
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-4 mt-4">
            <AlertDialogAction type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Usuario
            </AlertDialogAction>
            <AlertDialogCancel className="w-full">Cancelar</AlertDialogCancel>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
    </form>
  );
}