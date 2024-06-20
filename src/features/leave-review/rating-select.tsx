"use client";

import { useState } from "react";

export function RatingSelect({
  totalStars = 5,
  rating,
  onSelect,
}: {
  totalStars?: number;
  rating: number;
  onSelect: (rating: number) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div>
      {[...Array(totalStars)].map((_, index) => {
        const currentRating = index + 1;

        return (
          <label
            key={index}
            className={`${index !== 0 && "pl-1"}`}
            onMouseEnter={() => setHover(currentRating)}
            onMouseLeave={() => setHover(null)}
          >
            <input
              type="radio"
              name="rating"
              value={currentRating}
              onChange={() => onSelect(currentRating)}
              className="hidden"
            />

            <span
              className="text-3xl"
              style={{
                color:
                  currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9",
              }}
            >
              &#9733;
            </span>
          </label>
        );
      })}
    </div>
  );
}
