import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Cortix SL — AI expense tracker: scan receipts, speak expenses, ask AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const icon = await readFile(join(process.cwd(), "public/brand/cortix-sl-icon.png"));
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(34,211,238,0.28) 0%, rgba(7,11,20,0) 70%), #070b14",
          color: "#f1f5f9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs <img> */}
          <img src={iconSrc} width={72} height={72} style={{ borderRadius: 18 }} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 36, fontWeight: 700 }}>Cortix SL</div>
            <div style={{ fontSize: 22, color: "#a3b1c6" }}>by Tech Cortix</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>
            Track every expense
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, color: "#22d3ee" }}>
            in seconds.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#a3b1c6" }}>
            Scan receipts · Speak expenses · Ask AI · Budgets & exports
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#8290a6" }}>
          <div>sl.techcortix.com</div>
          <div>Built in Pakistan · Made for everyone</div>
        </div>
      </div>
    ),
    size,
  );
}
