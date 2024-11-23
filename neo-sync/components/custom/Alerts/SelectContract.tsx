import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAutoScroller } from "@dnd-kit/core/dist/hooks/utilities";

export interface Contract {
  name: string;
  url: string;
}

interface SelectContractsProps {
  contracts: Contract[];
  onSelectionUpdate: (selectedValue: string) => Promise<void>;
  url: string | null;
}

export default function SelectContract({
  contracts,
  onSelectionUpdate,
  url,
}: SelectContractsProps) {
  const handleValueChange = async (value: string) => {
    try {
      await onSelectionUpdate(value);
    } catch (error) {
      console.error("Error updating selection:", error);
    }
  };

  return (
    <Select value={url || undefined} onValueChange={handleValueChange}>
      <SelectTrigger className="">
        <SelectValue placeholder="Selecciona un contrato" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Selecciona un contrato</SelectLabel>
          {contracts.map((contract) => (
            <SelectItem key={contract.url} value={contract.name}>
              {contract.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
