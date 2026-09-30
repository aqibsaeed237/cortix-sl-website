type SectionHeaderProps = {
  id?: string;
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "center" | "start";
};

export function SectionHeader({ id, eyebrow, title, lead, align = "center" }: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <div className={`mb-12 max-w-2xl md:mb-16 ${centered ? "mx-auto text-center" : "text-start"}`}>
      <p className="mb-4 text-sm font-semibold tracking-wide text-accent">{eyebrow}</p>
      <h2 id={id} className="text-h2 font-semibold text-fg text-balance">
        {title}
      </h2>
      {lead && <p className="mt-5 text-lead text-muted text-pretty">{lead}</p>}
    </div>
  );
}
