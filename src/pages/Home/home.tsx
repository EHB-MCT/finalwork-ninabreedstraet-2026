import style from "./home.module.scss";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Sketch2 from "./sketches/sketch1";
import Sketch3 from "./sketches/sketch2";
import Sketch5 from "./sketches/sketch4";
import Sketch4 from "./sketches/sketch3";
import Sketch6 from "./sketches/sketch5";
import Sketch7 from "./sketches/sketch6";
import Sketch8 from "./sketches/sketch7";
import Sketch9 from "./sketches/sketch8";
import Sketch10 from "./sketches/sketch9";
import Sketch11 from "./sketches/sketch10/sketch10";
import LoginForm from "../../components/login/loginForm";
import { BracketItem } from "../../components/navigation/bracketItem/bracketItem";

export default function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [Sketch] = useState(() => {
    const sketchArr = [
      Sketch2,
      Sketch3,
      Sketch4,
      Sketch5,
      Sketch6,
      Sketch7,
      Sketch8,
      Sketch9,
      Sketch10,
      Sketch11,
    ];
    return sketchArr[Math.floor(Math.random() * sketchArr.length)];
  });

  const displayName = user?.user_metadata?.first_name || user?.email || "";

  return (
    <div className={style.alles}>
      <Sketch />
      <div className={style.welcome}>
        <h1>
          {user
            ? t("home.welcomeUser", { name: displayName })
            : t("home.welcomeGuest")}
        </h1>
      </div>

      <div className={style.content}>
        <div className={style.generalExplan}>
          <div className={style.startEx}>
            <div className={style.text}>
              {t("home.intro1")}
              <br />
              <br />
              {t("home.intro2")}
            </div>
          </div>
          <br />
          <br />
          <div className={style.columns}>
            <div className={style.left}>{t("home.oefeningenExplanation")}</div>
            <div className={style.right}>
              {t("home.createExplanation")}
              <div className={style.sketchExplanation}>
                {t("home.howItWorks")}
                <ol>
                  <li>{t("home.step1")}</li>
                  <li>{t("home.step2")}</li>
                  <li>{t("home.step3")}</li>
                  <li>{t("home.step4")}</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {!user && (
          <button className={style.loginBtn} onClick={() => setShowLogin(true)}>
            <BracketItem>{t("home.login")}</BracketItem>
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
