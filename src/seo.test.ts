import { describe, expect, it } from 'vitest'
import { getJsonLd, getSeoMetadata, renderSeoHead } from './seo'
import { LEGACY_HASH_ROUTES, PUBLIC_ROUTES, SITE_ORIGIN } from './routes'

describe('SEO estructural', () => {
  it('define únicamente las siete rutas públicas con barra final', () => {
    expect(PUBLIC_ROUTES.map((route) => route.path)).toEqual([
      '/',
      '/servicios/',
      '/nosotros/',
      '/proyectos/formula-animal/',
      '/proyectos/native-haus/',
      '/proyectos/nexus-pos/',
      '/proyectos/lia/',
    ])
    expect(PUBLIC_ROUTES.every((route) => route.path === '/' || route.path.endsWith('/'))).toBe(true)
  })

  it.each(PUBLIC_ROUTES)('genera canonical y metadatos únicos para $path', (route) => {
    const seo = getSeoMetadata(route.path)
    expect(seo.canonical).toBe(`${SITE_ORIGIN}${route.path}`)
    expect(seo.title).toBeTruthy()
    expect(seo.description.length).toBeGreaterThanOrEqual(120)
    expect(renderSeoHead(route.path)).toContain(`href="${seo.canonical}"`)
  })

  it('mantiene títulos y descripciones únicos', () => {
    expect(new Set(PUBLIC_ROUTES.map((route) => route.title)).size).toBe(PUBLIC_ROUTES.length)
    expect(new Set(PUBLIC_ROUTES.map((route) => route.description)).size).toBe(PUBLIC_ROUTES.length)
  })

  it('genera Organization, WebSite, WebPage y Service sin datos inventados', () => {
    const jsonLd = getJsonLd('/servicios/')
    const graph = jsonLd['@graph'] as Array<Record<string, unknown>>
    expect(graph.map((node) => node['@type'])).toEqual([
      'Organization',
      'WebSite',
      'WebPage',
      'Service',
      'Service',
      'Service',
    ])
    expect(JSON.stringify(jsonLd)).not.toMatch(/sameAs|address|email|rating|price/i)
    expect(() => JSON.parse(JSON.stringify(jsonLd))).not.toThrow()
  })

  it('usa imágenes sociales reales solo en los casos de estudio', () => {
    expect(getSeoMetadata('/').image).toBeUndefined()
    expect(getSeoMetadata('/servicios/').image).toBeUndefined()
    expect(getSeoMetadata('/nosotros/').image).toBeUndefined()
    for (const route of PUBLIC_ROUTES.filter((item) => item.path.startsWith('/proyectos/'))) {
      expect(getSeoMetadata(route.path).image).toMatch(/^https:\/\/novalinesoftware\.com\/assets\/.+\/cover\.png$/)
    }
  })

  it('conserva redirecciones para los hashes históricos', () => {
    expect(LEGACY_HASH_ROUTES).toEqual({
      '#nosotros': '/nosotros/',
      '#proyecto-formula-animal': '/proyectos/formula-animal/',
      '#proyecto-native-haus': '/proyectos/native-haus/',
      '#proyecto-nexus-pos': '/proyectos/nexus-pos/',
      '#proyecto-lia': '/proyectos/lia/',
    })
  })
})
