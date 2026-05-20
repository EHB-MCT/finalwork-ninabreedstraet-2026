import style from "./home.module.scss";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import Sketch2 from "./examples/sketch2";
import Sketch3 from "./examples/sketch3";
import Sketch4 from "./examples/sketch4";
import Sketch5 from "./examples/sketch5";
import Sketch6 from "./examples/sketch6";
import LoginForm from "../../components/LoginForm";

export default function Home() {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [Sketch] = useState(() => {
    const sketchArr = [Sketch2, Sketch3, Sketch4, Sketch5, Sketch6];
    return sketchArr[Math.floor(Math.random() * sketchArr.length)];
  });

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
