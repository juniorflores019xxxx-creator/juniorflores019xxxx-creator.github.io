import Link from "next/link";
import { SITE, SOCIAL } from "@/lib/site";
import { IconFacebook, IconInstagram, IconLinkedIn, IconMail, IconTikTok, IconWhatsApp, IconX } from "@/components/ui/icons";
import styles from "./footer.module.css";

const ICONS = { whatsapp: IconWhatsApp, mail: IconMail, instagram: IconInstagram, facebook: IconFacebook, linkedin: IconLinkedIn, tiktok: IconTikTok, x: IconX };

const LINKS = [
  { label: "Servicios", href: "/#servicios" },
  { label: "Aplicaciones", href: "/servicios/desarrollo-de-aplicaciones/" },
  { label: "Inteligencia Artificial", href: "/servicios/inteligencia-artificial/" },
  { label: "Automatización", href: "/servicios/automatizacion-empresarial/" },
  { label: "Desarrollo Web", href: "/servicios/desarrollo-web/" },
  { label: "Contacto", href: "#contacto" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.top}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo} aria-label="SIBNOVA, volver al inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <span className={styles.plate}><img src="/brand/sn-logo.png" alt="" width={865} height={407} loading="lazy" /></span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/sibnova-nombre-claro.png" alt="" width={631} height={84} loading="lazy" />
          </Link>
          <p className={styles.legal}>{SITE.legalName}</p>
          <p className={styles.tag}>{SITE.tagline}.</p>
        </div>

        <nav aria-label="Enlaces del pie de página" className={styles.links}>
          {LINKS.map((l) => (
            <a key={l.label} href={l.href}>{l.label}</a>
          ))}
        </nav>

        <div className={styles.social}>
          <p className={styles.small}>Síguenos y escríbenos</p>
          <ul>
            {SOCIAL.map((s) => {
              const Icon = ICONS[s.icon];
              const external = s.href.startsWith("http");
              return (
                <li key={s.label}>
                  <a href={s.href} aria-label={s.label} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
                    <Icon width={20} height={20} />
                  </a>
                </li>
              );
            })}
          </ul>
          <p className={styles.small}>{SITE.city}<br />{SITE.phoneDisplay} · {SITE.email}</p>
        </div>
      </div>
      <div className={`wrap ${styles.bottom}`}>
        <span>© {year} {SITE.fullLegalName}</span>
        <span className={styles.domain}>sibnova.com.bo</span>
      </div>
    </footer>
  );
}
