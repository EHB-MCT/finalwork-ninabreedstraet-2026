import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "./i18n.ts";

// Dit zoekt het <div id="root"> element in index.html en plakt daar de hele React app in.
// Het uitroepteken zegt: "ik ben zeker dat dit element bestaat".
createRoot(document.getElementById("root")!).render(
  // StrictMode = een React hulpmiddel dat extra waarschuwingen toont tijdens development.
  // AuthProvider = staat dus hier zodat de hele app de context meekrijgt van de user die is ingelogd
  // App is dus de hele app > in die app wordt er gerefereerd naar de router, waarin alle pagina's staan gelinkt.

  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
