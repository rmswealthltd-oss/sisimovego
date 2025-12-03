"use client";

interface Props {
  status: "APPROVED" | "PENDING" | "REJECTED";
}

export default function TripApprovalStatus({ status }: Props) {
  const colors = {
    APPROVED: "bg-green-100 text-green-700 border-green-300",
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-300",
    REJECTED: "bg-red-100 text-red-700 border-red-300",
  };

  return (
    <span
      className={`px-3 py-1 rounded-xl text-sm font-medium border ${colors[status]}`}
    >
      {status}
    </span>
  );
}
