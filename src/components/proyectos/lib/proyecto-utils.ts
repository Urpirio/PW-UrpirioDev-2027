import type { object_proyecto, tp_documento } from "../types/tp-proyectos";

/**
 * El CMS migró el campo de imagen de "documentos" a "images"; documentos
 * puede seguir viniendo null en proyectos ya migrados. Este helper cubre
 * ambos nombres para no romper mientras conviven datos con uno u otro.
 */
export const getImagenProyecto = (
  proyecto: Pick<object_proyecto, "images" | "documentos">,
): tp_documento | undefined => proyecto.images?.[0] ?? proyecto.documentos?.[0] ?? undefined;
