import React from "react";
import { Sidebar } from "@/components/global/sidebar";
import { NavbarWrapper } from "@/components/global/navbar-wrapper";
import DynamicBreadcrumb from "@/components/global/dynamicbreadcrumb";
import Chatbot from "@/components/global/chatbot";

// Componente de layout para el dashboard
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <ContentArea>
        {/* Uso de NavbarWrapper en lugar de Navbar */}
        <NavbarWrapper />
        <BreadcrumbSection />
        {children}
        <ChatbotSection />
      </ContentArea>
    </div>
  );
};

// Componente para la sección del contenido principal
const ContentArea: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col">{children}</div>
);

// Sección del breadcrumb
const BreadcrumbSection: React.FC = () => (
  <div className="pl-7 pt-5">
    <DynamicBreadcrumb capitalizeLinks={true} />
  </div>
);

// Sección del chatbot
const ChatbotSection: React.FC = () => (
  <div className="fixed bottom-4 z-50">
    <Chatbot />
  </div>
);

export default DashboardLayout;
