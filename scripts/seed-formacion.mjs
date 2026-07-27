// Sube la formación y los certificados que estaban hardcodeados en
// section-formacion.astro al CMS, respetando la relación real:
//
//   formacion-y-certificado (singleton: titulo, subtitulo)
//     ├─ formacions[]    (titulo, univerdidad, fecha_inicio, fecha_final)
//     └─ certificados[]  (titulo, Instituto, fecha)
//
// Uso:
//   STRAPI_ADMIN_TOKEN=xxxx node scripts/seed-formacion.mjs
//
// Es idempotente: si una formación/certificado con el mismo "titulo" ya
// existe, la salta.

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const TOKEN = process.env.STRAPI_ADMIN_TOKEN;

if (!TOKEN) {
  console.error(
    "Falta STRAPI_ADMIN_TOKEN. Ejecuta:\n  STRAPI_ADMIN_TOKEN=tu_token node scripts/seed-formacion.mjs",
  );
  process.exit(1);
}

const FORMACIONES = [
  {
    titulo: "Ingeniería de Software",
    univerdidad: "Universidad Dominicano Americana",
    fecha_inicio: "2022-09-01",
    fecha_final: null, // en curso
  },
  {
    titulo: "Técnico de programación de alto impacto",
    univerdidad: "Semillero Digital Intro",
    fecha_inicio: "2024-09-01",
    fecha_final: "2025-03-01",
  },
  {
    titulo: "Diploma en Matemáticas: Ciencia, Tecnología e Ingeniería",
    univerdidad: "Alison",
    fecha_inicio: "2024-01-01",
    fecha_final: "2024-04-01",
  },
  {
    titulo: "Diploma in Information Technology Support",
    univerdidad: "Alison",
    fecha_inicio: "2024-01-01",
    fecha_final: "2024-03-01",
  },
  {
    titulo: "Programa de Inmersión en Inglés (MESCYT)",
    univerdidad: "Escuela de Idiomas Dominicana Americana",
    fecha_inicio: "2023-01-01",
    fecha_final: "2023-11-01",
  },
];

const CERTIFICADOS = [
  {
    titulo: "Planificación estratégica en la gestión pública",
    Instituto: "INAP",
    fecha: "2025-10-01",
  },
  {
    titulo: "Diseño, implementación y evaluación de proyectos",
    Instituto: "INAP",
    fecha: "2025-11-01",
  },
  {
    titulo: "ISO/IEC 27001 — Seguridad de la Información (SGSI)",
    Instituto: "Alison",
    fecha: "2024-03-01",
  },
  {
    titulo: "Introducción a la programación en C#",
    Instituto: "Alison",
    fecha: "2024-05-01",
  },
  {
    titulo: "Introducción a la inteligencia empresarial",
    Instituto: "Alison",
    fecha: "2024-04-01",
  },
  {
    titulo: "Introducción a la ciencia de datos",
    Instituto: "Alison",
    fecha: "2024-04-01",
  },
];

const headers = {
  Authorization: `bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

const obtenerJson = async (pathname) => {
  const respuesta = await fetch(`${STRAPI_URL}${pathname}`, { headers });
  const json = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(`GET ${pathname} falló: ${JSON.stringify(json)}`);
  }
  return json;
};

const postJson = async (pathname, data) => {
  const respuesta = await fetch(`${STRAPI_URL}${pathname}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
  });
  const json = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(`POST ${pathname} falló: ${JSON.stringify(json)}`);
  }
  return json.data;
};

const putJson = async (pathname, data) => {
  const respuesta = await fetch(`${STRAPI_URL}${pathname}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ data }),
  });
  const json = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(`PUT ${pathname} falló: ${JSON.stringify(json)}`);
  }
  return json.data;
};

const sembrarColeccion = async (pathname, items, existentes) => {
  const nuevosIds = [];
  for (const item of items) {
    if (existentes.has(item.titulo)) {
      console.log(`⏭  ${item.titulo} (ya existe)`);
      continue;
    }
    const creado = await postJson(pathname, item);
    nuevosIds.push(creado.documentId);
    console.log(`✔  ${item.titulo}`);
  }
  return nuevosIds;
};

const main = async () => {
  console.log(`Consultando datos existentes en ${STRAPI_URL}...`);

  const [formacionesJson, certificadosJson] = await Promise.all([
    obtenerJson("/api/formacions?pagination[pageSize]=100"),
    obtenerJson("/api/certificados?pagination[pageSize]=100"),
  ]);
  const formacionesExistentes = new Set(
    (formacionesJson.data ?? []).map((f) => f.titulo),
  );
  const certificadosExistentes = new Set(
    (certificadosJson.data ?? []).map((c) => c.titulo),
  );

  console.log("\n— Formación —");
  const nuevasFormacionIds = await sembrarColeccion(
    "/api/formacions",
    FORMACIONES,
    formacionesExistentes,
  );

  console.log("\n— Certificados —");
  const nuevosCertificadoIds = await sembrarColeccion(
    "/api/certificados",
    CERTIFICADOS,
    certificadosExistentes,
  );

  if (nuevasFormacionIds.length > 0 || nuevosCertificadoIds.length > 0) {
    console.log("\nConectando con el singleton formacion-y-certificado...");
    const actual = await obtenerJson(
      "/api/formacion-y-certificado?populate=*",
    );
    const idsFormacionPrevios = (actual.data?.formacions ?? []).map(
      (f) => f.documentId,
    );
    const idsCertificadoPrevios = (actual.data?.certificados ?? []).map(
      (c) => c.documentId,
    );

    await putJson("/api/formacion-y-certificado", {
      formacions: [...new Set([...idsFormacionPrevios, ...nuevasFormacionIds])],
      certificados: [
        ...new Set([...idsCertificadoPrevios, ...nuevosCertificadoIds]),
      ],
    });
    console.log("✔ Conectado.");
  }

  console.log("\nListo.");
};

main().catch((error) => {
  console.error("Fallo el script:", error.message);
  process.exit(1);
});
