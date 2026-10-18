// Limpia la página 404 exportada (se ejecuta después de `npm run build`).
// El layout raíz le agrega el título, la dirección oficial (canonical) y el «index, follow» de la portada;
// en una página de error eso confunde a Google. Aquí se dejan solo su propio título y el «noindex».
import { readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";

const out = join(process.cwd(), "out");
const files = ["404.html", join("404", "index.html")];
let fixed = 0;

for (const name of files) {
  const file = join(out, name);
  if (!(await stat(file).catch(() => null))) continue;
  let html = await readFile(file, "utf8");
  const before = html;
  html = html
    .replace(/<title>(?!Página no encontrada)[^<]*<\/title>/g, "")
    .replace(/<link rel="canonical"[^>]*>/g, "")
    .replace(/<meta name="robots" content="index, follow"\/?>/g, "")
    .replace(/<meta property="og:url"[^>]*>/g, "");
  if (html !== before) { await writeFile(file, html); fixed++; }
}
console.log(`fix-404: ${fixed} archivo(s) corregidos.`);
