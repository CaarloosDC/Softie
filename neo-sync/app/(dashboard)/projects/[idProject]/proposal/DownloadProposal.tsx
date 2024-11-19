"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import { Download } from "lucide-react";
import parse from 'html-react-parser';

interface DownloadProposalProps {
  proposalText: string;
  projectName: string;
}

export default function DownloadProposal({ proposalText, projectName }: DownloadProposalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const formatHtmlContent = (html: string, doc: jsPDF): Array<{ text: string, style?: string, color?: string }> => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    let formattedSegments: Array<{ text: string, style?: string, color?: string }> = [];

    const processNode = (node: Node): void => {
      if (node.nodeType === Node.TEXT_NODE) {
        formattedSegments.push({ text: node.textContent || '' });
        return;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const computedStyle = window.getComputedStyle(element);

        switch (element.tagName.toLowerCase()) {
          case 'strong':
          case 'b':
            formattedSegments.push({ 
              text: element.textContent || '',
              style: 'bold'
            });
            break;

          case 'span':
            // Handle color
            const color = computedStyle.color;
            if (color) {
              const rgb = color.match(/\d+/g);
              if (rgb) {
                formattedSegments.push({ 
                  text: element.textContent || '',
                  color: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
                });
              }
            }
            break;

          case 'p':
            Array.from(element.childNodes).forEach(processNode);
            formattedSegments.push({ text: '\n\n' });
            break;

          case 'br':
            formattedSegments.push({ text: '\n' });
            break;

          default:
            Array.from(element.childNodes).forEach(processNode);
        }
      }
    };

    processNode(temp);
    return formattedSegments;
  };

  const generatePDF = async (htmlContent: string): Promise<jsPDF> => {
    try {
      const doc = new jsPDF();
      
      // Configure PDF settings
      doc.setFont("helvetica");
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const titleMaxWidth = pageWidth - (margin * 2);
      let yPosition = 20;

      // Create a temporary div to parse HTML
      const temp = document.createElement('div');
      temp.innerHTML = htmlContent;

      const processTextNode = (node: Node, computedStyle: CSSStyleDeclaration) => {
        if (yPosition >= 270) {
          doc.addPage();
          yPosition = 20;
        }

        // Handle text styling
        const fontSize = parseInt(computedStyle.fontSize);
        doc.setFontSize(fontSize || 12);

        // Handle font weight
        const isBold = computedStyle.fontWeight === 'bold' || parseInt(computedStyle.fontWeight) >= 600;
        doc.setFont("helvetica", isBold ? "bold" : "normal");

        // Handle text color
        const color = computedStyle.color;
        if (color) {
          const rgb = color.match(/\d+/g);
          if (rgb) {
            doc.setTextColor(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
          }
        }

        // Handle text decoration
        const isUnderlined = computedStyle.textDecoration.includes('underline');
        if (isUnderlined) {
          const text = node.textContent || '';
          const textWidth = doc.getTextWidth(text);
          doc.text(text, margin, yPosition);
          doc.line(margin, yPosition + 1, margin + textWidth, yPosition + 1);
        } else {
          doc.text(node.textContent || '', margin, yPosition);
        }

        yPosition += 7;
      };

      const processElement = (element: Element, parentStyle?: CSSStyleDeclaration) => {
        const computedStyle = window.getComputedStyle(element);
        const tagName = element.tagName.toLowerCase();

        // Handle display style
        if (computedStyle.display === 'none') return;

        // Handle margins and spacing
        const marginBottom = parseInt(computedStyle.marginBottom);
        if (marginBottom) yPosition += marginBottom / 10; // Convert pixels to appropriate PDF units

        switch (tagName) {
          case 'h2':
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            break;
          case 'h3':
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            break;
          case 'strong':
          case 'b':
            doc.setFont("helvetica", "bold");
            break;
          case 'em':
          case 'i':
            // Handle italic if needed
            break;
        }

        // Process child nodes
        element.childNodes.forEach(child => {
          if (child.nodeType === Node.TEXT_NODE) {
            processTextNode(child, computedStyle);
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            processElement(child as Element, computedStyle);
          }
        });

        // Reset styles after processing children
        if (parentStyle) {
          const fontSize = parseInt(parentStyle.fontSize);
          doc.setFontSize(fontSize || 12);
          doc.setFont("helvetica", parentStyle.fontWeight === 'bold' ? "bold" : "normal");
          
          const rgb = parentStyle.color.match(/\d+/g);
          if (rgb) {
            doc.setTextColor(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]));
          }
        } else {
          // Reset to defaults
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0);
        }

        // Handle spacing after element
        switch (tagName) {
          case 'p':
            yPosition += 7;
            break;
          case 'h2':
            yPosition += 10;
            break;
          case 'h3':
            yPosition += 8;
            break;
          case 'div':
            yPosition += 5;
            break;
        }
      };

      // Process all root elements
      Array.from(temp.children).forEach(element => {
        processElement(element);
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
      if (!stripHtml(proposalText).trim()) {
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