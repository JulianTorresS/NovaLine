import { useEffect } from 'react'

const GA_MEASUREMENT_ID = 'G-98EC98332F'
const GA_SCRIPT_URL = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
const PRODUCTION_HOSTNAMES = new Set(['novalinesoftware.com', 'www.novalinesoftware.com'])

const PROJECTS: Record<string, string> = {
  'formula-animal': 'Fórmula Animal',
  'native-haus': 'Nativhaus',
  'nexus-pos': 'NexusPOS',
  lia: 'Lia',
}

type Gtag = (...args: unknown[]) => void

type AnalyticsWindow = Window & {
  dataLayer?: unknown[]
  gtag?: Gtag
  __novalineGaInitialized?: boolean
}

function safeDestination(anchor: HTMLAnchorElement) {
  const url = new URL(anchor.href, window.location.origin)
  if (url.hostname === 'wa.me') return 'whatsapp'
  if (url.protocol === 'mailto:') return 'email'
  if (url.origin === window.location.origin) return url.pathname
  return `${url.origin}${url.pathname}`
}

function sendClickEvents(event: MouseEvent, gtag: Gtag) {
  if (!(event.target instanceof Element)) return
  const anchor = event.target.closest<HTMLAnchorElement>('a[href]')
  if (!anchor) return

  const url = new URL(anchor.href, window.location.origin)
  const pagePath = window.location.pathname

  if (url.hostname === 'wa.me' || url.protocol === 'mailto:') {
    gtag('event', 'contact_click', {
      contact_type: url.hostname === 'wa.me' ? 'whatsapp' : 'email',
      page_path: pagePath,
      link_url: safeDestination(anchor),
    })
  }

  const projectMatch = url.pathname.match(/^\/proyectos\/([^/]+)\/$/)
  const projectSlug = projectMatch?.[1]
  if (projectSlug && PROJECTS[projectSlug]) {
    gtag('event', 'project_view', {
      project_slug: projectSlug,
      project_name: PROJECTS[projectSlug],
      page_path: pagePath,
    })
  }

  const ctaName = anchor.dataset.analyticsCta
  if (ctaName) {
    gtag('event', 'cta_click', {
      cta_name: ctaName,
      page_path: pagePath,
      destination: safeDestination(anchor),
    })
  }
}

export function useGoogleAnalytics() {
  useEffect(() => {
    if (!PRODUCTION_HOSTNAMES.has(window.location.hostname)) return

    const analyticsWindow = window as AnalyticsWindow
    analyticsWindow.dataLayer ??= []
    analyticsWindow.gtag ??= function gtag(..._args: unknown[]) {
      analyticsWindow.dataLayer?.push(arguments)
    }

    if (!document.querySelector(`script[src="${GA_SCRIPT_URL}"]`)) {
      const script = document.createElement('script')
      script.async = true
      script.src = GA_SCRIPT_URL
      document.head.appendChild(script)
    }

    if (!analyticsWindow.__novalineGaInitialized) {
      analyticsWindow.__novalineGaInitialized = true
      analyticsWindow.gtag('js', new Date())
      analyticsWindow.gtag('config', GA_MEASUREMENT_ID)
    }

    const onClick = (event: MouseEvent) => sendClickEvents(event, analyticsWindow.gtag as Gtag)
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])
}
