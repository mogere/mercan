"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Calendar,
  User,
  Menu,
  X,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Loader2 } from "lucide-react";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/dashboard/orders", icon: Package },
  { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=${pathname}`);
    }
  }, [status, router, pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Mercan Logo" width={40} height={40} />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Mercan
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <User className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {session.user.name || "User"}
                </p>
                <p className="text-xs text-gray-500">{session.user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 space-y-2">
            {session?.user?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center px-4 py-3 text-sm font-medium text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <ShieldCheck className="w-5 h-5 mr-3" />
                Admin Panel
              </Link>
            )}
            <Link
              href="/api/auth/signout"
              className="flex items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Mercan Logo" width={32} height={32} />
              <span className="ml-2 text-lg font-bold text-gray-900">
                Mercan
              </span>
            </Link>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
