export interface tp_red_social {
  id: number;
  documentId: string;
  name: string;
  url: string | null;
}

export interface object_hero {
  id: number;
  documentId: string;
  descripcion?: string;
  Show_section: boolean;
  redes_sociales: tp_red_social[];
}

export type tp_hero = {
  data: object_hero;
  meta: {};
};
