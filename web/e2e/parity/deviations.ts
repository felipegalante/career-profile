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
  { id: "combo-option-meta", property: "color", reason: INK_3 },
  { id: "combo-disabled", property: "color", reason: INK_3 },
  { id: "record-meta", property: "color", reason: INK_3 },
  { id: "section-description", property: "color", reason: INK_3 },
  { id: "lane-count", property: "color", reason: INK_3 },
  { id: "lane-count", property: "text-transform", reason: "Lane counts are written \"Showing n of m\" and uppercased in CSS so screen readers read words rather than capitals." },
  { id: "drag-handle", property: "color", reason: INK_3 },
  { id: "chip-remove", property: "color", reason: INK_3 },
  { id: "lane-empty", property: "color", reason: INK_3 },
  { id: "table-th", property: "color", reason: INK_3 },
  { id: "sort-head", property: "color", reason: INK_3 },
  { id: "help-error", property: "color", reason: "In the artifact, `.field .help` outranks `.danger-text`, so field errors render grey; errors use the danger color the class names intend." },
  { id: "menu-item-danger", property: "color", reason: "In the artifact, `.menu .mi` outranks `.danger-text`, so destructive menu items render grey; they use the danger color the class names intend." },
];
