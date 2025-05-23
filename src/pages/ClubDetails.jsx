// src/pages/ClubDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../config/api";
import axios from "axios";
import ItemLogo from "@/components/ItemLogo";

const ClubDetails = () => {
  const { slug } = useParams();
  const [club, setClub] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. گرفتن اطلاعات club
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

  // 2. گرفتن competitions بعد از setClub
  useEffect(() => {
    if (!club) return;

    const fetchCompetitions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/competitions`);
        // فرض بر اینه که هر competition یک آرایه winners داره و هر winner یک club داره
        const filteredCompetitions = res.data.filter(
          (competition) =>
            competition.winners &&
            competition.winners.some(
              (winner) => winner.club && winner.club.slug === club.slug,
            ),
        );
        setCompetitions(filteredCompetitions);
        console.log(filteredCompetitions);
      } catch (err) {
        console.error("Failed to fetch competitions:", err);
      }
    };

    fetchCompetitions();
  }, [club]);

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
    <div className="_club-details flex">
      <div className="container mx-auto w-1/2 max-w-5xl py-10">
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

      <div className="w-1/2">
        <h2>Trophies</h2>
        {competitions.length > 0 ? (
          competitions.map((competition) => {
            const clubWinners = competition.winners.filter(
              (w) => w.club.slug === slug,
            );

            return (
              <div key={competition._id} className="mt-10 mb-4">
                <h3 className="mb-4 flex items-center gap-3 border-b pb-2 text-lg font-bold uppercase">
                  <img className="w-10" src={competition.logoUrl} alt={competition.name} />
                  {competition.name}
                  <span className="flex aspect-square h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 font-medium text-gray-400">
                    {clubWinners.length}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-x-3 gap-y-6">
                  {clubWinners.map((winner) => (
                    <div key={winner._id} className="text-gray-600">
                      <div>
                        <ItemLogo
                          size={70}
                          logoUrl={`/images/competitions/${competition.slug}-trophy.webp`}
                          name={competition.name}
                          type="competition"
                        />
                      </div>
                      <p className="mt-1 text-center font-extrabold capitalize">
                        {winner.year}
                      </p>
                      {winner.rank !== "1st" && (
                        <p className="capitalize">{winner.rank}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-600">No trophies found for this club.</p>
        )}
      </div>
    </div>
  );
};

export default ClubDetails;
