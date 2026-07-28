// Parser de Strapi Blocks (rich text). Se ha observado contenido real que
// mezcla dos estilos de autoría:
//  1) Bloques nativos con marcas (child.bold / child.italic / ...).
//  2) Markdown simple tecleado a mano dentro de bloques "paragraph" planos
//     (### título, * item, **negrita**).
// Este parser soporta ambos para no depender de cómo se escribió el texto.

interface BloqueHijo {
  type: string;
  text?: string;
  url?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  children?: BloqueHijo[];
}

interface BloqueStrapi {
  type: string;
  level?: number;
  format?: "ordered" | "unordered";
  children: BloqueHijo[];
}

export interface SegmentoInline {
  texto: string;
  negrita?: boolean;
  cursiva?: boolean;
  subrayado?: boolean;
  tachado?: boolean;
  codigo?: boolean;
  enlace?: string;
}

export interface BloqueParseado {
  tipo: "titulo" | "lista" | "parrafo" | "cita";
  nivel?: number;
  ordenada?: boolean;
  segmentos?: SegmentoInline[];
  items?: SegmentoInline[][];
}

/** Divide texto plano por marcadores **negrita** (markdown tecleado a mano). */
const parseMarkdownInline = (texto: string): SegmentoInline[] =>
  texto
    .split(/(\*\*.+?\*\*)/g)
    .filter(Boolean)
    .map((parte) => {
      const esNegrita = parte.startsWith("**") && parte.endsWith("**");
      return {
        texto: esNegrita ? parte.slice(2, -2) : parte,
        negrita: esNegrita,
      };
    });

const extraerSegmentos = (children?: BloqueHijo[]): SegmentoInline[] => {
  const segmentos: SegmentoInline[] = [];

  for (const hijo of children ?? []) {
    if (hijo.type === "link") {
      const texto = (hijo.children ?? []).map((c) => c.text ?? "").join("");
      if (texto) segmentos.push({ texto, enlace: hijo.url });
      continue;
    }

    const texto = hijo.text ?? "";
    if (!texto) continue;

    const tieneMarcaNativa =
      hijo.bold || hijo.italic || hijo.underline || hijo.strikethrough || hijo.code;

    if (tieneMarcaNativa) {
      segmentos.push({
        texto,
        negrita: hijo.bold,
        cursiva: hijo.italic,
        subrayado: hijo.underline,
        tachado: hijo.strikethrough,
        codigo: hijo.code,
      });
    } else {
      segmentos.push(...parseMarkdownInline(texto));
    }
  }

  return segmentos;
};

export const parseContenido = (
  bloques?: BloqueStrapi[] | null,
): BloqueParseado[] => {
  const resultado: BloqueParseado[] = [];

  for (const bloque of bloques ?? []) {
    if (bloque.type === "heading") {
      resultado.push({
        tipo: "titulo",
        nivel: bloque.level ?? 2,
        segmentos: extraerSegmentos(bloque.children),
      });
      continue;
    }

    if (bloque.type === "list") {
      resultado.push({
        tipo: "lista",
        ordenada: bloque.format === "ordered",
        items: (bloque.children ?? []).map((li) => extraerSegmentos(li.children)),
      });
      continue;
    }

    if (bloque.type === "quote") {
      resultado.push({ tipo: "cita", segmentos: extraerSegmentos(bloque.children) });
      continue;
    }

    // "paragraph" (o tipo desconocido): revisar markdown tecleado a mano
    // antes de tratarlo como párrafo normal.
    const textoPlano = (bloque.children ?? [])
      .map((c) => c.text ?? "")
      .join("")
      .trim();

    if (!textoPlano) continue; // línea vacía usada como espaciador

    if (textoPlano.startsWith("### ")) {
      resultado.push({
        tipo: "titulo",
        nivel: 3,
        segmentos: [{ texto: textoPlano.slice(4) }],
      });
    } else if (textoPlano.startsWith("* ") || textoPlano.startsWith("- ")) {
      const item = parseMarkdownInline(textoPlano.slice(2));
      const anterior = resultado[resultado.length - 1];
      if (anterior?.tipo === "lista" && !anterior.ordenada) {
        anterior.items!.push(item);
      } else {
        resultado.push({ tipo: "lista", ordenada: false, items: [item] });
      }
    } else {
      resultado.push({ tipo: "parrafo", segmentos: extraerSegmentos(bloque.children) });
    }
  }

  return resultado;
};

/** Concatena todo el texto plano de un rich text, sin marcas ni saltos. */
export const extraerTextoPlano = (bloques?: BloqueStrapi[] | null): string =>
  (bloques ?? [])
    .map((bloque) => (bloque.children ?? []).map((c) => c.text ?? "").join(""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
