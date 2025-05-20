// src/layout/AdminHeader.jsx
import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAdminUI } from "@/contexts/AdminUIContext";
import { Link } from "react-router-dom";

export default function AdminHeader() {
  const { pageTitle } = useAdminUI();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="cursor-pointer" />
      <Separator orientation="vertical" className="mr-3 ml-1.5 h-4" />
      <div className="w-f flex w-full items-center justify-between">
        <h1 className="text-lg font-semibold">{pageTitle}</h1>
        <AdminBreadcrumb />
      </div>
    </header>
  );
}
