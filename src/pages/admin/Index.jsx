// src/pages/admin/Index.jsx
import { useAdminUI } from "@/contexts/AdminUIContext";
import { useEffect } from "react";

import ClubsChart from "../components/ClubsChart";
import CompetitionsChart from "../components/CompetitionsChart";
import FansChart from "../components/FansChart";
import TrophiesChart from "../components/TrophiesChart";

export default function AdminPage() {
  const { setPageTitle } = useAdminUI();

  useEffect(() => {
    setPageTitle("Dashboard");
  }, []);

  return (
    <div className="grid gap-5 md:grid-cols-4">
      <ClubsChart />
      <CompetitionsChart />
      <FansChart />
      <TrophiesChart />
    </div>
  );
}
