// src/layout/MainLayout.jsx
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";

export default function MainLayout() {
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        search={search}
        setSearch={setSearch}
        show={show}
        setShow={setShow}
      />
      <main className="flex h-full flex-1 py-5">
        <Outlet context={{ search, setSearch, show }} />
      </main>
      <Toaster theme="light" position="bottom-left" richColors />
      <Footer />
    </div>
  );
}
