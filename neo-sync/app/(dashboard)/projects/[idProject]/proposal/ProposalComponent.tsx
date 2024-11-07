"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import Container from "@/components/global/Container/Container";
import Header from "@/components/global/Container/Header";
import { Card, CardContent } from "@/components/ui/card";
import DownloadProposal from "./DownloadProposal";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ProjectInfo {
  nombre: string;
  descripcion: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}
//llamada a la api de requerimientos
interface Requirement {
  id: string;
  nombre: string;
  descripcion: string;
  esfuerzo_requerimiento?: number;
  tiempo_requerimiento?: number;
  costo_requerimiento?: number;
}

interface TextSelection {
  start: number;
  end: number;
  text: string;
}

interface FormattingOption {
  label: string;
  tone: string;
}

const typewriterEffect = async (
  text: string,
  callback: (current: string) => void,
  speed = 10
) => {
  let current = '';
  for (let i = 0; i < text.length; i++) {
    current += text[i];
    callback(current);
    await new Promise(resolve => setTimeout(resolve, speed));
  }
};

export default function ProposalComponent() {
  const params = useParams();
  const projectId = params?.idProject as string;
  
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [proposalText, setProposalText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [selection, setSelection] = useState<TextSelection | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [isTransforming, setIsTransforming] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedTone, setSelectedTone] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formattingOptions = [
    {
      value: "professional",
      label: "Professional",
      tone: "professional and formal",
    },
    {
      value: "technical",
      label: "Technical",
      tone: "technical and detailed",
    },
    {
      value: "friendly",
      label: "Friendly",
      tone: "friendly and approachable",
    },
    {
      value: "persuasive",
      label: "Persuasive",
      tone: "persuasive and compelling",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      // Fetch project info
      const { data: projectData, error: projectError } = await supabase
        .from("proyecto")
        .select("*")
        .eq("id", projectId)
        .single();

      if (projectError) {
        console.error("Error fetching project:", projectError);
        toast({
          title: "Error",
          description: "Failed to fetch project information",
          variant: "destructive",
        });
        return;
      }

      // Fetch requirements
      const { data: requirementsData, error: requirementsError } = await supabase
        .from("requerimiento")
        .select("*")
        .eq("proyecto_id", projectId);

      if (requirementsError) {
        console.error("Error fetching requirements:", requirementsError);
        toast({
          title: "Error",
          description: "Failed to fetch requirements",
          variant: "destructive",
        });
        return;
      }

      setProjectInfo(projectData);
      setRequirements(requirementsData);

      // Generate initial proposal text
      const initialProposal = generateProposalText(projectData, requirementsData);
      setProposalText(initialProposal);
      setIsLoading(false);
    };

    fetchData();
  }, [projectId]);

  const generateProposalText = (project: ProjectInfo, reqs: Requirement[]) => {
    const totalCost = reqs.reduce((sum, req) => sum + (req.costo_requerimiento || 0), 0);
    const totalEffort = reqs.reduce((sum, req) => sum + (req.esfuerzo_requerimiento || 0), 0);
    const totalTime = reqs.reduce((sum, req) => sum + (req.tiempo_requerimiento || 0), 0);

    return `
Propuesta de Proyecto: ${project.nombre}

Descripción del Proyecto:
${project.descripcion}

Requerimientos:
${reqs.map((req, index) => `
${index + 1}. ${req.nombre}
   Descripción: ${req.descripcion}
   Esfuerzo estimado: ${req.esfuerzo_requerimiento || 0} horas
   Tiempo estimado: ${req.tiempo_requerimiento || 0} días
   Costo estimado: $${req.costo_requerimiento || 0} USD
`).join('\n')}

Resumen de Estimaciones:
- Esfuerzo total: ${totalEffort} horas
- Tiempo total estimado: ${totalTime} días
- Costo total del proyecto: $${totalCost} USD

Fechas Importantes:
- Fecha de inicio propuesta: ${project.fecha_inicio || 'Por definir'}
- Fecha de finalización estimada: ${project.fecha_fin || 'Por definir'}
`;
  };

  const handleTextSelection = () => {
    console.log("Selection handler triggered");
    const selection = window.getSelection();
    console.log("Selection:", selection?.toString());
    
    if (!selection || selection.isCollapsed) {
      setSelection(null);
      setIsPopoverOpen(false);
      return;
    }

    // Get the selected text and its range
    const range = selection.getRangeAt(0);
    const text = selection.toString().trim();

    // Only proceed if there's actually text selected
    if (!text) {
      setSelection(null);
      setIsPopoverOpen(false);
      return;
    }

    // Get the position for the popover
    const rect = range.getBoundingClientRect();
    
    // Find the textarea element
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    // Get the selection start and end positions
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Update the position and selection states
    setPopoverPosition({
      top: rect.top + window.scrollY - 40, // Offset to position above the selection
      left: rect.left + window.scrollX,
    });

    setSelection({
      start,
      end,
      text,
    });
    setIsPopoverOpen(true);

    console.log("Selection state:", {
      text: selection?.toString(),
      start,
      end,
      position: { top: rect.top, left: rect.left },
      scrollY: window.scrollY,
      finalPosition: popoverPosition
    });
  };

  const handleFormatText = async () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selectedText = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );

    if (!selectedText || !customPrompt.trim()) {
      toast({
        title: "Warning",
        description: "Please select some text and enter a prompt",
        variant: "destructive",
      });
      return;
    }

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    setIsTransforming(true);
    setIsAnimating(true);
    try {
      const response = await fetch("/api/transform-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: selectedText,
          prompt: customPrompt,
        }),
      });

      // First check if the response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Then try to parse the JSON
      const data = await response.json().catch(() => {
        throw new Error("Failed to parse response from server");
      });

      // Validate the transformed text exists
      if (!data.transformedText) {
        throw new Error("No transformed text received from API");
      }

      // Log the response for debugging
      console.log("API Response:", data);

      // Animate the text replacement
      const beforeText = proposalText.substring(0, selectionStart);
      const afterText = proposalText.substring(selectionEnd);
      
      await typewriterEffect(
        data.transformedText,
        (current) => {
          setProposalText(beforeText + current + afterText);
        },
        10 // Speed of typing animation
      );

      toast({
        title: "Success",
        description: "Text transformed successfully",
      });
    } catch (error) {
      console.error("Error transforming text:", error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to transform text",
        variant: "destructive",
      });
    } finally {
      setIsTransforming(false);
      setIsAnimating(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header title={`Propuesta de Proyecto: ${projectInfo?.nombre || ''}`}>
        <DownloadProposal 
          proposalText={proposalText}
          projectName={projectInfo?.nombre || ''}
        />
      </Header>

      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex gap-4 mb-4">
            <Input
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your prompt (e.g., 'Make it more professional' or 'Simplify this')"
              className="flex-1"
            />

            <Button
              onClick={handleFormatText}
              disabled={isTransforming || !customPrompt.trim()}
              className="w-[150px]"
            >
              {isTransforming ? (
                <>
                  <span className="animate-spin mr-2">⚡</span>
                  {isAnimating ? "Typing..." : "Transforming..."}
                </>
              ) : (
                "Transform Text"
              )}
            </Button>
          </div>

          <Textarea
            ref={textareaRef}
            value={proposalText}
            onChange={(e) => setProposalText(e.target.value)}
            className={`min-h-[600px] w-full font-sans transition-all duration-200 ${
              isAnimating ? 'bg-gray-50' : ''
            }`}
            placeholder="Propuesta del proyecto..."
          />
        </CardContent>
      </Card>
    </Container>
  );
}