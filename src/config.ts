export const SITE = {
  brand: 'NovaLine',
  whatsappNumber: '573228968494',
  whatsappMessage: 'Hola, quiero conversar sobre un proyecto de software para mi empresa.',
  heroInterval: 8000,
  phoneInterval: 3500,
  projectInterval: 5000,
}

export const NAV_ITEMS = [
  { label: 'Proceso', href: '/#proceso', sectionId: 'proceso' },
  { label: 'Servicios', href: '/servicios/#servicios', sectionId: 'servicios' },
  { label: 'Proyectos', href: '/#proyectos', sectionId: 'proyectos' },
  { label: 'Contacto', href: '/#contacto', sectionId: 'contacto' },
  { label: 'Nosotros', href: '/nosotros/', sectionId: 'nosotros' },
]

export const PHONE_DEMOS = [
  { name: 'Fintrack', kicker: 'Balance mensual', metric: '$ 48.900', label: 'Ingresos', value: '76%', secondary: 'Meta de ahorro' },
  { name: 'AulaViva', kicker: 'Progreso del curso', metric: '240', label: 'Estudiantes', value: '68%', secondary: 'Avance promedio' },
  { name: 'RutaViva', kicker: 'Operación en ruta', metric: '94%', label: 'A tiempo', value: '18', secondary: 'Vehículos activos' },
  { name: 'Nexo ERP', kicker: 'Tu negocio hoy', metric: '128', label: 'Pedidos', value: '31%', secondary: 'Más productividad' },
]

export const PROCESS = [
  { number: '01', title: 'Entendemos el negocio', text: 'Mapeamos tus procesos, el problema real y el resultado que necesitas antes de hablar de tecnología.' },
  { number: '02', title: 'Diseñamos la solución', text: 'Convertimos los hallazgos en flujos y un prototipo navegable que puedes validar desde el inicio.' },
  { number: '03', title: 'Construimos por etapas', text: 'Desarrollamos entregas funcionales, medibles y listas para probar con tu equipo.' },
  { number: '04', title: 'Seguimos a tu lado', text: 'Acompañamos la adopción, medimos el uso y evolucionamos el producto cuando el negocio lo pide.' },
]

export const SERVICES = [
  {
    icon: 'code',
    title: 'Software a la medida',
    summary: 'ERP, CRM, automatizaciones y herramientas internas creadas alrededor de tu operación.',
    text: 'Construimos plataformas internas, CRM y herramientas administrativas adaptadas a los procesos, roles e información de cada empresa.',
    link: 'Quiero digitalizar un proceso',
    caseHref: '/proyectos/formula-animal/',
    caseLabel: 'Ver el CRM de Fórmula Animal',
  },
  {
    icon: 'layers',
    title: 'Experiencias web responsive',
    summary: 'Portales, plataformas y aplicaciones web que tu equipo y tus clientes entienden en cualquier pantalla.',
    text: 'Diseñamos aplicaciones web, portales y catálogos responsive enfocados en objetivos de negocio y en una experiencia clara para cada usuario.',
    link: 'Tengo una idea de producto',
    caseHref: '/proyectos/native-haus/',
    caseLabel: 'Ver la experiencia web de Nativhaus',
  },
  {
    icon: 'pulse',
    title: 'Automatización y soporte',
    summary: 'Mantenimiento, automatizaciones y acompañamiento técnico con contexto real de tu negocio.',
    text: 'Automatizamos tareas y acompañamos el mantenimiento y la evolución de productos digitales con conocimiento de la operación.',
    link: 'Necesito apoyo técnico',
    caseHref: '/proyectos/lia/',
    caseLabel: 'Ver la automatización con Lia',
  },
]

export const TEAM_MEMBERS = [
  {
    name: 'Santiago Fraile Arevalo',
    role: 'Ingeniero de software',
    specialty: 'Back-end y arquitectura',
    bio: 'Desarrollador enfocado en construir sistemas sólidos, APIs claras y procesos que respondan a las necesidades reales de cada negocio.',
    photo: '/assets/team/WhatsApp Image 2026-09-15 at 12.24.01 PM.jpeg',
    photoStem: 'santiago',
  },
  {
    name: 'Julian David Torres Saavedra',
    role: 'Ingeniero de software',
    specialty: 'Front-end · UX/UI',
    bio: 'Desarrollador especializado en crear interfaces claras, funcionales y visualmente cuidadas, conectando las necesidades de las personas con experiencias digitales intuitivas.',
    photo: '/assets/team/ChatGPT Image 15 sept 2026, 04_50_50 p.m.png',
    photoStem: 'julian',
  },
]

export const PROJECTS = [
  { name: 'Lia', category: 'Agente inteligente', title: 'Un asistente empresarial que consulta, analiza y automatiza procesos.', metric: '4', metricLabel: 'capacidades conectadas', tags: ['IA', 'Automatización', 'Analítica'], theme: 'lia', featured: true, caseStudy: 'lia' },
  { name: 'NexusPOS', category: 'ERP comercial', title: 'Ventas, inventario, clientes y caja conectados en una sola operación.', metric: '10', metricLabel: 'módulos de negocio', tags: ['ERP', 'Punto de venta', 'Inventario'], theme: 'pos', featured: true, caseStudy: 'nexus-pos' },
  { name: 'Fórmula Animal', category: 'CRM veterinario', title: 'Una operación completa, del pedido a la liquidación.', metric: '15', metricLabel: 'módulos conectados', tags: ['CRM', 'Logística', 'Calidad'], theme: 'blue', featured: true, caseStudy: 'formula-animal' },
  { name: 'Nativhaus', category: 'Landing e-commerce', title: 'Madera, catálogo y asesoría reunidos en una experiencia que convierte.', metric: '24', metricLabel: 'productos conectados', tags: ['Landing', 'Catálogo', 'WhatsApp'], theme: 'wood', featured: true, caseStudy: 'native-haus' },
]

export function whatsappUrl(message = SITE.whatsappMessage) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`
}
