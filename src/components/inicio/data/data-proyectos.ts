import type { tp_proyectos } from "../types/tp-proyectos";

export const data_proyectos: tp_proyectos = [
  {
    name: "CloudSecure API",
    description:
      "API Gateway robusto especializado en la mitigación de ataques DDoS, cifrado de extremo a extremo y gestión centralizada de políticas de acceso.",
    technology: [{ name: "NestJS" }, { name: "TypeScript" }, { name: "Redis" }],
    url_proyecto: "https://api.cloudsecure-gateway.net",
    url_githud: "https://github.com/udev-labs/cloudsecure-api",
    empresa: "Vanguard CyberSec",
    images: [
      {
        url: "https://images.unsplash.com/photo-1563986768609-322da13575f3",
        alt: "Consola de monitoreo de tráfico y bloqueo de peticiones maliciosas",
      },
    ],
  },
  {
    name: "GeoRoute Logic",
    description:
      "Motor de optimización de rutas logísticas en tiempo real, diseñado para reducir costos de combustible y tiempos de entrega mediante IA geográfica.",
    technology: [
      { name: "Python" },
      { name: "FastAPI" },
      { name: "PostgreSQL" },
    ],
    url_proyecto: "https://georoute-logic.io",
    url_githud: "https://github.com/udev-labs/georoute-core",
    empresa: "LogiTrans Global",
    images: [
      {
        url: "https://images.unsplash.com/photo-1524661135-423995f22d0b",
        alt: "Mapa interactivo mostrando trazados óptimos de flotas vehiculares",
      },
    ],
  },
  {
    name: "EduStream Portal",
    description:
      "Plataforma de educación en línea compatible con SCORM, enfocada en la transmisión fluida de contenido interactivo y evaluaciones modulares.",
    technology: [
      { name: "Nuxt 3" },
      { name: "Tailwind CSS" },
      { name: "MySQL" },
    ],
    url_proyecto: "https://learn.edustream-portal.edu",
    url_githud: "https://github.com/udev-labs/edustream-platform",
    empresa: "Nexus Academic",
    images: [
      {
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
        alt: "Vista del aula virtual con reproductor multimedia y sección de notas",
      },
    ],
  },
  {
    name: "StockFlow ERP",
    description:
      "Sistema de planificación de recursos empresariales simplificado para PyMEs, con módulos de facturación electrónica y alertas automáticas de stock mínimo.",
    technology: [
      { name: "React" },
      { name: "Node.js" },
      { name: "SQL Server" },
    ],
    url_proyecto: "https://app.stockflow-erp.com",
    url_githud: "https://github.com/udev-labs/stockflow-erp",
    empresa: "Integra Business",
    images: [
      {
        url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c",
        alt: "Formulario de creación de facturas e historial de transacciones",
      },
    ],
  },
  {
    name: "MediSync App",
    description:
      "Aplicación móvil multiplataforma para la gestión de citas médicas, recordatorios de tratamiento y almacenamiento seguro de recetas electrónicas.",
    technology: [{ name: "Flutter" }, { name: "Dart" }, { name: "Supabase" }],
    url_proyecto: "https://medisync-app.org",
    url_githud: "https://github.com/udev-labs/medisync-mobile",
    empresa: "Clinica Virtual Health",
    images: [
      {
        url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
        alt: "Pantalla de inicio con el calendario de consultas y alertas de dosis",
      },
    ],
  },
  {
    name: "SmartHome Central",
    description:
      "Dashboard de automatización del hogar que consolida el control de luces, termostatos y cámaras de seguridad bajo protocolos locales de red.",
    technology: [{ name: "Vue 3" }, { name: "Express" }, { name: "SQLite" }],
    url_proyecto: "https://hub.smarthome-central.local",
    url_githud: "https://github.com/udev-labs/smarthome-central",
    empresa: "Domotica Labs",
    images: [
      {
        url: "https://images.unsplash.com/photo-1558002038-1055907df827",
        alt: "Controles deslizantes de intensidad lumínica y switches de dispositivos",
      },
    ],
  },
  
];
