// /frontend/src/components/apple/AppleSwitch.tsx

import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

export const AppleSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: theme.palette.primary.main,
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: theme.palette.primary.main,
  },
  "& .MuiSwitch-track": {
    borderRadius: 20,
  },
}));
