"use client";

import { useRouter } from "next/navigation";
import { requestHref, saveSelection } from "@/lib/selection";

// Botón «Elegir este diseño»: guarda la selección y abre el formulario de solicitud.
export default function ChooseDesign({ slug, className, children, label }: { slug: string; className?: string; children: React.ReactNode; label?: string }) {
  const router = useRouter();
  return (
    <a
      href={requestHref(slug)}
      className={className}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        saveSelection(slug);
        router.push(requestHref(slug));
      }}
    >
      {children}
    </a>
  );
}
