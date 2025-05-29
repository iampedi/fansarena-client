// src/layout/Navbar.jsx
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const menuItems = [
    { title: "Clubs", link: "/", active: true },
    { title: "Leaderboard", link: "/leaderboard", active: true },
    { title: "About", link: "/about", active: true },
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
    </ul>
  );
};

export default Navbar;
