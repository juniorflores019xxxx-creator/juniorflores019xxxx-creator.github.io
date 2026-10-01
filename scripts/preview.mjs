// Servidor estático mínimo para revisar la carpeta `out/` tal como la verá el hosting.
// Uso: npm run preview   (después de npm run build)
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "out");
const port = Number(process.env.PORT) || 4173;
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml",
};

createServer(async (req, res) => {
  try {
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = normalize(join(root, url));
    if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
    const s = await stat(file).catch(() => null);
    if (s?.isDirectory()) file = join(file, "index.html");
    else if (!s) {
      const html = await stat(file + ".html").catch(() => null);
      file = html ? file + ".html" : join(root, "404.html");
    }
    const body = await readFile(file);
    res.writeHead(file.endsWith("404.html") && !url.endsWith("404") ? 404 : 200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(500).end("Error");
  }
}).listen(port, () => console.log(`SIBNOVA en http://localhost:${port}`));
