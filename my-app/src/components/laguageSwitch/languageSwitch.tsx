import { useState } from "react";
import { useTranslation } from "react-i18next";
import style from "./languageSwitch.module.scss";

const LANGUAGES = [
  { label: "Nederlands", value: "nl" },
  { label: "English", value: "en" },
  { label: "Français", value: "fr" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const active =
    LANGUAGES.find((l) => l.value === i18n.language) ?? LANGUAGES[0];

  return (
    <>
      {open && (
        <>
          <div className={style.overlay} onClick={() => setOpen(false)} />
          <div className={style.dropdown}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                className={`${style.dropdownItem} ${active.value === lang.value ? style.dropdownItemActive : ""}`}
                onClick={() => {
                  i18n.changeLanguage(lang.value);
                  setOpen(false);
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}

      <div className={style.floater} onClick={() => setOpen((v) => !v)}>
        <span className={style.code}>{active.value.toUpperCase()}</span>▾
      </div>
    </>
  );
}
