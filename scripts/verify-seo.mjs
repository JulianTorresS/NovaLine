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
  assert(title, `${route}: falta title`)
  assert(description, `${route}: falta description`)
  assert(canonical === `${origin}${route}`, `${route}: canonical incorrecto`)
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

const combinedHtml = allHtml.join('\n')
assert(combinedHtml.includes('type="image/avif"'), 'No se encontraron fuentes AVIF')
assert(combinedHtml.includes('type="image/webp"'), 'No se encontraron fuentes WebP')

console.log(`SEO verificado: ${routes.length} rutas, metadatos únicos, JSON-LD parseable, enlaces internos válidos y assets responsivos.`)
