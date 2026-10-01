// Corrige un fallo de Next.js al exportar en Windows.
// Next espera archivos de precarga con nombre plano, por ejemplo:
//   out/servicios/desarrollo-web/__next.servicios.$d$slug.__PAGE__.txt
// pero en Windows los crea como carpetas:
//   out/servicios/desarrollo-web/__next.servicios/$d$slug/__PAGE__.txt
// Este script (se ejecuta solo después de `npm run build`) los aplana al nombre correcto.
// En Linux o macOS no encuentra nada que corregir y no hace cambios.
import { readdir, rename, rm, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const out = join(process.cwd(), "out");
let fixed = 0;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) await flatten(dir, full);
    else if (entry.name !== "_next") await walk(full);
  }
}

async function flatten(parent, segDir) {
  const files = [];
  const collect = async (d) => {
    for (const e of await readdir(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) await collect(p);
      else files.push(p);
    }
  };
  await collect(segDir);
  for (const f of files) {
    const flat = relative(parent, f).split(sep).join(".");
    await rename(f, join(parent, flat));
    fixed++;
  }
  await rm(segDir, { recursive: true, force: true });
}

if (await stat(out).catch(() => null)) {
  await walk(out);
  console.log(fixed ? `fix-segments: ${fixed} archivo(s) de precarga corregidos.` : "fix-segments: nada que corregir.");
}
