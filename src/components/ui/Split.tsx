import { Fragment } from "react";

/**
 * Divide un texto en palabras para animarlas una a una (data-split).
 * Las partes marcadas con *asteriscos* se resaltan en azul claro.
 */
export default function Split({ text, as: Tag = "span", className }: { text: string; as?: "span" | "h2" | "h3" | "p"; className?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  let i = 0;
  return (
    <Tag className={className} data-split aria-label={text.replace(/\*/g, "")}>
      {parts.map((part, pi) => {
        const accent = part.startsWith("*");
        const words = part.replace(/\*/g, "").split(/\s+/).filter(Boolean);
        return (
          <Fragment key={pi}>
            {words.map((w) => (
              <Fragment key={i}>
                <span className="split-mask" aria-hidden="true">
                  <span className="split-word" style={{ ["--i" as string]: i++, color: accent ? "var(--blue-2)" : undefined }}>
                    {w}
                  </span>
                </span>{" "}
              </Fragment>
            ))}
          </Fragment>
        );
      })}
    </Tag>
  );
}
