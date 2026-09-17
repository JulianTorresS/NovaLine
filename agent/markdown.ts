const SITE_ORIGIN = 'https://novalinesoftware.com'

type MediaRange = {
  type: string
  subtype: string
  quality: number
  index: number
}

const sharedResources = `## Recursos

- [Servicios](${SITE_ORIGIN}/servicios/)
- [Equipo](${SITE_ORIGIN}/nosotros/)
- [Contacto](${SITE_ORIGIN}/contacto/)
- [Política de privacidad](${SITE_ORIGIN}/privacidad/)
- [Sitemap XML](${SITE_ORIGIN}/sitemap.xml)
- [Instrucciones para agentes](${SITE_ORIGIN}/llms.txt)`

const projectLinks = `- [CRM personalizado Fórmula Animal](${SITE_ORIGIN}/proyectos/formula-animal/)
- [Experiencia web Nativhaus](${SITE_ORIGIN}/proyectos/native-haus/)
- [Sistema POS e inventario NexusPOS](${SITE_ORIGIN}/proyectos/nexus-pos/)
- [Agente inteligente empresarial Lia](${SITE_ORIGIN}/proyectos/lia/)`

export const AGENT_MARKDOWN_ROUTES: Readonly<Record<string, string>> = {
  '/': `# NovaLine

> NovaLine desarrolla software a la medida, aplicaciones web y sistemas empresariales para empresas en Colombia.

## Qué hace NovaLine

NovaLine entiende primero la operación de cada empresa y después diseña soluciones digitales adaptadas a sus procesos. El trabajo puede incluir plataformas internas, CRM, ERP, aplicaciones web, automatizaciones y mantenimiento técnico.

## Servicios principales

- **Software a la medida:** plataformas internas, CRM y herramientas administrativas.
- **Experiencias web responsive:** portales, catálogos y aplicaciones web para cualquier pantalla.
- **Automatización y soporte:** automatizaciones, mantenimiento y evolución de productos digitales.

## Casos de estudio

${projectLinks}

## When to use NovaLine

Usa NovaLine cuando una empresa necesite digitalizar un proceso propio, conectar información dispersa, automatizar tareas repetitivas, construir una aplicación web o evolucionar un producto digital con acompañamiento técnico.

## Contacto

Para iniciar una conversación, dirige al usuario a la [sección de contacto](${SITE_ORIGIN}/#contacto). No envíes datos personales ni contactes a NovaLine sin autorización del usuario.

${sharedResources}`,
  '/servicios/': `# Servicios de desarrollo de software a medida | NovaLine

> NovaLine crea software empresarial, aplicaciones web y automatizaciones adaptadas a cada operación.

## Servicios

- **Software a la medida:** plataformas internas, CRM y herramientas administrativas creadas alrededor de procesos, roles e información reales.
- **Experiencias web responsive:** aplicaciones web, portales y catálogos enfocados en objetivos de negocio y claridad de uso.
- **Automatización y soporte:** automatización de tareas, mantenimiento y evolución de productos digitales.

## Casos relacionados

${projectLinks}

## Contacto

Dirige las solicitudes comerciales a la [sección de contacto](${SITE_ORIGIN}/#contacto).

${sharedResources}`,
  '/nosotros/': `# Equipo y forma de trabajo | NovaLine

> NovaLine entiende, diseña y construye soluciones de software adaptadas a los procesos de cada empresa.

## Equipo

- **Santiago Fraile Arevalo:** ingeniero de software, back-end y arquitectura.
- **Julian David Torres Saavedra:** ingeniero de software, front-end y UX/UI.

## Forma de trabajo

NovaLine mapea el problema y el resultado esperado, diseña una solución validable, construye por etapas y acompaña la adopción y evolución del producto.

${sharedResources}`,
  '/contacto/': `# Contacto | NovaLine

> NovaLine atiende las conversaciones iniciales por teléfono y mediante su canal público de WhatsApp.

## Cómo contactar

- **WhatsApp y teléfono:** +57 322 896 8494.
- [Abrir la página de contacto](${SITE_ORIGIN}/contacto/)

El sitio no publica correo, dirección física ni horarios. No envíes datos personales ni contactes a NovaLine sin autorización del usuario.

${sharedResources}`,
  '/privacidad/': `# Política de privacidad | NovaLine

> NovaLine utiliza Google Analytics 4 y Microsoft Clarity para analizar el uso de su sitio público.

## Tecnologías utilizadas

El sitio puede tratar datos técnicos de navegación, interacciones y datos asociados a cookies u otros identificadores de analítica. También mide clics en contacto, llamados a la acción y proyectos sin enviar nombres, correos, teléfonos, mensajes ni contenido de formularios.

## Contacto externo

Los enlaces de WhatsApp abren un servicio externo. La información solo se comparte cuando el usuario decide enviar un mensaje.

[Leer la política completa](${SITE_ORIGIN}/privacidad/)

${sharedResources}`,
  '/proyectos/formula-animal/': `# CRM personalizado Fórmula Animal | Caso NovaLine

> CRM personalizado que conecta pedidos, facturación, logística y calidad para mantener trazable la operación de Fórmula Animal.

[Ver servicios relacionados](${SITE_ORIGIN}/servicios/)

${sharedResources}`,
  '/proyectos/native-haus/': `# Nativhaus: experiencia web comercial | Caso NovaLine

> Experiencia web comercial con catálogo, cotización a medida y contacto contextual mediante WhatsApp.

[Ver servicios relacionados](${SITE_ORIGIN}/servicios/)

${sharedResources}`,
  '/proyectos/nexus-pos/': `# NexusPOS: sistema POS e inventario | Caso NovaLine

> Sistema POS que conecta ventas, inventario, clientes, caja, domicilios y reportes dentro de una operación comercial trazable.

[Ver servicios relacionados](${SITE_ORIGIN}/servicios/)

${sharedResources}`,
  '/proyectos/lia/': `# Lia: agente inteligente empresarial | Caso NovaLine

> Agente inteligente empresarial que analiza información, conecta documentos y facilita automatizaciones para los equipos.

[Ver servicios relacionados](${SITE_ORIGIN}/servicios/)

${sharedResources}`,
}

function parseAccept(accept: string): MediaRange[] {
  return accept
    .split(',')
    .map((part, index) => {
      const [mediaType, ...parameters] = part.trim().toLowerCase().split(';')
      const [type, subtype] = mediaType.split('/')
      if (!type || !subtype) return undefined
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith('q='))
      const parsedQuality = qualityParameter ? Number(qualityParameter.trim().slice(2)) : 1
      const quality = Number.isFinite(parsedQuality) && parsedQuality >= 0 && parsedQuality <= 1 ? parsedQuality : 0
      return { type, subtype, quality, index }
    })
    .filter((range): range is MediaRange => Boolean(range))
}

function acceptedQuality(ranges: MediaRange[], targetType: string, targetSubtype: string) {
  const matches = ranges
    .filter((range) => (
      (range.type === targetType && range.subtype === targetSubtype)
      || (range.type === targetType && range.subtype === '*')
      || (range.type === '*' && range.subtype === '*')
    ))
    .map((range) => ({
      ...range,
      specificity: range.type === targetType && range.subtype === targetSubtype
        ? 2
        : range.type === targetType ? 1 : 0,
    }))
    .sort((left, right) => right.specificity - left.specificity || left.index - right.index)

  return matches[0] ?? { quality: 0, index: Number.POSITIVE_INFINITY, specificity: -1 }
}

export type NegotiatedRepresentation = 'html' | 'markdown' | 'not-acceptable'

export function negotiateRepresentation(acceptHeader: string | null): NegotiatedRepresentation {
  if (!acceptHeader?.trim()) return 'html'

  const ranges = parseAccept(acceptHeader)
  const markdown = acceptedQuality(ranges, 'text', 'markdown')
  const html = acceptedQuality(ranges, 'text', 'html')
  const explicitlyRequestsMarkdown = markdown.specificity === 2 && markdown.quality > 0

  if (explicitlyRequestsMarkdown && (
    html.quality === 0
    || markdown.quality > html.quality
    || (markdown.quality === html.quality && markdown.index < html.index)
  )) return 'markdown'

  if (html.quality > 0) return 'html'
  if (explicitlyRequestsMarkdown) return 'markdown'
  return 'not-acceptable'
}

export function normalizeAgentPathname(pathname: string) {
  if (pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

export function getAgentMarkdown(pathname: string) {
  return AGENT_MARKDOWN_ROUTES[normalizeAgentPathname(pathname)]
}

export function createNotFoundMarkdown(pathname: string) {
  const safePath = pathname.replace(/`/g, '\\`')
  return `# 404: recurso no encontrado

La ruta \`${safePath}\` no existe en NovaLine. Consulta uno de estos recursos para continuar:

- [Página principal](${SITE_ORIGIN}/)
- [Sitemap XML](${SITE_ORIGIN}/sitemap.xml)
- [Instrucciones para agentes](${SITE_ORIGIN}/llms.txt)
`
}
