import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import style from "../../pages/Home/home.module.scss";

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidSession(true);
      }
    });
  }, []);

  const handleReset = async () => {
    setError("");
    if (password !== confirm) return setError(t("resetPassword.noMatch"));
    if (password.length < 6) return setError(t("resetPassword.tooShort"));

    const { error } = await supabase.auth.updateUser({ password });
    if (error) return setError(error.message);

    setSuccess(true);
    setTimeout(() => navigate("/"), 3000);
  };

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
