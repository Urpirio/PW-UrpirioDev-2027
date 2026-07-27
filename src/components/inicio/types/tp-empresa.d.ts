export interface object_empresa {
  id: number;
  documentId: string;
  titulo: string;
  descripcion?: string;
  logo?: {
    url: string;
    alternativeText: string | null;
  } | null;
}
