// /canvas/state/canvasStore.ts
import { proxy } from "valtio";

export const canvasStore = proxy({
  layout: null, // contains sections → tables → seats
  selection: null, // seat/table/section selection object
  dragging: null, // current dragging item
});
