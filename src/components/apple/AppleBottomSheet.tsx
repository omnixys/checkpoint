// /frontend/src/components/apple/AppleBottomSheet.tsx

import React from "react";
import { Drawer, Box } from "@mui/material";

interface AppleBottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const AppleBottomSheet: React.FC<AppleBottomSheetProps> = ({
  open,
  onClose,
  children,
}) => {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 2,
        },
      }}
    >
      <Box>{children}</Box>
    </Drawer>
  );
};
