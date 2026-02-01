// utils/themeGlow.ts

export function glowColor(theme) {
  return theme.palette.omnixys.primary; // z.B. #6A4BBC
}

export function glowShadow(theme, intensity = 0.85) {
  const col = glowColor(theme);
  return `${intensity * 20}px ${intensity * 20}px ${intensity * 40}px ${col}`;
}
