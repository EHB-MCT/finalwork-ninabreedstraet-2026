import style from "./nav.module.scss";

export function FooterComponent() {
  return (
    <div className={style.footerContainer}>
      <div className={style.footerLine} />
      <footer className={style.footer}>
        <p className={style.copyright}>
          © 2026{" "}
          <a href="https://portfolioninabreedstraet2026.vercel.app/">
            Nina Breedstraet
          </a>
        </p>
        <p className={style.copyright}>
          Contactgegevens:{" "}
          <a href="mailto:breedstraetnina@gmail.com">
            breedstraetnina@gmail.com
          </a>
        </p>
        <ul className={style.footerlinks}>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/accountsettings">Account</a>
          </li>
          <li>
            <a href="/oefeningen">Oefeningen</a>
          </li>
        </ul>
      </footer>
    </div>
  );
}
