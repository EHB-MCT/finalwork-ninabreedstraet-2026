import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import style from "../pages/Home/home.module.scss";

interface LoginFormProps {
  onClose?: () => void;
}

export default function LoginForm({ onClose }: LoginFormProps) {
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
      alert("Registratie gelukt! Check je e-mail.");
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
      <button className={style.closeBtn} onClick={onClose} aria-label="Sluiten">
        ×
      </button>
      <h2>{isRegistering ? "Registreren" : "Inloggen"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {isRegistering && (
        <>
          <input
            type="text"
            placeholder="Voornaam"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Achternaam"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </>
      )}

      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Wachtwoord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSubmit}>
        {isRegistering ? "Registreren" : "Inloggen"}
      </button>

      <p>
        {isRegistering ? "Al een account?" : "Nog geen account?"}
        <span
          onClick={() => setIsRegistering(!isRegistering)}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {isRegistering ? " Inloggen" : " Registreren"}
        </span>
      </p>
    </div>
  );
}
