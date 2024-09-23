"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type TBreadCrumbProps = {
  homeElement?: ReactNode;
  separator?: ReactNode;
  capitalizeLinks?: boolean;
};

export default function DynamicBreadcrumb({
  homeElement = <Home className="h-4 w-4" />,
  separator = <ChevronRight className="h-4 w-4" />,
  capitalizeLinks = false,
}: TBreadCrumbProps) {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center">
            {homeElement}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathNames.length > 0 && (
          <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
        )}
        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathNames.length - 1;
          const itemLink = capitalizeLinks
            ? link[0].toUpperCase() + link.slice(1)
            : link;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{itemLink}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{itemLink}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
