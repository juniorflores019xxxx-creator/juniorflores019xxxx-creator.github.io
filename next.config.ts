import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exportación estática: `npm run build` genera la carpeta `out/`,
  // que se puede subir a cualquier hosting (Hostinger, Netlify, Vercel…).
  output: "export",
  // /servicios/desarrollo-web/ → out/servicios/desarrollo-web/index.html (funciona en cualquier hosting)
  trailingSlash: true,
  images: {
    // Las imágenes ya están optimizadas en /public; en export estático no hay servidor de imágenes.
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
