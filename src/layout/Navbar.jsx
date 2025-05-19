import { NavLink } from "react-router";

const Navbar = () => {
  const menuItems = [
    { title: "Clubs", link: "/", active: true },
    { title: "Nationals", link: "/nationals", active: false },
    { title: "Players", link: "/players", active: false },
    { title: "Stadiums", link: "/stadiums", active: false },
    { title: "Trophies", link: "/trophies", active: false },
  ];

  return (
    <ul className="flex">
      {menuItems.map(
        (item, i) =>
          item.active && (
            <li key={i}>
              <NavLink
                to={item.link}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-[17px] text-gray-500 hover:bg-gray-100/90 hover:text-black [&.active]:font-bold [&.active]:text-black"
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
