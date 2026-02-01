import { Theme } from "@mui/material/styles";
import { paperComponents } from "./paper";
import { buttonComponents } from "./button";
import { dialogComponents } from "./dialog";
import { textFieldComponents } from "./textField";

export const createComponentOverrides = (theme: Theme) => ({
  MuiPaper: paperComponents(theme),
  MuiButton: buttonComponents(theme),
  MuiDialog: dialogComponents(theme),
  MuiTextField: textFieldComponents(theme),
});
