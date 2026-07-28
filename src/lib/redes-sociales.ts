// Compartido entre el hero y el footer: ambos consumen la misma colección
// "red-social" del CMS ({ name, url }), donde url puede venir vacío.

export interface RedSocialCms {
  name: string;
  url: string | null;
}

export interface RedResuelta {
  titulo: string;
  href: string;
  icon: string;
}

interface RedConfig {
  icon: string;
  /** URL de respaldo por si el campo "url" aún no se ha llenado en el CMS. */
  fallbackHref?: string;
}

export const REDES_ICONOS: Record<string, RedConfig> = {
  github: { icon: "simple-icons:github", fallbackHref: "https://github.com/Urpirio" },
  githud: { icon: "simple-icons:github", fallbackHref: "https://github.com/Urpirio" },
  linkedin: {
    icon: "simple-icons:linkedin",
    fallbackHref: "https://do.linkedin.com/in/urpiriojunior-moreno-vargas-95294b269",
  },
  instagram: { icon: "simple-icons:instagram" },
  email: { icon: "lucide:mail", fallbackHref: "mailto:UrpirioJunior@gmail.com" },
};

export const resolverRedes = (redes: RedSocialCms[] = []): RedResuelta[] =>
  redes
    .map((red) => {
      const config = REDES_ICONOS[red.name?.toLowerCase()?.trim()];
      if (!config) return null;
      const href = red.url?.trim() || config.fallbackHref;
      if (!href) return null;
      return { titulo: red.name, href, icon: config.icon };
    })
    .filter((red): red is RedResuelta => red !== null);
