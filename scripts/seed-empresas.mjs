// Sube los logos de public/logos/ a la librería de medios de Strapi y crea
// las entradas del content-type "empresa" (colección /api/empresas),
// relacionando cada una con su logo recién subido.
//
// Uso:
//   STRAPI_ADMIN_TOKEN=xxxx node scripts/seed-empresas.mjs
//
// Es idempotente: si una empresa con el mismo título ya existe, la salta.

import { readFile } from "node:fs/promises";
import path from "node:path";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const TOKEN = process.env.STRAPI_ADMIN_TOKEN;

if (!TOKEN) {
  console.error(
    "Falta STRAPI_ADMIN_TOKEN. Ejecuta:\n  STRAPI_ADMIN_TOKEN=tu_token node scripts/seed-empresas.mjs",
  );
  process.exit(1);
}

const EMPRESAS = [
  {
    titulo: "OGTIC",
    descripcion: "Oficina Gubernamental de Tecnologías de la Información y Comunicación",
    logo: "public/logos/Ogtic-Logo.png",
  },
  {
    titulo: "ITU",
    descripcion: "Unión Internacional de Telecomunicaciones",
    logo: "public/logos/Itu-Logo.png",
  },
  {
    titulo: "Siddhatech",
    descripcion: "Innovate, Plan, Execute",
    logo: "public/logos/Siddhatech.png",
  },
];

const authHeaders = { Authorization: `bearer ${TOKEN}` };

const obtenerExistentes = async () => {
  const respuesta = await fetch(`${STRAPI_URL}/api/empresas`, {
    headers: authHeaders,
  });
  const json = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(`No se pudo leer /api/empresas: ${JSON.stringify(json)}`);
  }
  return new Set((json.data ?? []).map((e) => e.titulo));
};

const subirLogo = async (rutaArchivo) => {
  const buffer = await readFile(rutaArchivo);
  const nombre = path.basename(rutaArchivo);
  const form = new FormData();
  form.append("files", new Blob([buffer]), nombre);

  const respuesta = await fetch(`${STRAPI_URL}/api/upload`, {
    method: "POST",
    headers: authHeaders,
    body: form,
  });
  const json = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(`Error subiendo ${nombre}: ${JSON.stringify(json)}`);
  }

  return json[0].id;
};

const crearEmpresa = async ({ titulo, descripcion, logoId }) => {
  const respuesta = await fetch(`${STRAPI_URL}/api/empresas`, {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ data: { titulo, descripcion, logo: logoId } }),
  });
  const json = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(`Error creando "${titulo}": ${JSON.stringify(json)}`);
  }

  return json;
};

const main = async () => {
  console.log(`Consultando empresas existentes en ${STRAPI_URL}...`);
  const existentes = await obtenerExistentes();

  for (const empresa of EMPRESAS) {
    if (existentes.has(empresa.titulo)) {
      console.log(`⏭  ${empresa.titulo} (ya existe)`);
      continue;
    }

    console.log(`⬆  Subiendo logo de ${empresa.titulo}...`);
    const logoId = await subirLogo(empresa.logo);

    await crearEmpresa({
      titulo: empresa.titulo,
      descripcion: empresa.descripcion,
      logoId,
    });
    console.log(`✔  ${empresa.titulo}`);
  }

  console.log("\nListo.");
};

main().catch((error) => {
  console.error("Fallo el script:", error.message);
  process.exit(1);
});
