import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { SITE, whatsappUrl } from './config'

describe('NovaLine landing', () => {
  it('muestra la navegación principal y sus destinos', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)
    const navigation = screen.getByRole('navigation', { name: 'Navegación principal' })
    expect(navigation).toHaveTextContent('Inicio')
    expect(navigation).toHaveTextContent('Proyectos')
    expect(navigation).toHaveTextContent('Proceso')
    expect(navigation).toHaveTextContent('Servicios')
    expect(navigation).toHaveTextContent('Nosotros')
    expect(navigation).toHaveTextContent('Contacto')
    expect(Array.from(navigation.querySelectorAll(':scope > a:not(.button)')).map((link) => link.textContent)).toEqual([
      'Inicio',
      'Proceso',
      'Proyectos',
      'Contacto',
      'Servicios',
      'Nosotros',
    ])
    expect(navigation.querySelector('a[href="/"]')).toHaveTextContent('Inicio')
    const servicesLink = navigation.querySelector('a[href="/servicios/"]') as HTMLAnchorElement
    expect(servicesLink).toHaveTextContent('Servicios')
    fireEvent.click(servicesLink)
    expect(window.location.pathname).toBe('/servicios/')
    expect(screen.getByRole('heading', { level: 1, name: /Servicios de software a la medida para operar mejor/i })).toBeInTheDocument()
  })

  it('agrupa Servicios y Nosotros como páginas independientes', () => {
    window.history.replaceState({}, '', '/servicios/')
    const { unmount } = render(<App initialPath="/servicios/" />)
    const servicesPageLink = screen.getByRole('navigation', { name: 'Navegación principal' }).querySelector('a[href="/servicios/"]')
    expect(servicesPageLink).toHaveClass('is-active')

    unmount()
    window.history.replaceState({}, '', '/')
    render(<App initialPath="/" />)
    const homeNavigation = screen.getByRole('navigation', { name: 'Navegación principal' })
    const homeLinks = Array.from(homeNavigation.querySelectorAll<HTMLAnchorElement>('a:not(.button)'))
    const servicesHomeLink = homeNavigation.querySelector('a[href="/servicios/"]')
    const aboutHomeLink = homeNavigation.querySelector('a[href="/nosotros/"]')
    expect(servicesHomeLink).not.toHaveClass('is-active')
    expect(aboutHomeLink).not.toHaveClass('is-active')
    expect(servicesHomeLink).toHaveClass('nav__page-link')
    expect(aboutHomeLink).toHaveClass('nav__page-link')
    expect(homeLinks.slice(-2).map((link) => link.textContent)).toEqual(['Servicios', 'Nosotros'])
  })

  it('presenta un hero único y conserva el bloque compacto de tres servicios', () => {
    window.history.replaceState({}, '', '/')
    const { container } = render(<App />)
    expect(container.querySelectorAll('#inicio h1')).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: /Software a la medida que entiende cómo funciona tu empresa/i })).toBeInTheDocument()
    expect(container.querySelector('#inicio [role="tab"]')).not.toBeInTheDocument()
    expect(container.querySelector('.hero__count')).not.toBeInTheDocument()

    const services = screen.getByRole('region', { name: 'Servicios de desarrollo de NovaLine' })
    expect(services.querySelectorAll('.service-card')).toHaveLength(3)
    expect(services).toHaveTextContent('Software a la medida')
    expect(services).toHaveTextContent('Experiencias web responsive')
    expect(services).toHaveTextContent('Automatización y soporte')
    expect(screen.queryByRole('button', { name: 'Ver servicio siguiente' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Conocer nuestros servicios de desarrollo/i })).toHaveAttribute('href', '/servicios/')
  })

  it('integra el video, el símbolo original, el control de pausa y los ocho servicios', () => {
    window.history.replaceState({}, '', '/')
    const { container } = render(<App />)
    expect(container.querySelectorAll('.hero-background video')).toHaveLength(1)
    const video = container.querySelector<HTMLVideoElement>('.hero-background video')
    expect(video).toHaveAttribute('autoplay')
    expect(video).toHaveAttribute('loop')
    expect(video).toHaveAttribute('playsinline')
    expect(video).toHaveAttribute('preload', 'metadata')
    const poster = container.querySelector('.hero-background__poster')
    expect(poster).toHaveAttribute('src', '/assets/brand/hero-poster.webp')
    expect(video).not.toHaveAttribute('src')
    expect(video?.muted).toBe(true)
    expect(container.querySelector('.hero-background__glyph .brand__glyph')).toBeInTheDocument()

    fireEvent.canPlay(video as HTMLVideoElement)
    expect(video).toHaveClass('is-ready')
    expect(poster).toHaveClass('is-hidden')

    const pauseButton = screen.getByRole('button', { name: 'Pausar animaciones' })
    fireEvent.click(pauseButton)
    expect(screen.getByRole('button', { name: 'Reanudar animaciones' })).toHaveAttribute('aria-pressed', 'true')

    const ribbon = container.querySelector('.service-ribbon') as HTMLElement
    expect(ribbon.querySelectorAll('.service-ribbon__group')).toHaveLength(5)
    expect(ribbon.querySelectorAll('.service-ribbon__group[aria-hidden="false"]')).toHaveLength(1)
    expect(ribbon.querySelectorAll('.service-ribbon__group:first-child button')).toHaveLength(8)
    const softwareCard = Array.from(ribbon.querySelectorAll('button')).find((button) => button.textContent?.includes('Software a medida')) as HTMLButtonElement
    fireEvent.click(softwareCard)
    expect(ribbon).toHaveTextContent('Plataformas creadas alrededor de tus procesos')
    expect(ribbon.querySelector('a[href*="wa.me"]')).toHaveTextContent('Consultar por WhatsApp')
  })

  it('oculta el detalle del servicio a los diez segundos o al hacer scroll', () => {
    vi.useFakeTimers()

    try {
      const { container } = render(<App />)
      const ribbon = container.querySelector('.service-ribbon') as HTMLElement
      const softwareCard = Array.from(ribbon.querySelectorAll('button')).find((button) => button.textContent?.includes('Software a medida')) as HTMLButtonElement

      fireEvent.click(softwareCard)
      expect(ribbon.querySelector('.service-ribbon__detail')).toBeInTheDocument()
      expect(softwareCard).toHaveClass('is-active')
      expect(ribbon).toHaveClass('has-detail')

      act(() => vi.advanceTimersByTime(9999))
      expect(ribbon.querySelector('.service-ribbon__detail')).toBeInTheDocument()
      act(() => vi.advanceTimersByTime(1))
      expect(ribbon.querySelector('.service-ribbon__detail')).not.toBeInTheDocument()
      expect(softwareCard).not.toHaveClass('is-active')
      expect(ribbon).not.toHaveClass('has-detail')

      fireEvent.click(softwareCard)
      expect(ribbon.querySelector('.service-ribbon__detail')).toBeInTheDocument()
      fireEvent.scroll(window)
      expect(ribbon.querySelector('.service-ribbon__detail')).not.toBeInTheDocument()
      expect(softwareCard).not.toHaveClass('is-active')
      expect(ribbon).not.toHaveClass('has-detail')
    } finally {
      vi.useRealTimers()
    }
  })

  it('permite arrastrar manualmente el carrusel y reanuda al soltarlo', async () => {
    window.history.replaceState({}, '', '/')
    const { container } = render(<App />)
    const ribbon = container.querySelector('.service-ribbon') as HTMLElement
    const marquee = container.querySelector('.service-ribbon__marquee') as HTMLElement
    Object.defineProperty(marquee, 'scrollLeft', { configurable: true, value: 120, writable: true })

    fireEvent.pointerDown(marquee, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 220 })
    expect(ribbon).toHaveClass('is-interacting')
    fireEvent.pointerMove(marquee, { pointerId: 1, pointerType: 'mouse', clientX: 160 })
    expect(marquee.scrollLeft).toBe(180)
    fireEvent.pointerUp(marquee, { pointerId: 1, pointerType: 'mouse', clientX: 160 })
    await waitFor(() => expect(ribbon).not.toHaveClass('is-interacting'))
  })

  it('distingue un clic de un arrastre antes de capturar el puntero', () => {
    vi.useFakeTimers()

    try {
      window.history.replaceState({}, '', '/')
      const { container } = render(<App />)
      const ribbon = container.querySelector('.service-ribbon') as HTMLElement
      const marquee = ribbon.querySelector('.service-ribbon__marquee') as HTMLElement
      const softwareCard = Array.from(ribbon.querySelectorAll('button')).find((button) => button.textContent?.includes('Software a medida')) as HTMLButtonElement
      const setPointerCapture = vi.fn()
      const releasePointerCapture = vi.fn()
      marquee.setPointerCapture = setPointerCapture
      marquee.releasePointerCapture = releasePointerCapture

      fireEvent.pointerDown(softwareCard, { pointerId: 7, pointerType: 'mouse', button: 0, clientX: 220 })
      expect(setPointerCapture).not.toHaveBeenCalled()
      fireEvent.pointerUp(softwareCard, { pointerId: 7, pointerType: 'mouse', button: 0, clientX: 220 })
      fireEvent.click(softwareCard)

      expect(softwareCard).toHaveClass('is-active')
      expect(ribbon).toHaveClass('has-detail')
      expect(ribbon.querySelector('.service-ribbon__detail')).toBeInTheDocument()

      act(() => vi.advanceTimersByTime(0))
      expect(ribbon).not.toHaveClass('is-interacting')
      expect(ribbon).toHaveClass('has-detail')
    } finally {
      vi.useRealTimers()
    }
  })

  it('recicla las opciones después de un arrastre extremo para no dejar espacios vacíos', async () => {
    window.history.replaceState({}, '', '/')
    const { container } = render(<App />)
    const ribbon = container.querySelector('.service-ribbon') as HTMLElement
    const marquee = ribbon.querySelector('.service-ribbon__marquee') as HTMLElement
    const track = ribbon.querySelector('.service-ribbon__track') as HTMLElement
    Object.defineProperty(track, 'scrollWidth', { configurable: true, value: 4800 })
    Object.defineProperty(marquee, 'scrollLeft', { configurable: true, value: 4000, writable: true })

    fireEvent.pointerDown(marquee, { pointerId: 9, pointerType: 'mouse', button: 0, clientX: 220 })
    fireEvent.pointerMove(marquee, { pointerId: 9, pointerType: 'mouse', clientX: 120 })
    fireEvent.pointerUp(marquee, { pointerId: 9, pointerType: 'mouse', clientX: 120 })

    expect(marquee.scrollLeft).toBeGreaterThanOrEqual(1600)
    expect(marquee.scrollLeft).toBeLessThan(3200)
    await waitFor(() => expect(ribbon).not.toHaveClass('is-interacting'))

    marquee.scrollLeft = 4700
    fireEvent.scroll(marquee)
    await waitFor(() => {
      expect(marquee.scrollLeft).toBeGreaterThanOrEqual(1920)
      expect(marquee.scrollLeft).toBeLessThan(2880)
    })
  })

  it('presenta la identidad y la sección Nosotros de NovaLine', () => {
    window.history.replaceState({}, '', '/nosotros/')
    render(<App initialPath="/nosotros/" />)
    expect(screen.getAllByRole('link', { name: 'NovaLine, ir al inicio' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: 'Tecnología clara para negocios que quieren avanzar.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Conoce al equipo' })).toBeInTheDocument()
    expect(screen.getByText('Santiago Fraile Arevalo')).toBeInTheDocument()
    expect(screen.getByText('Julian David Torres Saavedra')).toBeInTheDocument()
    expect(screen.queryByText('Nombre del integrante')).not.toBeInTheDocument()
    expect(screen.queryByText('Agregar foto')).not.toBeInTheDocument()
  })

  it('construye un enlace de WhatsApp con el mensaje codificado', () => {
    const result = whatsappUrl()
    expect(result).toContain(`wa.me/${SITE.whatsappNumber}`)
    expect(result).toContain(encodeURIComponent(SITE.whatsappMessage))
  })

  it('encola clics rápidos sin desbordar el carrusel de proyectos', async () => {
    window.history.replaceState({}, '', '/')
    const { container } = render(<App />)
    const nextButton = screen.getByRole('button', { name: 'Proyectos siguientes' })
    const track = container.querySelector('.projects-track') as HTMLElement

    fireEvent.click(nextButton)
    const firstMovement = track.style.transform
    fireEvent.click(nextButton)
    expect(track.style.transform).toBe(firstMovement)

    fireEvent.transitionEnd(track)
    await waitFor(() => expect(track.style.transform).not.toBe(firstMovement))
  })

  it('abre el caso real de Fórmula Animal desde proyectos', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Ver caso real de Fórmula Animal' }))
    expect(screen.getByRole('heading', { name: /Un CRM que acompaña todo el recorrido/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/proyectos/formula-animal/')
    fireEvent.click(screen.getByRole('button', { name: /Facturación/i }))
    expect(screen.getByRole('heading', { name: 'La facturación conserva la trazabilidad' })).toBeInTheDocument()
  })

  it('abre el caso real de Native Haus y permite recorrer sus vistas', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Ver caso real de Nativhaus' }))
    expect(screen.getByRole('heading', { name: /Una vitrina digital que convierte madera/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/proyectos/native-haus/')
    fireEvent.click(screen.getByRole('button', { name: /Cotizador/ }))
    expect(screen.getByRole('heading', { name: 'La personalización termina en una conversación útil' })).toBeInTheDocument()
  })

  it('abre el ERP comercial NexusPOS y permite recorrer sus módulos', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Ver caso real de NexusPOS' }))
    expect(screen.getByRole('heading', { name: /La operación completa de un comercio/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/proyectos/nexus-pos/')
    fireEvent.click(screen.getByRole('button', { name: /Inventario/ }))
    expect(screen.getByRole('heading', { name: 'El stock acompaña la venta en tiempo real' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Caja/ }))
    expect(screen.getByRole('heading', { name: 'Cada turno cierra con el efectivo bajo control' })).toBeInTheDocument()
  })

  it('abre el caso de Lia y permite recorrer sus capacidades', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: 'Ver caso real de Lia' }))
    expect(screen.getByRole('heading', { name: /Una asistente empresarial capaz de entender/i })).toBeInTheDocument()
    expect(window.location.pathname).toBe('/proyectos/lia/')
    const heroScreenshot = screen.getByAltText('Conversación con el agente inteligente Lia')
    expect(heroScreenshot).toHaveAttribute('srcset', expect.stringContaining('/assets/lia/responsive/asistente-1280.png'))
    expect(heroScreenshot).toHaveAttribute('sizes', expect.stringContaining('635px'))
    expect(heroScreenshot).toHaveAttribute('width', '1916')
    expect(heroScreenshot).toHaveAttribute('height', '911')
    expect(heroScreenshot.parentElement?.querySelector('source[type="image/webp"]')).toHaveAttribute('srcset', expect.stringContaining('/assets/lia/responsive/asistente-1280.webp'))
    fireEvent.click(screen.getByRole('button', { name: /Configurar/ }))
    expect(screen.getByRole('heading', { name: 'El agente se adapta a la identidad y al motor de cada empresa' })).toBeInTheDocument()
  })

  it('mantiene visibles y accesibles los tres servicios de la portada', () => {
    window.history.replaceState({}, '', '/')
    const { container } = render(<App />)
    const services = screen.getByRole('region', { name: 'Servicios de desarrollo de NovaLine' })
    expect(services.querySelectorAll('article')).toHaveLength(3)
    expect(container.querySelector('[aria-roledescription="carrusel"]')).not.toBeInTheDocument()
    container.querySelectorAll('.project-card[aria-hidden="true"] .project-card__open').forEach((link) => {
      expect(link).toHaveAttribute('tabindex', '-1')
    })
  })

  it('abre la experiencia independiente de Servicios sin recargar', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)

    fireEvent.click(screen.getByRole('link', { name: /Conocer nuestros servicios de desarrollo/i }))

    expect(window.location.pathname).toBe('/servicios/')
    expect(window.location.hash).toBe('')
    expect(screen.getByRole('heading', { level: 1, name: /Servicios de software a la medida para operar mejor/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Una plataforma clara para conectar toda tu operación/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Menos pasos entre una buena experiencia/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Procesos que avanzan sin perder contexto/i })).toBeInTheDocument()
  })

  it('presenta los servicios por secciones y conserva sus animaciones y casos reales', () => {
    window.history.replaceState({}, '', '/servicios/')
    const { container } = render(<App initialPath="/servicios/" />)
    expect(screen.getByRole('heading', { level: 1, name: /Servicios de software a la medida para operar mejor/i })).toBeInTheDocument()
    expect(container.querySelectorAll('.service-story')).toHaveLength(3)
    expect(container.querySelector('.service-ribbon')).not.toBeInTheDocument()
    expect(container.querySelector('.phone-stage')).toBeInTheDocument()
    const nfcImage = screen.getByAltText(/Tarjeta física para solicitar reseñas/i)
    expect(nfcImage).toHaveAttribute('width', '1063')
    expect(nfcImage.parentElement?.querySelector('source[type="image/avif"]')).toHaveAttribute('srcset', expect.stringContaining('google-review-nfc-card-real-320.avif'))
    expect(container.querySelector('.process-motion')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ver el CRM de Fórmula Animal/i })).toHaveAttribute('href', '/proyectos/formula-animal/')
    expect(screen.getByRole('link', { name: /Ver la experiencia web de Nativhaus/i })).toHaveAttribute('href', '/proyectos/native-haus/')
    expect(screen.getByRole('link', { name: /Ver la automatización con Lia/i })).toHaveAttribute('href', '/proyectos/lia/')
  })

  it('publica el contacto real sin inventar otros datos', () => {
    window.history.replaceState({}, '', '/contacto/')
    const { container } = render(<App initialPath="/contacto/" />)
    expect(container.querySelector('.header--dark-hero .brand--light')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /Hablemos de lo que necesitas/i })).toBeInTheDocument()
    expect(screen.getByText('+57 322 896 8494')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Escribir por WhatsApp/i })).toHaveLength(2)
    expect(screen.getAllByRole('link', { name: /Escribir por WhatsApp/i }).every((link) => link.getAttribute('href')?.includes(`wa.me/${SITE.whatsappNumber}`))).toBe(true)
    expect(screen.queryByText(/correo electrónico/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/dirección física/i)).toBeInTheDocument()
  })

  it('explica con precisión la analítica y el contacto externo', () => {
    window.history.replaceState({}, '', '/privacidad/')
    render(<App initialPath="/privacidad/" />)
    expect(screen.getByRole('heading', { level: 1, name: /Política de privacidad/i })).toBeInTheDocument()
    expect(screen.getByText(/Google Analytics 4 y Microsoft Clarity/i)).toBeInTheDocument()
    expect(screen.getByText(/El sitio no tiene formularios/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /página de contacto/i })).toHaveAttribute('href', '/contacto/')
  })

  it('enlaza Contacto y Privacidad desde el footer', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)
    const footer = screen.getByRole('contentinfo')
    expect(footer.querySelector('a[href="/contacto/"]')).toHaveTextContent('Contacto')
    expect(footer.querySelector('a[href="/privacidad/"]')).toHaveTextContent('Privacidad')
  })
})
