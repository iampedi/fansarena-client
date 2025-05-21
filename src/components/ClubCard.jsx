import { Link } from "react-router";
import ClubImage from "../components/ClubImage";

const ClubCard = (props) => {
  const { club } = props;
  return (
    <div
      key={club._id}
      className="_card flex flex-col gap-5 rounded-lg border-1 border-gray-100 bg-gray-50/50 p-5 text-gray-600 duration-300 hover:border-gray-300 hover:bg-gray-50"
    >
      <div className="_images flex items-center justify-center">
        <Link to={`/clubs/${club.slug}`}>
          <ClubImage slug={club.slug} name={club.name} className="h-24" />
        </Link>
      </div>

      <div className="_content flex min-w-0 flex-grow flex-col">
        <Link to={`/clubs/${club.slug}`}>
          <h2 className="truncate text-lg font-bold capitalize">{club.name}</h2>
        </Link>

        {club.founded && <p>Founded in {club.founded}</p>}

        {(club.city || club.country) && (
          <p className="capitalize">
            {[club.city, club.country?.name].filter(Boolean).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};

export default ClubCard;
