import { useTranslation } from "react-i18next";
import style from "./oefeningen.module.scss";

export default function basis() {
  const { t } = useTranslation();

  return (
    <div className={style.oefeningBox}>
      <h2>{t("exercises.basis.title")}</h2>

      <div
        style={{ padding: "15px", borderRadius: "8px", marginBottom: "20px" }}
      >
        <h3>{t("exercises.basis.websiteStructure")}</h3>
        <p>
          {t("exercises.basis.buildingBlocks")}
          <br />
          <br />
          <strong>{t("exercises.basis.htmlTitle")}</strong> :{" "}
          {t("exercises.basis.htmlDesc")} <br />
          <br />
          <strong>{t("exercises.basis.cssTitle")}</strong> :{" "}
          {t("exercises.basis.cssDesc")} <br />
          <br />
          <strong>{t("exercises.basis.jsTitle")}</strong> :{" "}
          {t("exercises.basis.jsDesc")}
        </p>
        <br />
        <h3>{t("exercises.basis.technicalTitle")}</h3>
        <p>
          <br /> {t("exercises.basis.technicalIntro")}
          <ol>
            <li>{t("exercises.basis.step1")}</li>
            <li>{t("exercises.basis.step2")}</li>
            <li>{t("exercises.basis.step3")}</li>
          </ol>
        </p>
        <h3>{t("exercises.basis.frontendVsBackend")}</h3>
        <table>
          <tr>
            <th></th>
            <th>{t("exercises.basis.wat")}</th>
            <th>{t("exercises.basis.wieZietHet")}</th>
          </tr>
          <tr>
            <td>{t("exercises.basis.frontend")}</td>
            <td>{t("exercises.basis.frontendDesc")}</td>
            <td>{t("exercises.basis.frontendVisible")}</td>
          </tr>
          <tr>
            <td>{t("exercises.basis.backend")}</td>
            <td>{t("exercises.basis.backendDesc")}</td>
            <td>{t("exercises.basis.backendVisible")}</td>
          </tr>
        </table>
        <br />
        <br />
        <p>{t("exercises.basis.simpleVsComplex")}</p>
        <br />
        <p>{t("exercises.basis.summary")}</p>
      </div>
    </div>
  );
}
