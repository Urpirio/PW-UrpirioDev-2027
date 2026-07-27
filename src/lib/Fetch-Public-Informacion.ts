interface tp_Fetch {
  pathname: string;
}

// TEMPORAL: apuntando al Strapi local mientras section-hero/section-about-me
// no estén desplegados en producción. Antes de publicar, revertir a:
// export const API_URL = "https://pw-urpiriodev-cms-2027-production.up.railway.app";
export const API_URL = "http://localhost:1337";

// Definido en .env (no versionado). Ver .env.example.
const API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

export const Fetch = async ({ pathname }: tp_Fetch) => {
  const respuesta = await fetch(`${API_URL}${pathname}`, {
    method: "GET",
    headers: {
      Authorization: `bearer ${API_TOKEN}`,
    },
  });

  return await respuesta.json();
};
