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
  homeElement = <Home className="h-4 w-4 dark:text-white" />,
  separator = <ChevronRight className="h-4 w-4 dark:text-gray-400" />,
  capitalizeLinks = false,
}: TBreadCrumbProps) {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center dark:text-gray-300">
            {homeElement}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathNames.length > 0 && (
          <BreadcrumbSeparator className="dark:text-gray-400">
            {separator}
          </BreadcrumbSeparator>

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
                  <BreadcrumbPage className="dark:text-white">{itemLink}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href} className="dark:text-gray-300">
                    {itemLink}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className="dark:text-gray-400">
                  {separator}
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
  );
}
