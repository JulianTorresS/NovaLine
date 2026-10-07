export const SITE_ORIGIN = 'https://novalinesoftware.com'

export type RouteKey =
  | 'home'
  | 'services'
  | 'software-a-la-medida'
  | 'desarrollo-crm'
  | 'automatizacion-de-procesos'
  | 'desarrollo-web'
  | 'seo-local'
  | 'reemplazar-excel'
  | 'digitalizar-pedidos'
  | 'automatizar-procesos'
  | 'mejorar-presencia-digital'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'formula-animal'
  | 'native-haus'
  | 'nexus-pos'
  | 'lia'

export type RouteDefinition = {
  key: RouteKey
  path: string
  title: string
  description: string
  ogImage?: string
  ogImageWidth?: number
  ogImageHeight?: number
}

export const ROUTES: Record<RouteKey, RouteDefinition> = {
  home: {
    key: 'home',
    path: '/',
    title: 'Software para hacer crecer tu empresa | NovaLine',
    description: 'Creamos software, CRM, automatizaciones y soluciones web para reducir tareas manuales, ordenar procesos y ayudar a tu empresa a crecer.',
    ogImage: '/assets/social/novaline-home-1200x630-v3.png',
    ogImageWidth: 1200,
    ogImageHeight: 630,
  },
  services: {
    key: 'services',
    path: '/servicios/',
    title: 'Servicios de software a medida y automatización | NovaLine',
    description: 'Creamos software empresarial, aplicaciones web y automatizaciones adaptadas a cada operación, con mantenimiento y soporte cercano en Colombia.',
    ogImage: '/assets/social/novaline-servicios-1200x630-v2.png',
    ogImageWidth: 1200,
    ogImageHeight: 630,
  },
  'software-a-la-medida': {
    key: 'software-a-la-medida',
    path: '/servicios/software-a-la-medida/',
    title: 'Software a la medida para empresas en Colombia | NovaLine',
    description: 'Desarrollamos software a la medida para reemplazar Excel, centralizar información y digitalizar procesos propios. Solicita un diagnóstico.',
    ogImage: '/assets/social/novaline-servicios-1200x630-v2.png',
    ogImageWidth: 1200,
    ogImageHeight: 630,
  },
  'desarrollo-crm': {
    key: 'desarrollo-crm',
    path: '/servicios/desarrollo-crm/',
    title: 'Desarrollo de CRM personalizado en Colombia | NovaLine',
    description: 'Creamos CRM personalizados para organizar clientes, pedidos, seguimiento comercial y operación. Analicemos el proceso de tu empresa.',
    ogImage: '/assets/crm-formula-animal/cover.png',
    ogImageWidth: 744,
    ogImageHeight: 378,
  },
  'automatizacion-de-procesos': {
    key: 'automatizacion-de-procesos',
    path: '/servicios/automatizacion-de-procesos/',
    title: 'Automatización de procesos empresariales | NovaLine',
    description: 'Conectamos herramientas y automatizamos tareas repetitivas para ahorrar tiempo, reducir errores y dar continuidad a la operación.',
    ogImage: '/assets/lia/cover.png',
    ogImageWidth: 744,
    ogImageHeight: 378,
  },
  'desarrollo-web': {
    key: 'desarrollo-web',
    path: '/servicios/desarrollo-web/',
    title: 'Desarrollo web para empresas en Colombia | NovaLine',
    description: 'Diseñamos sitios y aplicaciones web rápidos, claros y orientados a generar oportunidades comerciales. Solicita un diagnóstico inicial.',
    ogImage: '/assets/native-haus/cover.png',
    ogImageWidth: 744,
    ogImageHeight: 378,
  },
  'seo-local': {
    key: 'seo-local',
    path: '/servicios/seo-local/',
    title: 'SEO local para empresas en Colombia | NovaLine',
    description: 'Mejoramos la presencia de tu negocio en Google, Maps y búsquedas locales con una base técnica y contenidos útiles. Revisa tu visibilidad.',
    ogImage: '/assets/social/novaline-servicios-1200x630-v2.png',
    ogImageWidth: 1200,
    ogImageHeight: 630,
  },
  'reemplazar-excel': {
    key: 'reemplazar-excel',
    path: '/soluciones/reemplazar-excel/',
    title: 'Reemplazar Excel con software empresarial | NovaLine',
    description: 'Centraliza datos, permisos y trazabilidad cuando Excel ya no alcanza para operar. Analizamos si tu proceso necesita un sistema propio.',
    ogImage: '/assets/crm-formula-animal/cover.png',
    ogImageWidth: 744,
    ogImageHeight: 378,
  },
  'digitalizar-pedidos': {
    key: 'digitalizar-pedidos',
    path: '/soluciones/digitalizar-pedidos/',
    title: 'Digitalizar pedidos y centralizar su gestión | NovaLine',
    description: 'Organiza pedidos que hoy llegan por WhatsApp, llamadas o archivos dispersos. Diseñamos un flujo digital conectado con tu operación.',
    ogImage: '/assets/nexus-pos/cover.png',
    ogImageWidth: 744,
    ogImageHeight: 378,
  },
  'automatizar-procesos': {
    key: 'automatizar-procesos',
    path: '/soluciones/automatizar-procesos/',
    title: 'Automatizar procesos manuales en tu empresa | NovaLine',
    description: 'Detecta tareas repetitivas, traspasos y alertas que pueden automatizarse sin perder control. Solicita un diagnóstico de tu proceso.',
    ogImage: '/assets/lia/cover.png',
    ogImageWidth: 744,
    ogImageHeight: 378,
  },
  'mejorar-presencia-digital': {
    key: 'mejorar-presencia-digital',
    path: '/soluciones/mejorar-presencia-digital/',
    title: 'Mejorar la presencia digital de tu empresa | NovaLine',
    description: 'Alinea tu sitio web, Google Business y SEO local para que más clientes encuentren y entiendan tu negocio. Revisa tu presencia digital.',
    ogImage: '/assets/social/novaline-home-1200x630-v3.png',
    ogImageWidth: 1200,
    ogImageHeight: 630,
  },
  about: {
    key: 'about',
    path: '/nosotros/',
    title: 'Equipo de desarrollo de software en Colombia | NovaLine',
    description: 'Conoce al equipo de NovaLine y cómo entendemos, diseñamos y construimos soluciones de software adaptadas a los procesos de cada empresa.',
    ogImage: '/assets/social/novaline-equipo-1200x630.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 630,
  },
  contact: {
    key: 'contact',
    path: '/contacto/',
    title: 'Contacto para proyectos de software | NovaLine',
    description: 'Contacta a NovaLine por teléfono o WhatsApp para conversar sobre una necesidad de software, automatización o producto digital para tu empresa.',
  },
  privacy: {
    key: 'privacy',
    path: '/privacidad/',
    title: 'Política de privacidad | NovaLine',
    description: 'Conoce cómo NovaLine utiliza Google Analytics, Microsoft Clarity, datos técnicos, cookies y enlaces de WhatsApp en este sitio web.',
  },
  'formula-animal': {
    key: 'formula-animal',
    path: '/proyectos/formula-animal/',
    title: 'CRM personalizado Fórmula Animal | Caso NovaLine',
    description: 'Conoce el CRM personalizado que conecta pedidos, facturación, logística y calidad para mantener trazable la operación de Fórmula Animal.',
    ogImage: '/assets/crm-formula-animal/cover.png',
    ogImageWidth: 744,
    ogImageHeight: 378,
  },
  'native-haus': {
    key: 'native-haus',
    path: '/proyectos/native-haus/',
    title: 'Nativhaus: experiencia web comercial | Caso NovaLine',
    description: 'Conoce la experiencia web de Nativhaus: una vitrina comercial con catálogo, cotización a medida y contacto contextual mediante WhatsApp.',
    ogImage: '/assets/native-haus/cover.png',
    ogImageWidth: 744,
    ogImageHeight: 378,
  },
  'nexus-pos': {
    key: 'nexus-pos',
    path: '/proyectos/nexus-pos/',
    title: 'NexusPOS: sistema POS e inventario | Caso NovaLine',
    description: 'Explora el sistema POS que conecta ventas, inventario, clientes, caja, domicilios y reportes dentro de una operación comercial trazable.',
    ogImage: '/assets/nexus-pos/cover.png',
    ogImageWidth: 744,
    ogImageHeight: 378,
  },
  lia: {
    key: 'lia',
    path: '/proyectos/lia/',
    title: 'Agente de IA empresarial Lia | Caso NovaLine',
    description: 'Conoce a Lia, un agente inteligente empresarial que analiza información, conecta documentos y facilita automatizaciones para los equipos.',
    ogImage: '/assets/lia/cover.png',
    ogImageWidth: 744,
    ogImageHeight: 378,
  },
}

export const PUBLIC_ROUTES = Object.values(ROUTES)

export const CASE_ROUTES = {
  'formula-animal': ROUTES['formula-animal'].path,
  'native-haus': ROUTES['native-haus'].path,
  'nexus-pos': ROUTES['nexus-pos'].path,
  lia: ROUTES.lia.path,
} as const

export const LEGACY_HASH_ROUTES: Record<string, string> = {
  '#nosotros': ROUTES.about.path,
  '#proyecto-formula-animal': ROUTES['formula-animal'].path,
  '#proyecto-native-haus': ROUTES['native-haus'].path,
  '#proyecto-nexus-pos': ROUTES['nexus-pos'].path,
  '#proyecto-lia': ROUTES.lia.path,
}

export function normalizePathname(pathname: string) {
  if (!pathname || pathname === '/') return '/'
  const clean = pathname.split('?')[0].split('#')[0]
  return clean.endsWith('/') ? clean : `${clean}/`
}

export function resolveRoute(pathname: string): RouteDefinition {
  const normalized = normalizePathname(pathname)
  return PUBLIC_ROUTES.find((route) => route.path === normalized) ?? ROUTES.home
}

export function absoluteUrl(path: string) {
  return new URL(path, `${SITE_ORIGIN}/`).toString()
}
