// src/pages/admin/Index.jsx
import { useAdminUI } from "@/contexts/AdminUIContext";
import { useEffect } from "react";

export default function AdminPage() {
  const { setPageTitle } = useAdminUI();

  useEffect(() => {
    setPageTitle("Dashboard");
  }, []);

  return <div></div>;
}
