import Image, { type StaticImageData } from "next/image";

/**
 * Device frame around a real app screenshot. Fixed width without `sizes`
 * makes next/image emit only 1x/2x candidates (e.g. 384w/560w), never 3840w.
 */
export function PhoneMockup({
  src,
  alt,
  width = 280,
  preload = false,
  className = "",
}: {
  src: StaticImageData;
  alt: string;
  width?: number;
  preload?: boolean;
  className?: string;
}) {
  const screenW = width - 20;
  return (
    <div
      className={`relative rounded-[44px] bg-gradient-to-b from-[#2b3445] to-[#10151f] p-2.5 shadow-lg ring-1 ring-white/10 ${className}`}
      style={{ width }}
    >
      <div className="absolute top-4 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" aria-hidden />
      <div className="overflow-hidden rounded-[36px] bg-black">
        <Image
          src={src}
          alt={alt}
          width={screenW}
          height={Math.round(screenW * (1024 / 460))}
          preload={preload}
          loading={preload ? "eager" : "lazy"}
          fetchPriority={preload ? "high" : undefined}
          placeholder={preload ? "empty" : "blur"}
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}
