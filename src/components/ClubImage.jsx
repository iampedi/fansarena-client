import { useState } from "react";

const ClubImage = ({ slug, name, className }) => {
  const [imgSrc, setImgSrc] = useState(`/images/clubs/${slug}.png`);

  return (
    <img
      src={imgSrc}
      alt={`${name} Logo`}
      className={className}
      onError={() => setImgSrc("/images/clubs/placeholder.webp")}
    />
  );
};

export default ClubImage;
