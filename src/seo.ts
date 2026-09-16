import { SERVICES, SITE, TEAM_MEMBERS } from './config'
import { absoluteUrl, resolveRoute, ROUTES, SITE_ORIGIN, type RouteDefinition } from './routes'

type JsonLd = Record<string, unknown>

const organizationId = `${SITE_ORIGIN}/#organization`
const websiteId = `${SITE_ORIGIN}/#website`
const logoUrl = absoluteUrl('/favicon.svg')
const caseRouteKeys = new Set(['formula-animal', 'native-haus', 'nexus-pos', 'lia'])

function organizationSchema(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': organizationId,
    name: SITE.brand,
    url: `${SITE_ORIGIN}/`,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_ORIGIN}/#logo`,
      url: logoUrl,
      contentUrl: logoUrl,
      width: 64,
      height: 64,
    },
    telephone: `+${SITE.whatsappNumber}`,
  }
}

function websiteSchema(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: `${SITE_ORIGIN}/`,
    name: SITE.brand,
    inLanguage: 'es-CO',
    publisher: { '@id': organizationId },
  }
}

function webpageSchema(route: RouteDefinition): JsonLd {
  const canonical = absoluteUrl(route.path)
  const page: JsonLd = {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: route.title,
    description: route.description,
    inLanguage: 'es-CO',
    isPartOf: { '@id': websiteId },
    about: { '@id': organizationId },
  }
  if (caseRouteKeys.has(route.key)) page.mainEntity = { '@id': `${canonical}#case-study` }
  return page
}

function serviceSchemas(): JsonLd[] {
  return SERVICES.map((service, index) => ({
    '@type': 'Service',
    '@id': `${absoluteUrl(ROUTES.services.path)}#service-${index + 1}`,
    name: service.title,
    description: service.text,
    provider: { '@id': organizationId },
    areaServed: {
      '@type': 'Country',
      name: 'Colombia',
    },
    url: absoluteUrl(ROUTES.services.path),
  }))
}

function personSchemas(): JsonLd[] {
  return TEAM_MEMBERS.map((member, index) => ({
    '@type': 'Person',
    '@id': `${absoluteUrl(ROUTES.about.path)}#person-${index + 1}`,
    name: member.name,
    jobTitle: member.role,
    image: absoluteUrl(member.photo),
    worksFor: { '@id': organizationId },
  }))
}

function caseStudySchema(route: RouteDefinition): JsonLd {
  const canonical = absoluteUrl(route.path)
  return {
    '@type': 'CreativeWork',
    '@id': `${canonical}#case-study`,
    url: canonical,
    name: route.title,
    description: route.description,
    inLanguage: 'es-CO',
    creator: { '@id': organizationId },
    ...(route.ogImage ? { image: absoluteUrl(route.ogImage) } : {}),
  }
}

export function getJsonLd(pathname: string): JsonLd {
  const route = resolveRoute(pathname)
  const graph = [organizationSchema(), websiteSchema(), webpageSchema(route)]
  if (route.key === 'services') graph.push(...serviceSchemas())
  if (route.key === 'about') graph.push(...personSchemas())
  if (caseRouteKeys.has(route.key)) graph.push(caseStudySchema(route))
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

export function getSeoMetadata(pathname: string) {
  const route = resolveRoute(pathname)
  const canonical = absoluteUrl(route.path)
  const image = route.ogImage ? absoluteUrl(route.ogImage) : undefined
  return {
    ...route,
    canonical,
    image,
    twitterCard: image ? 'summary_large_image' : 'summary',
    jsonLd: getJsonLd(route.path),
  }
}

function escapeAttribute(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function renderSeoHead(pathname: string) {
  const seo = getSeoMetadata(pathname)
  const tags = [
    `<title>${escapeAttribute(seo.title)}</title>`,
    `<meta name="description" content="${escapeAttribute(seo.description)}" />`,
    '<meta name="robots" content="index,follow,max-image-preview:large" />',
    `<link rel="canonical" href="${seo.canonical}" />`,
    `<meta property="og:title" content="${escapeAttribute(seo.title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(seo.description)}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:url" content="${seo.canonical}" />`,
    '<meta property="og:site_name" content="NovaLine" />',
    '<meta property="og:locale" content="es_CO" />',
    `<meta name="twitter:card" content="${seo.twitterCard}" />`,
    `<meta name="twitter:title" content="${escapeAttribute(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(seo.description)}" />`,
  ]
  if (seo.image) {
    tags.push(`<meta property="og:image" content="${seo.image}" />`)
    tags.push(`<meta name="twitter:image" content="${seo.image}" />`)
  }
  const json = JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c')
  tags.push(`<script id="novaline-jsonld" type="application/ld+json">${json}</script>`)
  return tags.join('\n    ')
}

function upsertMeta(selector: string, attribute: 'name' | 'property', key: string, content?: string) {
  const existing = document.head.querySelector<HTMLMetaElement>(selector)
  if (!content) {
    existing?.remove()
    return
  }
  const element = existing ?? document.createElement('meta')
  element.setAttribute(attribute, key)
  element.content = content
  if (!existing) document.head.appendChild(element)
}

export function applySeoToDocument(pathname: string) {
  const seo = getSeoMetadata(pathname)
  document.title = seo.title
  upsertMeta('meta[name="description"]', 'name', 'description', seo.description)
  upsertMeta('meta[name="robots"]', 'name', 'robots', 'index,follow,max-image-preview:large')
  upsertMeta('meta[property="og:title"]', 'property', 'og:title', seo.title)
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', seo.description)
  upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', seo.canonical)
  upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'NovaLine')
  upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', 'es_CO')
  upsertMeta('meta[property="og:image"]', 'property', 'og:image', seo.image)
  upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', seo.twitterCard)
  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title)
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description)
  upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', seo.image)

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = seo.canonical

  let jsonLd = document.head.querySelector<HTMLScriptElement>('#novaline-jsonld')
  if (!jsonLd) {
    jsonLd = document.createElement('script')
    jsonLd.id = 'novaline-jsonld'
    jsonLd.type = 'application/ld+json'
    document.head.appendChild(jsonLd)
  }
  jsonLd.textContent = JSON.stringify(seo.jsonLd)
}
