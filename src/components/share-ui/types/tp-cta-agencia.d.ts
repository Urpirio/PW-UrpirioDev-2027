export interface object_cta_agencia {
  id: number;
  documentId: string;
  titulo?: string;
  descripcion?: string;
  url_agencia?: string;
  label_url?: string;
}

export type tp_cta_agencia = {
  data: object_cta_agencia;
  meta: {};
};
