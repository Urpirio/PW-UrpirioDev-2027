import type { object_proyecto, tp_documento } from "../types/tp-proyectos";

/** Galería de imágenes del proyecto (portada + adicionales). */
export const getGaleriaImagenes = (
  proyecto: Pick<object_proyecto, "images">,
): tp_documento[] => proyecto.images ?? [];

/** Primera imagen del proyecto, si tiene alguna. */
export const getImagenProyecto = (
  proyecto: Pick<object_proyecto, "images">,
): tp_documento | undefined => getGaleriaImagenes(proyecto)[0];
