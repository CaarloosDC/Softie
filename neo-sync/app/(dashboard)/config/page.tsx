"use client";

import React from "react";

import Config from "@/components/custom/Config/Config";

import BlueButton from "@/components/custom/BlueButton";
import { AddUser } from "@/components/custom/Alerts/AddUser";
import { UserPlus } from "lucide-react";
import CustomSeparator from "@/components/custom/Overview/CustomSeparator";

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

      toast({
        title: "User added",
        description: "The new user has been successfully added.",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "There was a problem adding the user.",
      });
    }
  };

  return (
    //* Shows main component
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      {/* This is the header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>

        <BlueButton
          text="Agregar Usuario"
          icon={<UserPlus className="h-4 w-4" />}
        >
          <AddUser onSubmit={handleAddUser} />
        </BlueButton>
      </div>
      <CustomSeparator />
      {/* This shows the config */}
      <div>
        <Config />
      </div>
    </div>
  );
}

function toast(arg0: { title: string; description: string }) {
  throw new Error("Function not implemented.");
}
