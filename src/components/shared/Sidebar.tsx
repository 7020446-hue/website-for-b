"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Box,
  ClipboardList,
  FileText,
  Ticket,
  LogOut,
  User,
  Settings,
  ChevronRight,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(true);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const adminMenuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Box },
    { label: "Requests", href: "/admin/requests", icon: ClipboardList },
    { label: "Invoices", href: "/admin/invoices", icon: FileText },
    { label: "Tickets", href: "/admin/tickets", icon: Ticket },
  ];

  const customerMenuItems = [
    { label: "Dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/products", icon: Box },
    { label: "My Requests", href: "/customer/requests", icon: ClipboardList },
    { label: "My Invoices", href: "/customer/invoices", icon: FileText },
    { label: "My Tickets", href: "/customer/tickets", icon: Ticket },
  ];

  const menuItems = isAdmin ? adminMenuItems : customerMenuItems;

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-slate-900 text-white transition-all duration-300 shadow-xl",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-800">
        <div
          className={cn(
            "font-bold text-xl truncate bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent",
            !isOpen && "hidden"
          )}
        >
          SaaSManager
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded hover:bg-slate-800"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Profile Summary */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3 overflow-hidden">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
          <User className="w-6 h-6" />
        </div>
        {isOpen && (
          <div className="truncate">
            <div className="font-medium text-sm">{session?.user?.name || "User"}</div>
            <div className="text-xs text-slate-400">
              {isAdmin ? "Administrator" : "Customer"}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors group relative",
              pathname.startsWith(item.href)
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            {!isOpen && (
              <div className="absolute left-14 bg-slate-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
            {pathname.startsWith(item.href) && isOpen && (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 space-y-1">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors group relative"
          )}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {isOpen && <span className="text-sm">Settings</span>}
        </Link>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors w-full group relative"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isOpen && <span className="text-sm">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
