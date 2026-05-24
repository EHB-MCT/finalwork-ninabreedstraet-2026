import type { ParamValues, Sketch } from "../../pages/Maken/sketches";
import { supabase } from "../../lib/supabaseClient";

export async function saveProject(
  activeId: string,
  sketch: Sketch,
  params: ParamValues,
  code: string,
): Promise<void> {
  // betekent dat de functie async is maar niets teruggeeft, je wacht erop maar verwacht geen resultaat
  const {
    // gebruiker ophalen met supbase functie
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // een insert-functie om project toe te voegen aan de projects map, gebaseerd op de parameters ingesteld in de database
  await supabase.from("projects").insert({
    user_id: user.id,
    user: user.user_metadata.first_name,
    sketch_id: activeId,
    name: `${sketch.name} - ${new Date().toLocaleDateString()}`,
    params,
    code,
  });
}
