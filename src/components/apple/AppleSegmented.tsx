// /frontend/src/components/apple/AppleSegmented.tsx

import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";

interface AppleSegmentedProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const SegButton = styled(ToggleButton)(({ theme }) => ({
  borderRadius: 12,
  padding: "8px 16px",
  border: "none",
  fontWeight: 600,
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
}));

export const AppleSegmented: React.FC<AppleSegmentedProps> = ({
  value,
  onChange,
  options,
}) => {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(e, val) => val && onChange(val)}
      sx={{
        backgroundColor: "rgba(0,0,0,0.05)",
        borderRadius: 14,
        padding: "4px",
      }}
    >
      {options.map((opt) => (
        <SegButton key={opt} value={opt}>
          {opt}
        </SegButton>
      ))}
    </ToggleButtonGroup>
  );
};
