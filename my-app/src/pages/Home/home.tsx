import style from "./home.module.scss";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import Sketch from "./examples/sketch6";
import LoginForm from "../../components/LoginForm";

export default function Home() {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className={style.alles}>
      <Sketch />
      <div className={style.content}>
        <h1>
          {user
            ? `Welkom ${user.user_metadata?.first_name || user.email}!`
            : "Welkom bij Visual Learning!"}
        </h1>
        {!user && (
          <button className={style.loginBtn} onClick={() => setShowLogin(true)}>
            Inloggen
          </button>
        )}
      </div>
      {showLogin && !user && (
        <div className={style.modalOverlay} onClick={() => setShowLogin(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <LoginForm onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
