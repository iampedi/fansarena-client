// src/pages/Home.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../config/api";
import { useOutletContext } from "react-router-dom";

import Loader from "@/components/Loader";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import ClubCard from "../components/ClubCard";

const HomePage = () => {
  const [clubs, setClubs] = useState([]);
  const { search, setSearch, setShow } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setTimeout(() => {
        toast.success(location.state.message);
        window.history.replaceState({}, document.title, "/");
      }, 100);
    }
  }, [location.state]);

  const fetchClubs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/clubs`, {
        params: {
          search,
        },
      });
      setClubs(res.data);
    } catch (err) {
      setError("Could not load clubs. Please try again later.");
      console.error("Failed to fetch clubs:", err);
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [search]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="w-full py-10 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="3xl:px-0 container mx-auto px-4 md:py-5">
      {clubs.length === 0 && <div className="text-center">No clubs found!</div>}

      <div className="_list-cards grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {[...clubs]
          .sort((a, b) => a.name?.localeCompare(b.name))
          .map((club, i) => (
            <ClubCard
              key={i}
              club={club}
              setSearch={setSearch}
              setShow={setShow}
            />
          ))}
      </div>
    </div>
  );
};

export default HomePage;
