import type { RedSocialCms } from "../../../lib/redes-sociales";

export interface object_footer {
  id: number;
  documentId: string;
  descripcion?: string;
  ubicacion?: string;
  redes_sociales?: RedSocialCms[];
}

export type tp_footer = {
  data: object_footer;
  meta: {};
};
