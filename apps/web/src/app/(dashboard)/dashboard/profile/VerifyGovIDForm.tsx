"use client";

import { useState } from "react";
import { FiUploadCloud, FiCheckCircle } from "react-icons/fi";
import { Api } from "@/lib/api";

export default function VerifyGovIDForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"NONE" | "UPLOADING" | "SUBMITTED" | "ERROR">("NONE");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus("UPLOADING");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("govId", file);

      // Replace with your real API endpoint
      await Api.post("/profile/verify/gov-id", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus("SUBMITTED");
    } catch (err: any) {
      console.error("Government ID upload failed:", err);
      setErrorMsg("Failed to submit ID. Please try again.");
      setStatus("ERROR");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* File input */}
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-xl cursor-pointer hover:bg-gray-50">
        <FiUploadCloud size={32} className="text-gray-500" />
        <span className="mt-2 text-gray-700 font-medium">
          {file ? file.name : "Upload Government ID"}
        </span>
        <input
          type="file"
          className="hidden"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </label>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!file || status === "UPLOADING" || status === "SUBMITTED"}
        className="bg-secondary text-white px-5 py-2 rounded-xl disabled:opacity-50"
      >
        {status === "UPLOADING" ? "Submitting..." : "Submit ID"}
      </button>

      {/* Success or error message */}
      {status === "SUBMITTED" && (
        <p className="text-green-600 flex items-center gap-2 mt-2">
          <FiCheckCircle /> Government ID submitted for verification.
        </p>
      )}
      {status === "ERROR" && <p className="text-red-600 mt-2">{errorMsg}</p>}
    </form>
  );
}
