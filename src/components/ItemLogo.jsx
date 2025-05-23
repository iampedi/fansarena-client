// src/components/ItemLogo.jsx
import { useState } from "react";

function ItemLogo({ logoUrl, name, type, size = 24 }) {
  const [imgError, setImgError] = useState(false);

  const placeholders = {
    competition: "/images/competitions/placeholder.webp",
    club: "/images/clubs/placeholder.webp",
    default: "/images/placeholder.webp",
  };

  const placeholderSrc = placeholders[type] || placeholders.default;

  return (
    <img
      src={!imgError ? logoUrl || placeholderSrc : placeholderSrc}
      style={{ width: `${size}px`, height: `${size}px` }}
      alt={name || "Logo"}
      onError={() => setImgError(true)}
    />
  );
}

export default ItemLogo;
