import type { Theme } from "@mui/material/styles";
import { buttonComponents } from "./button";
import {
  dialogActionsComponents,
  dialogComponents,
  dialogContentComponents,
  dialogTitleComponents,
} from "./dialog";
import { paperComponents } from "./paper";
import { textFieldComponents } from "./textField";

export const createComponentOverrides = (theme: Theme) => ({
  MuiPaper: paperComponents(theme),
  MuiButton: buttonComponents(theme),
  MuiDialog: dialogComponents(theme),
  MuiDialogTitle: dialogTitleComponents(theme),
  MuiDialogContent: dialogContentComponents(theme),
  MuiDialogActions: dialogActionsComponents(theme),
  MuiTextField: textFieldComponents(theme),
});
