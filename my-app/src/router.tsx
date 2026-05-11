import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import Navigation from "./components/navigation/navigation";
import Dashboard from "./pages/dashboard";
import Home from "./pages/Home/home";
import OefeningenHome from "./pages/oefeningen/oefeningHome";
import Maken from "./pages/Maken/maken2";
import { useAuth } from "./context/AuthContext";
import { FooterComponent } from "./components/navigation/footer";
import Account from "./pages/Account/account";
import style from "./components/navigation/nav.module.scss";

// dit is de vaste opmaal van de hele website: nav bovenaan en footer onderaan
function AppShell({ showNav = true }: { showNav?: boolean }) {
  return (
    <div className={style.layout}>
      {showNav && <Navigation />}
      <main className={style.main}>
        <Outlet />
      </main>
      <div className={style.footerWrapper}>
        <FooterComponent />
      </div>
    </div>
  );
}

// dit is voor niet-ingelogde pagina's
function PublicLayout() {
  const { user } = useAuth();
  // !! zet user om naar een boolean
  return <AppShell showNav={!!user} />;
}

// dit is voor ingelogde pagina's
function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div>Laden...</div>;
  // replace bij <Navigate> betekent dat /dashboard niet in de browsergeschiedenis blijft
  // De user kan dus niet terug klikken om er terug te geraken.
  if (!user) return <Navigate to="/home" replace />;

  return <AppShell />;
}

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "home", element: <Home /> },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "oefeningen", element: <OefeningenHome /> },
      { path: "maken", element: <Maken /> },
      { path: "accountsettings", element: <Account /> },
    ],
  },
]);

export default router;
