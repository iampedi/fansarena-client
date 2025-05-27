import { Link } from "react-router";
import ClubImage from "../components/ClubImage";
import ReactCountryFlag from "react-country-flag";
import { TrophyIcon, UsersIcon } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import useAuth from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const ClubCard = (props) => {
  const { club } = props;
  const { user } = useAuth(AuthContext);

  return (
    <div
      key={club._id}
      className={cn(
        "_card group flex rounded-lg border-2 text-gray-600 duration-300 hover:shadow-lg md:flex-col",
        user?.favoriteClub === club.slug
          ? "border-yellow-400 bg-yellow-50/50 hover:shadow-yellow-200/50"
          : "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50/80 hover:shadow-gray-200/70",
      )}
    >
      <Link
        to={`/clubs/${club.slug}`}
        className="flex flex-1 items-center gap-2 md:flex-col md:gap-0"
      >
        <div className="_images flex items-center justify-center p-4 md:px-0 md:py-6">
          <ClubImage
            slug={club.slug}
            name={club.name}
            className={cn(
              "h-20 duration-300 md:h-24",
              user?.favoriteClub === club.slug
                ? ""
                : "md:opacity-50 md:grayscale md:group-hover:opacity-100 md:group-hover:grayscale-0",
            )}
          />
        </div>

        <div className="_content flex h-full w-full min-w-0 flex-1 flex-grow flex-col justify-around py-2 md:py-0">
          <h2
            className={cn(
              "truncate text-xl font-bold capitalize duration-300 md:py-2 md:text-center md:text-lg",
              user?.favoriteClub === club.slug
                ? "text-yellow-700 md:bg-yellow-200/50"
                : "text-black md:bg-gray-100 md:text-gray-400 md:group-hover:text-black",
            )}
          >
            {club.name}
          </h2>

          <div className="flex w-full items-center gap-6 md:justify-between md:p-4">
            <ReactCountryFlag
              countryCode={club.country?.code}
              svg
              style={{ width: "22px", height: "20px", borderRadius: "5px" }}
              className={cn(
                "rounded duration-300 md:order-2",
                user?.favoriteClub === club.slug
                  ? ""
                  : "md:opacity-30 md:grayscale md:group-hover:opacity-100 md:group-hover:grayscale-0",
              )}
            />

            <div
              className={cn(
                "flex items-center gap-2 duration-300 md:order-1",
                user?.favoriteClub === club.slug
                  ? "text-yellow-600"
                  : "text-gray-500 group-hover:text-gray-500 md:text-gray-300",
              )}
            >
              <TrophyIcon className="h-5 w-5" />
              <span className="font-medium">{club.trophies}</span>
            </div>

            <div
              className={cn(
                "flex items-center gap-2 duration-300 md:order-3",
                user?.favoriteClub === club.slug
                  ? "text-yellow-600"
                  : "text-gray-500 group-hover:text-gray-500 md:text-gray-300",
              )}
            >
              <UsersIcon className="h-5 w-5" />
              <span className="font-mdeium">{club.fans}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ClubCard;
