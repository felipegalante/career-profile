import type { ComponentType } from "react";
import { ColorPage } from "./foundations/ColorPage";
import { TypeLayoutPage } from "./foundations/TypeLayoutPage";
import { ActionsInputsPage } from "./primitives/ActionsInputsPage";
import { FeedbackPage } from "./primitives/FeedbackPage";
import { OverlaysPage } from "./primitives/OverlaysPage";
import { DialogOpenPage } from "./primitives/DialogOpenPage";
import { CollectionStatesPage } from "./states/CollectionStatesPage";
import { CommandPalettePage } from "./components/CommandPalettePage";
import { SidebarPage } from "./shell/SidebarPage";
import { KeyboardShortcutsPage } from "./shell/KeyboardShortcutsPage";
import { MobilePage } from "./shell/MobilePage";
import { FormStatesPage } from "./states/FormStatesPage";

export const galleryPages: Record<string, ComponentType> = {
  "foundations/color": ColorPage,
  "foundations/type-layout": TypeLayoutPage,
  "primitives/actions-inputs": ActionsInputsPage,
  "primitives/feedback": FeedbackPage,
  "primitives/overlays": OverlaysPage,
  "primitives/dialog-open": DialogOpenPage,
  "components/command-palette": CommandPalettePage,
  "shell/sidebar": SidebarPage,
  "shell/keyboard-shortcuts": KeyboardShortcutsPage,
  "shell/mobile": MobilePage,
  "states/collection-states": CollectionStatesPage,
  "states/form-states": FormStatesPage,
};
