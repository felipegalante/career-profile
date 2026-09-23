/* Plain route data shared by the gallery app and the Playwright suites. */
export type GalleryGroup = "Foundations" | "Primitives" | "Components" | "Patterns" | "Shell" | "States" | "Compositions";

export interface GalleryRoute {
  path: string;
  title: string;
  group: GalleryGroup;
  /** Artifact page under docs/design/artifacts that this gallery page reproduces. */
  artifact: string;
  /** Rendered without the gallery top bar because the specimen owns the whole viewport. */
  bare?: boolean;
}

export const galleryRoutes: GalleryRoute[] = [
  { path: "foundations/color", title: "Color", group: "Foundations", artifact: "design-system/color/color.html" },
  { path: "foundations/type-layout", title: "Type, spacing, and layout", group: "Foundations", artifact: "design-system/type-layout/type-layout.html" },
  { path: "primitives/actions-inputs", title: "Actions and inputs", group: "Primitives", artifact: "design-system/primitives/actions-inputs.html" },
  { path: "primitives/feedback", title: "Feedback and disclosure", group: "Primitives", artifact: "design-system/primitives/feedback.html" },
  { path: "primitives/overlays", title: "Overlays", group: "Primitives", artifact: "design-system/primitives/overlays.html" },
  { path: "primitives/dialog-open", title: "Dialog (open)", group: "Primitives", artifact: "experience/experience-add.html" },
  { path: "components/catalog-combobox", title: "CatalogCombobox", group: "Components", artifact: "design-system/components/catalog-combobox.html" },
  { path: "patterns/catalog-custom-values", title: "Catalog and custom values", group: "Patterns", artifact: "design-system/patterns/catalog-custom-values.html" },
  { path: "patterns/dependent-fields", title: "Dependent fields", group: "Patterns", artifact: "design-system/patterns/dependent-fields.html" },
  { path: "components/command-palette", title: "Command palette", group: "Components", artifact: "design-system/components/command-palette.html", bare: true },
  { path: "shell/sidebar", title: "Application shell", group: "Shell", artifact: "design-system/shell/sidebar.html", bare: true },
  { path: "shell/keyboard-shortcuts", title: "Keyboard shortcuts", group: "Shell", artifact: "design-system/shell/keyboard-shortcuts.html" },
  { path: "shell/mobile", title: "Mobile shell", group: "Shell", artifact: "profile/overview-mobile.html" },
  { path: "states/collection-states", title: "Collection states", group: "States", artifact: "design-system/states/collection-states.html" },
  { path: "states/form-states", title: "Form states", group: "States", artifact: "design-system/states/form-states.html" },
];

export const galleryGroups: GalleryGroup[] = ["Foundations", "Primitives", "Components", "Patterns", "Shell", "States", "Compositions"];
