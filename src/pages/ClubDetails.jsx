import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../config/api";
import axios from "axios";

const ClubDetails = () => {
  const { slug } = useParams();
  const [club, setClub] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    axios
      .get(`${API_URL}/api/clubs?slug=${slug}`)
      .then((response) => {
        if (response.data.length > 0) {
          setClub(response.data[0]);
        } else {
          setClub(null);
        }
      })
      .catch((error) => {
        console.log("Error Message:", error);
        setClub(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="text-center py-10">Loading club details...</div>;
  }

  if (club === null) {
    return (
      <div className="text-center py-10 text-red-600">Club not found.</div>
    );
  }

  return (
    <div className="_club-details">
      <div className="container max-w-5xl mx-auto py-10">
        <p>Details of {club.name}</p>
        <p>{club.description}</p>
      </div>
    </div>
  );
};

export default ClubDetails;
