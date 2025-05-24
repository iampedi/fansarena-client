import { NavLink } from "react-router";

const Navbar = () => {
  const menuItems = [
    { title: "Clubs", link: "/", active: true },
    { title: "Leaderboard", link: "/leaderboard", active: true },
  ];

  return (
    <ul className="flex rounded-full gap-2 border border-gray-200 bg-white shadow-md shadow-gray-200/75">
      {menuItems.map(
        (item, i) =>
          item.active && (
            <li key={i} className="hidden md:block">
              <NavLink
                to={item.link}
                className="flex h-11 items-center rounded-full px-5 font-semibold hover:font-bold hover:text-black [&.active]:font-bold [&.active]:bg-gray-100"
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
