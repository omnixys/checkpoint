export function promptHero(eventTitle: string) {
  return `
Generate a premium Apple-style event hero subtitle and optional background theme idea
for an event titled: "${eventTitle}".

Return ONLY raw text, no bullet points, no explanation.
`;
}

export function promptText(eventTitle: string) {
  return `
Write a premium, elegant, Apple-like description for the event: "${eventTitle}".

Tone: modern, minimalistic, creative, luxury.
Short paragraphs. No marketing clichés.
`;
}

export function promptFeatures(eventTitle: string) {
  return `
Generate 3-5 feature highlights for the event "${eventTitle}".
Return in JSON:

[
  { "icon": "star", "title": "...", "description": "..." },
  ...
]
`;
}

export function promptTimeline(eventTitle: string) {
  return `
Generate a realistic timeline (4-7 steps) for the event "${eventTitle}".

Return JSON:
[
  { "time": "14:00", "title": "...", "description": "..." },
  ...
]
`;
}

export function promptFAQ(eventTitle: string) {
  return `
Generate 3-6 FAQ entries for an event titled "${eventTitle}".

Return JSON:
[
  {"question":"...", "answer":"..."},
  ...
]
`;
}

export function promptQuote(eventTitle: string) {
  return `
Generate an inspiring short quote for the event "${eventTitle}".
Return raw text only.
`;
}

export function promptTeam(eventTitle: string) {
  return `
Generate 1-3 fictional hosts/speakers for this event "${eventTitle}".
Return JSON:
[
  {"name":"...", "role":"...", "bio":"..."},
  ...
]
`;
}

export function promptGallery(eventTitle: string) {
  return `
Suggest 3 abstract image theme ideas for event "${eventTitle}".
Return one per line, no list formatting.
`;
}
