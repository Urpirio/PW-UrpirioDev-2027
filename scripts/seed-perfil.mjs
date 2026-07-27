// Sube al singleton /api/sobre-mi los datos que estaban hardcodeados en
// section-perfil.astro: contacto, especialidad, perfil narrativo (rich text)
// y la foto de perfil (se sube como media si el campo aún está vacío).
//
// Uso:
//   STRAPI_ADMIN_TOKEN=xxxx node scripts/seed-perfil.mjs

import { readFile } from "node:fs/promises";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const TOKEN = process.env.STRAPI_ADMIN_TOKEN;

if (!TOKEN) {
  console.error(
    "Falta STRAPI_ADMIN_TOKEN. Ejecuta:\n  STRAPI_ADMIN_TOKEN=tu_token node scripts/seed-perfil.mjs",
  );
  process.exit(1);
}

const FOTO_PERFIL = "src/assets/foto_sin_fondo.png";

const PERFIL_RICH_TEXT = [
  {
    type: "paragraph",
    children: [
      {
        type: "text",
        text: "Soy desarrollador de software con experiencia en el diseño y desarrollo de interfaces modernas y escalables para plataformas ",
      },
      { type: "text", text: "web y móviles", bold: true },
      {
        type: "text",
        text: ". Me especializo en frontend de alta calidad, respaldado por una base sólida en backend, bases de datos, despliegue de sistemas e integración de plataformas, lo que me permite aportar de principio a fin.",
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        type: "text",
        text: "He liderado componentes técnicos de iniciativas nacionales de innovación, incluyendo ",
      },
      { type: "text", text: "soluciones basadas en IA en el sector público", bold: true },
      {
        type: "text",
        text: ", trabajando junto a equipos de backend, infraestructura y multidisciplinarios para garantizar estabilidad, seguridad, escalabilidad y rendimiento. Me siento cómodo asumiendo responsabilidades full-stack cuando hace falta.",
      },
    ],
  },
];

const PERFIL = {
  especialidad: "Desarrollador de software y especialista en soluciones digitales.",
  direccion: "Santo Domingo, RD",
  numero: "+1 (849) 257-7007",
  website: "urpiriodev.com.do",
  githud: "https://github.com/Urpirio",
  linkedin: "https://do.linkedin.com/in/urpiriojunior-moreno-vargas-95294b269",
  email: "UrpirioJunior@gmail.com",
  perfil: PERFIL_RICH_TEXT,
};

const headers = { Authorization: `bearer ${TOKEN}` };

const obtenerActual = async () => {
  const respuesta = await fetch(`${STRAPI_URL}/api/sobre-mi?populate=*`, {
    headers,
  });
  const json = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(`GET /api/sobre-mi falló: ${JSON.stringify(json)}`);
  }
  return json.data;
};

const subirFoto = async (rutaArchivo) => {
  const buffer = await readFile(rutaArchivo);
  const form = new FormData();
  form.append("files", new Blob([buffer]), "foto_sin_fondo.png");

  const respuesta = await fetch(`${STRAPI_URL}/api/upload`, {
    method: "POST",
    headers,
    body: form,
  });
  const json = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(`Error subiendo la foto: ${JSON.stringify(json)}`);
  }
  return json[0].id;
};

const main = async () => {
  console.log(`Consultando /api/sobre-mi en ${STRAPI_URL}...`);
  const actual = await obtenerActual();

  const data = { ...PERFIL };

  if (actual?.foto_perfil) {
    console.log("⏭  foto_perfil (ya tiene una imagen, no se reemplaza)");
  } else {
    console.log("⬆  Subiendo foto de perfil...");
    data.foto_perfil = await subirFoto(FOTO_PERFIL);
  }

  const respuesta = await fetch(`${STRAPI_URL}/api/sobre-mi`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  const json = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(`PUT /api/sobre-mi falló: ${JSON.stringify(json)}`);
  }

  console.log("✔ Perfil actualizado:", json.data.especialidad);
  console.log("\nListo.");
};

main().catch((error) => {
  console.error("Fallo el script:", error.message);
  process.exit(1);
});
