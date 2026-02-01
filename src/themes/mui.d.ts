import { ColorScale } from "./paletteTypes";
import { appleLight } from "./colors/appleColors";

declare module "@mui/material/styles" {
  interface Palette {
    apple: typeof appleLight;
    omnixys: ColorScale;
  }

  interface PaletteOptions {
    apple?: typeof appleLight;
    omnixys?: ColorScale;
  }
}
