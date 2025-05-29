// src/layout/MainLayout.jsx
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import ScrollToTop from "react-scroll-to-top";
import { ArrowBigUpDash, CircleFadingArrowUp } from "lucide-react";

export default function MainLayout() {
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        search={search}
        setSearch={setSearch}
        show={show}
        setShow={setShow}
      />
      <main
        className={cn(
          "flex h-full flex-1 flex-col",
          location.pathname === "/" ? "pb-5 md:pb-10" : "py-5 md:py-10",
        )}
      >
        <Outlet context={{ search, setSearch, show, setShow }} />
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
