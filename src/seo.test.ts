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
    expect(seo.title.length).toBeLessThanOrEqual(60)
    expect(seo.description.length).toBeGreaterThanOrEqual(120)
    expect(seo.description.length).toBeLessThanOrEqual(160)
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

  it('asigna la imagen social y dimensiones correctas a cada ruta pública', () => {
    const expectedImages = new Map([
      ['/', { path: '/assets/social/novaline-home-1200x630-v2.png', width: 1200, height: 630, type: 'image/png' }],
      ['/servicios/', { path: '/assets/social/novaline-servicios-1200x630-v2.png', width: 1200, height: 630, type: 'image/png' }],
      ['/nosotros/', { path: '/assets/social/novaline-equipo-1200x630.jpg', width: 1200, height: 630, type: 'image/jpeg' }],
      ['/proyectos/formula-animal/', { path: '/assets/crm-formula-animal/cover.png', width: 744, height: 378, type: 'image/png' }],
      ['/proyectos/native-haus/', { path: '/assets/native-haus/cover.png', width: 744, height: 378, type: 'image/png' }],
      ['/proyectos/nexus-pos/', { path: '/assets/nexus-pos/cover.png', width: 744, height: 378, type: 'image/png' }],
      ['/proyectos/lia/', { path: '/assets/lia/cover.png', width: 744, height: 378, type: 'image/png' }],
    ])

    for (const route of PUBLIC_ROUTES) {
      const seo = getSeoMetadata(route.path)
      const expected = expectedImages.get(route.path)
      expect(seo.image).toBe(`${SITE_ORIGIN}${expected?.path}`)
      expect(seo.imageWidth).toBe(expected?.width)
      expect(seo.imageHeight).toBe(expected?.height)
      expect(seo.imageType).toBe(expected?.type)
      expect(seo.twitterCard).toBe('summary_large_image')

      const head = renderSeoHead(route.path)
      expect(head).toContain(`<meta property="og:image:width" content="${expected?.width}" />`)
      expect(head).toContain(`<meta property="og:image:height" content="${expected?.height}" />`)
      expect(head).toContain(`<meta property="og:image:type" content="${expected?.type}" />`)
      expect(head).toContain('<meta name="twitter:image" content="')
    }
  })

  it('publica Person verificables en Nosotros y CreativeWork en cada caso', () => {
    const aboutGraph = getJsonLd('/nosotros/')['@graph'] as Array<Record<string, unknown>>
    const people = aboutGraph.filter((node) => node['@type'] === 'Person')
    expect(people).toHaveLength(2)
    expect(people.map((person) => person.name)).toEqual([
      'Santiago Fraile Arevalo',
      'Julian David Torres Saavedra',
    ])
    expect(JSON.stringify(people)).not.toMatch(/sameAs|address|email|award|rating/i)

    for (const route of PUBLIC_ROUTES.filter((item) => item.path.startsWith('/proyectos/'))) {
      const graph = getJsonLd(route.path)['@graph'] as Array<Record<string, unknown>>
      const caseStudy = graph.find((node) => node['@type'] === 'CreativeWork')
      expect(caseStudy?.['@id']).toBe(`${SITE_ORIGIN}${route.path}#case-study`)
      expect(() => JSON.parse(JSON.stringify(graph))).not.toThrow()
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
