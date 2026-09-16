export const SITE_ORIGIN = 'https://novalinesoftware.com'

export type RouteKey = 'home' | 'services' | 'about' | 'formula-animal' | 'native-haus' | 'nexus-pos' | 'lia'

export type RouteDefinition = {
  key: RouteKey
  path: string
  title: string
  description: string
  ogImage?: string
}

export const ROUTES: Record<RouteKey, RouteDefinition> = {
  home: {
    key: 'home',
    path: '/',
    title: 'Software a la medida en Colombia | NovaLine',
    description: 'Diseñamos software a la medida, experiencias web y soluciones digitales para que las empresas en Colombia operen con más claridad y control.',
  },
  services: {
    key: 'services',
    path: '/servicios/',
    title: 'Servicios de software a la medida | NovaLine',
    description: 'Creamos software a la medida, experiencias web y móviles, automatizaciones y soporte técnico adaptados a la operación de cada empresa.',
  },
  about: {
    key: 'about',
    path: '/nosotros/',
    title: 'Nosotros | Equipo de desarrollo de NovaLine',
    description: 'Conoce al equipo de NovaLine y nuestra forma de entender, diseñar y construir soluciones digitales claras para empresas en Colombia.',
  },
  'formula-animal': {
    key: 'formula-animal',
    path: '/proyectos/formula-animal/',
    title: 'Fórmula Animal CRM | Caso de estudio NovaLine',
    description: 'Un CRM veterinario que conecta pedidos, facturación, logística y calidad para conservar la trazabilidad de toda la operación.',
    ogImage: '/assets/crm-formula-animal/cover.png',
  },
  'native-haus': {
    key: 'native-haus',
    path: '/proyectos/native-haus/',
    title: 'Nativhaus | Caso de estudio NovaLine',
    description: 'Una landing comercial que organiza catálogo, cotización y asesoría para convertir productos de madera en soluciones fáciles de descubrir.',
    ogImage: '/assets/native-haus/cover.png',
  },
  'nexus-pos': {
    key: 'nexus-pos',
    path: '/proyectos/nexus-pos/',
    title: 'NexusPOS ERP comercial | Caso de estudio NovaLine',
    description: 'Un ERP comercial que reúne ventas, inventario, clientes, caja, domicilios y reportes en una sola operación conectada y trazable.',
    ogImage: '/assets/nexus-pos/cover.png',
  },
  lia: {
    key: 'lia',
    path: '/proyectos/lia/',
    title: 'Lia, agente inteligente | Caso de estudio NovaLine',
    description: 'Un agente inteligente empresarial que conecta conversaciones, datos, documentos y automatizaciones para ayudar a los equipos a actuar.',
    ogImage: '/assets/lia/cover.png',
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
