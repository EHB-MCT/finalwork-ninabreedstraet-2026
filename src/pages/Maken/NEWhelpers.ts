import type { ParamValues } from "./sketches";
import type { Sketch } from "./sketches";

export function getDefaultParams(sketch: Sketch): ParamValues {
  return Object.fromEntries(sketch.params.map((p) => [p.name, p.default]));
}
