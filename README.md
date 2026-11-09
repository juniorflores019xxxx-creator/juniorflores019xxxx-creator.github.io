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
| Paquetes y precios del catálogo | `src/lib/catalog.ts` |
| Los 20 diseños y sus demos | `src/lib/designs.ts` (fotos en `public/disenos/fotos/`, capturas en `public/disenos/capturas/`) |
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

## Catálogo de diseños y solicitudes

- **`/catalogo/`**: paquetes, trabajos reales y los 20 diseños con buscador y filtro por rubro (`src/components/designs/DesignCatalog.tsx`).
- **`/catalogo/ver/<estilo>/`**: visor de la demo con vista escritorio, tablet y celular, flechas al estilo anterior o siguiente y botón «Seleccionar este diseño» (`DemoViewer.tsx`).
- **`/catalogo/disenos/<estilo>/`**: una demo por estilo (`src/components/designs/DesignDemo.tsx` + `demo.module.css`). Negocios ficticios; fotos de Unsplash.
- **`/catalogo/solicitud/`**: formulario de 7 pasos (`RequestForm.tsx`). El diseño elegido se guarda en el navegador y viaja en `?diseno=`.
- **Paquetes y promociones** en `src/lib/catalog.ts`: Presencia, Empresa, catálogo con WhatsApp, tiendas (lanzamiento próximo), A medida, adicionales y el programa de Clientes Fundadores. Es la única fuente de precios: el catálogo, el formulario y el servidor la leen.
- El **estilo no cambia el precio**: el precio inicial sale del paquete. En cada build se genera `/api/catalogo.json`, que el servidor usa para validar paquetes, diseños y precios.

### Servidor de solicitudes (PHP en Hostinger)

| Archivo | Qué hace |
|---|---|
| `public/api/solicitud.php` | Recibe la solicitud, valida todo, calcula el precio desde `catalogo.json`, guarda archivos y avisa por correo a `sibnovaltda@gmail.com` |
| `public/api/_lib.php` | Funciones comunes (no se puede abrir por URL) |
| `public/admin/index.php` | CRM protegido con contraseña: panel con indicadores y embudo de ventas, clientes, solicitudes, datos recibidos, formularios y cuenta |

- **Dónde se guardan los datos:** en `sibnova-datos/`, al lado de `public_html/` (fuera de la parte pública). Es una base SQLite más la carpeta `archivos/`. Publicar una versión nueva del sitio **no los borra**. Haz copia de esa carpeta cada mes desde el Administrador de archivos de Hostinger.
- **Requisitos:** PHP 8.1 o superior con `pdo_sqlite`, `fileinfo` y `mbstring` (vienen activos en Hostinger), y `upload_max_filesize` de 12 MB o más.
- **Primer uso:** abre `https://sibnova.com.bo/admin/`, escribe la clave de activación (se entrega aparte, nunca va en Git) y crea tu contraseña de 12 caracteres o más. La clave de activación deja de servir después.
- **Protección:** campo trampa y tiempo mínimo contra robots, 30 intentos y 5 solicitudes válidas por hora y conexión, verificación del tipo real de cada archivo, límite de 10 archivos (10 MB cada uno, 40 MB en total), bloqueo de 15 minutos tras 5 contraseñas incorrectas, sesiones con cookie segura y token contra falsificación de formularios.
- Si el servidor no responde, el formulario ofrece enviar la solicitud por WhatsApp (sin archivos).

## Formularios de datos para clientes

- **`/datos-proyecto/?f=<formulario>`**: formularios privados (fuera del menú y de Google) para que el cliente envíe los datos, textos, colores y archivos de su proyecto.
- Formularios disponibles: `pagina-web`, `catalogo-whatsapp`, `logo`, `redes-sociales`, `logo-redes`, `aplicacion`, `inteligencia-artificial` y `automatizacion`.
- **Uso diario:** bandeja `/admin/` → **Formularios**: escribes el WhatsApp del cliente y se abre el chat con el enlace listo. Las respuestas y archivos llegan a **Datos recibidos**.
- **Crear un formulario nuevo para otro trabajo:** agrega una entrada en `FORMS` de `src/lib/forms.ts` reutilizando los bloques (contacto, empresa, colores, archivos, cierre). Se valida en el servidor con `/api/formularios.json`, que se genera en cada build. Nunca pedir contraseñas.
- **Pasar el trabajo a Claude:** en el detalle de cada solicitud o dato recibido, «Descargar para Claude» baja un ZIP con `brief.md` y los archivos del cliente. Abre la carpeta en Claude Code y pide «haz el proyecto con el brief» (habilidad `crear-proyecto-cliente`).
- Servidor: `public/api/datos.php` (mismas protecciones que las solicitudes; archivos fuera de `public_html`).
