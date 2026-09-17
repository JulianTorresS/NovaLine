import { readFile } from 'node:fs/promises'
import path from 'node:path'

const origin = 'https://novalinesoftware.com'
const routes = [
  '/',
  '/servicios/',
  '/nosotros/',
  '/proyectos/formula-animal/',
  '/proyectos/native-haus/',
  '/proyectos/nexus-pos/',
  '/proyectos/lia/',
]
const routeSet = new Set(routes)
const socialImages = new Map([
  ['/', { path: '/assets/social/novaline-home-1200x630-v3.png', width: '1200', height: '630', type: 'image/png' }],
  ['/servicios/', { path: '/assets/social/novaline-servicios-1200x630-v2.png', width: '1200', height: '630', type: 'image/png' }],
  ['/nosotros/', { path: '/assets/social/novaline-equipo-1200x630.jpg', width: '1200', height: '630', type: 'image/jpeg' }],
  ['/proyectos/formula-animal/', { path: '/assets/crm-formula-animal/cover.png', width: '744', height: '378', type: 'image/png' }],
  ['/proyectos/native-haus/', { path: '/assets/native-haus/cover.png', width: '744', height: '378', type: 'image/png' }],
  ['/proyectos/nexus-pos/', { path: '/assets/nexus-pos/cover.png', width: '744', height: '378', type: 'image/png' }],
  ['/proyectos/lia/', { path: '/assets/lia/cover.png', width: '744', height: '378', type: 'image/png' }],
])
const titles = new Set()
const descriptions = new Set()
const allHtml = []

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function attribute(html, selector) {
  const match = html.match(selector)
  return match?.[1]
}

for (const route of routes) {
  const file = route === '/' ? 'dist/index.html' : path.join('dist', route.slice(1), 'index.html')
  const html = await readFile(file, 'utf8')
  allHtml.push(html)

  const title = attribute(html, /<title>([^<]+)<\/title>/)
  const description = attribute(html, /<meta name="description" content="([^"]+)"/)
  const canonical = attribute(html, /<link rel="canonical" href="([^"]+)"/)
  const expectedImage = socialImages.get(route)
  const socialImage = `${origin}${expectedImage.path}`
  assert(title, `${route}: falta title`)
  assert(description, `${route}: falta description`)
  assert(canonical === `${origin}${route}`, `${route}: canonical incorrecto`)
  assert(html.includes(`<link rel="alternate" type="text/markdown" href="${origin}${route}" />`), `${route}: falta descubrimiento Markdown`)
  assert(html.includes(`<link rel="describedby" href="${origin}/llms.txt" />`), `${route}: falta descubrimiento de llms.txt`)
  assert(attribute(html, /<meta property="og:title" content="([^"]+)"/) === title, `${route}: og:title incorrecto`)
  assert(attribute(html, /<meta property="og:description" content="([^"]+)"/) === description, `${route}: og:description incorrecto`)
  assert(attribute(html, /<meta property="og:type" content="([^"]+)"/) === 'website', `${route}: og:type incorrecto`)
  assert(attribute(html, /<meta property="og:url" content="([^"]+)"/) === canonical, `${route}: og:url incorrecto`)
  assert(attribute(html, /<meta property="og:image" content="([^"]+)"/) === socialImage, `${route}: og:image incorrecto`)
  assert(attribute(html, /<meta property="og:image:width" content="([^"]+)"/) === expectedImage.width, `${route}: og:image:width incorrecto`)
  assert(attribute(html, /<meta property="og:image:height" content="([^"]+)"/) === expectedImage.height, `${route}: og:image:height incorrecto`)
  assert(attribute(html, /<meta property="og:image:type" content="([^"]+)"/) === expectedImage.type, `${route}: og:image:type incorrecto`)
  assert(attribute(html, /<meta name="twitter:card" content="([^"]+)"/) === 'summary_large_image', `${route}: twitter:card incorrecto`)
  assert(attribute(html, /<meta name="twitter:title" content="([^"]+)"/) === title, `${route}: twitter:title incorrecto`)
  assert(attribute(html, /<meta name="twitter:description" content="([^"]+)"/) === description, `${route}: twitter:description incorrecto`)
  assert(attribute(html, /<meta name="twitter:image" content="([^"]+)"/) === socialImage, `${route}: twitter:image incorrecto`)
  assert((html.match(/<h1\b/g) ?? []).length === 1, `${route}: debe contener exactamente un H1`)
  assert(!titles.has(title), `${route}: title duplicado`)
  assert(!descriptions.has(description), `${route}: description duplicada`)
  titles.add(title)
  descriptions.add(description)

  const jsonLd = attribute(html, /<script id="novaline-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/)
  assert(jsonLd, `${route}: falta JSON-LD`)
  JSON.parse(jsonLd)

  for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
    assert(/\bwidth="\d+"/.test(tag) && /\bheight="\d+"/.test(tag), `${route}: imagen sin width/height`)
  }

  for (const href of [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1])) {
    if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/assets/') || href.startsWith('/fonts/') || href === '/favicon.svg') continue
    const pathname = new URL(href, origin).pathname
    const normalized = pathname === '/' ? '/' : `${pathname.replace(/\/$/, '')}/`
    assert(routeSet.has(normalized), `${route}: enlace interno sin ruta pública (${href})`)
  }
}

const sitemap = await readFile('public/sitemap.xml', 'utf8')
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
assert(JSON.stringify(sitemapUrls) === JSON.stringify(routes.map((route) => `${origin}${route}`)), 'El sitemap no coincide con las siete rutas públicas')

const robots = await readFile('public/robots.txt', 'utf8')
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'robots.txt no apunta al sitemap canónico')

const llms = await readFile('public/llms.txt', 'utf8')
assert(llms.startsWith('# NovaLine'), 'llms.txt debe comenzar con el nombre de la entidad')
assert(llms.includes('## When to use NovaLine'), 'llms.txt no explica cuándo usar NovaLine')
assert(llms.includes('## How agents should use NovaLine'), 'llms.txt no incluye instrucciones para agentes')
const llmsSections = llms.split(/^## /m).slice(1)
for (const section of llmsSections) {
  const contentLines = section.split('\n').slice(1).filter((line) => line.trim())
  assert(contentLines.every((line) => /^- \[[^\]]+\]\(https:\/\/[^)]+\)(?:: .+)?$/.test(line)), 'cada sección H2 de llms.txt debe ser una lista de enlaces Markdown')
}
for (const route of routes) {
  assert(llms.includes(`${origin}${route}`), `llms.txt no enlaza la ruta pública ${route}`)
}

const combinedHtml = allHtml.join('\n')
assert(combinedHtml.includes('type="image/avif"'), 'No se encontraron fuentes AVIF')
assert(combinedHtml.includes('type="image/webp"'), 'No se encontraron fuentes WebP')

console.log(`SEO verificado: ${routes.length} rutas, metadatos únicos, JSON-LD parseable, llms.txt, enlaces internos válidos y assets responsivos.`)
