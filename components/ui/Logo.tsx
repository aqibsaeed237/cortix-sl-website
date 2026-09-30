import Image from "next/image";
import icon from "@/public/brand/cortix-sl-icon.png";

export function Logo({ byline }: { byline?: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <Image src={icon} alt="" width={32} height={32} className="size-8 rounded-[9px]" />
      <span className="flex items-baseline gap-1.5">
        <span className="text-[15px] font-semibold tracking-tight text-fg">Cortix SL</span>
        {byline && <span className="hidden text-xs text-subtle sm:inline">{byline}</span>}
      </span>
    </span>
  );
}
