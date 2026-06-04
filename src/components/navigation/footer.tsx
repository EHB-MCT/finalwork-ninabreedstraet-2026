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
        <ul className={style.footerlinks}>
          <li>
            <a href="https://www.instagram.com/n.breedstraet/">
              <img
                src="/Images/instagram.png"
                alt=""
                style={{ width: "2rem" }}
              />
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/nina-breedstraet-895a88236/">
              <img
                src="/Images/linkedin.png"
                alt=""
                style={{ width: "2rem" }}
              />
            </a>{" "}
          </li>
          <li>
            <a href="mailto:breedstraetnina@gmail.com">
              <img
                src="/Images/mail.png"
                alt=""
                style={{ width: "2rem", marginTop: "0.3rem" }}
              />
            </a>{" "}
          </li>
        </ul>
      </footer>
    </div>
  );
}
