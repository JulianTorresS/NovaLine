export const SITE = {
  brand: 'NovaLine',
  whatsappNumber: '573228968494',
  whatsappMessage: 'Hola, quiero conversar sobre un proyecto de software para mi empresa.',
  heroInterval: 8000,
  phoneInterval: 3500,
  projectInterval: 5000,
}

export const NAV_ITEMS = [
  { label: 'Proceso', href: '#proceso' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Contacto', href: '#contacto' },
  { label: 'Nosotros', href: '#nosotros' },
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
  { icon: 'code', title: 'Software a la medida', text: 'ERP, CRM, automatizaciones y herramientas internas creadas alrededor de tu operación.', link: 'Quiero digitalizar un proceso' },
  { icon: 'layers', title: 'Experiencias web y móvil', text: 'Portales, plataformas y aplicaciones rápidas que tu equipo y tus clientes entienden al instante.', link: 'Tengo una idea de producto' },
  { icon: 'pulse', title: 'Soporte que sí responde', text: 'Mantenimiento, mejoras y acompañamiento técnico con contexto real de tu negocio.', link: 'Necesito apoyo técnico' },
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
