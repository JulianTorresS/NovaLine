import { next } from '@vercel/functions'
import {
  createNotFoundMarkdown,
  getAgentMarkdown,
  negotiateRepresentation,
  normalizeAgentPathname,
} from './agent/markdown'

const negotiatedHeaders = {
  'Content-Language': 'es-CO',
  Vary: 'Accept',
}

function discoveryLink(requestUrl: string, hasMarkdown: boolean) {
  const url = new URL(requestUrl)
  const describedBy = `<${url.origin}/llms.txt>; rel="describedby"`
  if (!hasMarkdown) return describedBy
  const markdownUrl = `${url.origin}${normalizeAgentPathname(url.pathname)}`
  return `<${markdownUrl}>; rel="alternate"; type="text/markdown", ${describedBy}`
}

function textResponse(body: string, status: number, contentType: string, request: Request, hasMarkdown: boolean) {
  return new Response(request.method === 'HEAD' ? null : body, {
    status,
    headers: {
      ...negotiatedHeaders,
      'Content-Type': `${contentType}; charset=utf-8`,
      Link: discoveryLink(request.url, hasMarkdown),
    },
  })
}

export default function middleware(request: Request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return next({ headers: { Link: discoveryLink(request.url, false), Vary: 'Accept' } })
  }

  const pathname = new URL(request.url).pathname
  const markdown = getAgentMarkdown(pathname)
  const link = discoveryLink(request.url, Boolean(markdown))
  const representation = negotiateRepresentation(request.headers.get('accept'))
  if (representation === 'html') return next({ headers: { Link: link, Vary: 'Accept' } })
  if (representation === 'not-acceptable') {
    return textResponse('NovaLine puede responder con text/html o text/markdown.\n', 406, 'text/plain', request, Boolean(markdown))
  }

  if (!markdown) return textResponse(createNotFoundMarkdown(pathname), 404, 'text/markdown', request, false)
  return textResponse(`${markdown.trim()}\n`, 200, 'text/markdown', request, true)
}

export const config = {
  matcher: '/((?!assets/|fonts/|favicon\\.svg|robots\\.txt|sitemap\\.xml|llms\\.txt).*)',
}
