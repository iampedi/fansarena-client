// src/contexts/AdminUIContext.jsx
import { createContext, useContext, useState } from "react";

const AdminUIContext = createContext();

export function AdminUIProvider({ children }) {
  const [pageTitle, setPageTitle] = useState("");

  return (
    <AdminUIContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </AdminUIContext.Provider>
  );
}

export function useAdminUI() {
  return useContext(AdminUIContext);
}
