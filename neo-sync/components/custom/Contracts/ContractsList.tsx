"use client";

import React from "react";
import ContractCard from "./ContractCard";

export default function ContractsList() {
  return (
    <div className="flex flex-wrap gap-4 w-full justify-center">
      {[...Array(7)].map((_, index) => (
        <ContractCard key={index} />
      ))}
    </div>
  );
}
