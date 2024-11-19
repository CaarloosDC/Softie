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
import { Loader2, PlusIcon, UploadIcon } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/lib/db";

interface NewContractProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export function NewContract({ onClose, onSuccess }: NewContractProps) {
  //* State for file selection
  const [fileName, setFileName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : "");
    setSelectedFile(file || null);
  };

  //* Logic for date picker
  const [formData, setFormData] = useState({
    nombre: "",
    giro_empresa: "",
    fecha_inicio: undefined as Date | undefined,
  });
  const handleDateChange = (date: Date | undefined) => {
    setFormData((prevData) => ({ ...prevData, fecha_inicio: date }));
  };
  const invalidForm =
    formData.nombre === "" || formData.giro_empresa === "" || fileName === "";

  //* Handle submit
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Por favor seleccione un archivo");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fileExtension = selectedFile.name.split(".").pop();
      const newFileName = `${formData.nombre
        .trim()
        .replace(/\s+/g, "_")}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("contratosMarco")
        .upload(newFileName, selectedFile, {
          cacheControl: "3600",
          upsert: true, // This will overwrite if file with same name exists
        });

      if (uploadError) throw uploadError;

      setFileName("");
      setSelectedFile(null);
      onClose?.();
      onSuccess?.();
    } catch (err) {
      setError("Error al subir el archivo");
      console.error("Upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Agregar nuevo contrato</AlertDialogTitle>
      </AlertDialogHeader>
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
            <Input
              id="name"
              placeholder="Contrato 1"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label
                htmlFor="sector"
                className="block text-sm font-medium text-gray-700"
              >
                Enfocado a la Industria
              </label>
              <Select
                value={formData.giro_empresa}
                onValueChange={(value) =>
                  setFormData({ ...formData, giro_empresa: value })
                }
              >
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
              <DatePicker
                selectedDate={formData.fecha_inicio}
                onDateChange={handleDateChange}
              />
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
                onClick={() => document.getElementById("file-upload")?.click()}
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
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            className="bg-gray-900 hover:bg-gray-800 text-white rounded-md flex items-center justify-center w-full"
            onClick={handleSubmit}
            disabled={isLoading || invalidForm}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <PlusIcon className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Agregando..." : "Agregar Documento"}
          </Button>
          <AlertDialogCancel className="w-full" onClick={() => onClose?.()}>
            Cancelar
          </AlertDialogCancel>
        </div>
      </AlertDialogDescription>
    </>
  );
}
