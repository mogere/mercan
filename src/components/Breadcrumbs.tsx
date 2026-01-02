"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (!pathname || pathname === "/" || pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    return null;
  }

  const pathSegments = pathname?.split("/").filter(Boolean) || [];

  const generateBreadcrumbLabel = (segment: string, index: number) => {
    const labels: Record<string, string> = {
      shop: "Shop",
      products: "Products",
      services: "Services",
      cart: "Shopping Cart",
      checkout: "Checkout",
      success: "Order Success",
      auth: "Authentication",
      login: "Login",
      register: "Register",
      dashboard: "Dashboard",
      admin: "Admin",
      orders: "Orders",
      appointments: "Appointments",
      profile: "Profile",
      customers: "Customers",
      new: "Add New",
      edit: "Edit",
      book: "Book Appointment",
    };

    if (labels[segment]) {
      return labels[segment];
    }

    if (!isNaN(Number(segment))) {
      return `#${segment}`;
    }

    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  };

  const buildHref = (index: number) => {
    return "/" + pathSegments.slice(0, index + 1).join("/");
  };

  return (
    <div className="hidden md:block bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center text-gray-600 hover:text-orange-600">
                  <Home className="w-4 h-4" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pathSegments.map((segment, index) => {
              const isCurrentPage = index === pathSegments.length - 1;
              const breadcrumbLabel = generateBreadcrumbLabel(segment, index);
              const breadcrumbHref = buildHref(index);

              return (
                <div key={segment + index} className="flex items-center">
                  <BreadcrumbSeparator>
                    <ChevronRight className="w-4 h-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    {isCurrentPage ? (
                      <BreadcrumbPage className="text-gray-900 font-medium">
                        {breadcrumbLabel}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={breadcrumbHref} className="text-gray-600 hover:text-orange-600">
                          {breadcrumbLabel}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
