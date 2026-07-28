interface tp_Fetch {
  pathname: string;
}

// Ambos definidos en .env (no versionado). Ver .env.example.
// STRAPI_URL es opcional: si no se define, se usa producción. Para
// desarrollar contra un Strapi local, pon STRAPI_URL=http://localhost:1337
// en tu .env — nunca hace falta tocar este archivo para eso.
export const API_URL =
  import.meta.env.STRAPI_URL ||
  "https://pw-urpiriodev-cms-2027-production.up.railway.app";

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
