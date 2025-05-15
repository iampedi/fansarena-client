import { Trash } from "phosphor-react";
import ClubImage from "../components/ClubImage";
import { Link } from "react-router";

const ClubCard = (props) => {
  return (
    <div
      key={props.club.id}
      className="_card flex flex-col gap-5 rounded-lg border-1 border-gray-100 bg-gray-50/50 p-5 text-gray-600 duration-300 hover:border-gray-300 hover:bg-gray-50"
    >
      <div className="_images flex items-center justify-center">
        <Link to={`/club/${props.club.slug}`}>
          <ClubImage
            slug={props.club.slug}
            name={props.club.name}
            className="h-24"
          />
        </Link>
      </div>

      <div className="_content flex min-w-0 flex-grow flex-col">
        <Link to={`/club/${props.club.slug}`}>
          <h2 className="truncate text-lg font-bold">{props.club.name}</h2>
        </Link>

        {props.club.founded && <p>Foudned in {props.club.founded}</p>}
        {(props.club.city || props.club.country) && (
          <p>
            {props.club.city}, {props.club.country}
          </p>
        )}
      </div>
      {/* <div className="_tools flex items-center">
        <Trash
          onClick={() => props.deleteClub(props.club.id)}
          size={20}
          className="cursor-pointer text-gray-300 duration-300 hover:text-red-500"
        />
      </div> */}
    </div>
  );
};

export default ClubCard;
