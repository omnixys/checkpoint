import { createRequire } from "node:module";
import { threeTablePlan } from "../../../../services/seat/__tests__/fixtures/layout-recognition-raster.mjs";

const requireSeat = createRequire(
  new URL("../../../../services/seat/package.json", import.meta.url),
);
const sharp = requireSeat("sharp");

/** Test pixels are drawn independently of recognition and of the editor generators. */
export async function recognitionFixturePng() {
  const source = threeTablePlan();
  return sharp(source.data, { raw: { width: source.width, height: source.height, channels: 1 } })
    .png()
    .toBuffer();
}
