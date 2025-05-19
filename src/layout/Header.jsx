import { MagnifyingGlass } from "phosphor-react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto max-w-[92%]">
        <div className="_wrapper flex flex-col gap-5">
          <div className="_top flex items-center justify-between gap-5 pt-5">
            <div className="_logo flex w-1/6 items-center gap-2">
              <h1 className="text-xl font-bold text-blue-800">Fans Arena</h1>
            </div>
            <nav>
              <Navbar />
            </nav>

            <div className="_tools w-1/6 text-right flex gap-5 justify-end">
              <Link to="/admin">Admin</Link>
              <Link to="auth/signup">Sign Up</Link>
            </div>
          </div>
          <div className="_search flex justify-center pb-6">
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
