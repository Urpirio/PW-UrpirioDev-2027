// Sube las experiencias que estaban hardcodeadas en section-experiencia.astro
// al CMS, respetando la cadena de relaciones real:
//
//   sobre-mi-experiencia (singleton)
//     └─ card_experiencias[]        (puesto, empresa, fecha_inicio, fecha_final)
//          └─ lista_de_trayectorias[]  (logro)
//               └─ iconos[]            (relación al content-type "icono")
//
// Uso:
//   STRAPI_ADMIN_TOKEN=xxxx node scripts/seed-experiencias.mjs
//
// Es idempotente: si una experiencia con el mismo "titulo" ya existe, la salta.

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const TOKEN = process.env.STRAPI_ADMIN_TOKEN;

if (!TOKEN) {
  console.error(
    "Falta STRAPI_ADMIN_TOKEN. Ejecuta:\n  STRAPI_ADMIN_TOKEN=tu_token node scripts/seed-experiencias.mjs",
  );
  process.exit(1);
}

const ICONO_CHECK = "lucide:check";

const EXPERIENCIAS = [
  {
    titulo: "Desarrollador de software — Departamento de Innovación",
    empresa: "OGTIC · Oficina Gubernamental de Tecnologías (Santo Domingo)",
    fecha_inicio: "2025-05-01",
    fecha_final: "2026-05-01",
    logros: [
      "Lideré la implementación técnica del primer asistente de inteligencia artificial del Estado dominicano, desde el diseño hasta producción.",
      "Desarrollé aplicaciones web y móviles con arquitecturas modernas y las mejores prácticas de ingeniería de software.",
      "Colaboré con equipos multidisciplinarios en proyectos de innovación y transformación digital de impacto nacional.",
      "Representé a la entidad como portavoz técnico en medios (Noticias SIN y Radio CDN), presentando iniciativas de IA.",
    ],
  },
  {
    titulo: "Desarrollador full stack",
    empresa: "UrpirioDev (Santo Domingo)",
    fecha_inicio: "2024-10-01",
    fecha_final: null, // puesto actual
    logros: [
      "Diseño y desarrollo de sitios y aplicaciones a medida de principio a fin.",
      "Trabajo con clientes cuidando la experiencia de usuario, el rendimiento y la mantenibilidad del código.",
    ],
  },
  {
    titulo: "Desarrollador Junior",
    empresa: "Siddhatech (Santo Domingo)",
    fecha_inicio: "2025-03-01",
    fecha_final: "2025-05-01",
    logros: [
      "Diseño y desarrollo de interfaces para aplicaciones móviles con Kotlin Multiplatform.",
      "Participación activa en equipos bajo metodologías ágiles.",
      "Apoyo en la definición de la arquitectura de la información y los flujos de usuario.",
    ],
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

const buscarIconoCheck = async () => {
  const json = await obtenerJson("/api/iconos?pagination[pageSize]=100");
  const match = (json.data ?? []).find((i) => i.icono === ICONO_CHECK);
  if (!match) {
    throw new Error(
      `No se encontró el ícono "${ICONO_CHECK}". Corre primero scripts/seed-iconos.mjs.`,
    );
  }
  return match.documentId;
};

const obtenerExperienciasExistentes = async () => {
  const json = await obtenerJson("/api/card-experiencias?pagination[pageSize]=100");
  return new Set((json.data ?? []).map((e) => e.titulo));
};

const main = async () => {
  console.log(`Consultando datos existentes en ${STRAPI_URL}...`);
  const iconoCheckId = await buscarIconoCheck();
  const existentes = await obtenerExperienciasExistentes();

  const nuevasCardIds = [];

  for (const exp of EXPERIENCIAS) {
    if (existentes.has(exp.titulo)) {
      console.log(`⏭  ${exp.titulo} (ya existe)`);
      continue;
    }

    console.log(`⬆  ${exp.titulo}`);

    const trayectoriaIds = [];
    for (const logro of exp.logros) {
      const trayectoria = await postJson("/api/lista-de-trayectorias", {
        titulo: logro,
        iconos: [iconoCheckId],
      });
      trayectoriaIds.push(trayectoria.documentId);
    }

    const card = await postJson("/api/card-experiencias", {
      titulo: exp.titulo,
      empresa: exp.empresa,
      fecha_inicio: exp.fecha_inicio,
      fecha_final: exp.fecha_final,
      lista_de_trayectorias: trayectoriaIds,
    });

    nuevasCardIds.push(card.documentId);
    console.log(`   ✔ ${exp.logros.length} logros creados`);
  }

  if (nuevasCardIds.length > 0) {
    console.log("\nConectando con el singleton sobre-mi-experiencia...");
    const actual = await obtenerJson(
      "/api/sobre-mi-experiencia?populate=card_experiencias",
    );
    const idsPrevios = (actual.data?.card_experiencias ?? []).map(
      (c) => c.documentId,
    );
    const idsFinal = [...new Set([...idsPrevios, ...nuevasCardIds])];

    await putJson("/api/sobre-mi-experiencia", {
      card_experiencias: idsFinal,
    });
    console.log(`✔ Conectadas (${idsFinal.length} en total).`);
  }

  console.log("\nListo.");
};

main().catch((error) => {
  console.error("Fallo el script:", error.message);
  process.exit(1);
});
