import { Link } from "react-router";
import ClubImage from "../components/ClubImage";
import ReactCountryFlag from "react-country-flag";
import { TrophyIcon, UsersIcon } from "lucide-react";

const ClubCard = (props) => {
  const { club } = props;

  return (
    <div
      key={club._id}
      className="_card flex flex-col rounded-lg border-1 border-gray-100 bg-gray-50/50 text-gray-600 duration-300 hover:border-gray-200 hover:bg-gray-50/80 hover:shadow-lg hover:shadow-gray-200/70"
    >
      <div className="_images flex items-center justify-center p-6">
        <Link to={`/clubs/${club.slug}`}>
          <ClubImage slug={club.slug} name={club.name} className="h-24" />
        </Link>
      </div>

      <div className="_content flex min-w-0 flex-grow flex-col">
        <Link to={`/clubs/${club.slug}`}>
          <h2 className="truncate bg-gray-100 py-2 text-center text-lg font-bold text-black capitalize">
            {club.name}
          </h2>
        </Link>

        <div className="flex w-full items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <TrophyIcon className="h-5 w-5 text-gray-400" />
            <span className="font-bold text-gray-500/80">{club.trophies}</span>
          </div>
          <ReactCountryFlag
            countryCode={club.country?.code}
            svg
            style={{ width: "22px", height: "20px", borderRadius: "5px" }}
            className="rounded"
          />
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-500/80">0</span>
            <UsersIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;
