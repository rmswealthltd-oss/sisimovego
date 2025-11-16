// apps/web/src/components/RatingStars.tsx
"use client";

import { Star } from "lucide-react";

export default function RatingStars({ rating = 0 }: { rating?: number }) {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={16}
          className={
            n <= rounded
              ? "text-yellow-500 fill-yellow-500"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );
}
