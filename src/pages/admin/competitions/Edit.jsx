// src/pages/admin/competitions/Edit.jsx
import Loader from "@/components/Loader";
import { API_URL } from "@/config/api";
import { useAdminUI } from "@/contexts/AdminUIContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import CompetitionForm from "./Form";

export default function EditCompetitionPage() {
  const { slug } = useParams();
  const { setPageTitle } = useAdminUI();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setInitialValues(null);
    setPageTitle("Edit Competition");

    const fetchCompetition = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/competitions/${slug}`);
        const { name, level, continent, country } = res.data;

        setInitialValues({
          name,
          level,
          continent:
            country && country.continent ? country.continent : continent || "",
          country: country?._id || "",
        });
      } catch (err) {
        console.error("Failed to fetch competition:", err);
        toast.error("Failed to fetch competition");
      }
    };

    fetchCompetition();
  }, [slug, setPageTitle]);

  async function onSubmit(data, { reset, setSelectedContinent, setCountries }) {
    setLoading(true);
    if (!data.continent) delete data.continent;
    if (!data.country) delete data.country;
    try {
      await axios.put(`${API_URL}/api/competitions/${slug}`, data);
      reset();
      setSelectedContinent("");
      setCountries([]);
      navigate("/admin/competitions", {
        state: { success: "Competition Updated Successfully." },
      });
    } catch (err) {
      setLoading(false);
      if (
        err.response?.data?.error &&
        err.response.data.error.includes("already exists")
      ) {
        toast.error(
          "This competition name is already taken. Please choose another name.",
        );
      } else if (err.response?.data?.error) {
        console.log("test", err);
        toast.error("Server error: " + err.response.data.error);
      } else if (err.message) {
        toast.error("Client error: " + err.message);
      } else {
        toast.error("Update failed (unknown error)");
      }
    }
  }

  if (!initialValues || loading) return <Loader />;

  return (
    <CompetitionForm
      key={slug}
      onSubmit={onSubmit}
      initialValues={initialValues}
      mode="edit"
      loading={loading}
    />
  );
}
