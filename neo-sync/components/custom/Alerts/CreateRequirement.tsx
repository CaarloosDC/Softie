"use client";

import React, { useState } from "react";
import {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
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
import { Wand2Icon, Loader2 } from "lucide-react";
import { DatePicker } from "@/components/global/DatePicker";
import { toast } from "@/hooks/use-toast";
import { estimateRequirementEffort } from "@/app/services/aiEstimationReq";

interface CreateRequirementProps {
  onSubmit: (requirementData: any) => Promise<void>;
  projectId: number;
}

export function CreateRequirement({
  onSubmit,
  projectId,
}: CreateRequirementProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    fecha_inicio: undefined as Date | undefined,
    esfuerzo_requerimiento: "",
    estatus: "todo",
  });

  const [isEstimating, setIsEstimating] = useState(false);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, tipo: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prevData) => ({ ...prevData, fecha_inicio: date }));
  };

  const handleEstimateEffort = async () => {
    setIsEstimating(true);
    try {
      const response = await fetch("/api/generateTimeEstimation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          tipo: formData.tipo,
        }),
      });

      if (!response.ok) {
        throw new Error("Error estimating requirement effort");
      }

      const data = await response.json();
      console.log("Estimation response:", data);

      // Actualizar el formulario con la respuesta de la estimación
      setFormData((prevData) => ({
        ...prevData,
        ...data,
      }));

      toast({
        title: "Estimación completada",
        description: "La estimación del esfuerzo se ha completado con éxito.",
      });
    } catch (error) {
      console.error("Estimation error:", error);
      toast({
        title: "Error en la estimación",
        description: "Hubo un error al estimar el esfuerzo del requerimiento.",
        variant: "destructive",
      });
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitData = {
      ...formData,
      proyecto_id: projectId,
      fecha_inicio: formData.fecha_inicio
        ? formData.fecha_inicio.toISOString().split("T")[0]
        : null,
    };
    console.log("Submitting requirement data:", submitData);
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <AlertDialogHeader>
        <AlertDialogTitle>Crear nuevo requerimiento</AlertDialogTitle>
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
                placeholder="Nombre del requerimiento"
              />
            </div>
            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-gray-700"
              >
                Descripción
              </label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Describe los detalles del requerimiento del proyecto"
              />
            </div>
            <div className="flex gap-2">
              <div className="w-1/2">
                <label
                  htmlFor="tipo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tipo de requerimiento
                </label>
                <Select
                  name="tipo"
                  value={formData.tipo}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger id="tipo" className="w-full">
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
                  htmlFor="fecha_inicio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fecha de inicio del proceso
                </label>
                <DatePicker
                  selectedDate={formData.fecha_inicio}
                  onDateChange={handleDateChange}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="esfuerzo_requerimiento"
                className="block text-sm font-medium text-gray-700"
              >
                Esfuerzo estimado (en horas)
              </label>
              <div className="flex space-x-2">
                <Input
                  id="esfuerzo_requerimiento"
                  name="esfuerzo_requerimiento"
                  value={formData.esfuerzo_requerimiento}
                  onChange={handleInputChange}
                  placeholder="Total de horas"
                />
                <Button
                  size="sm"
                  type="button"
                  variant="default"
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                  onClick={handleEstimateEffort}
                  disabled={isEstimating}
                >
                  {isEstimating ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Wand2Icon className="w-4 mr-1" />
                  )}
                  {isEstimating ? 'Estimando...' : 'Estimar con IA'}
                </Button>
              </div>
            </div>
          </div>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="w-1/2">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              type="submit" 
              className="w-1/2"
            >
              Crear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogDescription>
      </AlertDialogHeader>
    </form>
  );
}