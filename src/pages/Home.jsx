import { useEffect, useState } from "react";
import { API_URL } from "../config/api";

import ClubCard from "../components/ClubCard";
import axios from "axios";

const HomePage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/clubs`);
        setClubs(res.data);
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-solid border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (clubs.length === 0) {
    return <div className="py-10 text-center">No clubs found!</div>;
  }

  return (
    <div className="container mx-auto max-w-[92%] py-10">
      <div className="_list-cards grid grid-cols-6 gap-5">
        {clubs.map((club) => (
          <ClubCard key={club._id} club={club} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
