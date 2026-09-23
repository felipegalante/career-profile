import type { ComponentType } from "react";
import { ColorPage } from "./foundations/ColorPage";
import { OverviewPage } from "./overview/OverviewPage";
import { PrinciplesPage } from "./overview/PrinciplesPage";
import { ProfileRecordDialogPage } from "./components/ProfileRecordDialogPage";
import { ProfileRecordsPage } from "./components/ProfileRecordsPage";
import { ProfileEmptyPage } from "./compositions/ProfileEmptyPage";
import { ExperiencePage } from "./compositions/ExperiencePage";
import { FocusPage } from "./compositions/FocusPage";
import { SkillsPage } from "./components/SkillsPage";
import { ProfilePage } from "./compositions/ProfilePage";
import { SkillsEditPage } from "./compositions/SkillsEditPage";
import { AdminTablePage } from "./components/AdminTablePage";
import { AdminUsersPage } from "./compositions/AdminUsersPage";
import { TypeLayoutPage } from "./foundations/TypeLayoutPage";
import { ActionsInputsPage } from "./primitives/ActionsInputsPage";
import { FeedbackPage } from "./primitives/FeedbackPage";
import { OverlaysPage } from "./primitives/OverlaysPage";
import { DialogOpenPage } from "./primitives/DialogOpenPage";
import { CollectionStatesPage } from "./states/CollectionStatesPage";
import { CommandPalettePage } from "./components/CommandPalettePage";
import { CatalogComboboxPage } from "./components/CatalogComboboxPage";
import { CatalogCustomValuesPage } from "./patterns/CatalogCustomValuesPage";
import { DependentFieldsPage } from "./patterns/DependentFieldsPage";
import { SidebarPage } from "./shell/SidebarPage";
import { KeyboardShortcutsPage } from "./shell/KeyboardShortcutsPage";
import { MobilePage } from "./shell/MobilePage";
import { FormStatesPage } from "./states/FormStatesPage";

export const galleryPages: Record<string, ComponentType> = {
  "overview/overview": OverviewPage,
  "overview/principles": PrinciplesPage,
  "components/profile-record-dialog": ProfileRecordDialogPage,
  "components/profile-records": ProfileRecordsPage,
  "compositions/profile-empty": ProfileEmptyPage,
  "compositions/experience": ExperiencePage,
  "compositions/focus": FocusPage,
  "components/skills": SkillsPage,
  "compositions/profile": ProfilePage,
  "compositions/skills-edit": SkillsEditPage,
  "components/admin-table": AdminTablePage,
  "compositions/admin-users": AdminUsersPage,
  "foundations/color": ColorPage,
  "foundations/type-layout": TypeLayoutPage,
  "primitives/actions-inputs": ActionsInputsPage,
  "primitives/feedback": FeedbackPage,
  "primitives/overlays": OverlaysPage,
  "primitives/dialog-open": DialogOpenPage,
  "components/catalog-combobox": CatalogComboboxPage,
  "patterns/catalog-custom-values": CatalogCustomValuesPage,
  "patterns/dependent-fields": DependentFieldsPage,
  "components/command-palette": CommandPalettePage,
  "shell/sidebar": SidebarPage,
  "shell/keyboard-shortcuts": KeyboardShortcutsPage,
  "shell/mobile": MobilePage,
  "states/collection-states": CollectionStatesPage,
  "states/form-states": FormStatesPage,
};
