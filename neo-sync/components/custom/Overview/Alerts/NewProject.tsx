"use client";

import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { DatePicker } from "@/components/global/DatePicker";
import { Wand2Icon, PlusIcon } from "lucide-react";

export function NewProject() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>();

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Crear nuevo proyecto</AlertDialogTitle>
        <AlertDialogDescription>
          <div className="space-y-4 mt-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <Input id="name" placeholder="Nombre del proyecto" />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Descripción del proyecto
              </label>
              <Textarea
                id="description"
                placeholder="Escribe aquí a grandes rasgos las necesidades del cliente"
              />
            </div>
            <div>
              <label
                htmlFor="transcription"
                className="block text-sm font-medium text-gray-700"
              >
                Transcripción de la reunión con el cliente (opcional)
              </label>
              <Textarea
                id="transcription"
                placeholder="Copia y pega la transcripción de la videollamada con el cliente aquí (opcional)"
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="sector"
                  className="block text-sm font-medium text-gray-700"
                >
                  Giro de la empresa
                </label>
                <Select>
                  <SelectTrigger id="sector">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Tecnología</SelectItem>
                    <SelectItem value="finance">Finanzas</SelectItem>
                    <SelectItem value="healthcare">Salud</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha de inicio del proyecto
                </label>
                <DatePicker />
              </div>
            </div>
          </div>
          <div className="space-y-4 mt-4">
            <div className="flex gap-1">
              <Button
                variant="default"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                <Wand2Icon className="w-4 mr-1" />
                Generar con inteligencia artificial
              </Button>
              <Button
                variant="default"
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-md flex-row justify-between"
              >
                <PlusIcon className="w-4 mr-1" />
                <span className="text-sm">Generar desde cero</span>
              </Button>
            </div>
            <AlertDialogCancel className="w-full">Cancelar</AlertDialogCancel>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
    </>
  );
}
