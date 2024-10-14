"use client";

import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
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
import { DatePicker } from "@/components/global/DatePicker";
import { Wand2Icon, PlusIcon } from "lucide-react";
import { retrieveRelevantDocs } from "@/lib/ollama/retrieval/retrieveRelevantDocs";
import { generateAnswer } from "@/lib/ollama/retrieval/generateLlamaResponse";
import { supabaseClient } from "@/supabase/client";

export function NewProject() {
  const handleGenerateWithAI = async () => {
    console.log('hello world')
    try {
      // const response = await fetch('/api/createEmbeddingsFromPdfs', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
  
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error('Error generating embeddings');
      // }

      // const data = await response.json();
      // console.log(data);

      const response = await fetch('/api/generateAIResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `Un proyecto de e-commerce de electrodomésticos podría ser una plataforma en línea donde los usuarios puedan explorar, comparar y comprar una amplia variedad de electrodomésticos, como refrigeradores, lavadoras, hornos, y más. El sitio incluiría:

1. **Catálogo de productos**: Mostrar electrodomésticos con imágenes, descripciones, precios, y especificaciones técnicas.
2. **Filtro de búsqueda**: Permitir a los usuarios filtrar por categorías, marcas, rangos de precio, características específicas, etc.
3. **Carrito de compras**: Función que permita a los usuarios agregar productos al carrito, revisar el total y proceder al pago.
4. **Sistema de pago seguro**: Integración con pasarelas de pago seguras para tarjetas de crédito, PayPal, u otros métodos.
5. **Reseñas y calificaciones**: Los usuarios pueden dejar comentarios y calificaciones sobre los productos.
6. **Envío y seguimiento**: Proveer opciones de envío y seguimiento de pedidos.

Esto ofrecería una experiencia de compra rápida y eficiente para los clientes que buscan electrodomésticos en línea.`,

        }),
      });

      if (!response.ok) {
        throw new Error('Error generating AI response');
      }

      const data = await response.json();
      console.log("Fetched json",data);

      // // Almacenar embeddings en la base de datos
      // const { error } = await supabaseClient.from("embeddings").insert([{
      //   content: data.response,
      //   embedding: data.response,
      //   metadata: { type: 'project', name: data.response.name }
      // }])

      // if (error) {
      //   console.error('Error storing embeddings:', error);
      //   throw new Error('Failed to store embeddings');
      // }
      
    } catch (error) {
      console.error('Error generating AI response ', error);
    }
  }

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Crear nuevo proyecto</AlertDialogTitle>
        <AlertDialogDescription>
          {/* Section where all the text input is received */}
          <div className="space-y-4 mt-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <Input id="name" placeholder="Nombre del proyecto" />
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
                placeholder="Escribe aquí a grandes rasgos las necesidades del cliente"
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
                placeholder="Copia y pega la transcripción de la videollamada con el cliente aquí (opcional)"
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
                <Select>
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
                <DatePicker />
              </div>
            </div>
          </div>
          {/* All the main buttons of the form */}
          <div className="space-y-4 mt-4">
            <div className="flex gap-1">
              <AlertDialogAction className="bg-blue-500 hover:bg-blue-600 text-white rounded-md" onClick={handleGenerateWithAI}>
                <Wand2Icon className="w-4 mr-1" />
                Generar con inteligencia artificial
              </AlertDialogAction>
              <AlertDialogAction className="bg-gray-900 hover:bg-gray-800 text-white rounded-md flex-row justify-between">
                <PlusIcon className="w-4 mr-1" />
                <span className="text-sm">Generar desde cero</span>
              </AlertDialogAction>
            </div>
            <AlertDialogCancel className="w-full">Cancelar</AlertDialogCancel>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
    </>
  );
}
