// Dit zorgt ervoor dat de gebruiker één keer moet inloggen dat de gebruikersgegevens meegenomen kan worden over de hele website.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabaseClient";

interface AuthContextType {
  user: any;
  loading: boolean;
}

// Maakt een lege "doos" aan die user en loading zal bevatten.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // AuthProvider is een wrapper-component. loading: true betekent: "we weten nog niet of iemand ingelogd is".
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Bij het opstarten vraagt de app meteen aan Supabase:
  // "is er al een actieve sessie?".
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      // eerste vraagteken > bestaat de sessie wel?
      // tweede vraagtene > als het undefined is mag het null zijn en dan kan je inloggen
      setUser(data.session?.user ?? null);
      // setLaoding is eerst true > wordt false en stopt dus met laden als de sessie gevonden is.
      setLoading(false);
    };

    getSession();

    // Dit luistert naar wijzigingen in het account, voor moest er worden uitgelogd bijvoorbeeld.
    // een underscore bij event omdat je die parameter niet gebruikt > dient enkel om te kijken of er ingelogd of uitgelogd is.
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    // als iemand dan uitlogd dan stopt deze listener ook met luisteren, de sessie stopt.
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// handige hook die overal gebruikt kan worden.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
