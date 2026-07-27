// Puebla el content-type "icono" (colección /api/iconos) con todos los
// íconos que el sitio realmente usa (astro-icon: lucide + simple-icons),
// cada uno con una descripción de para qué se usa en la UI.
//
// Uso:
//   STRAPI_ADMIN_TOKEN=xxxx node scripts/seed-iconos.mjs
//
// Variables de entorno opcionales:
//   STRAPI_URL   (por defecto: http://localhost:1337)
//
// El script es idempotente: si un ícono ya existe (mismo valor en el campo
// "icono"), lo salta en vez de crear un duplicado.

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const TOKEN = process.env.STRAPI_ADMIN_TOKEN;

if (!TOKEN) {
  console.error(
    "Falta STRAPI_ADMIN_TOKEN. Ejecuta:\n  STRAPI_ADMIN_TOKEN=tu_token node scripts/seed-iconos.mjs",
  );
  process.exit(1);
}

// Lista extraída del código real del sitio (grep de `Icon name="..."` y de
// los arreglos de datos que referencian íconos dinámicamente).
const ICONOS = [
  { icono: "lucide:arrow-left", descripcion: "Flecha hacia la izquierda, usada para volver a una página anterior." },
  { icono: "lucide:arrow-right", descripcion: "Flecha hacia la derecha, indica navegación o continuidad hacia adelante." },
  { icono: "lucide:arrow-up", descripcion: "Flecha hacia arriba, usada para volver al inicio de la página." },
  { icono: "lucide:arrow-up-right", descripcion: "Flecha en diagonal hacia arriba, indica que un enlace abre un sitio externo." },
  { icono: "lucide:award", descripcion: "Medalla, representa certificados y reconocimientos." },
  { icono: "lucide:book-marked", descripcion: "Libro con marcador, representa formación académica y aprendizaje." },
  { icono: "lucide:book-open", descripcion: "Libro abierto, representa el gusto por la lectura." },
  { icono: "lucide:briefcase", descripcion: "Maletín de trabajo, representa experiencia profesional." },
  { icono: "lucide:calendar", descripcion: "Calendario, indica una fecha de publicación o de un evento." },
  { icono: "lucide:camera", descripcion: "Cámara fotográfica, representa el gusto por la fotografía." },
  { icono: "lucide:check", descripcion: "Marca de verificación, confirma un punto, logro o característica." },
  { icono: "lucide:clock", descripcion: "Reloj, indica tiempo estimado de lectura." },
  { icono: "lucide:code", descripcion: "Símbolo de código, representa desarrollo de software y código limpio." },
  { icono: "lucide:folder-git-2", descripcion: "Carpeta con rama de Git, representa un repositorio o conjunto de proyectos." },
  { icono: "lucide:folder-open", descripcion: "Carpeta abierta, usada en estados vacíos (sin contenido todavía)." },
  { icono: "lucide:globe", descripcion: "Globo terráqueo, representa un sitio web o presencia en línea." },
  { icono: "lucide:graduation-cap", descripcion: "Birrete de graduación, representa formación académica." },
  { icono: "lucide:heart", descripcion: "Corazón, representa gustos o intereses personales." },
  { icono: "lucide:languages", descripcion: "Símbolo de idiomas, representa el dominio de distintas lenguas." },
  { icono: "lucide:layers", descripcion: "Capas superpuestas, representa contenido agrupado o relacionado." },
  { icono: "lucide:layout-grid", descripcion: "Cuadrícula, representa una vista en formato de galería o listado." },
  { icono: "lucide:layout-panel-left", descripcion: "Panel lateral, representa tecnologías de frontend." },
  { icono: "lucide:mail", descripcion: "Sobre de correo, representa contacto por email." },
  { icono: "lucide:map-pin", descripcion: "Pin de ubicación, representa un lugar geográfico." },
  { icono: "lucide:menu", descripcion: "Icono de menú hamburguesa, abre la navegación en móvil." },
  { icono: "lucide:music", descripcion: "Nota musical, representa el gusto por la música." },
  { icono: "lucide:newspaper", descripcion: "Periódico, representa el blog o las publicaciones del sitio." },
  { icono: "lucide:palette", descripcion: "Paleta de pintor, representa diseño y cuidado visual." },
  { icono: "lucide:pen-line", descripcion: "Lápiz escribiendo, representa la creación de contenido o artículos." },
  { icono: "lucide:phone", descripcion: "Teléfono, representa un número de contacto." },
  { icono: "lucide:rocket", descripcion: "Cohete, representa crecimiento o un proyecto más ambicioso." },
  { icono: "lucide:search", descripcion: "Lupa, representa la función de búsqueda." },
  { icono: "lucide:search-x", descripcion: "Lupa con una equis, indica que una búsqueda no arrojó resultados." },
  { icono: "lucide:server", descripcion: "Servidor, representa tecnologías de backend." },
  { icono: "lucide:smartphone", descripcion: "Teléfono móvil, representa desarrollo de aplicaciones móviles." },
  { icono: "lucide:sparkles", descripcion: "Destellos, representa algo destacado o fuera de lo común." },
  { icono: "lucide:tag", descripcion: "Etiqueta, representa una categoría." },
  { icono: "lucide:user", descripcion: "Silueta de persona, representa un perfil o sección personal." },
  { icono: "lucide:wrench", descripcion: "Llave inglesa, representa herramientas de desarrollo." },
  { icono: "lucide:x", descripcion: "Equis, cierra un menú, modal o ventana." },
  { icono: "lucide:zap", descripcion: "Rayo, representa rendimiento y velocidad." },
  { icono: "simple-icons:astro", descripcion: "Logo de Astro, framework web usado para construir el sitio." },
  { icono: "simple-icons:github", descripcion: "Logo de GitHub, enlaza al perfil o a un repositorio de código." },
  { icono: "simple-icons:instagram", descripcion: "Logo de Instagram, enlaza a la red social." },
  { icono: "simple-icons:linkedin", descripcion: "Logo de LinkedIn, enlaza al perfil profesional." },
  { icono: "simple-icons:nodedotjs", descripcion: "Logo de Node.js, tecnología de backend usada." },
  { icono: "simple-icons:react", descripcion: "Logo de React, librería de frontend usada." },
  { icono: "simple-icons:tailwindcss", descripcion: "Logo de Tailwind CSS, framework de estilos usado." },
  { icono: "simple-icons:typescript", descripcion: "Logo de TypeScript, lenguaje usado en el proyecto." },
  { icono: "simple-icons:x", descripcion: "Logo de X (antes Twitter), enlaza o comparte contenido en la red social." },
];

const headers = {
  Authorization: `bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

const obtenerExistentes = async () => {
  const existentes = new Set();
  let page = 1;

  while (true) {
    const respuesta = await fetch(
      `${STRAPI_URL}/api/iconos?pagination[page]=${page}&pagination[pageSize]=100`,
      { headers },
    );
    const json = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(
        `No se pudo leer /api/iconos: ${respuesta.status} ${JSON.stringify(json)}`,
      );
    }

    for (const item of json.data ?? []) {
      if (item.icono) existentes.add(item.icono);
    }

    const { page: actual, pageCount } = json.meta?.pagination ?? {};
    if (!actual || actual >= pageCount) break;
    page += 1;
  }

  return existentes;
};

const crearIcono = async ({ icono, descripcion }) => {
  const respuesta = await fetch(`${STRAPI_URL}/api/iconos`, {
    method: "POST",
    headers,
    body: JSON.stringify({ data: { icono, descripcion } }),
  });
  const json = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      `Error creando "${icono}": ${respuesta.status} ${JSON.stringify(json)}`,
    );
  }

  return json;
};

const main = async () => {
  console.log(`Consultando íconos existentes en ${STRAPI_URL}...`);
  const existentes = await obtenerExistentes();
  console.log(`Ya existen ${existentes.size} íconos.`);

  let creados = 0;
  let omitidos = 0;

  for (const item of ICONOS) {
    if (existentes.has(item.icono)) {
      console.log(`⏭  ${item.icono} (ya existe)`);
      omitidos++;
      continue;
    }

    try {
      await crearIcono(item);
      console.log(`✔  ${item.icono}`);
      creados++;
    } catch (error) {
      console.error(`✘  ${item.icono}:`, error.message);
    }
  }

  console.log(`\nListo. Creados: ${creados} · Omitidos (ya existían): ${omitidos}`);
};

main().catch((error) => {
  console.error("Fallo el script:", error.message);
  process.exit(1);
});
