import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import style from "../../pages/Home/home.module.scss";

interface LoginFormProps {
  onClose?: () => void;
}

type FormMode = "login" | "register" | "forgotPassword";

export default function LoginForm({ onClose }: LoginFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formMode, setFormMode] = useState<FormMode>("login");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");

    if (formMode === "forgotPassword") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) return setError(error.message);
      setSuccessMessage(t("login.resetEmailSent"));
      return;
    }

    if (formMode === "register") {
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

  const titles: Record<FormMode, string> = {
    login: t("login.login"),
    register: t("login.register"),
    forgotPassword: t("login.forgotPassword"),
  };

  return (
    <div className={style.glassPanel}>
      <button
        className={style.closeBtn}
        onClick={onClose}
        aria-label={t("login.close")}
      >
        ×
      </button>
      <h2>{titles[formMode]}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      {formMode === "register" && (
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

      {formMode !== "forgotPassword" && (
        <input
          type="password"
          placeholder={t("login.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      )}

      {formMode === "login" && (
        <span
          onClick={() => setFormMode("forgotPassword")}
          style={{
            fontSize: "0.85rem",
            color: "grey",
            cursor: "pointer",
            alignSelf: "flex-end",
          }}
        >
          {t("login.forgotPassword")}
        </span>
      )}

      <button onClick={handleSubmit}>
        {formMode === "forgotPassword"
          ? t("login.sendResetEmail")
          : formMode === "register"
            ? t("login.register")
            : t("login.login")}
      </button>

      {formMode === "forgotPassword" ? (
        <p>
          <span
            onClick={() => setFormMode("login")}
            style={{ color: "grey", cursor: "pointer" }}
          >
            ← {t("login.backToLogin")}
          </span>
        </p>
      ) : (
        <p>
          {formMode === "register"
            ? t("login.haveAccount")
            : t("login.noAccount")}
          <span
            onClick={() =>
              setFormMode(formMode === "register" ? "login" : "register")
            }
            style={{ color: "grey", cursor: "pointer" }}
          >
            {formMode === "register"
              ? ` ${t("login.login")}`
              : ` ${t("login.register")}`}
          </span>
        </p>
      )}
    </div>
  );
}
