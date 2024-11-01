"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";

interface SaveProposalProps {
  proposalText: string;
  projectId: string;
  projectName: string;
}

interface SaveProposalProps {
    proposalText: string;
    projectId: string;
    projectName: string;
  }
  
  export default function SaveProposal({ proposalText, projectId, projectName }: SaveProposalProps) {
    const [isSaving, setIsSaving] = useState(false);
  
    const generatePDF = async (text: string): Promise<Blob> => {
      try {
        const doc = new jsPDF();
        
        // Configure PDF settings
        doc.setFont("helvetica");
        
        // Title configuration
        doc.setFontSize(16);
        
        // Calculate title lines with word wrap
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        const titleMaxWidth = pageWidth - (margin * 2);
        const titleText = `Propuesta de Proyecto: ${projectName}`;
        const titleLines = doc.splitTextToSize(titleText, titleMaxWidth);
        
        // Draw title lines
        let yPosition = 20;
        titleLines.forEach((line: string) => {
          doc.text(line, margin, yPosition);
          yPosition += 10; // Increase spacing between title lines
        });
        
        // Add some spacing after title
        yPosition += 10;
        
        // Content configuration
        doc.setFontSize(12);
        
        // Split content text into lines that fit the page width
        const contentLines = doc.splitTextToSize(text, titleMaxWidth);
        
        // Add content
        contentLines.forEach((line: string) => {
          if (yPosition >= 280) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, margin, yPosition);
          yPosition += 7;
        });
        
        return doc.output('blob');
      } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Error al generar el PDF. Por favor, revise el contenido del documento.');
      }
    };

  const handleSaveProposal = async () => {
    try {
      setIsSaving(true);
      const supabase = createClient();

      // Validate inputs
      if (!proposalText.trim()) {
        throw new Error('El contenido de la propuesta no puede estar vacío');
      }

      if (!projectId) {
        throw new Error('ID del proyecto no encontrado');
      }
      
      // Generate PDF
      const pdfBlob = await generatePDF(proposalText);
      
      // Generate unique filename using timestamp and project ID
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '');
      const filename = `propuesta_${projectId}_${timestamp}.pdf`;
      
      // First, try to delete any existing files
      try {
        const { data: existingFiles, error: listError } = await supabase
          .storage
          .from('propuestas')
          .list('', {
            prefix: `propuesta_${projectId}_`
          });

        if (listError) {
          console.error('Error listing existing files:', listError);
          throw new Error('Error al buscar archivos existentes');
        }

        // Delete old files if they exist
        if (existingFiles && existingFiles.length > 0) {
          const { error: deleteError } = await supabase
            .storage
            .from('propuestas')
            .remove(existingFiles.map(file => file.name));

          if (deleteError) {
            console.error('Error deleting old files:', deleteError);
            throw new Error('Error al eliminar archivos antiguos');
          }
        }
      } catch (error) {
        console.error('Error handling existing files:', error);
        // Continue with upload even if cleanup fails
      }

      // Upload new PDF to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('propuestas')
        .upload(filename, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true // Changed to true for better reliability
        });

      if (uploadError) {
        console.error('Error de carga:', uploadError);
        throw new Error(`Error al subir el PDF: ${uploadError.message || 'Error desconocido en la carga'}`);
      }

      if (!uploadData) {
        throw new Error('Error: No se recibió confirmación de la carga del archivo');
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl }, error: urlError } = supabase
        .storage
        .from('propuestas')
        .getPublicUrl(filename);

      if (urlError) {
        console.error('Error getting public URL:', urlError);
        throw new Error('Error al obtener la URL del archivo');
      }

      // Update project table with the proposal URL
      const { error: updateError } = await supabase
        .from('proyecto')
        .update({ 
          propuesta: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (updateError) {
        console.error('Error de actualización:', updateError);
        throw new Error(`Error al actualizar el proyecto: ${updateError.message || 'Error desconocido en la actualización'}`);
      }

      toast({
        title: "¡Éxito!",
        description: "La propuesta se ha guardado y el PDF se ha generado correctamente",
        variant: "default",
      });
      
    } catch (error) {
      console.error('Error completo al guardar la propuesta:', error);
      
      // Determine the error message to show to the user
      let errorMessage = 'Error desconocido al guardar la propuesta';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Show error toast with more details
      toast({
        title: "Error al Guardar",
        description: errorMessage,
        variant: "destructive",
        duration: 5000, // Show for 5 seconds to ensure user sees it
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button 
      onClick={handleSaveProposal}
      disabled={isSaving}
      className="min-w-[150px]"
    >
      {isSaving ? (
        <span className="flex items-center gap-2">
          <span>Guardando...</span>
        </span>
      ) : (
        'Guardar Propuesta'
      )}
    </Button>
  );
}