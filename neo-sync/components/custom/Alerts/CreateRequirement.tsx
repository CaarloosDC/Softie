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
import { Wand2Icon } from "lucide-react";
import { DatePicker } from "@/components/global/DatePicker";

/**
 * This component handles the creation of a new requirement form by returning an alert dialog view that will be displayed by clicking a button
 */
export function CreateRequirement() {
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Crear nuevo requerimiento</AlertDialogTitle>
      </AlertDialogHeader>
      {/* Use the view state to manage which view the user wants  */}
      <div className="space-y-4">
        {/* Text input */}
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
        {/* Selection fo requirements and date picker */}
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
        {/* Effort + AI estimate */}
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
      {/* Display the main buttons/actions of the forms */}
      <AlertDialogFooter className="">
        {/* Depending which view is displayed, the arrengment of the buttons change */}
        <AlertDialogCancel className={"w-1/2"}>Cancelar</AlertDialogCancel>
        <AlertDialogAction className="w-1/2 bg-gray-800 hover:bg-gray-700 text-white rounded-md">
          Crear
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
