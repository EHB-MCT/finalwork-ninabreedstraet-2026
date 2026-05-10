import { Link, useLocation } from "react-router-dom";
import style from "./nav.module.scss";

const Navigation = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={style.alles}>
      <nav className={style.nav}>
        <Link
          to="/"
          className={style.home}
          style={{
            color: isActive("/") ? "#6e6e6e" : "black",
          }}
        >
          <img
            src="/Images/Stijlgids3.png"
            alt=""
            style={{
              width: "30px",
            }}
          />
        </Link>

        <Link
          to="/oefeningen"
          className={style.maken}
          style={{
            color:
              isActive("/oefeningen") ||
              location.pathname.startsWith("/oefening")
                ? "#6e6e6e"
                : "black",
          }}
        >
          <img
            src="/Images/Symbols2.png"
            alt=""
            style={{
              width: "30px",
            }}
          />
        </Link>

        <Link
          to="/maken"
          className={style.maken}
          style={{
            color: isActive("/maken") ? "#6e6e6e" : "black",
          }}
        >
          <img
            src="/Images/Symbols22.png"
            alt=""
            style={{
              width: "30px",
            }}
          />
        </Link>
        <Link
          to="/accountsettings"
          className={style.maken}
          style={{
            color: isActive("/maken") ? "#6e6e6e" : "black",
          }}
        >
          <img
            src="/Images/Stijlgids.png"
            alt=""
            style={{
              width: "30px",
            }}
          />
        </Link>
      </nav>
    </div>
  );
};

export default Navigation;
