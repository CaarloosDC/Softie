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

export interface Contract {
  name: string;
  url: string;
}

interface SelectContractsProps {
  contracts: Contract[];
  onSelectionUpdate: (selectedValue: string) => Promise<void>;
}

export default function SelectContract({
  contracts,
  onSelectionUpdate,
}: SelectContractsProps) {
  const handleValueChange = async (value: string) => {
    try {
      await onSelectionUpdate(value);
    } catch (error) {
      console.error("Error updating selection:", error);
    }
  };

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger className="">
        <SelectValue placeholder="Selecciona un contrato" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Selecciona un contrato</SelectLabel>
          {contracts.map((contract, index) => (
            <SelectItem
              key={index}
              value={contract.url} // Use URL as the value
            >
              {contract.name} {/* Display the name */}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
