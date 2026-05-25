import { BracketItem } from "../../components/bracketItem/bracketItem";
import style from "./oefeningNavBar.module.scss";

type OefeningNavBarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function OefeningNavBar({
  activeTab,
  setActiveTab,
}: OefeningNavBarProps) {
  return (
    <div className={style.alles}>
      <nav className={style.nav}>
        <button
          onClick={() => setActiveTab("basis")}
          className={activeTab === "basis" ? style.active : style.link}
        >
          <BracketItem>Basis</BracketItem>
        </button>
        <button
          onClick={() => setActiveTab("oefening 1")}
          className={activeTab === "oefening 1" ? style.active : style.link}
        >
          <BracketItem>Oefening 1</BracketItem>
        </button>
        <button
          onClick={() => setActiveTab("oefening 2")}
          className={activeTab === "oefening 2" ? style.active : style.link}
        >
          <BracketItem>Oefening 2</BracketItem>
        </button>
        <button
          onClick={() => setActiveTab("oefening 3")}
          className={activeTab === "oefening 3" ? style.active : style.link}
        >
          <BracketItem>Oefening 3</BracketItem>
        </button>
        <button
          onClick={() => setActiveTab("oefening 4")}
          className={activeTab === "oefening 4" ? style.active : style.link}
        >
          <BracketItem>Oefening 4</BracketItem>
        </button>
        <button
          onClick={() => setActiveTab("oefening 5")}
          className={activeTab === "oefening 5" ? style.active : style.link}
        >
          <BracketItem>Oefening 5</BracketItem>
        </button>
        <button
          onClick={() => setActiveTab("oefening 6")}
          className={activeTab === "oefening 6" ? style.active : style.link}
        >
          <BracketItem>Oefening 6</BracketItem>
        </button>
        <button
          onClick={() => setActiveTab("oefening 7")}
          className={activeTab === "oefening 7" ? style.active : style.link}
        >
          <BracketItem>Oefening 7</BracketItem>
        </button>
        <button
          onClick={() => setActiveTab("oefening 8")}
          className={activeTab === "oefening 8" ? style.active : style.link}
        >
          <BracketItem>Oefening 8</BracketItem>
        </button>
      </nav>
    </div>
  );
}
