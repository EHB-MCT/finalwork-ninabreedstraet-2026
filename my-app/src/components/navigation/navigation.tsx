import { Link, useLocation } from "react-router-dom";
import style from "./nav.module.scss";
import HomeIcon from "../SymbolsNav/HomeIcon";
import ExcerciseIcon from "../SymbolsNav/ExcerciseIcon";
import CreateIcon from "../SymbolsNav/CreateIcon";
import ProfileIcon from "../SymbolsNav/ProfileIcon";

const Navigation = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={style.alles}>
      <nav className={style.nav}>
        <Link to="/" className={style.home}>
          {/* <img
            src="/Images/Stijlgids3.png"
            alt=""
            style={{
              width: "30px",
            }}
          /> */}
          <HomeIcon color="white" size={30} />
        </Link>

        <Link to="/oefeningen" className={style.maken}>
          {/* <img
            src="/Images/Symbols2.png"
            alt=""
            style={{
              width: "30px",
            }}
          /> */}
          <ExcerciseIcon color="white" size={30} />
        </Link>

        <Link to="/maken" className={style.maken}>
          {/* <img
            src="/Images/Symbols22.png"
            alt=""
            style={{
              width: "30px",
            }}
          /> */}
          <CreateIcon color="white" size={30} />
        </Link>
        <Link to="/accountsettings" className={style.maken}>
          {/* <img
            src="/Images/Stijlgids.png"
            alt=""
            style={{
              width: "30px",
            }}
          /> */}
          <ProfileIcon color="white" size={30} />
        </Link>
      </nav>
    </div>
  );
};

export default Navigation;
