"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import { Download } from "lucide-react";

interface DownloadProposalProps {
  proposalText: string;
  projectName: string;
}

export default function DownloadProposal({ proposalText, projectName }: DownloadProposalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async (text: string): Promise<jsPDF> => {
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
        yPosition += 10;
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
      
      return doc;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Error al generar el PDF. Por favor, revise el contenido del documento.');
    }
  };

  const handleDownloadProposal = async () => {
    try {
      setIsGenerating(true);

      // Validate inputs
      if (!proposalText.trim()) {
        throw new Error('El contenido de la propuesta no puede estar vacío');
      }

      // Generate PDF
      const doc = await generatePDF(proposalText);
      
      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `propuesta_${projectName.toLowerCase().replace(/\s+/g, '_')}_${timestamp}.pdf`;
      
      // Save the PDF
      doc.save(filename);

      toast({
        title: "¡Éxito!",
        description: "La propuesta se ha descargado correctamente",
        variant: "default",
      });
      
    } catch (error) {
      console.error('Error al generar la propuesta:', error);
      
      let errorMessage = 'Error desconocido al generar la propuesta';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={handleDownloadProposal}
      disabled={isGenerating}
      className="min-w-[150px] gap-2"
    >
      {isGenerating ? (
        <span className="flex items-center gap-2">
          <span>Generando...</span>
        </span>
      ) : (
        <>
          <Download size={16} />
          <span>Descargar Propuesta</span>
        </>
      )}
    </Button>
  );
}