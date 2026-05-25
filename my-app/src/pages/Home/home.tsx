import style from "./home.module.scss";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import Sketch2 from "./examples/sketch2";
import Sketch3 from "./examples/sketch3";
import Sketch4 from "./examples/sketch4";
import Sketch5 from "./examples/sketch5";
import Sketch6 from "./examples/sketch6";
import LoginForm from "../../components/LoginForm";
import { BracketItem } from "../../components/bracketItem/bracketItem";

export default function Home() {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [Sketch] = useState(() => {
    const sketchArr = [Sketch2, Sketch3, Sketch4, Sketch5, Sketch6];
    return sketchArr[Math.floor(Math.random() * sketchArr.length)];
  });

  const [uitlegOpen, setUitlegOpen] = useState(false);

  return (
    <div className={style.alles}>
      <Sketch />
      <div className={style.welcome}>
        <h1>
          {user
            ? `Welkom ${user.user_metadata?.first_name || user.email}!`
            : "Welkom bij Visual Learning!"}
        </h1>
      </div>

      <button
        onClick={() => setUitlegOpen(!uitlegOpen)}
        className={style.uitlegBtn}
      >
        <BracketItem>
          {uitlegOpen ? "Sluit uitleg" : "Klik hier voor een woordje uitleg!"}
        </BracketItem>
      </button>

      <div className={style.content}>
        {uitlegOpen && (
          <div className={style.generalExplan}>
            <div className={style.startEx}>
              <div className={style.text}>
                Hallo! Welkom bij Glimpse! Een platform waar je tijdens het
                maken van visuals, een introductie krijgt tot coderen.
                <br />
                <br />
                Er zijn twee pagina's en je hebt de volledige vrijheid om te
                starten waar je zin in in hebt.
              </div>
            </div>
            <br />
            <br />
            <div className={style.columns}>
              <div className={style.left}>
                Eerst ga je de oefeningen-pagina zien. Hierop is een korte,
                eenvoudige uitleg te volgen over hoe je kan beginnen met
                coderen. Daarna worden er een paar belangrijke concepten binnen
                het coderen toegelicht.
              </div>
              <div className={style.right}>
                Als je geen zin hebt in coderen, kan je ook direct beginnen met
                het maken van visuals. Dit kan je doen op de create-pagina.
                <div className={style.sketchExplanation}>
                  Zo werkt het:
                  <ol>
                    <li>Kies een voorbeeld uit de lijst.</li>
                    <li>
                      Klik op ▶ naast een parameter om de bijbehorende code te
                      bekijken.
                    </li>
                    <li>
                      Wil je alles zien? Klik op "Toon de hele code" onderaan.
                    </li>
                    <li>Maak je eigen visuals!</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

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
