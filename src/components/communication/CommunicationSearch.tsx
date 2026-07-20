"use client";

import { alpha, InputBase, styled } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

const SearchContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "8px 12px",
  borderRadius: 12,
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha("#FFFFFF", 0.06)
      : alpha("#000000", 0.04),
  backdropFilter: "blur(8px)",
  border: `1px solid ${
    theme.palette.mode === "dark"
      ? alpha("#FFFFFF", 0.08)
      : alpha("#000000", 0.08)
  }`,
  transition: "border-color 0.2s",
  "&:focus-within": {
    borderColor: theme.palette.primary.main,
  },
}));

const StyledInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  fontSize: 13,
  fontWeight: 500,
  color: theme.palette.text.primary,
  "&::placeholder": {
    color: theme.palette.text.secondary,
    opacity: 0.7,
  },
}));

interface Props {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export function CommunicationSearch({
  placeholder = "Search...",
  value,
  onChange,
  debounceMs = 250,
}: Props) {
  const [local, setLocal] = useState(value);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setLocal(v);
      clearTimeout(timer.current);
      timer.current = window.setTimeout(() => onChange(v), debounceMs);
    },
    [onChange, debounceMs],
  );

  return (
    <SearchContainer>
      <StyledInput
        placeholder={placeholder}
        value={local}
        onChange={handleChange}
        fullWidth
      />
    </SearchContainer>
  );
}
