// src/pages/clubs/Index.jsx
import { API_URL } from "@/config/api";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
// UI Imports
import Loader from "@/components/Loader";
import ClubCard from "@/pages/clubs/ClubCardComponent";
import { ScanSearchIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

const ClubsListPage = () => {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);

  const searchInputRef = useRef(null);
  const searchBoxRef = useRef(null);

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

  const handleShowSearch = () => {
    setShow(true);

    setTimeout(() => {
      searchInputRef.current?.focus();
      searchBoxRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  if (error) {
    return <div className="w-full py-10 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="_page-title mb-8 flex flex-col items-center gap-2">
        <h1 className="md:text-3x flex items-center gap-2 text-2xl font-bold">
          {!show && (
            <ScanSearchIcon
              onClick={handleShowSearch}
              className="size-8 cursor-pointer hover:text-gray-600"
            />
          )}
          Clubs List - ({clubs.length})
        </h1>
        <p className="text-lg md:text-center">
          Explore clubs with at least one trophy in their history. Click any
          club for details. <br className="hidden md:block" />
          <span className="text-base text-gray-600">
            * (The list is continually updated and not yet complete.)
          </span>
        </p>
        {/* Search (optional) */}
        {show && (
          <div className="_search w-full pt-2" ref={searchBoxRef}>
            <div className="group mx-auto flex w-full items-center rounded-full border border-gray-300 bg-white md:w-1/3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                ref={searchInputRef}
                className="h-10 w-full rounded-tl-full rounded-bl-full bg-white px-4 text-center text-gray-400 placeholder:text-gray-300 group-hover:placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:placeholder:text-transparent"
              />
              <button
                className="flex h-10 w-11 items-center justify-center rounded-full pr-1"
                type="button"
                tabIndex={-1}
              >
                <XIcon
                  onClick={() => {
                    setSearch("");
                    setShow(false);
                  }}
                  className="cursor-pointer hover:text-gray-800 md:text-gray-300"
                />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="_list-cards grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {loading ? (
          <Loader className={"col-span-full"} />
        ) : clubs.length === 0 ? (
          <div className="col-span-full text-center">No clubs found!</div>
        ) : (
          [...clubs]
            .sort((a, b) => a.name?.localeCompare(b.name))
            .map((club, i) => (
              <ClubCard key={club._id || i} club={club} setSearch={setSearch} />
            ))
        )}
      </div>
    </div>
  );
};

export default ClubsListPage;
