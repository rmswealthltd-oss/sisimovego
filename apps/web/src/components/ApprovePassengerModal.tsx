"use client";

import { FiX, FiCheck } from "react-icons/fi";

interface ApprovePassengerModalProps {
  open: boolean;
  passengerName: string;
  onApprove: () => void;
  onClose: () => void;
}

export default function ApprovePassengerModal({
  open,
  passengerName,
  onApprove,
  onClose,
}: ApprovePassengerModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Approve Passenger</h2>
          <button onClick={onClose}>
            <FiX className="text-gray-600" size={22} />
          </button>
        </div>

        <p className="mt-4 text-gray-700">
          Approve <strong>{passengerName}</strong> to join this trip?
        </p>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border bg-gray-100 text-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={onApprove}
            className="px-4 py-2 rounded-xl bg-primary text-white flex items-center gap-2"
          >
            <FiCheck /> Approve
          </button>
        </div>
      </div>
    </div>
  );
}
