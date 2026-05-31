import { useState, useEffect } from "react";
import { SKETCHES } from "../pages/Maken/sketches";
import nlSketches from "../locales/nl/sketches.json";
import enSketches from "../locales/en/sketches.json";
import frSketches from "../locales/fr/sketches.json";
import i18n from "../i18n";

const translations = { nl: nlSketches, en: enSketches, fr: frSketches };

function getLocalized(lang: string) {
  const t = translations[lang as "nl" | "en" | "fr"] ?? translations.nl;

  return SKETCHES.map((sketch) => {
    const tr = t.sketches[sketch.id as keyof typeof t.sketches];
    if (!tr) return sketch;
    return {
      ...sketch,
      name: tr.name,
      desc: tr.desc,
      params: sketch.params.map((p) => ({
        ...p,
        label: tr.params[p.name as keyof typeof tr.params]?.label ?? p.label,
        explanation:
          tr.params[p.name as keyof typeof tr.params]?.explanation ??
          p.explanation,
      })),
    };
  });
}

export function useLocalizedSketches() {
  const [sketches, setSketches] = useState(() => getLocalized(i18n.language));

  useEffect(() => {
    const handler = (lang: string) => setSketches(getLocalized(lang));
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, []);

  return sketches;
}
