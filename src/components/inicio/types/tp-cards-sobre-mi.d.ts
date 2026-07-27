export interface object_icono {
  id: number;
  documentId: string;
  icono: string;
  descripcion?: string;
}

export interface object_card_sobre_mi {
  id: number;
  documentId: string;
  titulo: string;
  subtitulo: string;
  icono: object_icono | null;
}

export type tp_cards_sobre_mi = {
  data: object_card_sobre_mi[];
  meta: {};
};
