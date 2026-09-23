import type { ComponentType } from "react";
import { ColorPage } from "./foundations/ColorPage";
import { TypeLayoutPage } from "./foundations/TypeLayoutPage";
import { ActionsInputsPage } from "./primitives/ActionsInputsPage";
import { FeedbackPage } from "./primitives/FeedbackPage";
import { OverlaysPage } from "./primitives/OverlaysPage";
import { DialogOpenPage } from "./primitives/DialogOpenPage";
import { CollectionStatesPage } from "./states/CollectionStatesPage";
import { FormStatesPage } from "./states/FormStatesPage";

export const galleryPages: Record<string, ComponentType> = {
  "foundations/color": ColorPage,
  "foundations/type-layout": TypeLayoutPage,
  "primitives/actions-inputs": ActionsInputsPage,
  "primitives/feedback": FeedbackPage,
  "primitives/overlays": OverlaysPage,
  "primitives/dialog-open": DialogOpenPage,
  "states/collection-states": CollectionStatesPage,
  "states/form-states": FormStatesPage,
};
