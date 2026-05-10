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
          Basis
        </button>
        <button
          onClick={() => setActiveTab("oefening 1")}
          className={activeTab === "oefening 1" ? style.active : style.link}
        >
          Oefening 1
        </button>
        <button
          onClick={() => setActiveTab("oefening 2")}
          className={activeTab === "oefening 2" ? style.active : style.link}
        >
          Oefening 2
        </button>
        <button
          onClick={() => setActiveTab("oefening 3")}
          className={activeTab === "oefening 3" ? style.active : style.link}
        >
          Oefening 3
        </button>
        <button
          onClick={() => setActiveTab("oefening 4")}
          className={activeTab === "oefening 4" ? style.active : style.link}
        >
          Oefening 4
        </button>
        <button
          onClick={() => setActiveTab("oefening 5")}
          className={activeTab === "oefening 5" ? style.active : style.link}
        >
          Oefening 5
        </button>
        <button
          onClick={() => setActiveTab("oefening 6")}
          className={activeTab === "oefening 6" ? style.active : style.link}
        >
          Oefening 6
        </button>
        <button
          onClick={() => setActiveTab("oefening 7")}
          className={activeTab === "oefening 7" ? style.active : style.link}
        >
          Oefening 7
        </button>
        <button
          onClick={() => setActiveTab("oefening 8")}
          className={activeTab === "oefening 8" ? style.active : style.link}
        >
          Oefening 8
        </button>
      </nav>
    </div>
  );
}
