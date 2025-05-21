// src/pages/Home.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import ClubCard from "../components/ClubCard";
import { API_URL } from "../config/api";

const HomePage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClubs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/clubs`);
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
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-solid border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="py-10 text-center text-red-600">{error}</div>;
  }

  if (clubs.length === 0) {
    return <div className="py-10 text-center">No clubs found!</div>;
  }

  return (
    <div className="container mx-auto py-5">
      <div className="_list-cards grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {clubs.map((club) => (
          <ClubCard key={club._id} club={club} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
