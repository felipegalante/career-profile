import type { ComponentType } from "react";
import { ColorPage } from "./foundations/ColorPage";
import { TypeLayoutPage } from "./foundations/TypeLayoutPage";
import { ActionsInputsPage } from "./primitives/ActionsInputsPage";

export const galleryPages: Record<string, ComponentType> = {
  "foundations/color": ColorPage,
  "foundations/type-layout": TypeLayoutPage,
  "primitives/actions-inputs": ActionsInputsPage,
};
