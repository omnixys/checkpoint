// /canvas/utils/autoSave.ts
let timeout = null;

export function autoSave(fn, delay = 800) {
  clearTimeout(timeout);
  timeout = setTimeout(fn, delay);
}
