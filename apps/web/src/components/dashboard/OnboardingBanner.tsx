"use client";

import { UserView } from "../../../types/user";
import { useRouter } from "next/navigation";

export function OnboardingBanner({ user }: { user: UserView }) {
  const router = useRouter();

  const idVerified = user.governmentIdStatus === "VERIFIED";
  const idPending = user.governmentIdStatus === "PENDING";
  const idRejected = user.governmentIdStatus === "REJECTED";

  const licenseVerified = user.driverLicenseStatus === "VERIFIED";
  const licensePending = user.driverLicenseStatus === "PENDING";
  const licenseRejected = user.driverLicenseStatus === "REJECTED";

  const isDriver = user.role === "DRIVER";

  // Nothing to show if fully verified
  if (idVerified && (isDriver ? licenseVerified : true)) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 flex flex-col gap-3">
      <h2 className="font-semibold text-yellow-800 text-lg">Complete Your Verification</h2>

      {/* Government ID section */}
      {!idVerified && (
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Government ID Verification</p>
            {idPending && <p className="text-sm text-gray-600">Your ID is being reviewed…</p>}
            {idRejected && <p className="text-sm text-red-600">Your ID was rejected. Please re-upload.</p>}
          </div>

          {idPending ? (
            <span className="text-xs text-gray-500 italic">Pending</span>
          ) : (
            <button
              onClick={() => router.push("/profile/verify-id")}
              className="px-4 py-1.5 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
            >
              {idRejected ? "Re-upload ID" : "Upload ID"}
            </button>
          )}
        </div>
      )}

      {/* Driver License section (only for drivers) */}
      {isDriver && !licenseVerified && (
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Driver License Verification</p>
            {licensePending && <p className="text-sm text-gray-600">Your license is being reviewed…</p>}
            {licenseRejected && <p className="text-sm text-red-600">License was rejected. Please re-upload.</p>}
          </div>

          {licensePending ? (
            <span className="text-xs text-gray-500 italic">Pending</span>
          ) : (
            <button
              onClick={() => router.push("/profile/verify-license")}
              className="px-4 py-1.5 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
            >
              {licenseRejected ? "Re-upload License" : "Upload License"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
