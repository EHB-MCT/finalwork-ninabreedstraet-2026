import { useState } from "react";
import OefeningNavBar from "./oefeningNavBar";
import Basis from "./basis";
import Oefening3 from "./oefening3";
import Oefening2 from "./oefening2";
import Oefening1 from "./oefening1";
import Oefening4 from "./oefening8";
import Oefening5 from "./oefening4";
import Oefening6 from "./oefening5";
import Oefening7 from "./oefening7";
import Oefening8 from "./oefening6";

export default function OefeningenHome() {
  const [activeTab, setActiveTab] = useState("basis");

  return (
    <>
      <OefeningNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "basis" && <Basis />}
      {activeTab === "oefening 1" && <Oefening1 />}
      {activeTab === "oefening 2" && <Oefening2 />}
      {activeTab === "oefening 3" && <Oefening3 />}
      {activeTab === "oefening 4" && <Oefening4 />}
      {activeTab === "oefening 5" && <Oefening5 />}
      {activeTab === "oefening 6" && <Oefening6 />}
      {activeTab === "oefening 7" && <Oefening7 />}
      {activeTab === "oefening 8" && <Oefening8 />}
    </>
  );
}
