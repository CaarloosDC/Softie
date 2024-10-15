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
import { Wand2Icon, PlusIcon, FilterIcon } from "lucide-react";
import { supabaseClient } from "@/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

interface NewProjectProps {
  onSubmit: (projectData: any) => Promise<void>;
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

  //* State for file selection
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : null);
  };

  // * The CreateRequirement view has two main views, and the view state below handles which view to show
  const [view, setView] = useState("form");

  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const teamMembers = [
    { id: "1", name: "Joel", experience: "Senior", available: false },
    { id: "2", name: "Sebastian", experience: "Middle", available: true },
    { id: "3", name: "Daniel", experience: "Senior", available: false },
    { id: "4", name: "Carlos", experience: "Middle", available: true },
    { id: "5", name: "Roberto", experience: "Middle", available: true },
  ];

  // * Function to remove a team member if it was already selected, otherwise they are added to the selectedTeamMembers list
  const toggleTeamMember = (id: string) => {
    setSelectedTeamMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Crear nuevo proyecto</AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogDescription>
        {view === "form" ? (
          <>
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
          </>
        ) : (
          <>
            <div className="space-y-4">
              {/* Search + Filter */}
              <div className="flex space-x-2">
                <Input placeholder="Buscar por nombre" className="flex-grow" />
                <Button variant="outline">
                  <FilterIcon className="w-4 h-4 mr-2" />
                  Filtrar lista
                </Button>
              </div>
              {/* Table for showing possible team members */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Selecciona al equipo para este requerimiento
                </h3>
                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estado</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Experiencia</TableHead>
                      <TableHead>Disponibilidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <input
                            type="checkbox"
                            id={`member-${member.id}`}
                            checked={selectedTeamMembers.includes(member.id)}
                            onChange={() => toggleTeamMember(member.id)}
                            disabled={!member.available}
                          />
                        </TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.experience}</TableCell>
                        <TableCell>
                          <span
                            className={`text-sm ${
                              member.available
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {member.available ? "Disponible" : "No disponible"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Footer of table for extra information/actions */}
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  {selectedTeamMembers.length} personas seleccionadas
                </span>
                <Button
                  variant="outline"
                  onClick={() => setSelectedTeamMembers([])}
                >
                  Deseleccionar todo
                </Button>
              </div>
              <Separator />
            </div>
          </>
        )}
        {/* AI Button */}
        <div className="mt-4">
          <AlertDialogAction
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md w-full"
            onClick={handleGenerateWithAI}
          >
            <Wand2Icon className="w-4 mr-1" />
            Generar con inteligencia artificial
          </AlertDialogAction>
        </div>
      </AlertDialogDescription>
      <AlertDialogFooter className="">
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
              onClick={handleGenerateFromScratch}
            >
              <span className="text-sm">Crear</span>
            </AlertDialogAction>
          </>
        )}
      </AlertDialogFooter>
    </>
  );
}
