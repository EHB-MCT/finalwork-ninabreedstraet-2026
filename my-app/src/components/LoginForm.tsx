import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import style from "../pages/Home/home.module.scss";

interface LoginFormProps {
  onClose?: () => void;
}

export default function LoginForm({ onClose }: LoginFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async () => {
    setError("");
    if (isRegistering) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      if (error) return setError(error.message);
      alert(t("login.registrationSuccess"));
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return setError(error.message);
      if (onClose) onClose();
      else navigate("/dashboard");
    }
  };

  if (user && !onClose) {
    navigate("/dashboard");
  }

  return (
    <div className={style.glassPanel}>
      <button
        className={style.closeBtn}
        onClick={onClose}
        aria-label={t("login.close")}
      >
        ×
      </button>
      <h2>{isRegistering ? t("login.register") : t("login.login")}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {isRegistering && (
        <>
          <input
            type="text"
            placeholder={t("login.firstName")}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder={t("login.lastName")}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </>
      )}

      <input
        type="email"
        placeholder={t("login.email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder={t("login.password")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSubmit}>
        {isRegistering ? t("login.register") : t("login.login")}
      </button>

      <p>
        {isRegistering ? t("login.haveAccount") : t("login.noAccount")}
        <span
          onClick={() => setIsRegistering(!isRegistering)}
          style={{ color: "grey", cursor: "pointer" }}
        >
          {isRegistering ? ` ${t("login.login")}` : ` ${t("login.register")}`}
        </span>
      </p>
    </div>
  );
}
