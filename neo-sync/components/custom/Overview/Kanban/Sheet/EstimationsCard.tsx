import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Eye, Dumbbell, DollarSign, Clock } from "lucide-react"; // Importing lucide-react icons
import CustomSeparator from "../../CustomSeparator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EditableField } from "./EditableField";

export function EstimationsCard() {
  const [isEditing, setIsEditing] = useState(false); // State to toggle between edit/view

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  //* Variable that shows effort
  const [effort, setEffort] = useState(40);
  const [cost, setCost] = useState(460);
  const [time, setTime] = useState(2);

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Estimaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <CustomSeparator />
        <div className="flex flex-col gap-2 mt-2">
          <EditableField
            icon={Dumbbell}
            title="Esfuerzo"
            unit="horas"
            numberValue={effort}
            setNumberValue={setEffort}
          />
          <EditableField
            icon={DollarSign}
            title="Costo"
            unit="USD"
            numberValue={cost}
            setNumberValue={setCost}
          />
          <EditableField
            icon={Clock}
            title="Tiempo"
            unit="días"
            numberValue={time}
            setNumberValue={setTime}
          />
        </div>
      </CardContent>
      {isEditing && (
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={toggleEdit}>
            Guardar
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
