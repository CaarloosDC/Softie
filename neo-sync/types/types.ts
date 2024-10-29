import { LucideIcon } from 'lucide-react';

export interface Estimation {
  esfuerzo_requerimiento: number;
  tiempo_requerimiento: number;
  costo_requerimiento: number;
  requerimiento_id: string;
}

export interface EditableFieldProps {
  icon: LucideIcon;
  title: string;
  unit: string;
  numberValue: number;
  setNumberValue: (value: number) => void;
}