import { SITE, WHATSAPP_URL } from "@/lib/site";
import { IconWhatsApp } from "@/components/ui/icons";
import styles from "./whatsapp.module.css";

const MESSAGE = "Hola SIBNOVA, quiero información sobre sus servicios.";

// Acceso directo a WhatsApp, fijo en la esquina durante toda la página.
export default function WhatsAppFloat() {
  return (
    <a
      className={styles.bubble}
      href={`${WHATSAPP_URL}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noopener"
      aria-label={`Escríbenos por WhatsApp al ${SITE.phoneDisplay}`}
    >
      <span className={styles.label}>
        <b>¿Hablamos?</b>
        <small>Escríbenos por WhatsApp</small>
      </span>
      <span className={styles.icon}>
        <IconWhatsApp width={30} height={30} />
      </span>
    </a>
  );
}
