export interface object_habilidades_tecnica {
  id: number;
  documentId: string;
  titulo?: string;
  subtitulo?: string;
}

export type tp_habilidades_tecnica = {
  data: object_habilidades_tecnica;
  meta: {};
};
