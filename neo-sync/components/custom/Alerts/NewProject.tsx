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
    fecha_inicio: undefined as Date | undefined,
    estatus: 'todo'
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prevData => ({ ...prevData, giro_empresa: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prevData => ({...prevData, fecha_inicio: date  }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Submitting project data:', formData);
    await onSubmit(formData);
  };

  const handleGenerateWithAI = async () => {
    const jsonFormat = `{
      "nombre": "string",
      "descripcion": "string",
      "costo": "number",
      "transcripcion": "string",
      "giro_empresa": "string"
    }`;
  
    const requestBody = {
      query: formData.descripcion,
      jsonFormat: jsonFormat
    };
  
    console.log('Request body being sent to /api/generateAIResponse:', JSON.stringify(requestBody, null, 2));
  
    try {
      const response = await fetch('/api/generateAIResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        console.error('Error response from server:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error('Error generating AI response');
      }
  
      const data = await response.json();
      console.log("AI-generated project data received:", JSON.stringify(data, null, 2));
      
      // Update form data with AI-generated content
      const updatedFormData = {
        ...formData,
        ...data.response
      };
      console.log("Updated form data after AI generation:", JSON.stringify(updatedFormData, null, 2));
      setFormData(updatedFormData);
    } catch (error) {
      console.error('Error in handleGenerateWithAI:', error);
    }
  };

  
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
                <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700">
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
            <div className="flex gap-1">
              <AlertDialogAction 
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md" 
                onClick={handleGenerateWithAI}
              >
                <Wand2Icon className="w-4 mr-1" />
                Generar con inteligencia artificial
              </AlertDialogAction>
              <AlertDialogAction 
                type="submit" 
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-md flex-row justify-between"
              >
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