// src/layout/Header.jsx
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

import AuthButton from "@/components/AuthButton";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { SearchIcon, UserRoundCheckIcon, UserRoundCogIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { API_URL } from "@/config/api";

const Header = () => {
  const { isLoggedIn, user } = useAuth();
  const [club, setClub] = useState(null);
  const userClubSlug = user?.favoriteClubs;

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await fetch(`${API_URL}/api/clubs/${userClubSlug}`);
        setClub(await response.json());
      } catch (error) {
        console.error(error);
      }
    };

    if (userClubSlug) {
      fetchClub();
    }
  }, [userClubSlug]);

  return (
    <header className="border-b border-gray-100 bg-gray-100/40">
      <div className="3xl:px-0 container mx-auto px-5">
        <div className="_wrapper flex flex-col gap-5">
          <div className="_top flex items-center justify-between gap-5 py-5">
            <div className="_logo flex w-1/6 items-center gap-2">
              <Link to="/">
                <img src="/images/fa-logo.svg" alt="Logo" className="h-9" />
              </Link>
            </div>

            <nav>
              <Navbar />
            </nav>

            <div className="_tools flex items-center justify-end gap-2 text-right md:w-1/6">
              {isLoggedIn && (
                <>
                  <TooltipWrapper
                    tooltip={
                      <span className="capitalize">{club?.name} Page</span>
                    }
                  >
                    <Link to={`/clubs/${userClubSlug}`} className="mr-1 flex">
                      <img
                        src={club?.logoUrl}
                        alt={club?.name}
                        className="h-9 rounded-full"
                      />
                    </Link>
                  </TooltipWrapper>
                  {user?.isAdmin && (
                    <TooltipWrapper tooltip={"Admin Panel"}>
                      <Button size="icon" asChild>
                        <Link to="/admin">
                          <UserRoundCheckIcon />
                        </Link>
                      </Button>
                    </TooltipWrapper>
                  )}
                  <TooltipWrapper tooltip={"User Profile"}>
                    <Button size="icon" asChild>
                      <Link to="/profile">
                        <UserRoundCogIcon />
                      </Link>
                    </Button>
                  </TooltipWrapper>
                </>
              )}
              <AuthButton />
            </div>
          </div>
          <div className="_search hidden justify-center pb-6">
            <div className="group flex h-14 w-1/4 items-center rounded-full border border-gray-200 pr-2 shadow-md shadow-gray-200/70 focus-within:border-gray-300 focus-within:bg-gray-50/90 hover:border-gray-300 hover:bg-gray-50/90">
              <input
                type="text"
                placeholder="Search your favorite club"
                className="h-full w-full rounded-tl-full rounded-bl-full px-4 text-center text-gray-400 placeholder:text-gray-300 group-hover:placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:placeholder:text-transparent"
              />
              <button className="flex aspect-square h-10 w-10 items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500">
                <SearchIcon className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
