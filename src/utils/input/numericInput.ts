export interface NumericFieldState {
  min?: number;
  max?: number;
  step?: number;
}

const CONTROL_AND_NAVIGATION_KEYS = new Set([
  "Backspace",
  "Delete",
  "Tab",
  "Escape",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

interface NumericKeyEvent {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  preventDefault: () => void;
}

export function stripNonDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function stripNonDigitsAllowPlus(value: string): string {
  const stripped = value.replace(/[^\d+]/g, "");
  const leadingPlus = stripped.startsWith("+") ? "+" : "";
  return leadingPlus + stripped.replace(/\+/g, "");
}

export function isAllowedNumericKey(event: NumericKeyEvent): boolean {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return true;
  }
  if (CONTROL_AND_NAVIGATION_KEYS.has(event.key)) {
    return true;
  }
  if (event.key.length > 1) {
    return true;
  }
  return /^[0-9]$/.test(event.key);
}

export function blockNonNumericKey(event: NumericKeyEvent): void {
  if (!isAllowedNumericKey(event)) {
    event.preventDefault();
  }
}

export function numericHtmlInput({ min, max, step }: NumericFieldState = {}) {
  return {
    inputMode: "numeric",
    ...(min != null ? { min } : {}),
    ...(max != null ? { max } : {}),
    ...(step != null ? { step } : {}),
  };
}
