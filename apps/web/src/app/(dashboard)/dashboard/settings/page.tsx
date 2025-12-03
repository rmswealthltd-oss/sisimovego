"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = async () => {
    await fetch("/api/settings/update", {
      method: "POST",
      body: JSON.stringify({
        emailNotifications,
        smsNotifications,
        pushNotifications,
        darkMode,
      }),
    });

    alert("Settings saved.");
  };

  return (
    <div className="max-w-3xl space-y-12">
      <h1 className="text-2xl font-semibold text-gray-900">
        Account Settings
      </h1>

      {/* NOTIFICATION SETTINGS */}
      <section className="card space-y-6">
        <h2 className="text-xl font-semibold">Notifications</h2>

        {/* Email */}
        <label className="flex items-center justify-between">
          <span>Email Notifications</span>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            className="toggle-checkbox"
          />
        </label>

        {/* SMS */}
        <label className="flex items-center justify-between">
          <span>SMS Notifications</span>
          <input
            type="checkbox"
            checked={smsNotifications}
            onChange={(e) => setSmsNotifications(e.target.checked)}
            className="toggle-checkbox"
          />
        </label>

        {/* PUSH */}
        <label className="flex items-center justify-between">
          <span>Web Push Notifications</span>
          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={(e) => setPushNotifications(e.target.checked)}
            className="toggle-checkbox"
          />
        </label>
      </section>

      {/* APPEARANCE */}
      <section className="card space-y-6">
        <h2 className="text-xl font-semibold">Appearance</h2>

        <label className="flex items-center justify-between">
          <span>Dark Mode</span>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            className="toggle-checkbox"
          />
        </label>
      </section>

      {/* SAVE BUTTON */}
      <button
        onClick={handleSave}
        className="bg-primary text-white px-6 py-3 rounded-xl"
      >
        Save Settings
      </button>
    </div>
  );
}
