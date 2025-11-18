import { useState } from "react";
import PageTitle from "@/components/PageTitle";
import { Api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function SendNotification() {
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function send() {
    if (!title.trim() || !body.trim()) {
      alert("Title and body are required.");
      return;
    }

    setLoading(true);
    try {
      await Api.post("/admin/notifications/send", {
        userId: userId || undefined,
        title,
        body
      });

      alert("Notification sent!");
      navigate("/admin/notifications");
    } catch (e) {
      console.error(e);
      alert("Error sending notification");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageTitle>Send Notification</PageTitle>

      <div className="bg-white p-4 rounded shadow max-w-xl mt-4">
        <div className="mb-4">
          <label className="block font-medium mb-1">User ID (optional)</label>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            placeholder="Leave empty for broadcast"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            placeholder="Notification title"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="border px-3 py-2 rounded w-full h-32"
            placeholder="Message body..."
          />
        </div>

        <button
          disabled={loading}
          onClick={send}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </div>
    </div>
  );
}
