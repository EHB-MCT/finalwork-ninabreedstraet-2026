import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import style from "../../pages/Home/home.module.scss";
import type { AuthChangeEvent } from "@supabase/supabase-js";

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // dit houdt bij de gebruiker via een geldige reset-link is binnengekomen
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    // Dit luistert naar Supabase auth-events.
    // Als Supabase het event PASSWORD_RECOVERY stuurt (wat gebeurt als de gebruiker via de reset-link in de mail klikt),
    // dan wordt validSession op true gezet.
    // De lege array [] zorgt dat dit maar één keer wordt uitgevoerd bij het laden.
    supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidSession(true);
      }
    });
  }, []);

  const handleReset = async () => {
    // dit wist eventuele vorige foutmeldingen
    setError("");
    // geeft foutmelding als de twee wachtwoorden niet overeenkomen of als het te kort is
    if (password !== confirm) return setError(t("resetPassword.noMatch"));
    if (password.length < 6) return setError(t("resetPassword.tooShort"));

    // supabase functie om wachtwoord te updaten
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setError(error.message);

    // Zet de success-state op true en stuurt de gebruiker na 3 seconden naar de homepagina.
    setSuccess(true);
    setTimeout(() => navigate("/"), 3000);
  };

  // als het geen geldige link is, eentje die al vervallen is, wordt dit getoond
  if (!validSession) {
    return (
      <div className={style.glassPanel}>
        <p>{t("resetPassword.invalidLink")}</p>
      </div>
    );
  }

  return (
    <div className={style.glassPanel}>
      <h2>{t("resetPassword.title")}</h2>
      {/* als je naar de resetpassword link gaat wordt eerst succes getoond, succes is nog niet true dus dan wordt die naar de inputs begeleid
      als dat dan uiteindelijk true is wordt je naar handleReset begeleid > daar wordt setsucces naar true omgezet
       */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success ? (
        <p style={{ color: "green" }}>{t("resetPassword.success")}</p>
      ) : (
        <>
          <input
            type="password"
            placeholder={t("resetPassword.newPassword")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder={t("resetPassword.confirmPassword")}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button onClick={handleReset}>{t("resetPassword.submit")}</button>
        </>
      )}
    </div>
  );
}
