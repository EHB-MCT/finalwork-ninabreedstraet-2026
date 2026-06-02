import { Link, useLocation } from "react-router-dom";
import style from "./nav.module.scss";
import { BracketItem } from "./bracketItem/bracketItem";
import { CursorEffectFloater } from "./cursorEffect/cursorEffect";
import { BgEffect } from "./bgEffect/bgEffect";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../laguageSwitch/languageSwitch";

const Navigation = () => {
  const { t } = useTranslation();

  return (
    <div className={style.alles}>
      <nav className={style.nav}>
        <Link to="/" className={style.maken}>
          <BracketItem>{t("nav.home")}</BracketItem>
        </Link>

        <Link to="/oefeningen" className={style.maken}>
          <BracketItem>{t("nav.oef")}</BracketItem>
        </Link>

        <Link to="/maken" className={style.maken}>
          <BracketItem>{t("nav.create")}</BracketItem>
        </Link>
        <Link to="/accountsettings" className={style.maken}>
          <BracketItem>{t("nav.account")}</BracketItem>
        </Link>
      </nav>

      <div className={style.effects}>
        <CursorEffectFloater />
        <BgEffect />
        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default Navigation;
