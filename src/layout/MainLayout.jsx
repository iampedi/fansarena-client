// src/layout/MainLayout.jsx
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-5">
        <Outlet />
      </main>
      <Toaster theme="light" position="bottom-left" richColors />
      <Footer />
    </div>
  );
}
