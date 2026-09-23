/*
 * Computed-style parity: each pair names an element in a design artifact and the gallery element
 * (marked with data-parity-id) that reproduces it. Only properties the artifact rule declares are compared.
 */
export type ParityState = "default" | "hover" | "focus";

export interface ParityPair {
  id: string;
  artifact: string;
  artifactSelector: string;
  gallery: string;
  /** Defaults to [data-parity-id="<id>"]. */
  gallerySelector?: string;
  properties: string[];
  state?: ParityState;
}

const TYPE = ["font-family", "font-size", "line-height", "font-weight", "letter-spacing", "text-transform", "color"];
const SWATCH = ["height", "border-radius", "padding-top", "padding-left", "font-size", "font-weight", "box-shadow", "background-color", "color"];
const BUTTON = ["height", "padding-left", "padding-right", "border-radius", "background-color", "color", "font-size", "font-weight", "box-shadow", "gap", "opacity", "cursor"];
const INPUT = ["height", "padding-top", "padding-left", "padding-right", "border-radius", "background-color", "box-shadow", "font-size", "line-height", "color"];

const TYPE_LAYOUT = "design-system/type-layout/type-layout.html";
const foundations: ParityPair[] = [
  { id: "base-body", artifact: TYPE_LAYOUT, artifactSelector: "body", gallery: "foundations/type-layout", gallerySelector: "body", properties: ["font-family", "font-size", "line-height", "color", "background-color"] },
  { id: "type-display", artifact: TYPE_LAYOUT, artifactSelector: ".specimen .display", gallery: "foundations/type-layout", properties: TYPE },
  { id: "type-record", artifact: TYPE_LAYOUT, artifactSelector: ".specimen .record-title", gallery: "foundations/type-layout", properties: TYPE },
  { id: "type-section", artifact: TYPE_LAYOUT, artifactSelector: ".specimen .section-title", gallery: "foundations/type-layout", properties: TYPE },
  { id: "type-label", artifact: TYPE_LAYOUT, artifactSelector: ".specimen .label", gallery: "foundations/type-layout", properties: TYPE },
  { id: "type-meta", artifact: TYPE_LAYOUT, artifactSelector: ".specimen .meta.faint", gallery: "foundations/type-layout", properties: TYPE },
  { id: "type-overline", artifact: TYPE_LAYOUT, artifactSelector: ".specimen .overline", gallery: "foundations/type-layout", properties: TYPE },
  { id: "type-mono", artifact: TYPE_LAYOUT, artifactSelector: ".specimen .mono", gallery: "foundations/type-layout", properties: ["font-family", "font-size", "line-height"] },
  { id: "swatch-canvas", artifact: "design-system/color/color.html", artifactSelector: ".swatch:nth-child(1)", gallery: "foundations/color", properties: SWATCH },
  { id: "swatch-brand", artifact: "design-system/color/color.html", artifactSelector: ".swatch:nth-child(4)", gallery: "foundations/color", properties: SWATCH },
  { id: "swatch-success", artifact: "design-system/color/color.html", artifactSelector: "section:nth-of-type(2) .swatch:nth-child(1)", gallery: "foundations/color", properties: SWATCH },
  { id: "swatch-danger", artifact: "design-system/color/color.html", artifactSelector: "section:nth-of-type(2) .swatch:nth-child(4)", gallery: "foundations/color", properties: SWATCH },
];

const ACTIONS = "design-system/primitives/actions-inputs.html";
const ACTIONS_PAGE = "primitives/actions-inputs";
const actionsInputs: ParityPair[] = [
  { id: "btn-primary", artifact: ACTIONS, artifactSelector: ".btn.primary:not(.disabled)", gallery: ACTIONS_PAGE, properties: BUTTON },
  { id: "btn-primary-hover", artifact: ACTIONS, artifactSelector: ".btn.primary:not(.disabled)", gallery: ACTIONS_PAGE, gallerySelector: '[data-parity-id="btn-primary"]', properties: ["background-color"], state: "hover" },
  { id: "btn-secondary", artifact: ACTIONS, artifactSelector: ".btn.secondary", gallery: ACTIONS_PAGE, properties: BUTTON },
  { id: "btn-ghost", artifact: ACTIONS, artifactSelector: ".btn.ghost", gallery: ACTIONS_PAGE, properties: BUTTON },
  { id: "btn-danger", artifact: ACTIONS, artifactSelector: ".btn.danger", gallery: ACTIONS_PAGE, properties: BUTTON },
  { id: "btn-disabled", artifact: ACTIONS, artifactSelector: ".btn.primary.disabled", gallery: ACTIONS_PAGE, properties: BUTTON },
  { id: "field-layout", artifact: ACTIONS, artifactSelector: ".grid2 .field", gallery: ACTIONS_PAGE, gallerySelector: '[data-parity-id="field-email"]', properties: ["display", "flex-direction", "gap"] },
  { id: "field-label", artifact: ACTIONS, artifactSelector: ".grid2 .field label", gallery: ACTIONS_PAGE, gallerySelector: '[data-parity-id="field-email"] label', properties: ["font-size", "font-weight", "line-height", "color"] },
  { id: "input-default", artifact: ACTIONS, artifactSelector: ".grid2 .field:nth-child(1) .input", gallery: ACTIONS_PAGE, gallerySelector: '[data-parity-id="field-email"] input', properties: INPUT },
  { id: "input-focus", artifact: ACTIONS, artifactSelector: ".input.focus", gallery: ACTIONS_PAGE, gallerySelector: '[data-parity-id="field-location"] input', properties: INPUT, state: "focus" },
  { id: "input-error", artifact: ACTIONS, artifactSelector: ".input.error", gallery: ACTIONS_PAGE, gallerySelector: '[data-parity-id="field-linkedin"] input', properties: INPUT },
  { id: "check-on", artifact: ACTIONS, artifactSelector: ".check.on", gallery: ACTIONS_PAGE, gallerySelector: '[data-parity-id="check-current"] span[aria-hidden="true"]', properties: ["width", "height", "border-radius", "background-color", "box-shadow", "color"] },
  { id: "radio-on", artifact: ACTIONS, artifactSelector: ".radio.on", gallery: ACTIONS_PAGE, gallerySelector: '[data-parity-id="radio-primary"] span[aria-hidden="true"]', properties: ["width", "height", "border-radius", "box-shadow"] },
  { id: "selectbox", artifact: ACTIONS, artifactSelector: ".selectbox", gallery: ACTIONS_PAGE, gallerySelector: '[data-parity-id="select-type"] button', properties: ["height", "border-radius", "background-color", "padding-left", "padding-right", "color", "font-size"] },
  { id: "password-toggle", artifact: ACTIONS, artifactSelector: ".trail.buttonlike", gallery: ACTIONS_PAGE, gallerySelector: '[data-parity-id="field-password"] button', properties: ["padding-top", "padding-left", "border-radius", "color"] },
];

export const parityPairs: ParityPair[] = [...foundations, ...actionsInputs];
