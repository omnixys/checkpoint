// /canvas/utils/patchEngine.ts
import { applyPatch } from "fast-json-patch";

export function applyDiffToState(current, diff) {
  const patched = applyPatch(current, diff, false).newDocument;
  return patched;
}
