import Image from "next/image";

type IPhoneMockupProps = {
  src: string;
  alt: string;
  scale?: number;
  priority?: boolean;
};

export function IPhoneMockup({
  src,
  alt,
  scale = 1,
  priority = false,
}: IPhoneMockupProps) {
  const W = 260 * scale;
  const H = 530 * scale;

  return (
    <div
      style={{
        width: W,
        height: H,
        flexShrink: 0,
        position: "relative",
        background: "linear-gradient(160deg, #2a2a2a, #1a1a1a)",
        borderRadius: 40 * scale,
        padding: 10 * scale,
        boxShadow: `0 0 0 ${1 * scale}px rgba(255,255,255,0.1), 0 ${32 * scale}px ${80 * scale}px rgba(0,0,0,0.35), inset 0 ${1 * scale}px 0 rgba(255,255,255,0.06)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -2 * scale,
          top: 90 * scale,
          width: 3 * scale,
          height: 32 * scale,
          background: "#333",
          borderRadius: `${2 * scale}px 0 0 ${2 * scale}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -2 * scale,
          top: 130 * scale,
          width: 3 * scale,
          height: 24 * scale,
          background: "#333",
          borderRadius: `${2 * scale}px 0 0 ${2 * scale}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -2 * scale,
          top: 120 * scale,
          width: 3 * scale,
          height: 40 * scale,
          background: "#333",
          borderRadius: `0 ${2 * scale}px ${2 * scale}px 0`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 18 * scale,
          left: "50%",
          transform: "translateX(-50%)",
          width: 88 * scale,
          height: 22 * scale,
          background: "#1a1a1a",
          borderRadius: 99,
          zIndex: 10,
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 32 * scale,
          overflow: "hidden",
          background: "#EEF2F8",
          position: "relative",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={`${W}px`}
          style={{ objectFit: "cover", objectPosition: "top center" }}
        />
      </div>
    </div>
  );
}
