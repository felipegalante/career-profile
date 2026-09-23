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
  { path: "states/collection-states", title: "Collection states", group: "States", artifact: "design-system/states/collection-states.html" },
  { path: "states/form-states", title: "Form states", group: "States", artifact: "design-system/states/form-states.html" },
];

export const galleryGroups: GalleryGroup[] = ["Foundations", "Primitives", "Components", "Patterns", "Shell", "States", "Compositions"];
