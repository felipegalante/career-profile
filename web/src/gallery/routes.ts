/* Plain route data shared by the gallery app and the Playwright suites. */
export type GalleryGroup = "Overview" | "Foundations" | "Primitives" | "Components" | "Patterns" | "Shell" | "States" | "Compositions";

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
  { path: "overview/overview", title: "Design system overview", group: "Overview", artifact: "design-system/overview/overview.html" },
  { path: "overview/principles", title: "Design principles", group: "Overview", artifact: "design-system/overview/principles.html" },
  { path: "foundations/color", title: "Color", group: "Foundations", artifact: "design-system/color/color.html" },
  { path: "foundations/type-layout", title: "Type, spacing, and layout", group: "Foundations", artifact: "design-system/type-layout/type-layout.html" },
  { path: "primitives/actions-inputs", title: "Actions and inputs", group: "Primitives", artifact: "design-system/primitives/actions-inputs.html" },
  { path: "primitives/feedback", title: "Feedback and disclosure", group: "Primitives", artifact: "design-system/primitives/feedback.html" },
  { path: "primitives/overlays", title: "Overlays", group: "Primitives", artifact: "design-system/primitives/overlays.html" },
  { path: "primitives/dialog-open", title: "Dialog (open)", group: "Primitives", artifact: "experience/experience-add.html" },
  { path: "components/catalog-combobox", title: "CatalogCombobox", group: "Components", artifact: "design-system/components/catalog-combobox.html" },
  { path: "patterns/catalog-custom-values", title: "Catalog and custom values", group: "Patterns", artifact: "design-system/patterns/catalog-custom-values.html" },
  { path: "patterns/dependent-fields", title: "Dependent fields", group: "Patterns", artifact: "design-system/patterns/dependent-fields.html" },
  { path: "components/profile-record-dialog", title: "ProfileRecordDialog", group: "Components", artifact: "design-system/components/profile-record-dialog.html" },
  { path: "components/profile-records", title: "Profile records", group: "Components", artifact: "design-system/components/profile-records.html" },
  { path: "components/command-palette", title: "Command palette", group: "Components", artifact: "design-system/components/command-palette.html", bare: true },
  { path: "shell/sidebar", title: "Application shell", group: "Shell", artifact: "design-system/shell/sidebar.html", bare: true },
  { path: "shell/keyboard-shortcuts", title: "Keyboard shortcuts", group: "Shell", artifact: "design-system/shell/keyboard-shortcuts.html" },
  { path: "shell/mobile", title: "Mobile shell", group: "Shell", artifact: "profile/overview-mobile.html" },
  { path: "states/collection-states", title: "Collection states", group: "States", artifact: "design-system/states/collection-states.html" },
  { path: "states/form-states", title: "Form states", group: "States", artifact: "design-system/states/form-states.html" },
  { path: "compositions/profile-empty", title: "Profile (empty)", group: "Compositions", artifact: "profile/overview-empty.html", bare: true },
  { path: "compositions/experience", title: "Work experience", group: "Compositions", artifact: "experience/experience.html", bare: true },
  { path: "compositions/focus", title: "Professional Focus", group: "Compositions", artifact: "focus/focus.html", bare: true },
];

export const galleryGroups: GalleryGroup[] = ["Overview", "Foundations", "Primitives", "Components", "Patterns", "Shell", "States", "Compositions"];
