import type { ReactElement, SVGProps } from "react";

/* Paths are copied from the design artifacts so icons render exactly as reviewed. */
const glyphs = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9 21v-7h6v7" /></>,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 2v2M22 12h-2M12 22v-2M2 12h2" /></>,
  "user-plus": <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 11v6M19 14h6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21H10v-.1A1.7 1.7 0 0 0 8.9 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3V10h.1A1.7 1.7 0 0 0 4.6 8.9 1.7 1.7 0 0 0 4.3 7l-.1-.1L7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3H14v.1A1.7 1.7 0 0 0 15.1 4.6a1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1A1.7 1.7 0 0 0 19.4 9c.2.4.4.7.7 1 .3.2.7.4 1.1.4h.1V14h-.1a1.7 1.7 0 0 0-1.8 1Z" /></>,
  "sign-out": <><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M13 3h8v18h-8" /></>,
  "chevron-down": <path d="m7 10 5 5 5-5" />,
  sort: <path d="m8 9 4-4 4 4M16 15l-4 4-4-4" />,
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12 4 4L19 6" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
  "eye-off": <><path d="m3 3 18 18" /><path d="M10.6 6.2A11.3 11.3 0 0 1 12 6c6.5 0 10 6 10 6a18.2 18.2 0 0 1-3.2 3.8" /><path d="M6.2 6.2A18.1 18.1 0 0 0 2 12s3.5 6 10 6a10.9 10.9 0 0 0 3.4-.5" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
  "arrow-left": <><path d="m15 18-6-6 6-6" /><path d="M9 12h10" /></>,
  "arrow-right": <path d="M5 12h14M14 7l5 5-5 5" />,
  "more-horizontal": <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  pencil: <><path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" /><path d="m14 7 3 3" /></>,
  file: <><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v5h5" /></>,
  trend: <path d="M4 20h16M6 16l4-4 3 3 5-7" />,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 12h18" /></>,
  "bar-chart": <path d="M4 19V8M10 19V4M16 19v-7M22 19H2" />,
  "graduation-cap": <><path d="m3 10 9-5 9 5-9 5-9-5Z" /><path d="M7 12v5c3 2 7 2 10 0v-5" /></>,
  award: <><circle cx="12" cy="8" r="5" /><path d="m8.5 12.5-2 8 5.5-3 5.5 3-2-8" /></>,
  building: <><path d="M4 21V7l8-4 8 4v14" /><path d="M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3" /></>,
  upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M4 15v5h16v-5" /></>,
  sparkles: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" /><path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z" /></>,
} satisfies Record<string, ReactElement>;

export type IconName = keyof typeof glyphs;

export const iconNames = Object.keys(glyphs) as IconName[];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children" | "name"> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}

/** Decorative icon. Controls that contain only an icon must provide their own accessible name. */
export function Icon({ name, size = 18, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
      aria-hidden="true"
      focusable="false"
    >
      {glyphs[name]}
    </svg>
  );
}
