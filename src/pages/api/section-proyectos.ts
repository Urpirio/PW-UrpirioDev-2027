// import { string } from "astro:schema";
import { APIRoute } from "astro";
import { Fetch } from "../../lib/Fetch-Public-Informacion";

export const GET = (async ({ params }) => {
  const respuesta = await Fetch({ pathname: "/api/section-proyecto?populate=*" });

  return new Response(JSON.stringify(respuesta));
}) satisfies APIRoute;
