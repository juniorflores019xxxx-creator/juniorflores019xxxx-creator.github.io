"use client";

import { useRef, useState } from "react";
import { WHATSAPP_URL } from "@/lib/site";
import { IconWhatsApp } from "@/components/ui/icons";
import styles from "@/components/designs/request.module.css";

// Selector de archivos con lista y botón «Quitar». Las fotos pesadas se achican en el navegador;
// los videos o documentos que superan el límite no se suben: se ofrece enviarlos por WhatsApp
// y el cliente marca «Ya lo envié», que queda registrado en archivos_whatsapp[].
const IMG = /\.(jpe?g|png|webp)$/i;
const mb = (n: number) => `${(n / 1048576).toFixed(1)} MB`;

async function shrinkImage(file: File, maxBytes: number): Promise<File | null> {
  try {
    const bmp = await createImageBitmap(file);
    for (const [side, q] of [[2560, 0.86], [2048, 0.82], [1600, 0.78]] as const) {
      const k = Math.min(1, side / Math.max(bmp.width, bmp.height));
      const c = document.createElement("canvas");
      c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
      c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
      const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", q));
      if (blob && blob.size <= maxBytes) return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
    }
  } catch {}
  return null;
}

export default function FilePicker({ name, label, help, ext, maxMB, maxFiles = 10, context, optional = true }: {
  name: string; label: string; help?: string; ext: string[]; maxMB: number; maxFiles?: number; context: string; optional?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [tooBig, setTooBig] = useState<{ name: string; size: number }[]>([]);
  const [sent, setSent] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const max = maxMB * 1048576;

  // El input real conserva los archivos elegidos para que el formulario los envíe
  const sync = (list: File[]) => {
    const dt = new DataTransfer();
    list.forEach((f) => dt.items.add(f));
    if (input.current) input.current.files = dt.files;
    setFiles(list);
  };

  async function onPick(picked: File[]) {
    setBusy(true); setNote("");
    const keep = [...files];
    const big: { name: string; size: number }[] = [];
    for (const f of picked) {
      const e = f.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ext.includes(e)) { setNote(`«${f.name}» no es un formato permitido.`); continue; }
      if (keep.some((k) => k.name === f.name && k.size === f.size)) continue;
      if (f.size <= max) { keep.push(f); continue; }
      const small = IMG.test(f.name) ? await shrinkImage(f, max) : null;
      if (small) { keep.push(small); setNote(`«${f.name}» se achicó a ${mb(small.size)} para poder enviarlo.`); }
      else big.push({ name: f.name, size: f.size });
    }
    if (keep.length > maxFiles) setNote(`Puedes subir hasta ${maxFiles} archivos aquí.`);
    sync(keep.slice(0, maxFiles));
    setTooBig((t) => [...t.filter((x) => !big.some((b) => b.name === x.name)), ...big]);
    setBusy(false);
  }

  const wa = (fname: string) => `${WHATSAPP_URL}?text=${encodeURIComponent(`Hola SIBNOVA, te envío por aquí el archivo «${fname}» del ${context}.`)}`;

  return (
    <div className={styles.field}>
      <span>{label}{optional && <small> (opcional)</small>}</span>
      <input
        ref={input}
        type="file"
        name={name}
        multiple
        accept={ext.map((e) => `.${e}`).join(",")}
        onChange={(e) => {
          const picked = [...(e.target.files ?? [])];
          // Al elegir, el navegador reemplaza la lista: se vuelve a armar con los anteriores más los nuevos
          sync(files);
          onPick(picked);
        }}
      />
      <small className={styles.help}>{help ? `${help} ` : ""}Formatos: {ext.join(", ")}. Hasta {maxMB} MB por archivo.</small>
      {busy && <small className={styles.help}>Preparando archivos…</small>}
      {note && <small className={styles.help}>{note}</small>}
      {files.length > 0 && (
        <ul className={styles.fileList}>
          {files.map((f, i) => (
            <li key={f.name + i}>
              <span>{f.name} <small>({mb(f.size)})</small></span>
              <button type="button" onClick={() => sync(files.filter((_, j) => j !== i))} aria-label={`Quitar ${f.name}`}>Quitar</button>
            </li>
          ))}
        </ul>
      )}
      {tooBig.map((b) => (
        <div key={b.name} className={styles.bigFile} role="status">
          <p><b>«{b.name}»</b> pesa {mb(b.size)} y el máximo es {maxMB} MB. No se subirá con el formulario: envíalo por WhatsApp o compártelo con un enlace de Drive.</p>
          <div className={styles.bigActs}>
            <a className="btn btn-ghost" href={wa(b.name)} target="_blank" rel="noopener"><IconWhatsApp width={18} height={18} /> Enviar por WhatsApp</a>
            <label className={styles.consent}>
              <input type="checkbox" checked={sent.includes(b.name)} onChange={(e) => setSent((s) => (e.target.checked ? [...s, b.name] : s.filter((x) => x !== b.name)))} />
              <span>Ya lo envié por WhatsApp</span>
            </label>
            <button type="button" className={styles.linkBtn} onClick={() => { setTooBig((t) => t.filter((x) => x.name !== b.name)); setSent((s) => s.filter((x) => x !== b.name)); }}>Quitar aviso</button>
          </div>
          {sent.includes(b.name) && <input type="hidden" name="archivos_whatsapp[]" value={`${label}: ${b.name}`} />}
        </div>
      ))}
    </div>
  );
}
