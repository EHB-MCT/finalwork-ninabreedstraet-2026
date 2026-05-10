// Het maakt één keer een Supabase-client aan met mijn project-URL en publieke sleutel uit .env.
// Die client exporteer je, zodat alle andere bestanden hem kunnen gebruiken.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
