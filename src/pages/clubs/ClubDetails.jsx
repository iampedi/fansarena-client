// src/pages/clubs/ClubDetails.jsx
import { API_URL } from "@/config/api";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// UI Imports
import ItemLogo from "@/components/ItemLogo";
import Loader from "@/components/Loader";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import BeFanDialog from "@/pages/clubs/BeFanDialog";
import {
  CrownIcon,
  GlobeIcon,
  LinkIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";

const ClubDetailsPage = () => {
  const auth = useAuth();
  const { slug } = useParams();
  const [club, setClub] = useState(null);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ---------- Fetch Club ---------- */
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

  /* ---------- Fetch Competitions ---------- */
  useEffect(() => {
    if (!club) return;

    const fetchCompetitions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/competitions`);
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
    return <Loader />;
  }

  if (error) {
    return <div className="py-10 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="_club-details container mx-auto flex flex-col gap-10 px-4 lg:flex-row 2xl:max-w-7xl 2xl:px-0">
      <div className="lg:w-1/2">
        <div
          className={cn(
            "flex flex-col flex-wrap gap-8 rounded-xl border-2 p-8 lg:flex-row",
            auth.user?.favoriteClub === slug
              ? "border-yellow-500/50 bg-yellow-50/50"
              : "border-gray-200/50 bg-gray-50/50",
          )}
        >
          <ItemLogo
            logoUrl={club.logoUrl}
            name={club.name}
            type="club"
            size={128}
          />
          <div className="flex w-full flex-1 shrink-0 flex-col justify-center gap-5 text-lg">
            <h1
              className={cn(
                "text-4xl font-extrabold capitalize",
                auth.user?.favoriteClub === slug ? "text-yellow-500" : "",
              )}
            >
              {club.name}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UsersIcon className="h-8 w-8 text-gray-800" />
                <span className="text-2xl font-bold">{club.fans}</span>
              </div>

              {auth.user?.favoriteClub !== slug ? (
                <TooltipWrapper tooltip={<span>I want to be a FAN</span>}>
                  <UserPlusIcon
                    className="h-6 w-6 cursor-pointer"
                    onClick={() => setModalOpen(true)}
                  />
                </TooltipWrapper>
              ) : (
                <CrownIcon className="size-8 text-yellow-500" />
              )}

              <BeFanDialog
                open={modalOpen}
                onOpenChange={setModalOpen}
                club={club.name}
                auth={auth}
              />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2.5 font-medium">
                <GlobeIcon
                  className="text-gray-500"
                  style={{ width: "22px", height: "22px" }}
                />
                <span className="text-gray-600 capitalize">
                  {club.country?.continent}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <ReactCountryFlag
                  countryCode={club.country?.code}
                  svg
                  style={{
                    width: "22px",
                    height: "18px",
                    borderRadius: "5px",
                  }}
                />
                <span className="text-gray-600 capitalize">{club.city}</span>
              </div>
            </div>

            <div>
              {club.founded && (
                <p className="font-semibold text-gray-700 lg:mb-0">
                  <span>Founded in</span> {club.founded}
                </p>
              )}
              {club.arena && (
                <p className="font-semibold text-gray-700">
                  <span className="">Arena:</span>{" "}
                  <span className="capitalize">{club.arena}</span>
                </p>
              )}
            </div>

            {club.website && (
              <p className="flex items-center gap-2 text-blue-800">
                <LinkIcon style={{ width: "18px", height: "18px" }} />
                <a
                  href={club.website}
                  target="_blank"
                  className="underline hover:no-underline"
                >
                  Official Website
                </a>
              </p>
            )}

            {club.description && <p className="mb-6">{club.description}</p>}
          </div>
        </div>
        {auth.user?.favoriteClub !== slug && (
          <div className="mt-4 text-center">
            <Button className="w-full md:w-fit" size="lg" onClick={() => setModalOpen(true)}>
              <UserPlusIcon className="h-6 w-6" />I want to be a FAN
            </Button>
          </div>
        )}
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
                  <div className="_header mb-6 flex items-center justify-between rounded-xl border-2 border-gray-200/50 bg-gray-50/50 p-3 lg:px-3">
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
                    <span className="flex aspect-square h-9 w-9 items-center justify-center rounded-full border border-gray-200/50 bg-gray-200/70 text-lg font-bold">
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
                        <p className="flex h-7 items-center justify-center rounded bg-gray-700 text-center text-white capitalize">
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

export default ClubDetailsPage;
