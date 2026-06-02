import { useState, useEffect } from "react";
import { SKETCHES } from "../pages/Maken/sketches";
import nlSketches from "../locales/nl/sketches.json";
import enSketches from "../locales/en/sketches.json";
import frSketches from "../locales/fr/sketches.json";
import i18n from "../i18n";

// const translations = { nl: nlSketches, en: enSketches, fr: frSketches };

type ParamTranslation = {
  label: string;
  explanation: string;
};

type SketchTranslation = {
  name: string;
  desc: string;
  params: Record<string, ParamTranslation>;
};

type TranslationFile = {
  sketches: Record<string, SketchTranslation>;
};

function getLocalized(lang: string) {
  const translations: Record<"nl" | "en" | "fr", TranslationFile> = {
    nl: nlSketches,
    en: enSketches,
    fr: frSketches,
  };
  const t = translations[lang as "nl" | "en" | "fr"] ?? translations.nl;

  return SKETCHES.map((sketch) => {
    const tr = t.sketches[sketch.id];
    if (!tr) return sketch;

    return {
      ...sketch,
      name: tr.name,
      desc: tr.desc,
      params: sketch.params.map((p) => {
        const trParam = tr.params[p.name];

        return {
          ...p,
          label: trParam?.label ?? p.label,
          explanation: trParam?.explanation ?? p.explanation,
        };
      }),
    };
  });
}

export function useLocalizedSketches() {
  const [sketches, setSketches] = useState(() => getLocalized(i18n.language));

  useEffect(() => {
    const handler = (lang: string) => {
      setSketches(getLocalized(lang));
    };

    i18n.on("languageChanged", handler);

    return () => {
      i18n.off("languageChanged", handler);
    };
  }, []);

  return sketches;
}
