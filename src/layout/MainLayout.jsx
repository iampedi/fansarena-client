// src/layout/MainLayout.jsx
import { cn } from "@/lib/utils";
import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import Footer from "./Footer";
import Header from "./Header";
//  UI Imports
import { Toaster } from "@/components/ui/sonner";
import { CircleFadingArrowUp } from "lucide-react";

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        className={cn(
          "flex h-full flex-1 flex-col",
          location.pathname === "/" ? "pb-5 md:pb-10" : "py-5 md:py-10",
        )}
      >
        <Outlet />
      </main>
      <Toaster theme="light" position="bottom-left" richColors />
      <ScrollToTop
        className="!right-2 !bottom-2 flex items-center justify-center !rounded-full !bg-transparent text-gray-400 !shadow-none duration-300 hover:text-black"
        top={750}
        smooth
        component={<CircleFadingArrowUp size={30} />}
      />
      <Footer />
    </div>
  );
}
