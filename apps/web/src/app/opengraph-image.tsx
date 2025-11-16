import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #2563eb, #1e3a8a)",
          color: "white",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 72,
          fontWeight: 700,
        }}
      >
        SisiMove
      </div>
    ),
    size
  );
}
