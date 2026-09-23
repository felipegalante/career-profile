/*
 * Intentional differences from the artifacts. The parity suite asserts that each listed property
 * really differs, so an entry must be removed once the difference no longer exists.
 */
export interface ParityDeviation {
  id: string;
  property: string;
  reason: string;
}

const INK_3 = "--ink-3 is darkened from L 0.54 to 0.51 so faint text meets WCAG AA contrast.";

export const parityDeviations: ParityDeviation[] = [
  { id: "type-meta", property: "color", reason: INK_3 },
  { id: "type-overline", property: "color", reason: INK_3 },
  { id: "password-toggle", property: "color", reason: INK_3 },
];
