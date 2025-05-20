import { useState } from "react";

function ClubLogo({ logoUrl, name }) {
  const [imgError, setImgError] = useState(false);

  return (
    <img
      src={
        !imgError
          ? logoUrl || "/images/clubs/placeholder.webp"
          : "/images/clubs/placeholder.webp"
      }
      className="w-6"
      alt={name || "Club Logo"}
      onError={() => setImgError(true)}
    />
  );
}

export default ClubLogo;
