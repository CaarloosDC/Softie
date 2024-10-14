"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, SlidersHorizontal, ChevronDown } from "lucide-react";
import CustomSeparator from "@/components/custom/Overview/CustomSeparator";
import BlueButton from "@/components/custom/BlueButton";
import { NewContract } from "@/components/custom/Alerts/NewContract";
import ContractsList from "@/components/custom/Contracts/ContractsList";

export default function ContractsPage() {
  return (
    <div className="flex flex-col w-full gap-4 p-4 lg:gap-6 lg:p-6 mx-auto">
      {/* Header */}
      <div className="flex justify-between w-full">
        <h1 className="text-lg font-semibold md:text-2xl">Contratos Marco</h1>
        <div className="flex flex-row justify-between gap-3">
          <BlueButton text="Nuevo Contrato" icon={<Plus className="h-4 w-4" />}>
            <NewContract />
          </BlueButton>
          <Button
            variant="outline"
            className="bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300 rounded-md shadow-sm"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filtrar contratos
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bundle of main operations of the website */}
      <div className="flex flex-col gap-3 rounded-lg shadow-sm">
        <CustomSeparator />
        <ContractsList />
      </div>
    </div>
  );
}
