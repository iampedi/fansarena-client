// src/layout/Navbar.jsx
import { NavLink, useLocation } from "react-router-dom";

import { SearchIcon, XIcon } from "lucide-react";

const Navbar = ({ search, setSearch, show, setShow }) => {
  const location = useLocation();

  const menuItems = [
    { title: "Clubs", link: "/", active: true },
    { title: "Leaderboard", link: "/leaderboard", active: true },
  ];

  return (
    <ul className="flex gap-1 rounded-full border-gray-200 bg-white shadow-gray-200/75 md:border md:shadow-md">
      {menuItems.map(
        (item, i) =>
          item.active && (
            <li key={i} className="hidden md:block">
              <NavLink
                to={item.link}
                className="flex h-11 items-center rounded-full px-6 font-semibold hover:font-bold hover:text-black [&.active]:bg-gray-100 [&.active]:font-bold"
              >
                {item.title}
              </NavLink>
            </li>
          ),
      )}
      {location.pathname === "/" && (
        <li className="hidden aspect-square h-11 items-center justify-center rounded-full md:flex">
          <SearchIcon
            onClick={() => setShow(true)}
            className="cursor-pointer"
          />
        </li>
      )}

      {/* Search (optional) */}
      {show && (
        <div className="_search w-full pt-3 md:absolute md:top-0 md:right-0 md:left-0 md:z-50 md:pt-0">
          <div className="group flex h-[45px] w-full items-center rounded-full border border-gray-300 bg-white">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search club"
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
    </ul>
  );
};

export default Navbar;
