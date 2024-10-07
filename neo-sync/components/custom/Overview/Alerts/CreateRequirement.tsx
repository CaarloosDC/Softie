"use client";

import {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";
import { FilterIcon, Wand2Icon, Plus } from "lucide-react";
import { DatePicker } from "@/components/global/DatePicker";
import BlueButton from "../../BlueButton";
import Divider from "../../divider";

/**
 * This component handles the creation of a new requirement form by returning an alert dialog view that will be displayed by clicking a button
 */
export function CreateRequirement() {
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
        <AlertDialogTitle>Crear nuevo requerimiento</AlertDialogTitle>
      </AlertDialogHeader>
      {/* Use the view state to manage which view the user wants  */}
      {view === "form" ? (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción
            </label>
            <Textarea
              id="description"
              placeholder="Describe los detalles del requerimiento del proyecto"
            />
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Tipo de requerimiento
              </label>
              <Select>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RF">Funcional</SelectItem>
                  <SelectItem value="RNF">No Funcional</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Fecha de inicio del proceso
              </label>
              <DatePicker />
            </div>
          </div>
          <div>
            <label
              htmlFor="effort"
              className="block text-sm font-medium text-gray-700"
            >
              Esfuerzo estimado (en horas)
            </label>
            <div className="flex space-x-2">
              <Input id="effort" placeholder="Total de horas" />
              <Button
                variant="default"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                <Wand2Icon className="w-4 mr-1" />
                Estimar con IA
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input placeholder="Buscar por nombre" className="flex-grow" />
            <Button variant="outline">
              <FilterIcon className="w-4 h-4 mr-2" />
              Filtrar lista
            </Button>
          </div>
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
                          member.available ? "text-green-500" : "text-red-500"
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
          <Divider />
        </div>
      )}
      <AlertDialogFooter className="">
        <AlertDialogCancel className="w-1/3">Cancelar</AlertDialogCancel>
        {view === "form" ? (
          <Button
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-md"
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
            <AlertDialogAction className="w-1/3 bg-gray-800 hover:bg-gray-700 text-white rounded-md">
              Crear
            </AlertDialogAction>
          </>
        )}
      </AlertDialogFooter>
    </>
  );
}
