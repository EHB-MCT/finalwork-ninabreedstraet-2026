import { useState } from "react";
import { useTranslation } from "react-i18next";
import Basis from "./basis";
import Oefening3 from "./oefening3";
import Oefening2 from "./oefening2";
import Oefening1 from "./oefening1";
import Oefening4 from "./oefening8";
import Oefening5 from "./oefening4";
import Oefening6 from "./oefening5";
import Oefening7 from "./oefening7";
import Oefening8 from "./oefening6";
import { BracketItem } from "../../components/navigation/bracketItem/bracketItem";
import style from "./oefeningen.module.scss";

const TABS = [
  { key: "basis", translationKey: "oefeningen.basis" },
  { key: "oefening 1", translationKey: "oefeningen.exercise1" },
  { key: "oefening 2", translationKey: "oefeningen.exercise2" },
  { key: "oefening 3", translationKey: "oefeningen.exercise3" },
  { key: "oefening 4", translationKey: "oefeningen.exercise4" },
  { key: "oefening 5", translationKey: "oefeningen.exercise5" },
  { key: "oefening 6", translationKey: "oefeningen.exercise6" },
  { key: "oefening 7", translationKey: "oefeningen.exercise7" },
  { key: "oefening 8", translationKey: "oefeningen.exercise8" },
];

export default function OefeningenHome() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("basis");

  return (
    <div className={style.layout}>
      <aside className={style.sidebar}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${style.tabBtn} ${activeTab === tab.key ? style.active : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <BracketItem>
              {t(tab.translationKey)}
            </BracketItem>
          </button>
        ))}
      </aside>

      <main className={style.content}>
        {activeTab === "basis" && <Basis />}
        {activeTab === "oefening 1" && <Oefening1 />}
        {activeTab === "oefening 2" && <Oefening2 />}
        {activeTab === "oefening 3" && <Oefening3 />}
        {activeTab === "oefening 4" && <Oefening4 />}
        {activeTab === "oefening 5" && <Oefening5 />}
        {activeTab === "oefening 6" && <Oefening6 />}
        {activeTab === "oefening 7" && <Oefening7 />}
        {activeTab === "oefening 8" && <Oefening8 />}
      </main>
    </div>
  );
}
