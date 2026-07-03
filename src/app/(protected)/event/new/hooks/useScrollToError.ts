"use client";

import type { ValidationErrors } from "./useZodForm";

export function scrollToFirstError(errors: ValidationErrors): void {
  const firstPath = Object.keys(errors)[0];

  if (!firstPath) {
    return;
  }

  const element = document.querySelector(`[data-field="${firstPath}"]`);

  if (!element) {
    return;
  }

  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}
