import NextButton from "../../components/nextButton";
import style from "./oefeningen.module.scss";

export default function basis() {
  return (
    <div className={style.oefeningBox}>
      <h2>Let's start!</h2>

      <div
        style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>Hoe een website in elkaar steekt </h3>
        <p>
          Een website bestaat uit drie bouwstenen die elk een eigen taak hebben:
          <br />
          <br />
          <strong>HTML - de structuur</strong> Dit is het skelet van de pagina.
          Het bepaalt wát er op de pagina staat: koppen, tekst, afbeeldingen,
          knoppen, links. Alles staat in "tags" zoals {"`<h1>Titel</h1>`"} of
          {"`<p>Een paragraaf</p>`"}. <br />
          <br />
          <strong>CSS – de opmaak</strong> Dit is de styling. Het bepaalt hoe de
          HTML eruitziet: kleuren, lettertypen, afstanden, lay-out. Zonder CSS
          ziet een website er kaal en saai uit. <br />
          <br />
          <strong>JavaScript – het gedrag</strong> Dit maakt de pagina
          interactief. Denk aan een menu dat openklapt, een knop die reageert,
          of data die wordt geladen zonder dat je de pagina hoeft te verversen.
        </p>
        <br />
        <h3>Hoe werkt het technisch?</h3>
        <p>
          <br /> Wanneer je een websiteadres intypt in je browser, gebeurt dit:
          <ol>
            <li>
              Je browser stuurt een verzoek naar een server (een computer ergens
              op internet)
            </li>
            <li>
              De server stuurt bestanden terug — de HTML, CSS en JavaScript
            </li>
            <li>Je browser bouwt de pagina op basis van die bestanden</li>
          </ol>
        </p>
        <h3>Frontend vs. Backend</h3>
        <table>
          <tr>
            <th></th>
            <th>Wat</th>
            <th>Wie ziet het</th>
          </tr>
          <tr>
            <td>Frontend</td>
            <td>HTML, CSS, JS — wat je ziet in de browser</td>
            <td>De bezoeker</td>
          </tr>
          <tr>
            <td>Backend</td>
            <td>De server, database, logica achter de schermen</td>
            <td>Onzichtbaar</td>
          </tr>
        </table>
        <br />
        <p>
          Een simpele website (zoals een visitekaartje) heeft alleen een
          frontend. Een complexere website (zoals een webshop) heeft ook een
          backend om bijv. bestellingen en gebruikers op te slaan.
        </p>
        <p>
          Kort samengevat: HTML = structuur, CSS = uiterlijk, JavaScript =
          gedrag, en een server levert die bestanden af aan jouw browser.
        </p>
      </div>
      <NextButton />
    </div>
  );
}
