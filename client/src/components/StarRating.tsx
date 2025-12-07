"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  rating,
  onRate,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const [hover, setHover] = useState(0);

  const sizes = {
    sm: 14,
    md: 20,
    lg: 28,
  };

  return (
    <div className="d-flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={sizes[size]}
          style={{
            cursor: readonly ? "default" : "pointer",
            color: (hover || rating) >= star ? "#D76A05" : "#888888",
            transition: "color 0.15s ease",
          }}
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        />
      ))}
    </div>
  );
}
