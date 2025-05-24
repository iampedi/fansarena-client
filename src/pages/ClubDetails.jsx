// src/pages/ClubDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../config/api";
import axios from "axios";
import ItemLogo from "@/components/ItemLogo";
import { BuildingIcon, GlobeIcon } from "lucide-react";

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
    <div className="_club-details container mx-auto mb-10 flex flex-col gap-10 px-5 lg:flex-row 2xl:max-w-7xl 2xl:px-0">
      <div className="lg:w-1/2">
        <div className="flex flex-col gap-5 rounded-xl border-2 border-gray-200/50 bg-gray-50/50 px-5 py-8 lg:flex-row">
          <ItemLogo
            logoUrl={club.logoUrl}
            name={club.name}
            type="club"
            size={128}
          />
          <div className="flex flex-col justify-center text-lg">
            <h1 className="text-4xl font-extrabold capitalize">{club.name}</h1>
            <p className="my-4 flex flex-wrap items-center gap-2 font-medium text-gray-600 capitalize">
              <BuildingIcon
                className="text-gray-500"
                style={{ width: "24px", height: "24px" }}
              />
              <span>{club.country.continent},</span>
              <span>{club.country.name},</span>
              <span>{club.city}</span>
            </p>

            {club.founded && (
              <p className="mb-1 font-semibold text-gray-700 lg:mb-0">
                <span>Founded in</span> {club.founded}
              </p>
            )}
            {club.arena && (
              <p className="font-semibold text-gray-700">
                <span className="">Arena:</span>{" "}
                <span className="capitalize">{club.arena}</span>
              </p>
            )}
            {club.website && (
              <p className="udner mt-4 flex items-center gap-1 text-blue-800">
                <GlobeIcon style={{ width: "20px", height: "20px" }} />
                <a href={club.website} target="_blank">
                  Official Website
                </a>
              </p>
            )}
            {club.description && <p className="mb-6">{club.description}</p>}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-12 lg:w-1/2">
        {competitions.length > 0 ? (
          [...competitions]
            .sort((a, b) => b.winners.length - a.winners.length)
            .map((competition) => {
              const clubWinners = competition.winners.filter(
                (w) => w.club.slug === slug,
              );

              return (
                <div key={competition._id}>
                  <div className="_header mb-6 flex items-center justify-between border-b pb-3 lg:px-2">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <ItemLogo
                        logoUrl={`/images/competitions/${competition.slug}-symbol.webp`}
                        name={competition.name}
                        type="competition"
                        size={36}
                      />
                      <h3 className="font-bold uppercase lg:text-lg">
                        {competition.name}
                      </h3>
                    </div>
                    <span className="flex aspect-square h-9 w-9 items-center justify-center rounded-full border border-gray-200/50 bg-gray-100">
                      {clubWinners.length}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-5 lg:gap-6">
                    {clubWinners.map((winner) => (
                      <div key={winner._id} className="text-gray-600">
                        <div>
                          <ItemLogo
                            size={64}
                            logoUrl={`/images/competitions/${competition.slug}-trophy.webp`}
                            name={competition.name}
                            type="competition"
                          />
                        </div>
                        <p className="mt-1.5 text-center font-bold capitalize">
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
