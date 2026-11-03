// Diseño elegido por el cliente. Se guarda en su navegador y además viaja en la URL (?diseno=<slug>),
// así la selección no se pierde al navegar aunque el navegador bloquee el almacenamiento.
import { REQUEST_URL, getDesign } from "@/lib/designs";

const KEY = "sibnova:diseno";

export type Selection = { n: string; slug: string; name: string; demo: string; at: string };

export function saveSelection(slug: string): Selection | null {
  const d = getDesign(slug);
  if (!d) return null;
  const sel: Selection = { n: d.n, slug: d.slug, name: d.name, demo: `/catalogo/disenos/${d.slug}/`, at: new Date().toISOString() };
  try { localStorage.setItem(KEY, JSON.stringify(sel)); } catch {}
  return sel;
}

export function readSelection(): Selection | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const sel = JSON.parse(raw) as Selection;
    return getDesign(sel.slug) ? sel : null;
  } catch {
    return null;
  }
}

export function clearSelection() {
  try { localStorage.removeItem(KEY); } catch {}
}

export const requestHref = (slug: string) => `${REQUEST_URL}?diseno=${encodeURIComponent(slug)}`;
