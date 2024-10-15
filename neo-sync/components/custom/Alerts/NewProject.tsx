import React, { useState } from "react";
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/global/DatePicker";
import { Wand2Icon, PlusIcon } from "lucide-react";
import { supabaseClient } from "@/supabase/client";

interface NewProjectProps {
  onSubmit: (projectData: any) => Promise<void>;
}

export function NewProject2({ onSubmit }: NewProjectProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const projectData = {
      nombre: formData.get("name"),
      descripcion: formData.get("description"),
      transcripcion: formData.get("transcription"),
      giro_empresa: formData.get("sector"),
      fecha_inicio: formData.get("date"),
      estatus: "todo", // Default status
    };
    console.log("Submitting project data:", projectData);
    await onSubmit(projectData);
  };
}
export function NewProject() {
  const [descripcion, setDescripcion] = useState("");
  const [nombre, setNombre] = useState("");
  const [fecha_inicio, setFecha_Inicio] = useState<Date | undefined>(undefined);
  const [giroEmpresa, setGiroEmpresa] = useState("");
  const [transcripcion, setTranscripcion] = useState("");

  const handleGenerateFromScratch = async () => {
    try {
      const { error } = await supabaseClient.from("proyecto").insert([
        {
          nombre: nombre,
          descripcion: descripcion,
          giro_empresa: giroEmpresa,
          fecha_inicio: fecha_inicio,
          transcripcion: transcripcion,
          estatus: "todo",
        },
      ]);

      if (error) {
        console.error("Error saving project:", error);
        throw new Error("Failed to save project");
      }

      console.log("Project saved successfully");
    } catch (error) {
      console.error("Error generating from scratch:", error);
    }
  };

  const handleGenerateWithAI = async () => {
    try {
      const jsonFormat = `{
        "nombre": "string",
        "descripcion": "string",
        "costo": "number",
        "transcripcion": "string",
        "giro_empresa": "string"
      }`;

      const response = await fetch("/api/generateAIResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: descripcion,
          jsonFormat: jsonFormat,
        }),
      });

      if (!response.ok) {
        throw new Error("Error generating AI response");
      }

      const data = await response.json();
      console.log("Fetched json", data);
    } catch (error) {
      console.error("Error generating AI response:", error);
    }
  };

  return (
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
            <Input
              id="name"
              name="name"
              placeholder="Nombre del proyecto"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
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
              name="description"
              placeholder="Escribe aquí a grandes rasgos las necesidades del cliente"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
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
              name="transcription"
              placeholder="Copia y pega la transcripción de la videollamada con el cliente aquí (opcional)"
              value={transcripcion}
              onChange={(e) => setTranscripcion(e.target.value)}
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
              <Select
                name="sector"
                value={giroEmpresa}
                onValueChange={(value) => setGiroEmpresa(value)}
              >
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
              <DatePicker
                selectedDate={fecha_inicio}
                onDateChange={setFecha_Inicio}
              />
            </div>
          </div>
        </div>
        <div className="space-y-4 mt-4">
          <div className="flex gap-1">
            <AlertDialogAction
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              onClick={handleGenerateWithAI}
            >
              <Wand2Icon className="w-4 mr-1" />
              Generar con inteligencia artificial
            </AlertDialogAction>
            <AlertDialogAction
              type="button"
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-md flex-row justify-between"
              onClick={handleGenerateFromScratch}
            >
              <PlusIcon className="w-4 mr-1" />
              <span className="text-sm">Generar desde cero</span>
            </AlertDialogAction>
          </div>
          <AlertDialogCancel className="w-full">Cancelar</AlertDialogCancel>
        </div>
      </AlertDialogDescription>
    </AlertDialogHeader>
  );
}
