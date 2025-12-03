"use client";

import { useState } from "react";
import { FiUploadCloud, FiCheckCircle } from "react-icons/fi";
import { Api } from "@/lib/api";

export default function VerifyDriverLicenseForm() {
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
      formData.append("license", file);

      // Replace with your API route
      await Api.post("/profile/verify/license", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus("SUBMITTED");
    } catch (err: any) {
      console.error("License upload failed:", err);
      setErrorMsg("Failed to submit license. Please try again.");
      setStatus("ERROR");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* File input */}
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-xl cursor-pointer hover:bg-gray-50">
        <FiUploadCloud size={32} className="text-gray-500" />
        <span className="mt-2 text-gray-700 font-medium">
          {file ? file.name : "Upload Driver License"}
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
        className="bg-primary text-white px-5 py-2 rounded-xl disabled:opacity-50"
      >
        {status === "UPLOADING" ? "Submitting..." : "Submit License"}
      </button>

      {/* Success or Error */}
      {status === "SUBMITTED" && (
        <p className="text-green-600 flex items-center gap-2 mt-2">
          <FiCheckCircle /> License submitted for verification.
        </p>
      )}
      {status === "ERROR" && <p className="text-red-600 mt-2">{errorMsg}</p>}
    </form>
  );
}
