type IconName = "email" | "lock" | "eye" | "eye-off" | "check";

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
  if (name === "eye-off") return <svg {...svgProps}><path d="m3 3 18 18" /><path d="M10.6 6.2A11.3 11.3 0 0 1 12 6c6.5 0 10 6 10 6a18.2 18.2 0 0 1-3.2 3.8" /><path d="M6.2 6.2A18.1 18.1 0 0 0 2 12s3.5 6 10 6a10.9 10.9 0 0 0 3.4-.5" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>;
  return <svg {...svgProps}><path d="m5 12 4 4L19 6" /></svg>;
}
