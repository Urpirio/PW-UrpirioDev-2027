import type { object_icono } from "../../inicio/types/tp-cards-sobre-mi";

export interface object_trayectoria {
  id: number;
  documentId: string;
  titulo: string;
  iconos?: object_icono[];
}

export interface object_card_experiencia {
  id: number;
  documentId: string;
  titulo: string;
  empresa: string;
  fecha_inicio?: string | null;
  fecha_final?: string | null;
  lista_de_trayectorias?: object_trayectoria[];
}

export interface object_sobre_mi_experiencia {
  id: number;
  documentId: string;
  titulo?: string;
  subtitulo?: string;
  card_experiencias?: object_card_experiencia[];
}

export type tp_sobre_mi_experiencia = {
  data: object_sobre_mi_experiencia;
  meta: {};
};
