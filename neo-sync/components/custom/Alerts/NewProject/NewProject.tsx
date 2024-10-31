import React, { useState } from "react";
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogFooter,
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
import { Wand2Icon, PlusIcon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { DataTable } from "@/components/global/data-table";
import { columns } from "./columnsProject";
import { getData } from "../../Config/Config";

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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, giro_empresa: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prevData) => ({ ...prevData, fecha_inicio: date }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submitting project data:", formData);
    await onSubmit(formData);
  };

  const handleGenerateWithAI = async () => {
    const jsonFormat = `{
      "nombre": "string",
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

  // * The CreateRequirement view has two main views, and the view state below handles which view to show
  const [view, setView] = useState("form");

  //* State for file selection
  const [fileName, setFileName] = useState<string | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : null);
  };

  //* Mock data
  const data = getData();

  return (
    <form onSubmit={handleSubmit}>
      <AlertDialogHeader>
        <AlertDialogTitle>Crear nuevo proyecto</AlertDialogTitle>
      </AlertDialogHeader>
      {view === "form" ? (
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
              />
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
              />
            </div>
            {/* Upload transcript of meeting with client */}
            <div>
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subir documento
              </label>
              <div className="flex items-center space-x-2">
                <Button
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
        </AlertDialogDescription>
      ) : (
        <div className="">
          {/* Give the columns to show, the data, and set the amount of rows that will be shown */}
          <DataTable columns={columns} data={data} rows={5} />
        </div>
      )}
      <div className="my-4">
        <AlertDialogAction
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md w-full"
          onClick={handleGenerateWithAI}
        >
          <Wand2Icon className="w-4 mr-1" />
          Generar con inteligencia artificial
        </AlertDialogAction>
      </div>
      <AlertDialogFooter>
        {/* Depending which view is displayed, the arrengment of the buttons change */}
        <AlertDialogCancel className={view === "form" ? "w-1/2" : "w-1/3"}>
          Cancelar
        </AlertDialogCancel>
        {view === "form" ? (
          <Button
            className="w-1/2 bg-gray-800 hover:bg-gray-700 text-white rounded-md"
            onClick={() => setView("team")}
          >
            Siguiente
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              className="w-1/3"
              onClick={() => setView("form")}
            >
              Anterior
            </Button>
            {/* AlertDialogAction will dismiss the view when clicked */}
            <AlertDialogAction
              type="button"
              className="w-1/3 bg-gray-800 hover:bg-gray-700 text-white rounded-md"
            >
              <span className="text-sm">Crear</span>
            </AlertDialogAction>
          </>
        )}
      </AlertDialogFooter>
    </form>
  );
}
