"use client";

import Image from "next/image";

type ScreenshotThumbProps = {
  src: string;
  label: string;
};

export function ScreenshotThumb({ src, label }: ScreenshotThumbProps) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        border: "1px solid #E2E8F0",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(15,34,64,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
      }}
    >
      <div style={{ position: "relative", aspectRatio: "9/19.5" }}>
        <Image src={src} alt={label} fill sizes="(max-width:768px) 50vw, 20vw" style={{ objectFit: "cover", objectPosition: "top" }} />
      </div>
      <div
        style={{
          padding: "12px 14px",
          fontSize: 13,
          fontWeight: 600,
          color: "#0F172A",
          borderTop: "1px solid #E2E8F0",
        }}
      >
        {label}
      </div>
    </div>
  );
}
