// src/layout/Header.jsx
import { API_URL } from "@/config/api";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/images/fa-logo-main.svg";
// UI Imports
import AuthButton from "@/components/AuthButton";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { MenuIcon, UserRoundCheckIcon, UserRoundCogIcon } from "lucide-react";
import Navbar from "./Navbar";

const Header = () => {
  const { isLoggedIn, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [club, setClub] = useState(null);
  const userClubSlug = user?.favoriteClub;

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

  // Disable body scroll
  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4">
        <div className="_wrapper flex flex-col gap-5">
          <div className="_top flex flex-wrap items-center justify-between py-3 md:flex-nowrap md:gap-5">
            <div className="_logo flex w-1/5 items-center gap-2">
              <Link to="/">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-12"
                />
              </Link>
            </div>

            <nav className="relative order-3 w-full md:order-none md:block md:w-auto">
              <Navbar />
            </nav>

            <div className="_tools flex items-center justify-end gap-2 text-right md:w-1/5">
              {isLoggedIn && (
                <>
                  {/* Club Logo */}
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

                  {/* Admin Panel */}
                  {user?.isAdmin && (
                    <TooltipWrapper tooltip={"Admin Panel"}>
                      <Button className="hidden md:flex" size="icon" asChild>
                        <Link to="/admin">
                          <UserRoundCheckIcon />
                        </Link>
                      </Button>
                    </TooltipWrapper>
                  )}

                  {/* Profile */}
                  <TooltipWrapper tooltip={"User Profile"}>
                    <Button className="hidden md:flex" size="icon" asChild>
                      <Link to="/profile" onClick={() => {}}>
                        <UserRoundCogIcon />
                      </Link>
                    </Button>
                  </TooltipWrapper>
                </>
              )}

              {/* Mobile Menu Button */}
              <Button
                size="icon"
                onClick={() => setOpen(true)}
                className="md:hidden"
              >
                <MenuIcon />
              </Button>

              <AuthButton />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar & Backdrop - always in DOM for smooth animation */}
      <div className="md:hidden">
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Sidebar from bottom */}
        <div
          className={`fixed bottom-0 left-0 z-50 flex h-[50%] w-full transform items-center justify-center rounded-t-3xl bg-white p-6 shadow-lg transition-transform duration-500 ease-in-out ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <nav className="itemc flex flex-col gap-5 text-2xl font-bold">
            <Link to="/" onClick={() => setOpen(false)}>
              Clubs
            </Link>
            <Link to="/leaderboard" onClick={() => setOpen(false)}>
              Leaderboard
            </Link>
            <Link to="/profile" onClick={() => setOpen(false)}>
              Profile
            </Link>
            {user?.isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)}>
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
