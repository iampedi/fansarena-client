// src/layout/AdminHeader.jsx
import AdminBreadcrumb from "@/components/AdminBreadcrumb";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAdminUI } from "@/contexts/AdminUIContext";
import { GlobeIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminHeader() {
  const { pageTitle } = useAdminUI();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="cursor-pointer" />
      <Separator orientation="vertical" className="mr-3 ml-1.5 h-4" />
      <div className="w-f flex w-full items-center justify-between gap-6">
        <h1 className="flex-1 text-lg font-semibold">{pageTitle}</h1>
        <AdminBreadcrumb />

        <div className="flex gap-2">
          <Button asChild>
            <Link to="/">
              <GlobeIcon />
            </Link>
          </Button>
          <LogoutButton icon={true} />
        </div>
      </div>
    </header>
  );
}
