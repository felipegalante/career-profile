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

export const parityPairs: ParityPair[] = [
  { id: "base-body", artifact: "design-system/type-layout/type-layout.html", artifactSelector: "body", gallery: "foundations/type-layout", gallerySelector: "body", properties: ["font-family", "font-size", "line-height", "color", "background-color"] },
  { id: "type-display", artifact: "design-system/type-layout/type-layout.html", artifactSelector: ".specimen .display", gallery: "foundations/type-layout", properties: TYPE },
  { id: "type-record", artifact: "design-system/type-layout/type-layout.html", artifactSelector: ".specimen .record-title", gallery: "foundations/type-layout", properties: TYPE },
  { id: "type-section", artifact: "design-system/type-layout/type-layout.html", artifactSelector: ".specimen .section-title", gallery: "foundations/type-layout", properties: TYPE },
  { id: "type-label", artifact: "design-system/type-layout/type-layout.html", artifactSelector: ".specimen .label", gallery: "foundations/type-layout", properties: TYPE },
  { id: "type-meta", artifact: "design-system/type-layout/type-layout.html", artifactSelector: ".specimen .meta.faint", gallery: "foundations/type-layout", properties: TYPE },
  { id: "type-overline", artifact: "design-system/type-layout/type-layout.html", artifactSelector: ".specimen .overline", gallery: "foundations/type-layout", properties: TYPE },
  { id: "type-mono", artifact: "design-system/type-layout/type-layout.html", artifactSelector: ".specimen .mono", gallery: "foundations/type-layout", properties: ["font-family", "font-size", "line-height"] },
  { id: "swatch-canvas", artifact: "design-system/color/color.html", artifactSelector: ".swatch:nth-child(1)", gallery: "foundations/color", properties: SWATCH },
  { id: "swatch-brand", artifact: "design-system/color/color.html", artifactSelector: ".swatch:nth-child(4)", gallery: "foundations/color", properties: SWATCH },
  { id: "swatch-success", artifact: "design-system/color/color.html", artifactSelector: "section:nth-of-type(2) .swatch:nth-child(1)", gallery: "foundations/color", properties: SWATCH },
  { id: "swatch-danger", artifact: "design-system/color/color.html", artifactSelector: "section:nth-of-type(2) .swatch:nth-child(4)", gallery: "foundations/color", properties: SWATCH },
];
