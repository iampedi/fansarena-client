// src/pages/admin/competitions/New.jsx
import { API_URL } from "@/config/api";
import { useAdminUI } from "@/contexts/AdminUIContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CompetitionForm from "./Form";
import Loader from "@/components/Loader";

export default function NewCompetitionPage() {
  const { setPageTitle } = useAdminUI();
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    setPageTitle("Create New Competition");
  }, [setPageTitle]);

  async function onSubmit(data, { reset, setSelectedContinent, setCountries }) {
    setLoading(true);
    try {
      const cleanData = {};
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined && v !== "") cleanData[k] = v;
      });

      await axios.post(`${API_URL}/api/competitions`, cleanData);
      reset();
      setSelectedContinent("");
      setCountries([]);
      navigate("/admin/competitions", {
        state: { success: "Competition Created Successfully." },
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Submission failed.");
      setLoading(false);
    }
  }

  if (Loading) {
    return <Loader />;
  }

  return (
    <div className="relative">
      <CompetitionForm
        onSubmit={onSubmit}
        initialValues={{ name: "", level: "", continent: "", country: "" }}
        mode="create"
        loading={Loading}
      />
    </div>
  );
}
