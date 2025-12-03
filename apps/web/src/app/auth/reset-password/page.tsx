// apps/web/src/app/auth/reset-password/page.tsx
"use client";

import React, { useState } from "react";
import { Api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await Api.post("/auth/reset-password/request", { email });
      setMessage("If your account exists, a password reset link has been sent to your email.");
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleReset}
        className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-md border space-y-5"
      >
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-600 text-sm hover:underline"
        >
          <FiArrowLeft size={14} />
          Back
        </button>

        <h1 className="text-2xl font-semibold text-gray-700">Reset password</h1>
        <p className="text-sm text-gray-500">
          Enter your email and we’ll send you instructions to reset your password.
        </p>

        {/* Success message */}
        {message && (
          <p className="text-green-700 text-sm bg-green-50 border border-green-200 p-3 rounded-lg">
            {message}
          </p>
        )}

        {/* Error message */}
        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
            {error}
          </p>
        )}

        {/* Email input */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Email address
          </label>
          <input
            type="email"
            required
            placeholder="dev@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition disabled:bg-gray-400"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </div>
  );
}
