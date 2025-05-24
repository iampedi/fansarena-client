// src/layout/Header.jsx
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { MagnifyingGlass } from "phosphor-react";

const Header = () => {
  const { isLoggedIn } = useAuth();

  return (
    <header className="border-b border-gray-100 bg-gray-100/40">
      <div className="container mx-auto px-5 2xl:px-0">
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

            <div className="_tools hidden w-1/6 justify-end gap-2 text-right md:flex">
              {isLoggedIn ? (
                <>
                  <Button variant={"secondary"} asChild>
                    <Link to={"/admin"}>Admin</Link>
                  </Button>
                  <LogoutButton />
                </>
              ) : (
                <Button asChild>
                  <Link to={"/auth/signin"}>Sign In</Link>
                </Button>
              )}
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
                <MagnifyingGlass
                  size={18}
                  weight="bold"
                  className="text-white"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
