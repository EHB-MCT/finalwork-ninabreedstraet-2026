import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { ParamValues } from "../pages/Maken/sketches";

// deze functie krijgt setParams mee van de parent zodat hij de parameters kan aanpassen zonder ze zelf te bezitten
export function useAccordionParams(
  setParams: Dispatch<SetStateAction<ParamValues>>,
  // dispath neemt een actie als parameter en returnt een void, er zijn verschillende acties en setStateAction is daar één van, daaraan geef je de ParamValues mee
) {
  // houdt bij welke parameter momenteel open is
  const [openParam, setOpenParam] = useState<string | null>(null);

  // als de aangeklikte parameter al open is, sluit hem dan
  function toggleParam(name: string): void {
    setOpenParam((prev) => (prev === name ? null : name));
  }

  // deze vier werden hetzelfde, ze updaten één specifieke parameter in het params object
  // ...prev kopieert alle bestaande parameters
  // [name]: Number.parseFloat(value) >> overschijft enkel de gewijzigde + parseFloat zet string om in een getal
  // [name]: value >> overschijft enkel de gewijzigde
  // alle parameters worden bewaart als string
  function handleRangeChange(name: string, value: string): void {
    setParams((prev) => ({ ...prev, [name]: Number.parseFloat(value) }));
  }

  function handleColorChange(name: string, value: string): void {
    setParams((prev) => ({ ...prev, [name]: value }));
  }

  function handleTextChange(name: string, value: string): void {
    setParams((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(name: string, value: string): void {
    setParams((prev) => ({ ...prev, [name]: value }));
  }

  return {
    openParam,
    toggleParam,
    handleRangeChange,
    handleColorChange,
    handleTextChange,
    handleImageChange,
  };
}
