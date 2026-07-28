export interface tp_red_social {
  id: number;
  documentId: string;
  name: string;
  url: string | null;
}

export interface tp_hero_imagen {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
}

export interface object_hero {
  id: number;
  documentId: string;
  descripcion?: string;
  Show_section: boolean;
  redes_sociales: tp_red_social[];
  /** [0]: foto normal, [1]: foto alterna (easter egg al hover). */
  images?: tp_hero_imagen[] | null;
}

export type tp_hero = {
  data: object_hero;
  meta: {};
};
