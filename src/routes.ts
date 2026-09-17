export const SITE_ORIGIN = 'https://novalinesoftware.com'

export type RouteKey = 'home' | 'services' | 'about' | 'formula-animal' | 'native-haus' | 'nexus-pos' | 'lia'

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
    title: 'Desarrollo de software a la medida en Colombia | NovaLine',
    description: 'Desarrollamos software a la medida, aplicaciones web y sistemas empresariales que automatizan procesos para empresas en Colombia.',
    ogImage: '/assets/social/novaline-home-1200x630.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 630,
  },
  services: {
    key: 'services',
    path: '/servicios/',
    title: 'Servicios de desarrollo de software a medida | NovaLine',
    description: 'Creamos software empresarial, aplicaciones web y automatizaciones adaptadas a cada operación, con mantenimiento y soporte cercano en Colombia.',
    ogImage: '/assets/social/novaline-servicios-1200x630.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 630,
  },
  about: {
    key: 'about',
    path: '/nosotros/',
    title: 'Equipo y forma de trabajo | NovaLine',
    description: 'Conoce al equipo de NovaLine y cómo entendemos, diseñamos y construimos soluciones de software adaptadas a los procesos de cada empresa.',
    ogImage: '/assets/social/novaline-equipo-1200x630.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 630,
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
    title: 'Lia: agente inteligente empresarial | Caso NovaLine',
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
