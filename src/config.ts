export const SITE = {
  brand: 'NovaLine',
  whatsappNumber: '573228968494',
  whatsappMessage: 'Hola, quiero conversar sobre un proyecto de software para mi empresa.',
  heroInterval: 8000,
  phoneInterval: 3500,
  projectInterval: 5000,
}

export const NAV_ITEMS = [
  { label: 'Inicio', href: '/', sectionId: 'inicio' },
  { label: 'Proceso', href: '/#proceso', sectionId: 'proceso' },
  { label: 'Proyectos', href: '/#proyectos', sectionId: 'proyectos' },
  { label: 'Contacto', href: '/#contacto', sectionId: 'contacto' },
  { label: 'Servicios', href: '/servicios/', sectionId: 'servicios' },
  { label: 'Nosotros', href: '/nosotros/', sectionId: 'nosotros' },
]

export const PHONE_DEMOS = [
  { name: 'Fintrack', kicker: 'Balance mensual', metric: '$ 48.900', label: 'Ingresos', value: '76%', secondary: 'Meta de ahorro' },
  { name: 'AulaViva', kicker: 'Progreso del curso', metric: '240', label: 'Estudiantes', value: '68%', secondary: 'Avance promedio' },
  { name: 'RutaViva', kicker: 'Operación en ruta', metric: '94%', label: 'A tiempo', value: '18', secondary: 'Vehículos activos' },
  { name: 'Nexo ERP', kicker: 'Tu negocio hoy', metric: '128', label: 'Pedidos', value: '31%', secondary: 'Más productividad' },
]

export const PROCESS = [
  { number: '01', title: 'Analizamos tu negocio', text: 'Entendemos el proceso actual, las personas involucradas y el resultado que necesitas mejorar.' },
  { number: '02', title: 'Detectamos oportunidades', text: 'Identificamos tareas manuales, información dispersa y puntos donde la tecnología puede aportar valor.' },
  { number: '03', title: 'Diseñamos la solución', text: 'Convertimos los hallazgos en flujos y un prototipo navegable que puedes validar desde el inicio.' },
  { number: '04', title: 'Desarrollamos', text: 'Construimos por etapas funcionales para revisar avances con tu equipo y reducir incertidumbre.' },
  { number: '05', title: 'Implementamos', text: 'Preparamos datos, accesos y acompañamiento para integrar la solución a la operación real.' },
  { number: '06', title: 'Acompañamos', text: 'Atendemos ajustes y evolucionamos el producto cuando cambian las prioridades del negocio.' },
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
  { name: 'Lia', category: 'Agente inteligente', title: 'Un asistente empresarial que consulta, analiza y automatiza procesos.', problem: 'Consultar información y ejecutar tareas exigía cambiar entre documentos y herramientas.', solution: 'Diseñamos un agente empresarial que reúne consulta, análisis y acciones asistidas.', result: 'Cuatro capacidades conectadas en una misma experiencia de trabajo.', metric: '4', metricLabel: 'capacidades conectadas', tags: ['IA', 'Automatización', 'Analítica'], theme: 'lia', featured: true, caseStudy: 'lia' },
  { name: 'NexusPOS', category: 'ERP comercial', title: 'Ventas, inventario, clientes y caja conectados en una sola operación.', problem: 'La operación comercial necesitaba relacionar cada venta con inventario, clientes y caja.', solution: 'Construimos un sistema POS con módulos para venta, domicilios, inventario y reportes.', result: 'Diez módulos de negocio trabajan sobre una operación comercial conectada.', metric: '10', metricLabel: 'módulos de negocio', tags: ['ERP', 'Punto de venta', 'Inventario'], theme: 'pos', featured: true, caseStudy: 'nexus-pos' },
  { name: 'Fórmula Animal', category: 'CRM veterinario', title: 'Una operación completa, del pedido a la liquidación.', problem: 'La operación estaba distribuida entre diferentes procesos y herramientas.', solution: 'Desarrollamos un CRM personalizado para pedidos, logística, calidad, clientes y facturación.', result: 'Más de 15 módulos conectados centralizan el recorrido de cada pedido.', metric: '15+', metricLabel: 'módulos conectados', tags: ['CRM', 'Logística', 'Calidad'], theme: 'blue', featured: true, caseStudy: 'formula-animal' },
  { name: 'Nativhaus', category: 'Landing e-commerce', title: 'Madera, catálogo y asesoría reunidos en una experiencia que convierte.', problem: 'El portafolio necesitaba una presentación digital clara que facilitara explorar y cotizar.', solution: 'Creamos una experiencia web con catálogo, universos de producto y contacto contextual.', result: 'Veinticuatro productos conectados con rutas de cotización por WhatsApp.', metric: '24', metricLabel: 'productos conectados', tags: ['Landing', 'Catálogo', 'WhatsApp'], theme: 'wood', featured: true, caseStudy: 'native-haus' },
]

export function whatsappUrl(message = SITE.whatsappMessage) {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`
}
