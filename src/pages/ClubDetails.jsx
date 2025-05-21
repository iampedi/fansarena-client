// src/pages/ClubDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../config/api";
import axios from "axios";

const ClubDetails = () => {
  const { slug } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchClub = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/clubs/${slug}`);
        if (response.data) {
          setClub(response.data);
        } else {
          setError("Club not found.");
          setClub(null);
        }
      } catch (err) {
        console.error("Failed to fetch club:", err);
        setError("Failed to load club details.");
        setClub(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [slug]);

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

  if (!club) {
    return null;
  }

  return (
    <div className="_club-details">
      <div className="container mx-auto max-w-5xl py-10">
        <img src={club.logoUrl} alt={club.name} className="mb-4 h-24" />
        <h1 className="mb-4 text-2xl font-bold capitalize">{club.name}</h1>
        {club.description && <p className="mb-6">{club.description}</p>}

        {club.country.continent && (
          <p className="text-gray-600">
            <span className="font-semibold">Continent:</span>{" "}
            <span className="capitalize">{club.country.continent}</span>
          </p>
        )}
        {club.country && (
          <p className="text-gray-600">
            <span className="font-semibold">Country:</span>{" "}
            <span className="capitalize">{club.country.name}</span>
          </p>
        )}
        {club.city && (
          <p className="text-gray-600">
            <span className="font-semibold">City:</span>{" "}
            <span className="capitalize">{club.city}</span>
          </p>
        )}
        {club.founded && (
          <p className="text-gray-600">
            <span className="font-semibold">Founded:</span> {club.founded}
          </p>
        )}
        {club.arena && (
          <p className="text-gray-600">
            <span className="font-semibold">Arena:</span>{" "}
            <span className="capitalize">{club.arena}</span>
          </p>
        )}
        {club.website && (
          <p className="text-gray-600">
            <a href={club.website} target="_blank">
              Official Website
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default ClubDetails;
