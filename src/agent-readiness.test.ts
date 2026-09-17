import { describe, expect, it } from 'vitest'
import middleware, { config as middlewareConfig } from '../middleware'
import {
  AGENT_MARKDOWN_ROUTES,
  createNotFoundMarkdown,
  getAgentMarkdown,
  negotiateRepresentation,
} from '../agent/markdown'
import { PUBLIC_ROUTES } from './routes'

describe('negociación Markdown para agentes', () => {
  it('usa el runtime Node.js soportado por Vercel', () => {
    expect(middlewareConfig.runtime).toBe('nodejs')
  })

  it.each([
    ['text/markdown', 'markdown'],
    ['text/markdown, text/html;q=0.8', 'markdown'],
    ['text/html, text/markdown;q=0.8', 'html'],
    ['text/html,application/xhtml+xml,*/*;q=0.8', 'html'],
    ['*/*', 'html'],
    ['application/json', 'not-acceptable'],
    ['text/markdown;q=0, text/html;q=0.5', 'html'],
  ] as const)('negocia %s como %s', (accept, expected) => {
    expect(negotiateRepresentation(accept)).toBe(expected)
  })

  it('publica Markdown no vacío para las siete rutas', () => {
    expect(Object.keys(AGENT_MARKDOWN_ROUTES)).toEqual(PUBLIC_ROUTES.map((route) => route.path))
    for (const route of PUBLIC_ROUTES) {
      expect(getAgentMarkdown(route.path)?.length).toBeGreaterThan(100)
    }
  })

  it.each(PUBLIC_ROUTES)('responde $path como Markdown con las cabeceras de negociación', async (route) => {
      const response = middleware(new Request(`https://novalinesoftware.com${route.path}`, {
        headers: { Accept: 'text/markdown' },
      }))
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8')
      expect(response.headers.get('vary')).toBe('Accept')
      expect(response.headers.get('link')).toContain('rel="alternate"; type="text/markdown"')
      expect(response.headers.get('link')).toContain('<https://novalinesoftware.com/llms.txt>; rel="describedby"')
      expect((await response.text()).length).toBeGreaterThan(100)
    })

  it('conserva HTML para navegadores y declara Vary: Accept', () => {
    const response = middleware(new Request('https://novalinesoftware.com/', {
      headers: { Accept: 'text/html' },
    }))
    expect(response.headers.get('x-middleware-next')).toBe('1')
    expect(response.headers.get('vary')).toBe('Accept')
    expect(response.headers.get('link')).toContain('rel="alternate"; type="text/markdown"')
  })

  it('devuelve un 404 Markdown explicativo con recursos para agentes', async () => {
    const path = '/__ora-404-probe-test'
    const response = middleware(new Request(`https://novalinesoftware.com${path}`, {
      headers: { Accept: 'text/markdown' },
    }))
    const body = await response.text()
    expect(response.status).toBe(404)
    expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8')
    expect(response.headers.get('vary')).toBe('Accept')
    expect(body.length).toBeGreaterThan(20)
    expect(body).toContain('https://novalinesoftware.com/llms.txt')
    expect(body).toBe(createNotFoundMarkdown(path))
  })

  it('responde HEAD sin cuerpo y conserva las cabeceras Markdown', async () => {
    const response = middleware(new Request('https://novalinesoftware.com/', {
      method: 'HEAD',
      headers: { Accept: 'text/markdown' },
    }))
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8')
    expect(await response.text()).toBe('')
  })

  it('devuelve 406 cuando no puede producir un formato aceptable', () => {
    const response = middleware(new Request('https://novalinesoftware.com/', {
      headers: { Accept: 'application/json' },
    }))
    expect(response.status).toBe(406)
    expect(response.headers.get('vary')).toBe('Accept')
  })
})
