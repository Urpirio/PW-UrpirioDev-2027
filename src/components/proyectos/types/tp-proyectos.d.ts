export interface tp_documento {
  id: number;
  url: string;
  alternativeText: string | null;
}

export interface tp_categoria_proyecto {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface tp_tecnologia_proyecto {
  id: number;
  nombre: string;
  descripcion: string;
}

// Bloque de rich text (Strapi Blocks). El texto puede traer markdown simple
// embebido (### títulos, * listas, **negrita**) que se procesa aparte con
// parseContenido — ver src/lib/parse-rich-text.ts.
export interface tp_bloque_texto {
  type: string;
  text: string;
}

export interface tp_bloque_contenido {
  type: string;
  children: tp_bloque_texto[];
}

export interface object_proyecto {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  contenido?: tp_bloque_contenido[];
  url_proyecto: string;
  url_githud: string;
  publishedAt: string;
  /** @deprecated el CMS ahora usa `images`; puede venir null */
  documentos: tp_documento[] | null;
  images?: tp_documento[] | null;
  categoria_proyectos: tp_categoria_proyecto[];
  tecnologia_proyectos: tp_tecnologia_proyecto[];
}

export type tp_proyectos = {
  data: object_proyecto[];
  meta: {};
};

export type tp_proyecto_single = {
  data: object_proyecto;
  meta: {};
};
