// Segundo artículo de ejemplo, misma categoría que el primero
// ("Desarrollo Web"), para demostrar la sección de "relacionados".
//
// Uso:
//   STRAPI_ADMIN_TOKEN=xxxx node scripts/seed-articulo-demo-2.mjs

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const TOKEN = process.env.STRAPI_ADMIN_TOKEN;

if (!TOKEN) {
  console.error(
    "Falta STRAPI_ADMIN_TOKEN. Ejecuta:\n  STRAPI_ADMIN_TOKEN=tu_token node scripts/seed-articulo-demo-2.mjs",
  );
  process.exit(1);
}

const headers = {
  Authorization: `bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

const obtenerJson = async (pathname) => {
  const respuesta = await fetch(`${STRAPI_URL}${pathname}`, { headers });
  const json = await respuesta.json();
  if (!respuesta.ok) throw new Error(`GET ${pathname} falló: ${JSON.stringify(json)}`);
  return json;
};

const postJson = async (pathname, data) => {
  const respuesta = await fetch(`${STRAPI_URL}${pathname}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
  });
  const json = await respuesta.json();
  if (!respuesta.ok) throw new Error(`POST ${pathname} falló: ${JSON.stringify(json)}`);
  return json.data;
};

const parrafo = (texto, marca = {}) => ({
  type: "paragraph",
  children: [{ type: "text", text: texto, ...marca }],
});

const titulo = (texto, level = 3) => ({
  type: "heading",
  level,
  children: [{ type: "text", text: texto }],
});

const lista = (items) => ({
  type: "list",
  format: "unordered",
  children: items.map((item) => ({
    type: "list-item",
    children: [{ type: "text", text: item }],
  })),
});

const ARTICULO = [
  parrafo(
    "Antes de escribir la primera línea de código de este portafolio, tuve que decidir dónde iba a vivir el contenido: texto plano en el repositorio, un archivo JSON, o un CMS real. Elegí Strapi, y esto es lo que me convenció.",
  ),
  titulo("Por qué no me quedé con contenido estático"),
  parrafo(
    "Un portafolio cambia todo el tiempo: proyectos nuevos, experiencia actualizada, artículos como este. Editar código para cada cambio de texto se vuelve tedioso rápido, y no quería depender de hacer un ",
  ),
  parrafo("deploy", { code: true }),
  parrafo(" completo solo para corregir una palabra."),
  titulo("Lo que me gustó de Strapi"),
  lista([
    "Es open-source y se puede autohospedar sin costo recurrente.",
    "El editor de contenido enriquecido (Blocks) exporta JSON estructurado, fácil de parsear en el frontend.",
    "Las relaciones entre content-types se sienten como una base de datos real, no como un formulario plano.",
  ]),
  titulo("Lo que no esperaba"),
  parrafo(
    "El populate de relaciones anidadas tiene curva de aprendizaje, y algunos campos con relaciones circulares pueden fallar si pides ",
  ),
  parrafo("populate=*", { code: true }),
  parrafo(
    " de forma muy profunda. Aprendí a ser más específico con qué pedir en cada endpoint en vez de pedir todo siempre.",
  ),
  parrafo(
    "En general, la inversión de tiempo en conectar el CMS valió la pena: ahora puedo actualizar casi todo el sitio sin tocar código.",
  ),
];

const main = async () => {
  console.log(`Preparando segundo artículo de ejemplo en ${STRAPI_URL}...`);

  const categoriasExistentes = await obtenerJson("/api/categoria-blogs");
  const categoria = categoriasExistentes.data.find((c) => c.nombre === "Desarrollo Web");
  if (!categoria) {
    throw new Error('No se encontró la categoría "Desarrollo Web". Corre primero scripts/seed-articulo-demo.mjs.');
  }

  const autoresExistentes = await obtenerJson("/api/autores-de-articulos");
  const autor = autoresExistentes.data.find((a) => a.nombe === "Urpirio");
  if (!autor) {
    throw new Error("No se encontró el autor. Corre primero scripts/seed-articulo-demo.mjs.");
  }

  const articulo = await postJson("/api/blogs", {
    titulo: "Por qué elegí Strapi como CMS headless para mi portafolio",
    subtitulo: "Lo que me convenció, y lo que no esperaba al conectar el contenido.",
    articulo: ARTICULO,
    categoria_blogs: [categoria.documentId],
    autores_de_articulo: [autor.documentId],
  });

  console.log(`\n✔ Artículo creado: "${articulo.titulo}"`);
  console.log(`  /articulos/${articulo.documentId}`);
  console.log("\nListo.");
};

main().catch((error) => {
  console.error("Fallo el script:", error.message);
  process.exit(1);
});
