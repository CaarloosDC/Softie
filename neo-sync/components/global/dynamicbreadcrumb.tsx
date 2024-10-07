"use client";

import React, { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter to handle routing
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
  const router = useRouter(); // Get the router instance
  const pathNames = paths.split("/").filter((path) => path);

  const handleClick = (href: string) => {
    router.push(href); // Use router.push for smooth navigation
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            // Use button to prevent anchor behavior
            onClick={() => handleClick("/")} // Use router push to navigate
            className="flex items-center dark:text-gray-300 cursor-pointer"
          >
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
                  <BreadcrumbPage className="dark:text-white">
                    {itemLink}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    // Use button to prevent anchor behavior
                    onClick={() => handleClick(href)} // Use router.push for navigation
                    className="dark:text-gray-300 cursor-pointer"
                  >
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
  );
}
