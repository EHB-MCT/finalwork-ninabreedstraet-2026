import type { Dispatch, SetStateAction } from "react";
import type { Sketch, ParamValues } from "../../pages/Maken/sketches";

export interface AccordionPanelProps {
  activeId: string;
  sketch: Sketch;
  params: ParamValues;
  setParams: Dispatch<SetStateAction<ParamValues>>;
  onSwitchSketch: (id: string) => void;
  code: string;
  onCodeChange: (code: string) => void;
  onExecute: (code: string, params: ParamValues) => void;
}
