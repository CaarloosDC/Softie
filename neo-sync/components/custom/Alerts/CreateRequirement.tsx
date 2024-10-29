import React, { useState } from 'react';
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
import { Wand2Icon } from "lucide-react";
import { DatePicker } from "@/components/global/DatePicker";

interface CreateRequirementProps {
  onSubmit: (requirementData: any) => Promise<void>;
  projectId: number; // Add this prop to receive the project ID
}

export function CreateRequirement({ onSubmit, projectId }: CreateRequirementProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: '',
    fecha_inicio: undefined as Date | undefined,
    esfuerzo_requerimiento: '',
    estatus: 'todo', // Add a default status
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prevData => ({ ...prevData, tipo: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prevData => ({...prevData, fecha_inicio: date }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitData = {
      ...formData,
      proyecto_id: projectId, // Include the project ID
      fecha_inicio: formData.fecha_inicio ? formData.fecha_inicio.toISOString().split('T')[0] : null,
    };
    console.log('Submitting requirement data:', submitData);
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <AlertDialogHeader>
        <AlertDialogTitle>Crear nuevo requerimiento</AlertDialogTitle>
        <AlertDialogDescription>
          <div className="space-y-4 mt-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                  Tipo de requerimiento
                </label>
                <Select name="tipo" value={formData.tipo} onValueChange={handleSelectChange}>
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
                <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700">
                  Fecha de inicio del proceso
                </label>
                <DatePicker 
                  selectedDate={formData.fecha_inicio}
                  onDateChange={handleDateChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="esfuerzo_requerimiento" className="block text-sm font-medium text-gray-700">
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
                  type="button"
                  variant="default"
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  <Wand2Icon className="w-4 mr-1" />
                  Estimar con IA
                </Button>
              </div>
            </div>
          </div>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="w-1/2">Cancelar</AlertDialogCancel>
            <AlertDialogAction type="submit" className="w-1/2 bg-gray-800 hover:bg-gray-700 text-white rounded-md">
              Crear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogDescription>
      </AlertDialogHeader>
    </form>
  );
}