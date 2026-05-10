import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import style from "./account.module.scss";

export default function Account() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [updateMsg, setUpdateMsg] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      setFirstName(user.user_metadata?.first_name || "");
      setLastName(user.user_metadata?.last_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleUpdateProfile = async () => {
    setUpdateMsg("");
    const { error } = await supabase.auth.updateUser({
      data: { first_name: firstName, last_name: lastName },
      email: email || undefined,
    });

    if (error) {
      setUpdateMsg("Fout: " + error.message);
    } else {
      setUpdateMsg("Profiel succesvol bijgewerkt!");
    }
  };

  const handleUpdatePassword = async () => {
    setUpdateMsg("");
    if (!password) return;
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setUpdateMsg("Fout: " + error.message);
    } else {
      setUpdateMsg("Wachtwoord succesvol bijgewerkt!");
      setPassword("");
    }
  };

  if (loading) return <div>Laden...</div>;

  const displayName = user?.user_metadata?.first_name || user?.email || "";

  return (
    <div className={style.alles}>
      <div className={style.buttonGroup}>
        <button onClick={handleLogout} className={style.logoutBtn}>
          Uitloggen
        </button>
      </div>
      <div className={style.account}>
        <div className={style.settings}>
          <div className={style.accountForm}>
            <h2>Accountgegevens</h2>

            <div className={style.formGroup}>
              <label>Voornaam</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className={style.formGroup}>
              <label>Achternaam</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className={style.formGroup}>
              <label>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button onClick={handleUpdateProfile}>Profiel bijwerken</button>

            <div className={style.divider}></div>

            <div className={style.formGroup}>
              <label>Nieuw wachtwoord</label>
              <input
                type="password"
                placeholder="Nieuw wachtwoord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button onClick={handleUpdatePassword}>Wachtwoord wijzigen</button>

            {updateMsg && <p className={style.updateMsg}>{updateMsg}</p>}
          </div>
        </div>
        <div className={style.projects}>
          <h2>Projects</h2>
        </div>
      </div>
    </div>
  );
}
