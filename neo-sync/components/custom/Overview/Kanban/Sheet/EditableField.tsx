// EditableField.tsx
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface NumberPopoverProps {
  numberValue: number;
  setNumberValue: (value: number) => void;
  label: string;
  icon: LucideIcon;
}

export function NumberPopover({
  numberValue,
  setNumberValue,
  label,
  icon: Icon,
}: NumberPopoverProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow empty string to handle deletion
    const inputValue = e.target.value;
    
    // If input is empty, set to 0 or you could set to empty string
    if (inputValue === '') {
      setNumberValue(0);
      return;
    }

    // Convert to number only if it's a valid number
    const value = parseFloat(inputValue);
    if (!isNaN(value)) {
      setNumberValue(value);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
          size="icon"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid grid-cols-[auto_auto_1fr] items-center gap-2">
          <Icon className="h-5 w-5" />
          <Label htmlFor="number-input">{label}</Label>
          <Input
            id="number-input"
            type="text" // Changed from 'number' to 'text'
            value={numberValue}
            onChange={handleInputChange}
            className="h-8"
            // Allow only numbers and decimal point
            onKeyPress={(e) => {
              if (!/[\d.]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface EditableFieldProps {
  icon: LucideIcon;
  title: string;
  unit: string;
  numberValue: number;
  setNumberValue: (value: number) => void;
}

export function EditableField({
  icon: Icon,
  title,
  unit,
  numberValue,
  setNumberValue,
}: EditableFieldProps) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-1">
        <Icon className="h-5 w-5" />
        <span>
          <strong>{title}:</strong> {numberValue} {unit}
        </span>
      </div>

      <NumberPopover
        numberValue={numberValue}
        setNumberValue={setNumberValue}
        label={title}
        icon={Icon}
      />
    </div>
  );
}