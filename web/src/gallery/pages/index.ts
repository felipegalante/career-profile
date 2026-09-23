import type { ComponentType } from "react";
import { ColorPage } from "./foundations/ColorPage";
import { TypeLayoutPage } from "./foundations/TypeLayoutPage";

export const galleryPages: Record<string, ComponentType> = {
  "foundations/color": ColorPage,
  "foundations/type-layout": TypeLayoutPage,
};
