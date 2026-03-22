import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #334155 42%, #e2e8f0 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontSize: 28,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            opacity: 0.78,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "rgba(255,255,255,0.9)",
            }}
          />
          Lens Notes
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: 880 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 82, lineHeight: 0.95, fontWeight: 700 }}>
            <div style={{ display: "flex" }}>Through Images</div>
            <div style={{ display: "flex" }}>and Quiet Notes</div>
          </div>
          <div style={{ display: "flex", fontSize: 30, lineHeight: 1.5, opacity: 0.84 }}>
            A personal space for photo essays, journals, and small observations.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            opacity: 0.8,
          }}
        >
          <div style={{ display: "flex" }}>Photo Essays · Journals · Personal Archive</div>
          <div style={{ display: "flex" }}>{siteConfig.url.replace(/^https?:\/\//, "")}</div>
        </div>
      </div>
    ),
    size,
  );
}
