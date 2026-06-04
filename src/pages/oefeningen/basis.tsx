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
        <p>{t("exercises.basis.buildingBlocks")}</p>
        <br />
        <ul>
          <li>
            {" "}
            <strong>{t("exercises.basis.htmlTitle")}</strong> :{" "}
            {t("exercises.basis.htmlDesc")}
          </li>
          <li>
            <strong>{t("exercises.basis.cssTitle")}</strong> :{" "}
            {t("exercises.basis.cssDesc")}
          </li>
          <li>
            <strong>{t("exercises.basis.jsTitle")}</strong> :{" "}
            {t("exercises.basis.jsDesc")}
          </li>
        </ul>
        <h3>{t("exercises.basis.technicalTitle")}</h3>
        <p>{t("exercises.basis.technicalIntro")}</p>
        <ol>
          <li>{t("exercises.basis.step1")}</li>
          <li>{t("exercises.basis.step2")}</li>
          <li>{t("exercises.basis.step3")}</li>
        </ol>
        <h3>{t("exercises.basis.frontendVsBackend")}</h3>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>{t("exercises.basis.wat")}</th>
              <th>{t("exercises.basis.wieZietHet")}</th>
            </tr>
          </thead>
          <tbody>
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
          </tbody>
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
