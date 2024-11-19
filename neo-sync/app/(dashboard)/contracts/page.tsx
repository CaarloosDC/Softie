"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, SlidersHorizontal, ChevronDown } from "lucide-react";
import CustomSeparator from "@/components/custom/Overview/CustomSeparator";
import BlueButton from "@/components/custom/BlueButton";
import { NewContract } from "@/components/custom/Alerts/NewContract";
import ContractsList from "@/components/custom/Contracts/ContractsList";
import Container from "@/components/global/Container/Container";
import Header from "@/components/global/Container/Header";

export default function ContractsPage() {
  //* Use parent container to render title and content
  return (
    <Container>
      <Header title="Contratos Marco">
        <BlueButton text="Nuevo Contrato" icon={<Plus className="h-4 w-4" />}>
          <NewContract
            onSuccess={() => {
              window.location.reload();
            }}
          />
        </BlueButton>
      </Header>

      {/* Content */}
      <ContractsList />
    </Container>
  );
}
