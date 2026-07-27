// NOTA: la colección /api/blogs aún no tiene entradas publicadas, por lo que
// este esquema se basa en la convención usada en /api/proyectos (mismo CMS).
// Ajustar los nombres de campo si en Strapi difieren una vez haya contenido real.

export interface tp_blog_documento {
  id: number;
  url: string;
  alternativeText: string | null;
}

export interface tp_categoria_blog {
  id: number;
  documentId: string;
  nombre: string;
  descripcion?: string;
}

export interface object_blog {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo?: string;
  resumen?: string;
  contenido: string;
  publishedAt: string;
  documentos?: tp_blog_documento[];
  categoria_blogs?: tp_categoria_blog[];
}

export type tp_blogs = {
  data: object_blog[];
  meta: {};
};

export type tp_blog_single = {
  data: object_blog;
  meta: {};
};
