// components/event-description/text/text.logic.ts
"use client";

import { marked } from "marked";

export function useTextLogic(content: string) {
  const html = marked.parse(content);
  return { html };
}
