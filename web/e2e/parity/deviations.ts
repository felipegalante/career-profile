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
  { id: "toast-description", property: "color", reason: INK_3 },
  { id: "stepdot-off", property: "color", reason: INK_3 },
  { id: "nav-group", property: "color", reason: INK_3 },
  { id: "palette-group", property: "color", reason: INK_3 },
  { id: "help-error", property: "color", reason: "In the artifact, `.field .help` outranks `.danger-text`, so field errors render grey; errors use the danger color the class names intend." },
  { id: "menu-item-danger", property: "color", reason: "In the artifact, `.menu .mi` outranks `.danger-text`, so destructive menu items render grey; they use the danger color the class names intend." },
];
