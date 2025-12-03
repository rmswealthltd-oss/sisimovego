"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface Props {
  tripId: string;
}

export default function JoinTripButton({ tripId }: Props) {
  return (
    <Link
      href={`/dashboard/trips/${tripId}/join`}
      className="bg-secondary text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-secondary/90"
    >
      Join Trip <FiArrowRight />
    </Link>
  );
}
