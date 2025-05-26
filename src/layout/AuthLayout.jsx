import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Outlet />
      <Toaster theme="light" position="bottom-left" richColors />
    </div>
  );
}
