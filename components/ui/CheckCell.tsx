import { Check, Minus } from "lucide-react";

/** Table cell value: ✓ / – / text, with accessible text for icons. */
export function CheckCell({
  value,
  yes,
  no,
}: {
  value: boolean | string;
  yes: string;
  no: string;
}) {
  if (typeof value === "string") {
    return <span className="text-sm text-fg">{value}</span>;
  }
  return value ? (
    <>
      <Check className="mx-auto size-5 text-accent" aria-hidden />
      <span className="sr-only">{yes}</span>
    </>
  ) : (
    <>
      <Minus className="mx-auto size-5 text-subtle" aria-hidden />
      <span className="sr-only">{no}</span>
    </>
  );
}
