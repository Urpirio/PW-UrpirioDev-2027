// Crea un artículo de ejemplo completo en /api/blogs: categoría, fuentes,
// autor (reutiliza uno existente si ya hay) y el contenido en rich text
// (Strapi Blocks) con encabezados, lista y negritas nativas.
//
// Uso:
//   STRAPI_ADMIN_TOKEN=xxxx node scripts/seed-articulo-demo.mjs

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const TOKEN = process.env.STRAPI_ADMIN_TOKEN;

if (!TOKEN) {
  console.error(
    "Falta STRAPI_ADMIN_TOKEN. Ejecuta:\n  STRAPI_ADMIN_TOKEN=tu_token node scripts/seed-articulo-demo.mjs",
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
    "Cuando empecé a construir este portafolio, la parte visual fue la más fácil. Lo que realmente me hizo pensar fue conectar cada sección a un CMS real en vez de dejar todo el contenido escrito directamente en el código. Estas son cinco cosas que aprendí en el camino.",
  ),
  titulo("1. Diseña primero, conecta después"),
  parrafo(
    "Construí cada sección con datos de prueba antes de pensar en el CMS. Eso me dejó validar el diseño rápido, sin esperar a tener el backend listo. Cuando por fin conecté cada endpoint, solo tuve que reemplazar los datos, no rehacer el diseño.",
  ),
  titulo("2. El populate profundo de Strapi tiene sus trucos"),
  parrafo(
    "Strapi v5 solo popula un nivel por defecto. Si una relación tiene, a su vez, otra relación adentro (como un ícono dentro de una tarjeta), hay que pedirlo explícitamente con algo como ",
  ),
  parrafo("populate[relacion][populate]=otraRelacion", { code: true }),
  parrafo(
    ". La primera vez que lo necesité, perdí un buen rato pensando que el dato simplemente no existía.",
  ),
  titulo("3. Nunca confíes en que un campo va a estar lleno"),
  parrafo(
    "Todo el contenido del CMS puede venir vacío, sobre todo mientras se está cargando por primera vez. Por eso cada sección de este sitio tiene un ",
    { bold: true },
  ),
  parrafo(
    "valor de respaldo",
    { bold: true },
  ),
  parrafo(
    ": si el dato real no está, se muestra un texto sensato en su lugar, nunca un hueco vacío o un error.",
  ),
  titulo("4. Los content-types crecen con el proyecto"),
  lista([
    "Empecé con campos simples: título y subtítulo.",
    "Con el tiempo agregué relaciones: categorías, tecnologías, íconos.",
    "Al final, hasta el CTA de cada proyecto se volvió su propio content-type reutilizable.",
  ]),
  parrafo(
    "No pasa nada por no tener el esquema perfecto desde el día uno. Lo importante es que el código sepa adaptarse cuando el esquema cambia.",
  ),
  titulo("5. Un componente reutilizable ahorra horas"),
  parrafo(
    "El carrusel de imágenes, las tarjetas de proyecto, el parser de texto enriquecido... todo eso lo construí una sola vez y lo reutilizo en varias secciones. Cuando se necesita un ajuste, se hace en un solo lugar y se refleja en todas partes.",
  ),
  parrafo(
    "Si estás construyendo algo parecido, mi consejo es simple: conecta lo real lo antes posible, pero deja que tu interfaz siga funcionando aunque el dato no llegue.",
  ),
];

const CATEGORIA = { nombre: "Desarrollo Web", descripcion: "Notas técnicas sobre construir software." };

const FUENTES = [
  {
    titulo: "Astro Docs — Content Collections",
    url: "https://docs.astro.build/en/guides/content-collections/",
    descripcion: "Documentación oficial de Astro.",
  },
  {
    titulo: "Strapi Docs — REST API Populate & Select",
    url: "https://docs.strapi.io/dev-docs/api/rest/populate-select",
    descripcion: "Documentación oficial de Strapi sobre populate.",
  },
];

const main = async () => {
  console.log(`Preparando artículo de ejemplo en ${STRAPI_URL}...`);

  // Categoría (reutiliza si ya existe con ese nombre)
  const categoriasExistentes = await obtenerJson("/api/categoria-blogs");
  let categoria = categoriasExistentes.data.find((c) => c.nombre === CATEGORIA.nombre);
  if (!categoria) {
    categoria = await postJson("/api/categoria-blogs", CATEGORIA);
    console.log(`✔ Categoría creada: ${categoria.nombre}`);
  } else {
    console.log(`⏭ Categoría ya existía: ${categoria.nombre}`);
  }

  // Autor (reutiliza el primero que exista; si no hay ninguno, crea uno)
  const autoresExistentes = await obtenerJson("/api/autores-de-articulos");
  let autor = autoresExistentes.data[0];
  if (!autor) {
    autor = await postJson("/api/autores-de-articulos", {
      nombe: "Urpirio",
      apellido: "Moreno Vargas",
      linkedin: "https://do.linkedin.com/in/urpiriojunior-moreno-vargas-95294b269",
    });
    console.log(`✔ Autor creado: ${autor.nombe} ${autor.apellido}`);
  } else {
    console.log(`⏭ Autor ya existía: ${autor.nombe} ${autor.apellido}`);
  }

  // Fuentes
  const fuenteIds = [];
  for (const fuente of FUENTES) {
    const creada = await postJson("/api/fuentes", fuente);
    fuenteIds.push(creada.documentId);
    console.log(`✔ Fuente creada: ${fuente.titulo}`);
  }

  // Artículo
  const articulo = await postJson("/api/blogs", {
    titulo: "5 lecciones que aprendí conectando mi portafolio a un CMS headless",
    subtitulo:
      "Notas prácticas sobre Astro, Strapi y los errores que cometí en el camino.",
    articulo: ARTICULO,
    categoria_blogs: [categoria.documentId],
    autores_de_articulo: [autor.documentId],
    fuentes: fuenteIds,
  });

  console.log(`\n✔ Artículo creado: "${articulo.titulo}"`);
  console.log(`  /articulos/${articulo.documentId}`);
  console.log("\nListo.");
};

main().catch((error) => {
  console.error("Fallo el script:", error.message);
  process.exit(1);
});
