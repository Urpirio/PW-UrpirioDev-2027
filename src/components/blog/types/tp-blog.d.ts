import type { tp_bloque_contenido, object_proyecto_cta } from "../../proyectos/types/tp-proyectos";

export interface tp_blog_documento {
  id: number;
  documentId: string;
  name: string;
  url: string;
  alternativeText: string | null;
  ext: string;
  mime: string;
  size: number;
}

export interface tp_categoria_blog {
  id: number;
  documentId: string;
  nombre: string;
  descripcion?: string;
}

export interface tp_autor_articulo {
  id: number;
  documentId: string;
  /** Tal cual está en el CMS (con el typo "nombe"). */
  nombe: string;
  apellido: string;
  linkedin?: string | null;
  instagram?: string | null;
  foto_autor?: tp_blog_documento | null;
}

export interface tp_fuente {
  id: number;
  documentId: string;
  titulo: string;
  url: string;
  descripcion?: string;
}

export interface object_blog {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo?: string;
  articulo: tp_bloque_contenido[];
  publishedAt: string;
  imagenes?: tp_blog_documento[] | null;
  documentos?: tp_blog_documento[] | null;
  categoria_blogs?: tp_categoria_blog[];
  cta?: object_proyecto_cta | null;
  autores_de_articulo?: tp_autor_articulo | null;
  fuentes?: tp_fuente[];
}

export type tp_blogs = {
  data: object_blog[];
  meta: {};
};

export type tp_blog_single = {
  data: object_blog;
  meta: {};
};
