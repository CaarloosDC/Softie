"use client";

import React from "react";

import Config from "@/components/custom/Config/Config";

import BlueButton from "@/components/custom/BlueButton";
import { AddUser } from "@/components/custom/Alerts/AddUser";
import { UserPlus } from "lucide-react";
import CustomSeparator from "@/components/custom/Overview/CustomSeparator";
import Header from "@/components/global/Container/Header";
import Container from "@/components/global/Container/Container";

export default function ProjectsPage() {
  const handleAddUser = async (userData: any) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response:", errorData);
        throw new Error(
          `Failed to add user: ${response.status} ${response.statusText}`
        );
      }

      const newUser = await response.json();
      console.log("New user added:", newUser);
      return true;
    } catch (error) {
      throw error;
    }
    return false;
  };

  //* Use parent container to render title and content
  return (
    <Container>
      <Header title="Roles">
        <BlueButton
          text="Agregar Usuario"
          icon={<UserPlus className="h-4 w-4" />}
        >
          <AddUser onSubmit={handleAddUser} />
        </BlueButton>
      </Header>

      {/* Content */}
      <Config />
    </Container>
  );
}
