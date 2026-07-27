import type { tp_bloque_contenido } from "../../proyectos/types/tp-proyectos";

export interface object_perfil {
  id: number;
  documentId: string;
  especialidad?: string;
  direccion?: string;
  numero?: string;
  website?: string;
  githud?: string;
  linkedin?: string;
  email?: string;
  perfil?: tp_bloque_contenido[] | null;
  foto_perfil?: {
    url: string;
    alternativeText: string | null;
  } | null;
}

export type tp_perfil = {
  data: object_perfil;
  meta: {};
};
