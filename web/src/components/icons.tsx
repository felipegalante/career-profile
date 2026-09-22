type IconName = "email" | "lock" | "eye" | "check";

export function Icon({ name }: { name: IconName }) {
  const isCheck = name === "check";
  const svgProps = {
    "aria-hidden": true,
    fill: "none",
    height: isCheck ? 16 : 18,
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: isCheck ? 2 : 1.8,
    viewBox: "0 0 24 24",
    width: isCheck ? 16 : 18,
  };

  if (name === "email") return <svg {...svgProps}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;
  if (name === "lock") return <svg {...svgProps}><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
  if (name === "eye") return <svg {...svgProps}><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></svg>;
  return <svg {...svgProps}><path d="m5 12 4 4L19 6" /></svg>;
}
