import type { tp_bloque_contenido } from "../../proyectos/types/tp-proyectos";
import type { object_card_sobre_mi } from "./tp-cards-sobre-mi";
import type { object_empresa } from "./tp-empresa";

export interface object_sobre_mi {
  id: number;
  documentId: string;
  titulo?: string;
  subtitulo?: string;
  contenido?: tp_bloque_contenido[] | null;
  cards_sobre_mis?: object_card_sobre_mi[];
  empresas?: object_empresa[];
  Tecnologias?: string | number | null;
  roles_profesionales?: string | number | null;
  Experiencia?: string | number | null;
}

export type tp_sobre_mi = {
  data: object_sobre_mi;
  meta: {};
};
