// Sube al singleton /api/section-about-me el contenido real que estaba
// hardcodeado como fallback en section-sobre-me.astro (título, tagline,
// narrativa con negrita nativa y las 3 estadísticas).
//
// Uso:
//   STRAPI_ADMIN_TOKEN=xxxx node scripts/seed-sobre-mi.mjs

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const TOKEN = process.env.STRAPI_ADMIN_TOKEN;

if (!TOKEN) {
  console.error(
    "Falta STRAPI_ADMIN_TOKEN. Ejecuta:\n  STRAPI_ADMIN_TOKEN=tu_token node scripts/seed-sobre-mi.mjs",
  );
  process.exit(1);
}

const CONTENIDO_RICH_TEXT = [
  {
    type: "paragraph",
    children: [
      {
        type: "text",
        text: "Desarrollador de software dominicano. Lideré la parte técnica del ",
      },
      {
        type: "text",
        text: "primer asistente de IA del Estado dominicano",
        bold: true,
      },
      {
        type: "text",
        text: " y disfruto convertir ideas en productos que se sienten bien de usar. Creo que el mejor código es el que se entiende sin necesidad de explicarlo.",
      },
    ],
  },
];

const SOBRE_MI = {
  titulo: "Más que líneas de código",
  subtitulo: "Un vistazo rápido a quién soy y cómo trabajo.",
  contenido: CONTENIDO_RICH_TEXT,
  Tecnologias: "20+",
  roles_profesionales: "3",
  Experiencia: "1er",
};

const main = async () => {
  console.log(`Actualizando /api/section-about-me en ${STRAPI_URL}...`);

  const respuesta = await fetch(`${STRAPI_URL}/api/section-about-me`, {
    method: "PUT",
    headers: {
      Authorization: `bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: SOBRE_MI }),
  });
  const json = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(`PUT falló: ${JSON.stringify(json)}`);
  }

  console.log("✔ Actualizado:", json.data.titulo);
  console.log("\nListo.");
};

main().catch((error) => {
  console.error("Fallo el script:", error.message);
  process.exit(1);
});
