import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Shankhya — Free Online Calculators";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F1115 0%, #1a2030 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
          padding: 48,
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -1, display: "flex" }}>
          <span>Shankhya</span>
        </div>
        <div style={{ fontSize: 36, color: "#93a3b8", marginTop: 16, textAlign: "center" }}>
          Free online calculators for finance, health, math and more
        </div>
        <div style={{ fontSize: 28, color: "#38bdf8", marginTop: 40 }}>
          Fast · Accurate · Clear explanations
        </div>
      </div>
    ),
    { ...size }
  );
}
