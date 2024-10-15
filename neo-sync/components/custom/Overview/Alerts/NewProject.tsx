import React, { useState } from 'react';
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

interface NewProjectProps {
  onSubmit: (projectData: any) => Promise<void>;
}

export function NewProject({ onSubmit }: NewProjectProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    transcripcion: '',
    giro_empresa: '',
    fecha_inicio: null as Date | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, giro_empresa: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, fecha_inicio: date || null }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const projectData = {
      ...formData,
      fecha_inicio: formData.fecha_inicio ? formData.fecha_inicio.toISOString() : null,
      estatus: "todo" // Default status
    };
    await onSubmit(projectData);
  };

  const handleGenerateWithAI = async () => {
    try {
      const response = await fetch('/api/generateAIResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: formData.descripcion,
          jsonFormat: `{
            "nombre": "string",
            "descripcion": "string",
            "costo": "number",
            "transcripcion": "string",
            "giro_empresa": "string"
          }`
        }),
      });

      if (!response.ok) {
        throw new Error('Error generating AI response');
      }

      const data = await response.json();
      console.log("AI-generated project data:", data);
      
      // Update form with AI-generated data
      setFormData(prev => ({
        ...prev,
        nombre: data.response.nombre || prev.nombre,
        descripcion: data.response.descripcion || prev.descripcion,
        transcripcion: data.response.transcripcion || prev.transcripcion,
        giro_empresa: data.response.giro_empresa || prev.giro_empresa,
      }));
      
    } catch (error) {
      console.error('Error generating AI response:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <AlertDialogHeader>
        <AlertDialogTitle>Crear nuevo proyecto</AlertDialogTitle>
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
                placeholder="Nombre del proyecto" 
              />
            </div>
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
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
            <div>
              <label htmlFor="transcripcion" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="giro_empresa" className="block text-sm font-medium text-gray-700">
                  Giro de la empresa
                </label>
                <Select name="giro_empresa" onValueChange={handleSelectChange} value={formData.giro_empresa}>
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
                <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700">
                  Fecha de inicio del proyecto
                </label>
                <DatePicker 
                  onDateChange={handleDateChange} 
                  selectedDate={formData.fecha_inicio || undefined}
                />
              </div>
            </div>
          </div>
          <div className="space-y-4 mt-4">
            <div className="flex gap-1">
              <AlertDialogAction className="bg-blue-500 hover:bg-blue-600 text-white rounded-md" onClick={handleGenerateWithAI}>
                <Wand2Icon className="w-4 mr-1" />
                Generar con inteligencia artificial
              </AlertDialogAction>
              <AlertDialogAction type="submit" className="bg-gray-900 hover:bg-gray-800 text-white rounded-md flex-row justify-between">
                <PlusIcon className="w-4 mr-1" />
                <span className="text-sm">Generar desde cero</span>
              </AlertDialogAction>
            </div>
            <AlertDialogCancel className="w-full">Cancelar</AlertDialogCancel>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
    </form>
  );
}