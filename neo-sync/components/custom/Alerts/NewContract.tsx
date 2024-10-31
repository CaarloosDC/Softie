"use client";

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
import { DatePicker } from "@/components/global/DatePicker";
import { PlusIcon, UploadIcon } from "lucide-react";
import { useState } from "react";

export function NewContract() {
  //* State for file selection
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : null);
  };

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Agregar nuevo contrato</AlertDialogTitle>
        <AlertDialogDescription>
          {/* Section where all the text input is received */}
          <div className="space-y-4 mt-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <Input id="name" placeholder="Contrato 1" />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="sector"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enfocado a la Industria
                </label>
                <Select>
                  <SelectTrigger id="sector">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Tecnología</SelectItem>
                    <SelectItem value="finance">Finanzas</SelectItem>
                    <SelectItem value="healthcare">Salud</SelectItem>
                    <SelectItem value="none">Ninguna</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha del contrato
                </label>
                <DatePicker />
              </div>
            </div>
            {/* Upload a file from file system */}
            <div>
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subir documento
              </label>
              <div className="flex items-center space-x-2">
                <Button
                  size={"sm"}
                  variant="outline"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                  className="w-full justify-start"
                >
                  <UploadIcon className="mr-2 h-4 w-4" />
                  {fileName || "Seleccionar archivo"}
                </Button>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
              </div>
              {fileName && (
                <p className="mt-2 text-sm text-gray-500">
                  Archivo seleccionado: {fileName}
                </p>
              )}
            </div>
          </div>
          {/* All the main buttons of the form */}
          <div className="space-y-4 mt-4">
            <AlertDialogAction className="bg-gray-900 hover:bg-gray-800 text-white rounded-md flex items-center justify-center w-full">
              <PlusIcon className="w-4 mr-1" />
              <span className="text-sm">Agregar Contrato</span>
            </AlertDialogAction>

            <AlertDialogCancel className="w-full">Cancelar</AlertDialogCancel>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
    </>
  );
}
