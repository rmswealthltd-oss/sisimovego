"use client";

import VerifyDriverLicenseForm from "../VerifyDriverLicenseForm";
import VerifyGovIDForm from "../VerifyGovIDForm";

export default function ProfileVerificationPage() {
  return (
    <div className="space-y-10 max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Your Profile Verification
      </h1>

      <section className="card space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Driver License Verification
        </h2>
        <p className="text-gray-600 text-sm">
          To post trips as a driver, you must upload a valid driver's license.
        </p>
        <VerifyDriverLicenseForm />
      </section>

      <section className="card space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Government ID Verification
        </h2>
        <p className="text-gray-600 text-sm">
          To join trips as a passenger, you must upload a valid government ID.
        </p>
        <VerifyGovIDForm />
      </section>
    </div>
  );
}
