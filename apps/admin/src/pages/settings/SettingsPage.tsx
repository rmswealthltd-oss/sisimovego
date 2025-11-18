"use client";

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageTitle from "@/components/PageTitle";

import GeneralSettings from "./components/GeneralSettings";
import LocationSettings from "./components/LocationSettings";
import PriceSettings from "./components/PriceSettings";
import PlatformFeeSettings from "./components/PlatformFeeSettings";
import VerificationSettings from "./components/VerificationSettings";
import AdminAccountSettings from "./components/AdminAccountSettings";

// ---------------------------------------------------------
// TABS CONFIG
// ---------------------------------------------------------
const TABS = [
  { key: "general", name: "General" },
  { key: "locations", name: "Locations" },
  { key: "pricing", name: "Pricing" },
  { key: "fees", name: "Platform Fees" },
  { key: "verification", name: "Verification" },
  { key: "account", name: "Admin Account" },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract last segment after /admin/settings/*
  const pathParts = location.pathname.split("/");
  const active = pathParts[pathParts.length - 1] || "general";

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageTitle>System Settings</PageTitle>

      {/* TABS NAVIGATION */}
      <div className="flex gap-3 mt-6 border-b pb-2">
        {TABS.map((t) => {
          const isActive = active === t.key;

          return (
            <button
              key={t.key}
              onClick={() => navigate(`/admin/settings/${t.key}`)}
              className={`px-4 py-2 rounded-t-md font-medium transition ${
                isActive
                  ? "bg-white border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {t.name}
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      <div className="mt-6 space-y-6">
        {active === "general" && <GeneralSettings />}
        {active === "locations" && <LocationSettings />}
        {active === "pricing" && <PriceSettings />}
        {active === "fees" && <PlatformFeeSettings />}
        {active === "verification" && <VerificationSettings />}
        {active === "account" && <AdminAccountSettings />}
      </div>
    </div>
  );
}
