export interface object_formacion {
  id: number;
  documentId: string;
  titulo: string;
  univerdidad: string;
  fecha_inicio?: string | null;
  fecha_final?: string | null;
}

export interface object_certificado {
  id: number;
  documentId: string;
  titulo: string;
  Instituto: string;
  fecha?: string | null;
}

export interface object_formacion_y_certificado {
  id: number;
  documentId: string;
  titulo?: string;
  subtitulo?: string;
  formacions?: object_formacion[];
  certificados?: object_certificado[];
}

export type tp_formacion_y_certificado = {
  data: object_formacion_y_certificado;
  meta: {};
};
