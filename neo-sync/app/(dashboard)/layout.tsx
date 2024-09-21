
import React from "react";

import { Sidebar } from "../../components/global/sidebar";
import { Navbar } from "../../components/global/navbar";
import DynamicBreadcrumb from "../../components/global/dynamicbreadcrumb";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Navbar />
        <div className="pl-7 pt-5">
          <DynamicBreadcrumb capitalizeLinks={true} />
        </div>
        {children}
      </div>
    </div>
  );
}