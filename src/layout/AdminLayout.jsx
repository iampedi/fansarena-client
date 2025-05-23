// src/layout/AdminLayout.jsx
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { AdminUIProvider } from "@/contexts/AdminUIContext";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout() {
  return (
    <AdminUIProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="bg-sidebar max-h-screen overflow-hidden p-3">
          <div className="border-sidebar-border flex min-h-[calc(100vh-24px)] flex-col rounded-xl border bg-white">
            <AdminHeader />
            <div className="h-full overflow-auto p-4">
              <Outlet />
            </div>
          </div>
          <Toaster theme="light" position="bottom-left" richColors />
        </SidebarInset>
      </SidebarProvider>
    </AdminUIProvider>
  );
}
