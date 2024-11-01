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
import { Button } from "@/components/ui/button";

interface NewProjectProps {
  onSubmit: (projectData: any) => Promise<void>;
}

export function NewProject({ onSubmit }: NewProjectProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    transcripcion: "",
    giro_empresa: "",
    fecha_inicio: undefined as Date | undefined,
    estatus: "todo",
  });

  const [errors, setErrors] = useState({
    nombre: false,
    descripcion: false,
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: value === "" }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, giro_empresa: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prevData) => ({ ...prevData, fecha_inicio: date }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.nombre === "" || formData.descripcion === "") {
      setErrors({
        nombre: formData.nombre === "",
        descripcion: formData.descripcion === "",
      });
      return;
    }
    console.log("Submitting project data:", formData);
    await onSubmit(formData);
  };

  const handleGenerateWithAI = async () => {
    if (formData.nombre === "" || formData.descripcion === "") {
      setErrors({
        nombre: formData.nombre === "",
        descripcion: formData.descripcion === "",
      });
      return;
    }

    const jsonFormat = `{
      "nombre": "string" -> este debe de ser el n0mbre del proyecto: ${formData.nombre},
      "descripcion": "string",
      "costo": "number",
      "transcripcion": "string",
      "giro_empresa": "string",
      "requerimientos": [
        {
          "nombre": "string",
          "descripcion": "string",
          "tipo": "string" // Puede ser "funcional", "no funcional", "restricción", etc.,
          "esfuerzo_requerimiento": "number" // Numero entero que representa story points,
        }
      ]
    }`;

    const requestBody = {
      query: formData.descripcion,
      additionalData: formData.transcripcion,
      jsonFormat: jsonFormat,
    };

    console.log(
      "Request body being sent to /api/generateAIResponse:",
      JSON.stringify(requestBody, null, 2)
    );

    try {
      const response = await fetch("/api/generateAIResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error(
          "Error response from server:",
          response.status,
          response.statusText
        );
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error("Error generating AI response");
      }

      const data = await response.json();
      console.log(
        "AI-generated project data received:",
        JSON.stringify(data, null, 2)
      );

      // Update form data with AI-generated content
      const updatedFormData = {
        ...formData,
        ...data.response,
      };

      console.log(
        "Updated form data after AI generation:",
        JSON.stringify(updatedFormData, null, 2)
      );
      setFormData(updatedFormData);
    } catch (error) {
      console.error("Error in handleGenerateWithAI:", error);
    }
  };

  const isFormValid = formData.nombre !== "" && formData.descripcion !== "";

  return (
    <form onSubmit={handleSubmit}>
      <AlertDialogHeader>
        <AlertDialogTitle>Crear nuevo proyecto</AlertDialogTitle>
        <AlertDialogDescription>
          <div className="space-y-4 mt-4">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre del proyecto"
                className={`${
                  errors.nombre ? "border-red-500" : ""
                }`}
              />
              {errors.nombre && (
                <p className="text-red-500 text-xs mt-1">
                  El campo Nombre es obligatorio.
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-gray-700"
              >
                Descripción del proyecto
              </label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Escribe aquí a grandes rasgos las necesidades del cliente"
                className={`${
                  errors.descripcion ? "border-red-500" : ""
                }`}
              />
              {errors.descripcion && (
                <p className="text-red-500 text-xs mt-1">
                  El campo Descripción es obligatorio.
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="transcripcion"
                className="block text-sm font-medium text-gray-700"
              >
                Transcripción de la reunión con el cliente (opcional)
              </label>
              <Textarea
                id="transcripcion"
                name="transcripcion"
                value={formData.transcripcion}
                onChange={handleInputChange}
                placeholder="Copia y pega la transcripción de la videollamada con el cliente aquí (opcional)"
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="giro_empresa"
                  className="block text-sm font-medium text-gray-700"
                >
                  Giro de la empresa
                </label>
                <Select
                  name="giro_empresa"
                  value={formData.giro_empresa}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger id="giro_empresa">
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
                  htmlFor="fecha_inicio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha de inicio del proyecto
                </label>
                <DatePicker
                  selectedDate={formData.fecha_inicio}
                  onDateChange={handleDateChange}
                />
              </div>
            </div>
          </div>
          <div className="space-y-4 mt-4">
            <div className="flex gap-2">
              <AlertDialogAction asChild>
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleGenerateWithAI}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white flex items-center"
                  disabled={!isFormValid}
                >
                  <Wand2Icon className="w-4 h-4 mr-1" />
                  Generar con IA
                </Button>
              </AlertDialogAction>

              <AlertDialogAction asChild>
                <Button
                  size="sm"
                  variant="default"
                  type="submit"
                  className="flex-1 flex items-center"
                  disabled={!isFormValid}
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  <span>Generar desde cero</span>
                </Button>
              </AlertDialogAction>
            </div>
            <AlertDialogCancel asChild>
              <Button size="sm" variant="outline" className="w-full">
                Cancelar
              </Button>
            </AlertDialogCancel>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
    </form>
  );
}