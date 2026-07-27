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

export interface object_proyecto {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  url_proyecto: string;
  url_githud: string;
  publishedAt: string;
  documentos: tp_documento[];
  categoria_proyectos: tp_categoria_proyecto[];
  tecnologia_proyectos: tp_tecnologia_proyecto[];
}

export type tp_proyectos = {
  data: object_proyecto[];
  meta: {};
};
