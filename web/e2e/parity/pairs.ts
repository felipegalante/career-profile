/*
 * Computed-style parity: each pair names an element in a design artifact and the gallery element
 * (marked with data-parity-id) that reproduces it. Only properties the artifact rule declares are compared.
 */
export type ParityState = "default" | "hover" | "focus";

/** Interaction run on a page before measuring, for states that only exist after input. */
export type ParityAction = { press: string } | { click: string } | { type: string; text: string } | { waitFor: string };

export interface ParityPair {
  id: string;
  artifact: string;
  artifactSelector: string;
  gallery: string;
  /** Defaults to [data-parity-id="<id>"]. */
  gallerySelector?: string;
  properties: string[];
  state?: ParityState;
  viewport?: { width: number; height: number };
  artifactAction?: ParityAction | ParityAction[];
  galleryAction?: ParityAction | ParityAction[];
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

const SIDEBAR = "design-system/shell/sidebar.html";
const SHELL_PAGE = "shell/sidebar";
const COLLAPSE: ParityAction = { press: "Control+b" };
const shell: ParityPair[] = [
  { id: "side", artifact: SIDEBAR, artifactSelector: ".side", gallery: SHELL_PAGE, gallerySelector: "aside", properties: ["width", "position", "background-color", "box-shadow", "padding-top", "padding-left", "display", "flex-direction"] },
  { id: "side-brand", artifact: SIDEBAR, artifactSelector: ".side .brand", gallery: SHELL_PAGE, gallerySelector: "aside > div:first-child", properties: ["display", "gap", "padding-top", "padding-left", "padding-bottom", "font-size", "font-weight"] },
  { id: "logo", artifact: SIDEBAR, artifactSelector: ".side .logo", gallery: SHELL_PAGE, gallerySelector: "aside > div:first-child > div", properties: ["width", "height", "border-radius", "background-color", "color", "font-family", "font-size", "font-weight"] },
  { id: "nav-group", artifact: SIDEBAR, artifactSelector: ".nav-group", gallery: SHELL_PAGE, gallerySelector: "aside nav div[aria-hidden]", properties: ["font-size", "line-height", "font-weight", "letter-spacing", "text-transform", "color", "padding-top", "padding-left", "padding-bottom"] },
  { id: "nav-link-current", artifact: SIDEBAR, artifactSelector: ".nav a.on", gallery: SHELL_PAGE, gallerySelector: 'aside [aria-current="page"]', properties: ["height", "padding-left", "border-radius", "display", "gap", "background-color", "color", "font-weight"] },
  { id: "nav-link", artifact: SIDEBAR, artifactSelector: ".nav a:not(.on)", gallery: SHELL_PAGE, gallerySelector: "aside nav a:not([aria-current])", properties: ["height", "padding-left", "border-radius", "background-color", "color", "font-weight"] },
  { id: "nav-link-hover", artifact: "profile/profile.html", artifactSelector: ".nav a:not(.on)", gallery: SHELL_PAGE, gallerySelector: "aside nav a:not([aria-current])", properties: ["background-color", "color"], state: "hover" },
  { id: "nav-icon", artifact: SIDEBAR, artifactSelector: ".nav a svg", gallery: SHELL_PAGE, gallerySelector: "aside nav a svg", properties: ["width", "height", "stroke-width"] },
  { id: "userbox", artifact: SIDEBAR, artifactSelector: ".userbox", gallery: SHELL_PAGE, gallerySelector: 'aside [aria-haspopup="menu"]', properties: ["margin-top", "padding-top", "padding-left", "padding-bottom", "box-shadow", "display", "gap", "border-radius"] },
  { id: "main", artifact: SIDEBAR, artifactSelector: ".main", gallery: SHELL_PAGE, gallerySelector: "main", properties: ["margin-left", "padding-top", "padding-left", "padding-right", "padding-bottom"] },
  { id: "phead", artifact: SIDEBAR, artifactSelector: ".phead", gallery: SHELL_PAGE, gallerySelector: "main > div:first-child", properties: ["display", "justify-content", "align-items", "gap", "margin-bottom"] },
  { id: "phead-title", artifact: SIDEBAR, artifactSelector: ".phead h1", gallery: SHELL_PAGE, gallerySelector: "main h1", properties: ["font-size", "line-height", "font-weight", "letter-spacing", "margin-top", "margin-bottom"] },
  { id: "phead-description", artifact: SIDEBAR, artifactSelector: ".phead p", gallery: SHELL_PAGE, gallerySelector: "main h1 + p", properties: ["color", "margin-top", "margin-bottom"] },
  { id: "command-trigger", artifact: SIDEBAR, artifactSelector: ".command-trigger", gallery: SHELL_PAGE, gallerySelector: 'main [aria-keyshortcuts="Meta+K Control+K"]', properties: ["height", "min-width", "border-radius", "background-color", "color", "padding-left", "gap"] },
  { id: "sidebar-toggle", artifact: SIDEBAR, artifactSelector: ".sidebar-toggle", gallery: SHELL_PAGE, gallerySelector: 'main [aria-keyshortcuts="Meta+B Control+B"]', properties: ["height", "border-radius", "background-color", "color", "padding-left", "gap"] },
  { id: "side-collapsed", artifact: SIDEBAR, artifactSelector: ".side", gallery: SHELL_PAGE, gallerySelector: "aside", properties: ["width", "padding-left", "padding-right"], artifactAction: COLLAPSE, galleryAction: COLLAPSE },
  { id: "main-collapsed", artifact: SIDEBAR, artifactSelector: ".main", gallery: SHELL_PAGE, gallerySelector: "main", properties: ["margin-left"], artifactAction: COLLAPSE, galleryAction: COLLAPSE },
  { id: "nav-link-collapsed", artifact: SIDEBAR, artifactSelector: ".nav a.on", gallery: SHELL_PAGE, gallerySelector: 'aside [aria-current="page"]', properties: ["justify-content", "padding-left", "padding-right"], artifactAction: COLLAPSE, galleryAction: COLLAPSE },
  { id: "account-menu", artifact: "profile/avatar-menu.html", artifactSelector: ".user-menu-popover", gallery: SHELL_PAGE, gallerySelector: '[role="menu"]', properties: ["width", "background-color", "border-radius", "box-shadow", "padding-top", "padding-left"], galleryAction: { click: 'aside [aria-haspopup="menu"]' } },
  { id: "account-menu-item", artifact: "profile/avatar-menu.html", artifactSelector: ".user-menu-item:not(.danger)", gallery: SHELL_PAGE, gallerySelector: '[role="menu"] [role="menuitem"]:not(:last-child)', properties: ["height", "padding-left", "border-radius", "display", "gap", "color", "font-weight"], galleryAction: { click: 'aside [aria-haspopup="menu"]' } },
  { id: "account-menu-danger", artifact: "profile/avatar-menu.html", artifactSelector: ".user-menu-item.danger", gallery: SHELL_PAGE, gallerySelector: '[role="menu"] [role="menuitem"]:last-child', properties: ["color"], galleryAction: { click: 'aside [aria-haspopup="menu"]' } },
  { id: "account-menu-separator", artifact: "profile/avatar-menu.html", artifactSelector: ".user-menu-sep", gallery: SHELL_PAGE, gallerySelector: '[role="menu"] [role="separator"]', properties: ["height", "background-color", "margin-top", "margin-left"], galleryAction: { click: 'aside [aria-haspopup="menu"]' } },
  { id: "mobile-top", artifact: "profile/overview-mobile.html", artifactSelector: ".mobile-top", gallery: SHELL_PAGE, gallerySelector: "header", properties: ["display", "justify-content", "align-items", "padding-top", "padding-left", "background-color", "border-bottom-width", "border-bottom-color"], viewport: { width: 390, height: 844 } },
  { id: "mobile-menu-button", artifact: "profile/overview-mobile.html", artifactSelector: ".mobile-top .btn", gallery: SHELL_PAGE, gallerySelector: "header button", properties: ["width", "height", "border-radius", "background-color", "box-shadow"], viewport: { width: 390, height: 844 } },
];

const PALETTE = "design-system/components/command-palette.html";
const PALETTE_PAGE = "components/command-palette";
const palette: ParityPair[] = [
  { id: "palette", artifact: PALETTE, artifactSelector: ".command-palette", gallery: PALETTE_PAGE, gallerySelector: 'div:has(> [aria-label="Command palette"])', properties: ["width", "background-color", "border-radius", "box-shadow"] },
  { id: "palette-search", artifact: PALETTE, artifactSelector: ".command-search", gallery: PALETTE_PAGE, gallerySelector: '[aria-label="Command palette"] > div:first-child', properties: ["padding-top", "padding-left", "border-bottom-width", "border-bottom-color"] },
  { id: "palette-input", artifact: PALETTE, artifactSelector: ".command-search .input", gallery: PALETTE_PAGE, gallerySelector: '[role="dialog"] input', properties: ["height", "background-color", "border-radius", "padding-left"] },
  { id: "palette-body", artifact: PALETTE, artifactSelector: ".command-body", gallery: PALETTE_PAGE, gallerySelector: '[role="dialog"] [role="menu"]', properties: ["max-height", "padding-top", "padding-left", "overflow-y"] },
  { id: "palette-group", artifact: PALETTE, artifactSelector: ".command-group-title", gallery: PALETTE_PAGE, gallerySelector: '[role="dialog"] [role="menu"] header', properties: ["font-size", "line-height", "font-weight", "letter-spacing", "text-transform", "color", "padding-top", "padding-left", "padding-bottom"] },
  { id: "palette-item-active", artifact: PALETTE, artifactSelector: ".command-item.active", gallery: PALETTE_PAGE, gallerySelector: '[role="menuitem"][data-focused]', properties: ["height", "padding-left", "border-radius", "display", "gap", "background-color", "color"] },
  { id: "palette-item", artifact: PALETTE, artifactSelector: ".command-item:not(.active)", gallery: PALETTE_PAGE, gallerySelector: '[role="menuitem"]:not([data-focused])', properties: ["height", "padding-left", "border-radius", "background-color", "color"] },
  { id: "palette-item-title", artifact: PALETTE, artifactSelector: ".command-item:not(.active) .command-title", gallery: PALETTE_PAGE, gallerySelector: '[role="menuitem"]:not([data-focused]) div > div:first-child', properties: ["font-weight", "color"] },
  { id: "palette-foot", artifact: PALETTE, artifactSelector: ".dialog-foot", gallery: PALETTE_PAGE, gallerySelector: '[role="dialog"] > div:last-child', properties: ["display", "justify-content", "padding-top", "padding-left", "box-shadow"] },
];

const COMBO = "design-system/components/catalog-combobox.html";
const COMBO_PAGE = "components/catalog-combobox";
const typeCompany: ParityAction[] = [{ type: '[data-parity-id="combo-company"] input', text: "shop" }, { waitFor: '[role="option"]:nth-child(3)' }];
const OPTION = ["min-height", "padding-top", "padding-left", "display", "justify-content", "align-items", "gap"];
const combobox: ParityPair[] = [
  { id: "combo-input", artifact: COMBO, artifactSelector: ".combo .input.with-icon", gallery: COMBO_PAGE, gallerySelector: '[data-parity-id="combo-company"] input', properties: ["height", "padding-left", "border-radius", "background-color", "box-shadow"], galleryAction: typeCompany },
  { id: "combo-menu", artifact: COMBO, artifactSelector: ".combo-menu", gallery: COMBO_PAGE, gallerySelector: 'div:has(> [role="listbox"])', properties: ["border-radius", "background-color", "box-shadow"], galleryAction: typeCompany },
  { id: "combo-create", artifact: COMBO, artifactSelector: ".combo-menu .create-option", gallery: COMBO_PAGE, gallerySelector: '[role="option"]:first-child', properties: [...OPTION, "background-color", "color", "font-weight"], galleryAction: typeCompany },
  { id: "combo-option", artifact: COMBO, artifactSelector: ".combo-menu .option:nth-child(3)", gallery: COMBO_PAGE, gallerySelector: '[role="option"]:nth-child(3)', properties: [...OPTION, "box-shadow", "background-color"], galleryAction: typeCompany },
  { id: "combo-option-active", artifact: COMBO, artifactSelector: ".combo-menu .option.active", gallery: COMBO_PAGE, gallerySelector: '[role="option"][data-focused]', properties: ["background-color"], galleryAction: [...typeCompany, { press: "ArrowDown" }, { press: "ArrowDown" }] },
  { id: "combo-option-meta", artifact: COMBO, artifactSelector: ".combo-menu .option .meta.faint", gallery: COMBO_PAGE, gallerySelector: '[role="option"]:nth-child(2) [slot="description"], [role="option"]:nth-child(2) > span:last-child', properties: ["font-size", "line-height", "color"], galleryAction: typeCompany },
  { id: "combo-match", artifact: "experience/company-search.html", artifactSelector: ".option.active b", gallery: COMBO_PAGE, gallerySelector: '[role="option"] b', properties: ["font-weight"], galleryAction: typeCompany },
  { id: "combo-disabled", artifact: "skills/skills-search.html", artifactSelector: ".option.disabled", gallery: COMBO_PAGE, gallerySelector: '[role="option"][aria-disabled="true"]', properties: ["color", "background-color"], galleryAction: [{ type: '[data-parity-id="combo-skill"] input', text: "type" }, { waitFor: '[role="option"][aria-disabled="true"]' }] },
  { id: "combo-empty", artifact: COMBO, artifactSelector: ".combo-menu .empty", gallery: COMBO_PAGE, gallerySelector: '[role="listbox"] header', properties: ["padding-top", "padding-left", "text-align"], galleryAction: [{ type: '[data-parity-id="combo-empty"] input', text: "unknown value" }, { waitFor: '[role="listbox"] header' }] },
];

const RECORDS = "design-system/components/profile-records.html";
const EMPTY_PROFILE = "profile/overview-empty.html";
const FOCUS = "focus/focus.html";
const profile: ParityPair[] = [
  { id: "record", artifact: RECORDS, artifactSelector: ".record:nth-child(2)", gallery: "components/profile-records", gallerySelector: '[data-parity-id="records"] > div:nth-child(2)', properties: ["padding-top", "padding-left", "box-shadow"] },
  { id: "record-head", artifact: RECORDS, artifactSelector: ".record-head", gallery: "components/profile-records", gallerySelector: '[data-parity-id="records"] > div > div:first-child', properties: ["display", "justify-content", "gap"] },
  { id: "record-title", artifact: RECORDS, artifactSelector: ".record h3", gallery: "components/profile-records", gallerySelector: '[data-parity-id="records"] h3', properties: ["font-size", "line-height", "font-weight", "margin-top", "margin-bottom"] },
  { id: "record-subtitle", artifact: RECORDS, artifactSelector: ".record p", gallery: "components/profile-records", gallerySelector: '[data-parity-id="records"] h3 + p', properties: ["color", "margin-top", "margin-bottom"] },
  { id: "record-meta", artifact: RECORDS, artifactSelector: ".record .meta.faint", gallery: "components/profile-records", gallerySelector: '[data-parity-id="records"] h3 + p + div', properties: ["font-size", "line-height", "color"] },
  { id: "record-chips", artifact: RECORDS, artifactSelector: ".record .chips", gallery: "components/profile-records", gallerySelector: '[data-parity-id="records"] ul', properties: ["display", "flex-wrap", "gap", "margin-top"] },
  { id: "record-action", artifact: RECORDS, artifactSelector: ".record .btn.icon.ghost", gallery: "components/profile-records", gallerySelector: '[data-parity-id="records"] button', properties: ["width", "height", "border-radius", "color"] },
  { id: "hero", artifact: EMPTY_PROFILE, artifactSelector: ".profile-hero", gallery: "compositions/profile-empty", properties: ["padding-top", "padding-left", "display", "align-items", "gap", "border-radius", "box-shadow"] },
  { id: "hero-name", artifact: EMPTY_PROFILE, artifactSelector: ".profile-hero .record-title", gallery: "compositions/profile-empty", gallerySelector: '[data-parity-id="hero"] > div:nth-child(2) > div:first-child', properties: ["font-size", "line-height", "font-weight", "letter-spacing"] },
  { id: "hero-subtitle", artifact: EMPTY_PROFILE, artifactSelector: ".profile-hero .muted", gallery: "compositions/profile-empty", gallerySelector: '[data-parity-id="hero"] > div:nth-child(2) > div:last-child', properties: ["color"] },
  { id: "placeholder", artifact: EMPTY_PROFILE, artifactSelector: ".profile-placeholder:nth-child(2)", gallery: "compositions/profile-empty", gallerySelector: '[data-parity-id="placeholders"] > div:nth-child(2)', properties: ["padding-top", "padding-left", "display", "align-items", "justify-content", "gap", "box-shadow"] },
  { id: "placeholder-icon", artifact: EMPTY_PROFILE, artifactSelector: ".placeholder-icon", gallery: "compositions/profile-empty", gallerySelector: '[data-parity-id="placeholders"] [aria-hidden="true"]', properties: ["width", "height", "border-radius", "background-color", "color"] },
  { id: "placeholder-title", artifact: EMPTY_PROFILE, artifactSelector: ".placeholder-copy h3", gallery: "compositions/profile-empty", gallerySelector: '[data-parity-id="placeholders"] h3', properties: ["font-size", "line-height", "font-weight", "margin-top"] },
  { id: "placeholder-description", artifact: EMPTY_PROFILE, artifactSelector: ".placeholder-copy p", gallery: "compositions/profile-empty", gallerySelector: '[data-parity-id="placeholders"] h3 + p', properties: ["color", "margin-top", "margin-bottom"] },
  { id: "section-head-page", artifact: "experience/experience.html", artifactSelector: ".surface > .pad.between", gallery: "compositions/experience", gallerySelector: '[data-parity-id="section-page"] > div:first-child', properties: ["padding-top", "padding-left", "display", "align-items", "justify-content", "gap"] },
  { id: "section-title", artifact: "experience/experience.html", artifactSelector: ".pad.between .section-title", gallery: "compositions/experience", gallerySelector: '[data-parity-id="section-page"] h2', properties: ["font-size", "line-height", "font-weight", "letter-spacing", "margin-top"] },
  { id: "section-description", artifact: "experience/experience.html", artifactSelector: ".pad.between .meta.faint", gallery: "compositions/experience", gallerySelector: '[data-parity-id="section-page"] h2 + div', properties: ["font-size", "line-height", "color"] },
  { id: "focus-card", artifact: FOCUS, artifactSelector: ".focus-card", gallery: "compositions/focus", properties: ["padding-top", "padding-left", "border-radius", "box-shadow", "background-color"] },
  { id: "focus-icon", artifact: FOCUS, artifactSelector: ".focus-icon:not(.accent):not(.info)", gallery: "compositions/focus", gallerySelector: '[data-parity-id="focus-card"] [aria-hidden="true"]', properties: ["width", "height", "border-radius", "background-color", "color"] },
  { id: "focus-icon-accent", artifact: FOCUS, artifactSelector: ".focus-icon.accent", gallery: "compositions/focus", gallerySelector: '[data-parity-id="focus-card-accent"] [aria-hidden="true"]', properties: ["background-color", "color"] },
  { id: "focus-icon-info", artifact: FOCUS, artifactSelector: ".focus-icon.info", gallery: "compositions/focus", gallerySelector: '[data-parity-id="focus-card-info"] [aria-hidden="true"]', properties: ["background-color", "color"] },
  { id: "focus-label", artifact: FOCUS, artifactSelector: ".focus-title b", gallery: "compositions/focus", gallerySelector: '[data-parity-id="focus-card"] h3', properties: ["font-size", "line-height", "font-weight"] },
  { id: "focus-description", artifact: FOCUS, artifactSelector: ".focus-card p.muted", gallery: "compositions/focus", gallerySelector: '[data-parity-id="focus-card"] p', properties: ["color", "margin-top", "margin-bottom"] },
];

const SKILLS = "design-system/components/skills.html";
const SKILLS_PAGE = "components/skills";
const TECHNICAL = '[data-skill-category="TECHNICAL"]';
const skills: ParityPair[] = [
  { id: "skill-grid", artifact: SKILLS, artifactSelector: ".skill-grid", gallery: SKILLS_PAGE, gallerySelector: `div:has(> ${TECHNICAL})`, properties: ["display", "column-gap", "row-gap"] },
  { id: "skill-card", artifact: SKILLS, artifactSelector: ".skill-card", gallery: SKILLS_PAGE, gallerySelector: TECHNICAL, properties: ["padding-top", "padding-left", "padding-bottom", "border-radius", "box-shadow", "background-color"] },
  { id: "skill-card-head", artifact: SKILLS, artifactSelector: ".skill-card-head", gallery: SKILLS_PAGE, gallerySelector: `${TECHNICAL} > div:first-child`, properties: ["display", "align-items", "justify-content", "gap", "min-height"] },
  { id: "skill-card-title", artifact: SKILLS, artifactSelector: ".skill-card-head .section-title", gallery: SKILLS_PAGE, gallerySelector: `${TECHNICAL} h3`, properties: ["font-size", "line-height", "font-weight", "letter-spacing"] },
  { id: "skill-card-badge", artifact: SKILLS, artifactSelector: ".skill-card-head .badge", gallery: SKILLS_PAGE, gallerySelector: `${TECHNICAL} > div:first-child > span`, properties: ["height", "padding-left", "border-radius", "background-color", "color", "font-size"] },
  { id: "lane", artifact: SKILLS, artifactSelector: ".lane", gallery: SKILLS_PAGE, gallerySelector: `${TECHNICAL} section`, properties: ["padding-top", "padding-bottom", "border-top-width", "border-top-color"] },
  { id: "lane-head", artifact: SKILLS, artifactSelector: ".lane-head", gallery: SKILLS_PAGE, gallerySelector: `${TECHNICAL} section > div:first-child`, properties: ["display", "align-items", "justify-content", "gap", "margin-bottom"] },
  { id: "level", artifact: SKILLS, artifactSelector: ".level", gallery: SKILLS_PAGE, gallerySelector: `${TECHNICAL} h4`, properties: ["display", "align-items", "gap", "font-weight", "font-size"] },
  { id: "level-dot-on", artifact: SKILLS, artifactSelector: ".dots i.on", gallery: SKILLS_PAGE, gallerySelector: `${TECHNICAL} h4 i:first-child`, properties: ["width", "height", "border-radius", "background-color"] },
  { id: "level-dot-off", artifact: SKILLS, artifactSelector: '.lane[data-proficiency="BEGINNER"] .dots i:last-child', gallery: SKILLS_PAGE, gallerySelector: `${TECHNICAL} section[data-proficiency="BEGINNER"] h4 i:last-child`, properties: ["width", "height", "background-color"] },
  { id: "lane-count", artifact: SKILLS, artifactSelector: ".count", gallery: SKILLS_PAGE, gallerySelector: `${TECHNICAL} section > div:first-child > span`, properties: ["font-family", "font-size", "line-height", "font-weight", "color", "text-transform"] },
  { id: "lane-chips", artifact: SKILLS, artifactSelector: ".lane .chips", gallery: SKILLS_PAGE, gallerySelector: `${TECHNICAL} section ul`, properties: ["display", "flex-wrap", "gap", "margin-top"] },
  { id: "edit-chip", artifact: SKILLS, artifactSelector: '.chip[draggable="true"]:not(.custom)', gallery: SKILLS_PAGE, gallerySelector: `${TECHNICAL} li[data-skill-id]`, properties: ["display", "align-items", "gap", "min-height", "padding-top", "padding-left", "border-radius", "background-color", "color", "font-size", "font-weight"] },
  { id: "edit-chip-custom", artifact: SKILLS, artifactSelector: ".chip.custom", gallery: SKILLS_PAGE, gallerySelector: `${TECHNICAL} li[data-skill-id="graphql"]`, properties: ["background-color", "color", "box-shadow"] },
  { id: "drag-handle", artifact: SKILLS, artifactSelector: ".drag-handle", gallery: SKILLS_PAGE, gallerySelector: `${TECHNICAL} li[data-skill-id] [aria-hidden="true"]`, properties: ["color", "font-size", "letter-spacing", "margin-right"] },
  { id: "chip-remove", artifact: SKILLS, artifactSelector: ".skill-remove", gallery: SKILLS_PAGE, gallerySelector: `${TECHNICAL} li[data-skill-id] > button`, properties: ["min-width", "min-height", "padding-left", "border-radius", "color", "background-color"] },
  { id: "lane-empty", artifact: SKILLS, artifactSelector: ".empty-lane-copy", gallery: SKILLS_PAGE, gallerySelector: `${TECHNICAL} section[data-proficiency="BEGINNER"] li`, properties: ["font-size", "line-height", "color"] },
  { id: "lane-show-all", artifact: SKILLS, artifactSelector: ".lane .btn.sm.ghost", gallery: SKILLS_PAGE, gallerySelector: `${TECHNICAL} section[data-proficiency="INTERMEDIATE"] > div:last-child button`, properties: ["height", "padding-left", "border-radius", "font-size", "color"] },
  { id: "drag-rule", artifact: SKILLS, artifactSelector: ".drag-rule", gallery: SKILLS_PAGE, gallerySelector: 'div:has(+ div > [data-skill-category])', properties: ["display", "gap", "margin-top", "padding-top", "padding-left", "border-radius", "background-color", "color", "font-size", "line-height"] },
  { id: "section-head-embedded", artifact: "profile/profile.html", artifactSelector: ".profile-section .section-head", gallery: "compositions/profile", gallerySelector: '[data-parity-id="section-embedded"] > div:first-child', properties: ["padding-top", "padding-left", "padding-bottom", "display", "align-items", "justify-content", "gap"] },
];

export const parityPairs: ParityPair[] = [...foundations, ...actionsInputs, ...feedback, ...states, ...overlays, ...shell, ...palette, ...combobox, ...profile, ...skills];
