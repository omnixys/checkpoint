import React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

export type AppleButtonVariant =
  | "accent"
  | "filled"
  | "tonal"
  | "borderless"
  | "ghost"
  | "destructive"
  | "success";

export type AppleButtonIconPosition = "left" | "right";

export interface AppleButtonProps extends Omit<ButtonProps, "variant"> {
  children: React.ReactNode;
  variant?: AppleButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;

  icon?: React.ReactNode;
  iconPosition?: AppleButtonIconPosition;
}



/* ----------------------------------------------------------
 * Base Styles
 * ---------------------------------------------------------- */

const BaseButton = styled(Button)(() => ({
  borderRadius: 14,
  fontWeight: 600,
  padding: "10px 18px",
  textTransform: "none",
}));

/* Accent (Blue) */
const AccentButton = styled(BaseButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark ?? theme.palette.primary.main,
  },
}));

/* Filled (Neutral gray) */
const FilledButton = styled(BaseButton)(({ theme }) => ({
  backgroundColor: theme.palette.apple.gray6,
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.apple.opaqueSeparator}`,
  "&:hover": {
    backgroundColor: theme.palette.apple.gray5,
  },
}));

/* Tonal (Lighter neutral) */
const TonalButton = styled(BaseButton)(({ theme }) => ({
  backgroundColor: theme.palette.apple.gray5,
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.apple.gray4,
  },
}));

/* Borderless */
const BorderlessButton = styled(BaseButton)(({ theme }) => ({
  background: "transparent",
  color: theme.palette.primary.main,
  boxShadow: "none",
  "&:hover": {
    backgroundColor: theme.palette.apple.gray6,
  },
}));

/* Ghost (text-only subtle) */
const GhostButton = styled(BaseButton)(({ theme }) => ({
  background: "transparent",
  color: theme.palette.text.secondary,
  padding: "6px 8px",
  boxShadow: "none",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(0,0,0,0.05)"
        : "rgba(255,255,255,0.08)",
  },
}));

/* 🔥 Destructive (iOS Red) */
const DestructiveButton = styled(BaseButton)(() => ({
  backgroundColor: "#FF3B30",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#D9362A",
  },
}));

/* 🟢 Success (iOS Green) */
const SuccessButton = styled(BaseButton)(() => ({
  backgroundColor: "#34C759",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#28A745",
  },
}));

/* ----------------------------------------------------------
 * RENDER: Supports left/right icons
 * ---------------------------------------------------------- */

export const AppleButton: React.FC<AppleButtonProps>  = ({
  children,
  variant = "accent",
  icon,
  iconPosition = "left",
  ...rest
}) => {
  const content =
    icon && iconPosition === "left" ? (
      <>
        {icon}
        <span style={{ marginLeft: 8 }}>{children}</span>
      </>
    ) : icon && iconPosition === "right" ? (
      <>
        <span style={{ marginRight: 8 }}>{children}</span>
        {icon}
      </>
    ) : (
      children
    );

  switch (variant) {
    case "accent":
      return <AccentButton {...rest}>{content}</AccentButton>;
    case "filled":
      return <FilledButton {...rest}>{content}</FilledButton>;
    case "tonal":
      return <TonalButton {...rest}>{content}</TonalButton>;
    case "borderless":
      return <BorderlessButton {...rest}>{content}</BorderlessButton>;
    case "ghost":
      return <GhostButton {...rest}>{content}</GhostButton>;
    case "destructive":
      return <DestructiveButton {...rest}>{content}</DestructiveButton>;
    case "success":
      return <SuccessButton {...rest}>{content}</SuccessButton>;
    default:
      return <AccentButton {...rest}>{content}</AccentButton>;
  }
};
