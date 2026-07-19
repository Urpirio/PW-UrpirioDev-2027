export interface object_proyectos {
  name: string;
  description: string;
  technology: [{ name: string }, { name: string }, { name: string }];
  url_proyecto: string;
  url_githud: string;
  empresa: string;
  images: [
    {
      url: string;
      alt: string;
    },
  ];
}

export type tp_proyectos = object_proyectos[];

export type tp_section_proyecto = {
  data: {
    id: number;
    titulo: string;
    subtitulo: string;
    proyectos: {
      id: number;
      titulo: string;
      subtitulo: string;
      descripcion: string;
      url_proyecto: string;
      url_githud: string;
    }[];
  };
  meta: {};
};
