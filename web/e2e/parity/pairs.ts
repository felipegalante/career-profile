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

const CALLOUT = ["display", "gap", "align-items", "padding-top", "padding-left", "border-radius", "background-color", "color"];
const TOAST = ["display", "gap", "padding-top", "padding-left", "border-radius", "background-color", "color", "box-shadow"];
const BADGE = ["display", "gap", "height", "padding-left", "border-radius", "background-color", "color", "font-size", "font-weight"];
const CHIP = ["display", "gap", "min-height", "padding-top", "padding-left", "border-radius", "background-color", "color", "font-size", "font-weight", "box-shadow"];
const FEEDBACK = "design-system/primitives/feedback.html";
const FEEDBACK_PAGE = "primitives/feedback";
const feedback: ParityPair[] = [
  { id: "callout-info", artifact: FEEDBACK, artifactSelector: ".callout:not(.success):not(.warning):not(.danger)", gallery: FEEDBACK_PAGE, properties: CALLOUT },
  { id: "callout-success", artifact: FEEDBACK, artifactSelector: ".callout.success", gallery: FEEDBACK_PAGE, properties: CALLOUT },
  { id: "callout-warning", artifact: FEEDBACK, artifactSelector: ".callout.warning", gallery: FEEDBACK_PAGE, properties: CALLOUT },
  { id: "callout-danger", artifact: FEEDBACK, artifactSelector: ".callout.danger", gallery: FEEDBACK_PAGE, properties: CALLOUT },
  { id: "toast-success", artifact: "skills/skills-feedback.html", artifactSelector: ".toast.success", gallery: FEEDBACK_PAGE, properties: TOAST },
  { id: "toast-danger", artifact: FEEDBACK, artifactSelector: ".toast-sample.danger", gallery: FEEDBACK_PAGE, gallerySelector: '[data-parity-id="toast-success"] ~ div', properties: ["background-color", "color", "border-radius", "box-shadow", "padding-top", "padding-left"] },
  { id: "toast-description", artifact: "skills/skills-feedback.html", artifactSelector: ".toast.success .meta.faint", gallery: FEEDBACK_PAGE, gallerySelector: '[data-parity-id="toast-success"] b + div', properties: ["font-size", "line-height", "color"] },
  { id: "skeleton-lg", artifact: FEEDBACK, artifactSelector: ".skeleton.skel-lg", gallery: FEEDBACK_PAGE, gallerySelector: '[data-parity-id="skeleton-lg"] > div', properties: ["height", "border-radius", "background-image", "background-size"] },
  { id: "badge-brand", artifact: "design-system/overview/overview.html", artifactSelector: ".ds-head .badge.brand", gallery: FEEDBACK_PAGE, properties: BADGE },
  { id: "badge-success", artifact: "design-system/overview/overview.html", artifactSelector: ".badge.success", gallery: FEEDBACK_PAGE, properties: BADGE },
  { id: "avatar-lg", artifact: "profile/profile.html", artifactSelector: ".profile-hero .avatar.lg", gallery: FEEDBACK_PAGE, properties: ["width", "height", "border-radius", "background-color", "color", "font-size", "font-weight"] },
  { id: "chip-brand", artifact: "design-system/components/profile-records.html", artifactSelector: ".chip", gallery: FEEDBACK_PAGE, properties: CHIP },
  { id: "chip-neutral", artifact: "profile/profile.html", artifactSelector: ".chip.neutral", gallery: FEEDBACK_PAGE, properties: CHIP },
  { id: "chip-custom", artifact: "design-system/components/skills.html", artifactSelector: ".chip.custom", gallery: FEEDBACK_PAGE, properties: CHIP },
  { id: "progress", artifact: "design-system/overview/overview.html", artifactSelector: ".progress", gallery: FEEDBACK_PAGE, properties: ["height", "border-radius", "background-color"] },
  { id: "progress-fill", artifact: "design-system/overview/overview.html", artifactSelector: ".progress span", gallery: FEEDBACK_PAGE, gallerySelector: '[data-parity-id="progress"] span', properties: ["height", "border-radius", "background-color"] },
  { id: "stepdot-on", artifact: "onboarding/career.html", artifactSelector: ".stepdot.on", gallery: FEEDBACK_PAGE, gallerySelector: '[data-parity-id="stepper"] li[aria-current="step"]', properties: ["width", "height", "border-radius", "background-color", "color", "font-family", "font-size", "font-weight"] },
  { id: "stepdot-off", artifact: "onboarding/career.html", artifactSelector: ".stepdot:not(.on)", gallery: FEEDBACK_PAGE, gallerySelector: '[data-parity-id="stepper"] li:last-child', properties: ["width", "height", "border-radius", "background-color", "color"] },
  { id: "stepbar", artifact: "onboarding/career.html", artifactSelector: ".stepbar", gallery: FEEDBACK_PAGE, gallerySelector: '[data-parity-id="stepper"] li[aria-hidden="true"]', properties: ["height", "background-color"] },
  { id: "kbd", artifact: "design-system/shell/keyboard-shortcuts.html", artifactSelector: ".kbd", gallery: FEEDBACK_PAGE, properties: ["min-width", "height", "padding-left", "border-radius", "background-color", "box-shadow", "color", "font-family", "font-size", "font-weight"] },
];

const COLLECTION = "design-system/states/collection-states.html";
const states: ParityPair[] = [
  { id: "empty", artifact: COLLECTION, artifactSelector: ".empty", gallery: "states/collection-states", properties: ["padding-top", "padding-left", "text-align"] },
  { id: "empty-iconbox", artifact: COLLECTION, artifactSelector: ".empty .iconbox", gallery: "states/collection-states", gallerySelector: '[data-parity-id="empty"] > div[aria-hidden]', properties: ["width", "height", "border-radius", "background-color", "color", "margin-bottom"] },
  { id: "empty-title", artifact: COLLECTION, artifactSelector: ".empty h3", gallery: "states/collection-states", gallerySelector: '[data-parity-id="empty"] h3', properties: ["font-size", "font-weight", "line-height", "margin-top", "margin-bottom"] },
  { id: "empty-description", artifact: COLLECTION, artifactSelector: ".empty p", gallery: "states/collection-states", gallerySelector: '[data-parity-id="empty"] p', properties: ["color", "max-width", "margin-top", "margin-bottom"] },
  { id: "empty-error-iconbox", artifact: COLLECTION, artifactSelector: "section:nth-of-type(4) .iconbox", gallery: "states/collection-states", gallerySelector: '[data-parity-id="empty-error"] > div[aria-hidden]', properties: ["background-color", "color"] },
  { id: "help-error", artifact: "design-system/states/form-states.html", artifactSelector: ".help.danger-text", gallery: "states/form-states", gallerySelector: '[data-parity-id="field-url"] > :last-child', properties: ["font-size", "color"] },
];

const OVERLAYS = "design-system/primitives/overlays.html";
const MENU_ITEM = ["height", "border-radius", "padding-left", "padding-right", "display", "gap", "color"];
const overlays: ParityPair[] = [
  { id: "dialog-head", artifact: OVERLAYS, artifactSelector: ".dialog-head", gallery: "primitives/overlays", properties: ["display", "align-items", "justify-content", "padding-top", "padding-right", "padding-bottom", "padding-left"] },
  { id: "dialog-title", artifact: OVERLAYS, artifactSelector: ".dialog-head h2", gallery: "primitives/overlays", gallerySelector: '[data-parity-id="dialog-head"] h2', properties: ["font-size", "line-height", "font-weight", "letter-spacing", "margin-top", "margin-bottom"] },
  { id: "dialog-close", artifact: OVERLAYS, artifactSelector: ".dialog-head .btn.icon.ghost", gallery: "primitives/overlays", gallerySelector: '[data-parity-id="dialog-head"] button', properties: ["width", "height", "padding-left", "border-radius", "color", "background-color"] },
  { id: "dialog-body", artifact: OVERLAYS, artifactSelector: ".dialog-body", gallery: "primitives/overlays", properties: ["padding-top", "padding-right", "padding-bottom", "padding-left"] },
  { id: "dialog-foot", artifact: OVERLAYS, artifactSelector: ".dialog-foot", gallery: "primitives/overlays", properties: ["display", "justify-content", "gap", "padding-top", "padding-right", "padding-bottom", "padding-left", "box-shadow"] },
  { id: "menu", artifact: OVERLAYS, artifactSelector: ".menu", gallery: "primitives/overlays", properties: ["width", "background-color", "box-shadow", "border-radius", "padding-top", "padding-left"] },
  { id: "menu-item", artifact: OVERLAYS, artifactSelector: ".menu .mi:first-child", gallery: "primitives/overlays", properties: MENU_ITEM },
  { id: "menu-item-danger", artifact: OVERLAYS, artifactSelector: ".menu .mi.danger-text", gallery: "primitives/overlays", properties: ["color"] },
  { id: "tabs", artifact: "profile/account.html", artifactSelector: ".tabs", gallery: "primitives/overlays", properties: ["display", "align-items", "gap", "border-bottom-width", "border-bottom-color", "padding-left", "padding-right"] },
  { id: "tab-selected", artifact: "profile/account.html", artifactSelector: ".tab.on", gallery: "primitives/overlays", gallerySelector: '[data-parity-id="tabs"] [aria-selected="true"]', properties: ["height", "padding-left", "color", "font-weight", "border-bottom-width", "border-bottom-color"] },
  { id: "tab", artifact: "profile/account.html", artifactSelector: ".tab:not(.on)", gallery: "primitives/overlays", gallerySelector: '[data-parity-id="tabs"] [aria-selected="false"]', properties: ["height", "padding-left", "color", "font-weight", "border-bottom-width"] },
  { id: "dialog-overlay", artifact: "experience/experience-add.html", artifactSelector: ".overlay", gallery: "primitives/dialog-open", gallerySelector: "[data-blocking-dialog]", properties: ["position", "display", "align-items", "justify-content", "padding-top", "padding-left", "background-color", "z-index"] },
  { id: "dialog-surface", artifact: "experience/experience-add.html", artifactSelector: ".dialog", gallery: "primitives/dialog-open", gallerySelector: "[data-blocking-dialog] > *", properties: ["width", "max-height", "overflow-y", "background-color", "border-radius", "box-shadow"] },
];

export const parityPairs: ParityPair[] = [...foundations, ...actionsInputs, ...feedback, ...states, ...overlays];
