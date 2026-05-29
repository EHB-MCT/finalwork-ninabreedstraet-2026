import { useState, useEffect } from "react";
import style from "./bgEffect.module.scss";

const COLORS = [
  { label: "Wit", value: "#ffffff" },
  { label: "Zwart", value: "#000000" },
  { label: "Grijs", value: "#f0f0f0" },
  { label: "Rood", value: "#fce4e4" },
  { label: "Blauw", value: "#e4eefe" },
  { label: "Groen", value: "#e4f5e4" },
  { label: "Geel", value: "#fefbe4" },
  { label: "Paars", value: "#f0e4fe" },
];

export function BgEffect() {
  const [open, setOpen] = useState(false);
  // Bijhouden welke kleur momenteel geselecteerd is, de default waarde is de eerste kleur
  const [active, setActive] = useState(COLORS[0].value);

  // Elke keer dat active verandert, wordt de achtergrondkleur van de volledige body aangepast
  useEffect(
    () => {
      document.body.style.backgroundColor = active;
    },
    // [active] = dit wilt zeggen, render deze code enkel opnieuw als de waarde van active veranderd is sinds de vorige render
    [active],
  );

  return (
    <>
      {/* dit wordt enkel gerenderd als de state 'open' is */}
      {open && (
        <>
          {/* setOverlay is een onzichtbare laag, als je buiten het dropdown menu klikt, sluit het menu */}
          <div className={style.overlay} onClick={() => setOpen(false)} />
          <div className={style.dropdown}>
            {COLORS.map((color) => (
              <button
                key={color.value}
                // krijgt sowieso dropdownItem als class, en ook dropdownItemActive als die momenteel actief is
                className={`${style.dropdownItem} ${active === color.value ? style.dropdownItemActive : ""}`}
                // bij klikken wordt de gekozen kleur de achtergrondkleur en sluit het menu
                onClick={() => {
                  setActive(color.value);
                  setOpen(false);
                }}
              >
                {color.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* de omgekeerde waarde wordt opgeslagen, dus als het dicht is, en je klikt, dan wordt open opgeslagen en gaat het menu terug open */}
      <div className={style.background}></div>
      <div className={style.floater} onClick={() => setOpen((v) => !v)}>
        <span
          className={style.activeSwatch}
          style={{ backgroundColor: active }}
        />
        ▾
      </div>
    </>
  );
}
