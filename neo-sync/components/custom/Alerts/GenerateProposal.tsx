"use client";

import {
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Wand2Icon,
  FileText,
  List,
  Target,
  Hourglass,
  DollarSign,
} from "lucide-react";
import { ReactNode } from "react";

export default function GenerateProposal() {
  const alerts = [
    "Insuficientes recursos para cumplir la meta establecida.",
    "El presupuesto actual rebasa el límite establecido por el cliente.",
    "El desarrollador Sebastian tendrá vacaciones durante el proyecto.",
    "Debes de asignar un project manager al proyecto.",
  ];

  return (
    <>
      {/* Header */}
      <AlertDialogHeader className="text-center">
        <AlertDialogTitle className="text-xl font-bold">
          Resumen Propuesta
        </AlertDialogTitle>
      </AlertDialogHeader>

      {/* Content */}
      <AlertDialogDescription className="space-y-2 mt-1">
        {/* Summary Section */}
        <div className="space-y-2">
          <AlertDialogTitle className="text-xl font-bold">
            Resumen
          </AlertDialogTitle>
          <SummaryItem
            icon={<List className="w-3 h-3" />}
            title="Requerimientos totales:"
            content="120"
          />
          <SummaryItem
            icon={<Target className="w-3 h-3" />}
            title="Estimación de esfuerzo:"
            content="360 puntos"
          />
          <SummaryItem
            icon={<Hourglass className="w-3 h-3" />}
            title="Tiempo estimado:"
            content="6 meses"
          />
          <SummaryItem
            icon={<DollarSign className="w-3 h-3" />}
            title="Costo estimado:"
            content="$1,350,980.00 MXN"
          />
        </div>
        <Separator />
        {/* Alerts Section */}
        <div className="space-y-2">
          <AlertDialogTitle className="text-xl font-bold text-red-500">
            Alertas
          </AlertDialogTitle>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex justify-start items-center space-x-2 text-sm text-red-500 bg-red-50 p-2 rounded-md"
              >
                <AlertCircle className="w-3 h-3 mt-0.5" />
                <span>{alert}</span>
              </div>
            ))}
          </div>
        </div>
        {/* AI Button */}
        <Button
          variant="default"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          <Wand2Icon className="w-4 mr-1" />
          Solucionar con inteligencia artificial
        </Button>
      </AlertDialogDescription>

      <Separator />

      {/* Footer Section for create/cancel buttons */}
      <AlertDialogFooter className="flex flex-col">
        <AlertDialogCancel className="w-1/2">Cerrar</AlertDialogCancel>
        <AlertDialogAction className="w-1/2 bg-gray-800 hover:bg-gray-700 text-white rounded-md">
          <FileText className="w-3 h-3" />
          Generar propuesta
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}

// * The component below is only used in the main component of this code. Thats why is only declared here
interface SummaryItemProps {
  icon: ReactNode;
  title: string;
  content: string | number;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ icon, title, content }) => {
  return (
    <div className="flex justify-between text-sm bg-gray-100 p-2 rounded-md">
      <div className="flex gap-2 items-center">
        {icon}
        <span className="text-gray-600">{title}</span>
      </div>
      <span className="font-semibold">{content}</span>
    </div>
  );
};
