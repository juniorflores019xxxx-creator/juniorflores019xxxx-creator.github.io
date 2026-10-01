# SIBNOVA — sitio web oficial (proyecto 2)

Sitio corporativo de **SIBNOVA LTDA. · Soluciones Informáticas de Bolivia**.
Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4, con animaciones de scroll en **GSAP** y el hero 3D en **Three.js**.
Se exporta como sitio **estático** (carpeta `out/`), así que se puede subir a cualquier hosting.

## Requisitos

- Node.js 20 o superior (instalado en `C:\Users\PC\tools\node-v24.21.0-win-x64`, ya añadido al PATH de tu usuario).
  Si una terminal no reconoce `node` o `npm`, ciérrala y ábrela de nuevo.

## Comandos

```bash
npm install        # solo la primera vez (o si borras node_modules)
npm run dev        # desarrollo con recarga en vivo → http://localhost:3000
npm run build      # compila para producción → genera la carpeta out/
npm run preview    # sirve out/ tal como lo verá el hosting → http://localhost:4173
npm run lint       # revisión de código
```

## Estructura

```
src/
  app/
    layout.tsx          fuentes, SEO (title, description, Open Graph, Twitter), datos para Google (JSON-LD)
    page.tsx            orden de las secciones
    globals.css         paleta, tipografía, botones y base de animaciones
    robots.ts           → /robots.txt
    sitemap.ts          → /sitemap.xml
    icon.png, apple-icon.png            favicon / icono iOS (logo SN)
    opengraph-image.png, twitter-image.png   imagen al compartir en redes
  lib/
    site.ts             DATOS DE LA EMPRESA: teléfono, correo, WhatsApp, redes, fundadores, menú
    gsap.ts             registro de GSAP + ScrollTrigger
  components/
    Header.tsx          header fijo + menú móvil a pantalla completa
    Footer.tsx
    Motion.tsx          animaciones de scroll globales (data-split, data-reveal, data-parallax, data-zoom)
    hero/Hero.tsx       hero con scroll y textos
    hero/HeroScene.ts   escena 3D (red de nodos, núcleo S+N → AI · APPS · WEB · CLOUD · AUTOMATION · DATA)
    sections/           Servicios, Proceso, Ecosistema, Proyectos, Nosotros, CTA final, Contacto
    ui/                 iconos, texto animado por palabras, inclinación 3D de tarjetas
public/
  brand/                logos (versión clara para fondo negro)
  img/                  fotos del equipo y de Te Resuelvo (ya optimizadas)
scripts/preview.mjs     servidor local para revisar out/
```

## Cambios habituales

| Quiero cambiar… | Archivo |
|---|---|
| Teléfono, correo, WhatsApp, dominio | `src/lib/site.ts` → `SITE` |
| Añadir Instagram, Facebook, LinkedIn, TikTok | `src/lib/site.ts` → `SOCIAL` (descomenta y pon la URL real) |
| Nombres o cargos de los fundadores | `src/lib/site.ts` → `FOUNDERS` |
| Fotos | reemplaza los archivos en `public/img/` con el mismo nombre |
| Textos de servicios / proceso | `src/components/sections/Services.tsx` / `Process.tsx` |
| Colores | `src/app/globals.css` → `:root` |

## Páginas de servicio

Cada tarjeta de "Lo que construimos" abre su propia página:

- `/servicios/desarrollo-de-aplicaciones/`
- `/servicios/inteligencia-artificial/`
- `/servicios/automatizacion-empresarial/`
- `/servicios/desarrollo-web/`

Todo su contenido (qué construimos, pasos del proceso, tecnologías, qué recibe el cliente, para quién es)
está en **`src/lib/services.ts`**: edita ese archivo para cambiar textos. El diseño está en `src/components/service/`.
Cada página trae el formulario de contacto con el tema del servicio ya marcado, y están incluidas en el sitemap.

> `npm run build` ejecuta después `scripts/fix-segments.mjs`, que corrige un fallo de Next.js al exportar en Windows
> (archivos de precarga de páginas creados como carpetas). En Linux/macOS no hace nada.

## Buscador inteligente

Botón **Buscar** en la cabecera (o **Ctrl + K** / tecla **/**). Entiende sinónimos, ignora tildes y tolera errores de escritura
("inventraio" → inventario). Lleva a la sección o servicio correcto, abre WhatsApp, correo o teléfono, y siempre ofrece
"Contarnos: «lo que escribiste»", que baja al formulario con ese texto ya escrito.
Las palabras clave están en `src/components/search/searchIndex.ts`.

## Burbuja de WhatsApp

Fija en la esquina inferior derecha durante toda la página (`src/components/WhatsAppFloat.tsx`).
Abre WhatsApp con el mensaje "Hola SIBNOVA, quiero información sobre sus servicios."

## Formulario de contacto

No necesita servidor: al enviarlo abre **WhatsApp** (+591 7648 6765) con el mensaje ya redactado.
El botón lo dice claramente ("Continuar en WhatsApp").

## Accesibilidad y rendimiento

- Con **"reducir movimiento"** activado en el sistema, se desactivan las animaciones y el hero se muestra estático.
- Three.js se carga aparte (no bloquea la primera pintura) y solo se renderiza mientras el hero está en pantalla.
- Densidad de partículas y resolución reducidas en móvil.

## Publicación (pendiente, se hará al final)

1. `npm run build`
2. Sube **el contenido** de la carpeta `out/` (no la carpeta en sí) a la raíz del hosting
   (en Hostinger: `public_html/`, con el Administrador de archivos o por FTP).
3. Comprueba `https://sibnova.com.bo/robots.txt` y `https://sibnova.com.bo/sitemap.xml`.
4. Registra el sitemap en Google Search Console.

Alternativa sin configuración: Vercel o Netlify detectan Next.js y publican directamente.
