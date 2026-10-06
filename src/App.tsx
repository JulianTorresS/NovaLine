import { CSSProperties, MouseEvent as ReactMouseEvent, MouseEventHandler, PointerEvent as ReactPointerEvent, ReactNode, TransitionEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NAV_ITEMS, PHONE_DEMOS, PROCESS, PROJECTS, SERVICES, SITE, TEAM_MEMBERS, whatsappUrl } from './config'
import { CASE_ROUTES, normalizePathname, PUBLIC_ROUTES, resolveRoute } from './routes'
import { applySeoToDocument } from './seo'
import { useGoogleAnalytics } from './analytics'

type IconName = 'arrow' | 'check' | 'chevronLeft' | 'chevronRight' | 'code' | 'layers' | 'menu' | 'pulse' | 'quote' | 'search' | 'x'

type ClarityCommand = ((...args: unknown[]) => void) & { q?: unknown[][] }

function useClarityTracking() {
  useEffect(() => {
    if (!['novalinesoftware.com', 'www.novalinesoftware.com'].includes(window.location.hostname)) return

    const clarityWindow = window as typeof window & { clarity?: ClarityCommand }
    const source = 'https://www.clarity.ms/tag/yje8n0pthh'
    if (clarityWindow.clarity || document.querySelector(`script[src="${source}"]`)) return

    const clarity: ClarityCommand = (...args) => {
      (clarity.q ??= []).push(args)
    }
    clarityWindow.clarity = clarity

    const loadScript = () => {
      if (document.querySelector(`script[src="${source}"]`)) return
      const script = document.createElement('script')
      script.async = true
      script.src = source
      document.head.appendChild(script)
    }
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
      cancelIdleCallback?: (handle: number) => void
    }
    const idleHandle = idleWindow.requestIdleCallback?.(loadScript, { timeout: 2500 })
    const timer = idleHandle === undefined ? window.setTimeout(loadScript, 1800) : undefined
    return () => {
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle)
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [])
}

function useSystemPause<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    let offscreen = false
    const update = () => setPaused(Boolean(media?.matches || document.hidden || offscreen))
    const observer = new IntersectionObserver(([entry]) => { offscreen = !entry.isIntersecting; update() }, { threshold: .05 })
    if (ref.current) observer.observe(ref.current)
    media?.addEventListener('change', update)
    document.addEventListener('visibilitychange', update)
    update()
    return () => {
      observer.disconnect()
      media?.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])
  return { ref, paused }
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevronLeft: <path d="m15 18-6-6 6-6"/>,
    chevronRight: <path d="m9 18 6-6-6-6"/>,
    code: <><path d="m8 9-3 3 3 3"/><path d="m16 9 3 3-3 3"/><path d="m14 5-4 14"/></>,
    layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></>,
    menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    pulse: <><path d="M3 12h4l2.2-5 4.1 10 2.2-5H21"/><circle cx="12" cy="12" r="10"/></>,
    quote: <><path d="M10 11H5a4 4 0 0 0 4 4v2a6 6 0 0 1-6-6V6h7v5Z"/><path d="M21 11h-5a4 4 0 0 0 4 4v2a6 6 0 0 1-6-6V6h7v5Z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    x: <><path d="m6 6 12 12"/><path d="M18 6 6 18"/></>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2a9.84 9.84 0 0 0-8.45 14.88L2 22l5.25-1.54A9.86 9.86 0 1 0 12.04 2Zm0 17.93a8.02 8.02 0 0 1-4.09-1.12l-.29-.17-3.12.92.94-3.04-.19-.31a8.04 8.04 0 1 1 6.75 3.72Zm4.41-6.02c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/>
    </svg>
  )
}

function BrandGlyph() {
  return (
    <svg className="brand__glyph" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M7.5 17.5 12 6.5 15.4 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.5 17.5h4M15.4 14h5.1" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="3.5" cy="17.5" r="2.15" fill="#39e6e8"/>
      <circle cx="20.5" cy="14" r="2.15" fill="#39e6e8"/>
    </svg>
  )
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <a className={`brand ${light ? 'brand--light' : ''}`} href="/" aria-label="NovaLine, ir al inicio">
      <span className="brand__mark"><BrandGlyph /></span>
      <span>NovaLine</span>
    </a>
  )
}

function Header({ aboutMode = false, darkHero = false, onAboutBrandChange }: { aboutMode?: boolean; darkHero?: boolean; onAboutBrandChange?: (visible: boolean) => void }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [aboutBrandVisible, setAboutBrandVisible] = useState(!aboutMode)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > (aboutMode ? 4 : 18))
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [aboutMode])

  useEffect(() => {
    if (!aboutMode) return
    const logo = document.getElementById('about-hero-logo')
    if (!logo) return
    const observer = new IntersectionObserver(([entry]) => {
      const visible = !entry.isIntersecting
      setAboutBrandVisible(visible)
      onAboutBrandChange?.(visible)
    }, { rootMargin: '-82px 0px 0px' })
    observer.observe(logo)
    return () => observer.disconnect()
  }, [aboutMode, onAboutBrandChange])

  useEffect(() => {
    const currentPath = normalizePathname(window.location.pathname)
    const currentPage = NAV_ITEMS.find((item) => {
      const destination = new URL(item.href, window.location.origin)
      return !destination.hash && normalizePathname(destination.pathname) === currentPath
    })

    if (currentPath !== '/') {
      setActive(currentPage?.sectionId ?? '')
      return
    }

    const itemsBySection = new Map(NAV_ITEMS.map((item) => [item.sectionId, item]))
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.sectionId)).filter(Boolean) as Element[]
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const item = itemsBySection.get(entry.target.id)
        if (!item) return
        const destination = new URL(item.href, window.location.origin)
        const isHomeSection = item.sectionId === 'inicio' || (Boolean(destination.hash) && normalizePathname(destination.pathname) === currentPath)
        setActive(isHomeSection ? item.sectionId : '')
      }),
      { rootMargin: '-35% 0px -55% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const onNavClick = (event: ReactMouseEvent<HTMLAnchorElement>, item: typeof NAV_ITEMS[number]) => {
    setOpen(false)
    const destination = new URL(item.href, window.location.origin)
    const samePageAnchor = Boolean(destination.hash) && normalizePathname(destination.pathname) === normalizePathname(window.location.pathname)
    if (!samePageAnchor) return

    const section = document.getElementById(item.sectionId)
    if (!section) return

    event.preventDefault()
    window.history.pushState({}, '', `${window.location.pathname}${window.location.search}${destination.hash}`)
    section.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className={`header ${aboutMode ? 'header--about' : ''} ${darkHero && !scrolled ? 'header--dark-hero' : ''} ${scrolled ? 'header--scrolled' : ''} ${aboutMode && !aboutBrandVisible ? 'header--about-open' : ''} ${aboutMode && aboutBrandVisible ? 'header--brand-arrived' : ''}`}>
      <div className="header__inner shell">
        <div className="header__brand-slot"><Brand light={darkHero && !scrolled} /></div>
        <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => {
            const independentPage = !item.href.includes('#') && item.sectionId !== 'inicio'
            return <a key={item.href} className={`${active === item.sectionId ? 'is-active' : ''} ${independentPage ? 'nav__page-link' : ''}`.trim()} href={item.href} onClick={(event) => onNavClick(event, item)}>{item.label}</a>
          })}
          <a className="button button--small nav__mobile-cta" href={whatsappUrl()} target="_blank" rel="noreferrer" data-analytics-cta="quote_project"><WhatsAppIcon /> Cotizar proyecto</a>
        </nav>
        <a className="button button--small header__cta" href={whatsappUrl()} target="_blank" rel="noreferrer" data-analytics-cta="quote_project">Cotizar proyecto <Icon name="arrow" /></a>
        <button className="menu-button" type="button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <Icon name={open ? 'x' : 'menu'} size={23} />
        </button>
      </div>
    </header>
  )
}

function DashboardScreen({ demoIndex, compact = false }: { demoIndex: number; compact?: boolean }) {
  const demo = PHONE_DEMOS[demoIndex % PHONE_DEMOS.length]
  return (
    <div className={`phone-ui ${compact ? 'phone-ui--compact' : ''}`} key={`${demo.name}-${compact}`}>
      <div className="phone-ui__top"><span>9:41</span><span className="phone-ui__signals">● ᯤ</span></div>
      <div className="phone-ui__hello">Hola, equipo</div>
      <div className="phone-ui__title-row"><strong>{demo.kicker}</strong><span>•••</span></div>
      <div className="phone-ui__feature">
        <span>{demo.label}</span><strong>{demo.metric}</strong>
        <div className="mini-chart"><i/><i/><i/><i/><i/><i/></div>
      </div>
      <div className="phone-ui__summary">
        <span><small>{demo.secondary}</small><strong>{demo.value}</strong></span>
        <span className="phone-ui__ring"><b>{demo.value}</b></span>
      </div>
      <div className="phone-ui__rows"><i/><i/><i/></div>
      <div className="phone-ui__dock">
        {PHONE_DEMOS.map((item, itemIndex) => <span key={item.name} className={itemIndex === demoIndex % PHONE_DEMOS.length ? 'is-active' : ''}/>) }
      </div>
    </div>
  )
}

function Phone({ side, demoIndex }: { side: 'left' | 'right'; demoIndex: number }) {
  return (
    <div className={`phone phone--${side}`} aria-hidden="true">
      <span className="phone__button phone__button--one"/><span className="phone__button phone__button--two"/>
      <div className="phone__screen">
        <span className="phone__island"/>
        <DashboardScreen demoIndex={demoIndex} compact={side === 'right'} />
        <span className="phone__glass"/>
      </div>
    </div>
  )
}

function PhoneStage({ demoIndex }: { demoIndex: number }) {
  return (
    <div className="phone-stage">
      <div className="phone-stage__halo"/>
      <Phone side="left" demoIndex={demoIndex} />
      <Phone side="right" demoIndex={demoIndex + 1} />
    </div>
  )
}

function NfcStage({ active }: { active: boolean }) {
  return (
    <div className="nfc-stage">
      <div className="nfc-photo-card">
        {active && (
          <picture>
            <source type="image/avif" srcSet="/assets/responsive/google-review-nfc-card-real-320.avif 320w, /assets/responsive/google-review-nfc-card-real-640.avif 640w, /assets/responsive/google-review-nfc-card-real-1063.avif 1063w" sizes="(max-width: 650px) 278px, 390px" />
            <source type="image/webp" srcSet="/assets/responsive/google-review-nfc-card-real-320.webp 320w, /assets/responsive/google-review-nfc-card-real-640.webp 640w, /assets/responsive/google-review-nfc-card-real-1063.webp 1063w" sizes="(max-width: 650px) 278px, 390px" />
            <img
              src="/assets/google-review-nfc-card-real.png"
              alt="Tarjeta física para solicitar reseñas de Google mediante NFC"
              width="1063"
              height="1094"
              loading="lazy"
              decoding="async"
              draggable="false"
            />
          </picture>
        )}
        <div className="nfc-radar" aria-hidden="true"><i/><i/><i/></div>
      </div>
    </div>
  )
}

const PROCESS_ACTORS = [
  { name: 'Laura', fullName: 'Laura Méndez', from: 7, to: 8, goal: 10, order: '#0129', tone: 'blue' },
  { name: 'Andrés', fullName: 'Andrés Rojas', from: 4, to: 5, goal: 10, order: '#0130', tone: 'cyan' },
  { name: 'Camila', fullName: 'Camila Torres', from: 9, to: 10, goal: 10, order: '#0131', tone: 'violet' },
  { name: 'Felipe', fullName: 'Felipe Gómez', from: 5, to: 6, goal: 10, order: '#0132', tone: 'teal' },
]

function ProcessAnimationStage({ active, paused }: { active: boolean; paused: boolean }) {
  const [cycle, setCycle] = useState(0)
  const [actorIndex, setActorIndex] = useState(0)
  const [received, setReceived] = useState(true)
  const actor = PROCESS_ACTORS[actorIndex]
  const progressFrom = Math.round((actor.from / actor.goal) * 100)
  const progressTo = Math.round((actor.to / actor.goal) * 100)

  useEffect(() => {
    if (!active || paused) return
    setReceived(false)
    const arrivalTimer = window.setTimeout(() => setReceived(true), 2600)
    const repeatTimer = window.setTimeout(() => {
      setReceived(false)
      setCycle((value) => value + 1)
      setActorIndex((value) => (value + 1) % PROCESS_ACTORS.length)
    }, 3900)
    return () => {
      window.clearTimeout(arrivalTimer)
      window.clearTimeout(repeatTimer)
    }
  }, [active, paused, cycle])

  return (
    <div className="process-showcase">
      <div className="process-showcase__copy">
        <h3>Procesos en movimiento.</h3>
        <a className="text-link process-showcase__case-link" href={SERVICES[2].caseHref} aria-label={SERVICES[2].caseLabel}>Ver caso real <span className="text-link__arrow" aria-hidden="true">→</span></a>
      </div>

      <div className={`process-motion process-motion--${actor.tone} ${received ? 'is-received' : ''}`} key={cycle} aria-label={`Animación de un pedido de ${actor.name} que actualiza el avance de su proceso`} style={{ '--progress-from': `${progressFrom}%`, '--progress-to': `${progressTo}%` } as CSSProperties}>
        <div className="process-motion__glow" aria-hidden="true"/>
        <span className="process-actor-float">{actor.fullName}</span>
        <div className="process-event">
          <span className="process-envelope process-envelope--static" aria-hidden="true"><i/></span>
          <div><strong>Pedido {actor.order}</strong></div>
          <span>Listo</span>
        </div>

        <div className="process-route" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 0 8 C 65 8, 84 10, 100 92"/>
          </svg>
        </div>
        <span className="process-envelope process-envelope--flight" aria-hidden="true"><i/></span>

        <div className="process-result">
          <div className="process-result__top">
            <div><small>Avance del proceso</small><strong>Pedidos integrados</strong></div>
            <span className="process-result__status"><Icon name="check" size={14}/> Actualizado</span>
          </div>
          <div className={`process-total ${received ? 'is-updated' : ''}`} aria-live="polite"><span>{actor.from}</span><span>{actor.to}</span></div>
          <div className="process-bar"><i/></div>
          <div className="process-bar__labels"><span>{received ? progressTo : progressFrom}% completado</span><span>Meta: {actor.goal} pedidos</span></div>
        </div>

        <div className="process-capabilities" aria-hidden="true"><span>Pedidos</span><span>Inventario</span><span>Documentos</span><span>Entregas</span></div>
      </div>
    </div>
  )
}

const HERO_VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4'

const SERVICE_RIBBON = [
  { name: 'Software a medida', description: 'Plataformas creadas alrededor de tus procesos, roles y objetivos de negocio.', message: 'Hola, quiero conversar sobre software a la medida para mi empresa.' },
  { name: 'CRM empresariales', description: 'Centralizamos clientes, seguimientos, ventas y decisiones en una operación conectada.', message: 'Hola, quiero conversar sobre un CRM empresarial para mi equipo.' },
  { name: 'Aplicaciones web', description: 'Creamos aplicaciones claras, seguras y listas para crecer con tu empresa.', message: 'Hola, quiero conversar sobre el desarrollo de una aplicación web.' },
  { name: 'Automatización', description: 'Conectamos tareas y datos para reducir trabajo manual y errores repetitivos.', message: 'Hola, quiero automatizar procesos de mi empresa.' },
  { name: 'SEO local', description: 'Mejoramos tu presencia en búsquedas locales para acercarte a clientes de tu zona.', message: 'Hola, quiero mejorar el SEO local de mi negocio.' },
  { name: 'Reseñas con NFC', description: 'Facilitamos que una buena experiencia se convierta en una reseña con un solo gesto.', message: 'Hola, quiero implementar tarjetas NFC para conseguir más reseñas.' },
  { name: 'Procesos animados', description: 'Convertimos flujos complejos en experiencias visuales fáciles de explicar y seguir.', message: 'Hola, quiero visualizar un proceso con una experiencia animada.' },
  { name: 'Soporte y evolución', description: 'Acompañamos el producto después del lanzamiento para mantenerlo y hacerlo evolucionar.', message: 'Hola, quiero conversar sobre soporte y evolución de software.' },
]
const SERVICE_RIBBON_COPIES = 3
const SERVICE_RIBBON_CENTER_COPY = Math.floor(SERVICE_RIBBON_COPIES / 2)

function ServiceRibbonIcon({ index }: { index: number }) {
  const paths: ReactNode[] = [
    <><path d="m8 9-3 3 3 3"/><path d="m16 9 3 3-3 3"/><path d="m14 5-4 14"/></>,
    <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2"/><path d="M3.5 19c.4-3.2 2.2-5 5.5-5s5.1 1.8 5.5 5"/><path d="M14.5 15c2.9-.7 5.2.6 6 3.5"/></>,
    <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9S14.5 18.4 12 21c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z"/></>,
    <><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/><path d="M10 7h3a4 4 0 0 1 4 4v3M14 17h-3a4 4 0 0 1-4-4v-3"/></>,
    <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.2 4.2"/><path d="M7.5 11.5 10 14l4.5-5"/></>,
    <><path d="M6 8a6 6 0 0 1 0 8M10 5a10 10 0 0 1 0 14M14 2a14 14 0 0 1 0 20"/><circle cx="3" cy="12" r="1"/></>,
    <><path d="M3 12h4l2.2-5 4.1 10 2.2-5H21"/><circle cx="12" cy="12" r="10"/></>,
    <><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="5"/><path d="m5.6 5.6 2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/></>,
  ]
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[index]}</svg>
}

function normalizeServiceRibbonOffset(offset: number, groupWidth: number) {
  if (!groupWidth) return offset

  let nextOffset = offset
  while (nextOffset > -groupWidth) nextOffset -= groupWidth
  while (nextOffset <= -groupWidth * 2) nextOffset += groupWidth
  return nextOffset
}

function HeroBackground({ paused }: { paused: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const glyphRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (navigator.userAgent.includes('jsdom')) return
    if (paused) {
      video.pause()
    } else {
      void video.play().catch(() => undefined)
    }
  }, [paused])

  useEffect(() => {
    const stage = stageRef.current
    const video = videoRef.current
    const glyph = glyphRef.current
    if (!stage || !video || !glyph || navigator.userAgent.includes('jsdom')) return

    const positionValue = (value: string | undefined, fallback: number) => {
      if (!value) return fallback
      if (value.endsWith('%')) return Number.parseFloat(value) / 100
      if (value === 'left' || value === 'top') return 0
      if (value === 'right' || value === 'bottom') return 1
      return .5
    }
    const syncGlyph = () => {
      const stageRect = stage.getBoundingClientRect()
      const videoRect = video.getBoundingClientRect()
      if (!stageRect.width || !stageRect.height || !videoRect.width || !videoRect.height) return

      const sourceWidth = video.videoWidth || 1600
      const sourceHeight = video.videoHeight || 900
      const objectFit = getComputedStyle(video).objectFit
      const scale = objectFit === 'contain'
        ? Math.min(videoRect.width / sourceWidth, videoRect.height / sourceHeight)
        : Math.max(videoRect.width / sourceWidth, videoRect.height / sourceHeight)
      const renderedWidth = sourceWidth * scale
      const renderedHeight = sourceHeight * scale
      const [rawX, rawY] = getComputedStyle(video).objectPosition.split(/\s+/)
      const objectX = positionValue(rawX, .5)
      const objectY = positionValue(rawY, .5)
      const contentLeft = videoRect.left - stageRect.left + (videoRect.width - renderedWidth) * objectX
      const contentTop = videoRect.top - stageRect.top + (videoRect.height - renderedHeight) * objectY

      glyph.style.left = `${contentLeft + renderedWidth * .657}px`
      glyph.style.top = `${contentTop + renderedHeight * .541}px`
      glyph.style.width = `${renderedWidth * .088}px`
    }

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(syncGlyph)
    observer?.observe(stage)
    observer?.observe(video)
    video.addEventListener('loadedmetadata', syncGlyph)
    window.addEventListener('resize', syncGlyph)
    const frame = window.requestAnimationFrame(syncGlyph)

    return () => {
      observer?.disconnect()
      video.removeEventListener('loadedmetadata', syncGlyph)
      window.removeEventListener('resize', syncGlyph)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={stageRef} className="hero-background" aria-hidden="true">
      <video ref={videoRef} className="hero-background__video" src={HERO_VIDEO_URL} autoPlay muted loop playsInline preload="auto" aria-hidden="true" suppressHydrationWarning/>
      <span ref={glyphRef} className="hero-background__glyph"><BrandGlyph /></span>
    </div>
  )
}

function ServiceRibbon({ paused }: { paused: boolean }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [interacting, setInteracting] = useState(false)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const firstGroupRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const positionedRef = useRef(false)
  const dragRef = useRef<{ pointerId: number; startX: number; startOffset: number; lastX: number; lastTime: number; velocity: number; moved: boolean } | null>(null)
  const suppressClickRef = useRef(false)
  const clickResetRef = useRef<number | null>(null)
  const wheelEndRef = useRef<number | null>(null)
  const momentumFrameRef = useRef<number | null>(null)
  const activeService = selected === null ? null : SERVICE_RIBBON[selected]

  const applyOffset = useCallback((offset: number, measuredWidth?: number) => {
    const track = trackRef.current
    const groupWidth = measuredWidth ?? firstGroupRef.current?.getBoundingClientRect().width ?? 0
    if (!track || !groupWidth) return

    const nextOffset = normalizeServiceRibbonOffset(offset, groupWidth)
    offsetRef.current = nextOffset
    positionedRef.current = true
    track.style.transform = `translate3d(${nextOffset.toFixed(3)}px, 0, 0)`
  }, [])

  const stopMomentum = useCallback(() => {
    if (momentumFrameRef.current === null) return
    window.cancelAnimationFrame(momentumFrameRef.current)
    momentumFrameRef.current = null
  }, [])

  useEffect(() => {
    const group = firstGroupRef.current
    if (!group) return

    const positionInCenter = () => {
      const groupWidth = group.getBoundingClientRect().width
      if (groupWidth) applyOffset(-groupWidth, groupWidth)
    }
    const frame = window.requestAnimationFrame(positionInCenter)
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(positionInCenter)
    observer?.observe(group)

    return () => {
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [applyOffset])

  useEffect(() => () => {
    stopMomentum()
    if (clickResetRef.current !== null) window.clearTimeout(clickResetRef.current)
    if (wheelEndRef.current !== null) window.clearTimeout(wheelEndRef.current)
  }, [stopMomentum])

  useEffect(() => {
    const marquee = marqueeRef.current
    if (!marquee) return

    const handleWheel = (event: WheelEvent) => {
      const shiftedDelta = event.shiftKey && Math.abs(event.deltaX) < 1 ? event.deltaY : event.deltaX
      if (Math.abs(shiftedDelta) < 1 || (!event.shiftKey && Math.abs(shiftedDelta) < Math.abs(event.deltaY) * .75)) return

      event.preventDefault()
      stopMomentum()
      const groupWidth = firstGroupRef.current?.getBoundingClientRect().width ?? 0
      if (!positionedRef.current && groupWidth) applyOffset(-groupWidth, groupWidth)
      applyOffset(offsetRef.current - shiftedDelta, groupWidth || undefined)
      setInteracting(true)

      if (wheelEndRef.current !== null) window.clearTimeout(wheelEndRef.current)
      wheelEndRef.current = window.setTimeout(() => {
        wheelEndRef.current = null
        setInteracting(false)
      }, 140)
    }

    marquee.addEventListener('wheel', handleWheel, { passive: false })
    return () => marquee.removeEventListener('wheel', handleWheel)
  }, [applyOffset, stopMomentum])

  useEffect(() => {
    const marquee = marqueeRef.current
    if (!marquee || paused || selected !== null || interacting || navigator.userAgent.includes('jsdom')) return

    let frame = 0
    let previousTime = performance.now()
    const move = (time: number) => {
      const elapsed = Math.min(time - previousTime, 64)
      previousTime = time

      const groupWidth = firstGroupRef.current?.getBoundingClientRect().width ?? 0
      if (groupWidth) {
        applyOffset(offsetRef.current - groupWidth * elapsed / 42000, groupWidth)
      }

      frame = window.requestAnimationFrame(move)
    }

    frame = window.requestAnimationFrame(move)
    return () => window.cancelAnimationFrame(frame)
  }, [applyOffset, interacting, paused, selected])

  useEffect(() => {
    if (selected === null) return

    const dismiss = () => setSelected(null)
    const timeout = window.setTimeout(dismiss, 10000)
    window.addEventListener('scroll', dismiss, { passive: true })

    return () => {
      window.clearTimeout(timeout)
      window.removeEventListener('scroll', dismiss)
    }
  }, [selected])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    stopMomentum()
    if (clickResetRef.current !== null) window.clearTimeout(clickResetRef.current)
    const groupWidth = firstGroupRef.current?.getBoundingClientRect().width ?? 0
    if (!positionedRef.current && groupWidth) applyOffset(-groupWidth, groupWidth)
    const now = performance.now()
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startOffset: offsetRef.current, lastX: event.clientX, lastTime: now, velocity: 0, moved: false }
    setInteracting(true)
  }
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const distance = event.clientX - drag.startX
    if (Math.abs(distance) > 5 && !drag.moved) {
      drag.moved = true
      event.currentTarget.setPointerCapture?.(event.pointerId)
    }
    if (!drag.moved) return

    const now = performance.now()
    const elapsed = Math.max(now - drag.lastTime, 1)
    const instantaneousVelocity = (event.clientX - drag.lastX) / elapsed
    drag.velocity = drag.velocity * .65 + instantaneousVelocity * .35
    drag.lastX = event.clientX
    drag.lastTime = now
    applyOffset(drag.startOffset + distance)
  }
  const finishInteraction = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    suppressClickRef.current = drag.moved
    dragRef.current = null
    event.currentTarget.releasePointerCapture?.(event.pointerId)

    if (drag.moved) {
      clickResetRef.current = window.setTimeout(() => {
        suppressClickRef.current = false
        clickResetRef.current = null
      }, 80)
    }

    let velocity = Math.max(-2.4, Math.min(2.4, drag.velocity))
    if (!drag.moved || Math.abs(velocity) < .02) {
      setInteracting(false)
      return
    }

    let previousTime: number | null = null
    let momentumDuration = 0
    const continueMomentum = (time: number) => {
      const elapsed = previousTime === null ? 16.67 : Math.min(Math.max(time - previousTime, 1), 34)
      previousTime = time
      momentumDuration += elapsed
      applyOffset(offsetRef.current + velocity * elapsed)
      velocity *= Math.pow(.91, elapsed / 16.67)

      if (Math.abs(velocity) < .02 || momentumDuration >= 900) {
        momentumFrameRef.current = null
        setInteracting(false)
        return
      }
      momentumFrameRef.current = window.requestAnimationFrame(continueMomentum)
    }
    momentumFrameRef.current = window.requestAnimationFrame(continueMomentum)
  }
  const onMarqueeClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return
    suppressClickRef.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <section className={`service-ribbon ${paused ? 'is-paused' : ''} ${selected !== null ? 'has-detail' : ''} ${interacting ? 'is-interacting' : ''}`} aria-label="Servicios destacados de NovaLine">
      <h2 className="sr-only">Servicios de NovaLine</h2>
      <div ref={marqueeRef} className="service-ribbon__marquee" aria-label="Desliza para explorar los servicios" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={finishInteraction} onPointerCancel={finishInteraction} onClickCapture={onMarqueeClick}>
        <div ref={trackRef} className="service-ribbon__track">
          {Array.from({ length: SERVICE_RIBBON_COPIES }, (_, copy) => (
            <div ref={copy === 0 ? firstGroupRef : undefined} className="service-ribbon__group" aria-hidden={copy !== SERVICE_RIBBON_CENTER_COPY} key={copy}>
              {SERVICE_RIBBON.map((service, index) => (
                <button className={selected === index ? 'is-active' : ''} type="button" onClick={() => setSelected((current) => current === index ? null : index)} tabIndex={copy === SERVICE_RIBBON_CENTER_COPY ? 0 : -1} aria-expanded={copy === SERVICE_RIBBON_CENTER_COPY ? selected === index : undefined} key={`${copy}-${service.name}`}>
                  <ServiceRibbonIcon index={index}/><span>{service.name}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      {activeService && (
        <div className="service-ribbon__detail" aria-live="polite">
          <div><strong>{activeService.name}</strong><span>{activeService.description}</span></div>
          <a href={whatsappUrl(activeService.message)} target="_blank" rel="noreferrer" data-analytics-cta={`service_ribbon_${selected}`}>Consultar por WhatsApp <WhatsAppIcon size={18}/></a>
        </div>
      )}
    </section>
  )
}

function Hero() {
  const [manuallyPaused, setManuallyPaused] = useState(false)
  const systemPause = useSystemPause<HTMLElement>()
  const animationsPaused = manuallyPaused || systemPause.paused

  return (
    <>
      <section ref={systemPause.ref} id="inicio" className="hero hero--reference">
        <HeroBackground paused={animationsPaused}/>
        <div className="shell hero-reference__content">
          <div className="hero-copy hero-reference__copy">
            <span className="hero-reference__eyebrow">Software a la medida para empresas</span>
            <h1>Software a la medida que entiende cómo funciona tu empresa.</h1>
            <p>Desarrollamos software a la medida para empresas en Colombia: aplicaciones web y sistemas que ordenan la operación, automatizan procesos y facilitan el crecimiento.</p>
            <div className="hero-copy__actions">
              <a className="button" href={whatsappUrl()} target="_blank" rel="noreferrer" data-analytics-cta="discuss_project">Cuéntanos qué necesitas <Icon name="arrow"/></a>
              <a className="text-link" href="/#proyectos">Ver proyectos <span className="text-link__arrow" aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-proof"><span><Icon name="check"/> Alcance claro</span><span><Icon name="check"/> Entregas por etapas</span><span><Icon name="check"/> Soporte cercano</span></div>
          </div>
          <button className="hero-motion-toggle" type="button" aria-pressed={manuallyPaused} aria-label={manuallyPaused ? 'Reanudar animaciones' : 'Pausar animaciones'} title={manuallyPaused ? 'Reanudar animaciones' : 'Pausar animaciones'} onClick={() => setManuallyPaused((value) => !value)}>
            {manuallyPaused ? <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 7 8 5-8 5V7Z"/></svg> : <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M8 7v10M16 7v10"/></svg>}
            <span className="sr-only">{manuallyPaused ? 'Reanudar animaciones' : 'Pausar animaciones'}</span>
          </button>
        </div>
      </section>
      <ServiceRibbon paused={manuallyPaused || systemPause.paused}/>
    </>
  )
}

function SectionIntro({ marker, title, text }: { marker: string; title: string; text?: string }) {
  return <div className="section-intro"><span>{marker}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>
}

function ProcessSection() {
  return (
    <section id="proceso" className="section process-section">
      <div className="shell">
        <SectionIntro marker="Nuestro proceso" title="Cuatro decisiones claras antes de cada entrega." text="Sabes qué estamos construyendo, por qué y qué sigue. Sin cajas negras ni sorpresas al final." />
        <div className="process-list">
          {PROCESS.map((step, index) => <article className="process-card" key={step.number}><span className="process-card__number">{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div>{index < PROCESS.length - 1 && <span className="process-card__connector" aria-hidden="true"/>}</article>)}
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section id="servicios" className="section services-section" aria-label="Servicios de desarrollo de NovaLine">
      <div className="shell">
        <SectionIntro marker="Lo que hacemos" title="Tecnología útil, diseñada alrededor del trabajo real." />
        <div className="services-grid">
          {SERVICES.map((service, index) => (
            <article className={`service-card service-card--${index + 1}`} key={service.title}>
              <div className="service-card__icon"><Icon name={service.icon as IconName} size={25}/></div>
              <span className="service-card__index">0{index + 1}</span>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              <div className="service-card__links">
                <a href={whatsappUrl(`Hola, ${service.link.toLowerCase()}.`)} target="_blank" rel="noreferrer">{service.link} <Icon name="arrow"/></a>
              </div>
            </article>
          ))}
        </div>
        <a className="section-link" href="/servicios/">Conocer nuestros servicios de desarrollo <Icon name="arrow"/></a>
      </div>
    </section>
  )
}

function AboutPage() {
  const [brandDocked, setBrandDocked] = useState(false)
  const [methodVisible, setMethodVisible] = useState(false)
  const methodRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    const method = methodRef.current
    if (!method) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setMethodVisible(true)
        observer.disconnect()
      }
    }, { threshold: .18 })
    observer.observe(method)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="about-page">
      <Header aboutMode onAboutBrandChange={setBrandDocked} />
      <main id="nosotros">
        <section className="about-hero">
          <div className="shell about-manifesto">
            <div id="about-hero-logo" className="about-manifesto__logo-anchor">
              <div className={`about-manifesto__mark ${brandDocked ? 'is-docked' : 'is-home'}`}><BrandGlyph /></div>
            </div>
            <div>
              <span className="about-eyebrow">Somos NovaLine</span>
              <h1>Tecnología clara para negocios que quieren avanzar.</h1>
              <p>Somos un equipo de desarrollo de software que diseña soluciones adaptadas a las personas, los procesos y las decisiones de cada empresa.</p>
            </div>
          </div>
        </section>

        <section className="about-story-section">
          <div className="shell">
            <div className="about-story__heading"><span className="about-eyebrow">Nuestra manera de crear</span><h2>Primero entendemos. Después diseñamos. Finalmente construimos.</h2><p>NovaLine acerca la tecnología a empresas que necesitan soluciones propias, sin procesos confusos ni herramientas que obliguen al equipo a cambiar su forma de trabajar. <a href="/#proyectos">Conoce los proyectos que hemos construido.</a></p></div>
            <div ref={methodRef} className={`about-method ${methodVisible ? 'is-visible' : ''}`}>
              <article><span>01</span><h3>Entender</h3><p>Escuchamos el contexto, las personas y el problema antes de proponer tecnología.</p></article>
              <article><span>02</span><h3>Diseñar</h3><p>Convertimos lo aprendido en flujos claros y experiencias fáciles de validar.</p></article>
              <article><span>03</span><h3>Construir</h3><p>Desarrollamos por etapas y acompañamos la evolución después de publicar.</p></article>
            </div>
          </div>
        </section>

        <section className="about-purpose-section">
          <div className="shell about-direction">
            <article><span>01 · Misión</span><h3>Convertir procesos complejos en herramientas simples de usar.</h3><p>Creamos software a la medida y experiencias digitales que ordenan la operación, reducen fricción y generan resultados visibles.</p></article>
            <article><span>02 · Visión</span><h3>Ser el aliado tecnológico que crece junto a cada empresa.</h3><p>Queremos construir relaciones de largo plazo, con soluciones que evolucionen al ritmo del negocio y mantengan siempre su claridad.</p></article>
          </div>
        </section>

        <section className="about-team-section">
          <div className="shell about-team">
            <div className="about-team__heading">
              <div><span className="about-eyebrow">Las personas detrás del trabajo</span><h2>Conoce al equipo</h2></div>
              <p>Un espacio cercano para saber quién piensa, diseña y construye cada solución.</p>
            </div>
            <div className="team-grid">
              {TEAM_MEMBERS.map((member) => (
                <article className="team-card" key={member.name}>
                  <div className="team-card__portrait">
                    <picture>
                      <source type="image/avif" srcSet={`/assets/team/responsive/${member.photoStem}-320.avif 320w, /assets/team/responsive/${member.photoStem}-640.avif 640w`} sizes="(max-width: 650px) calc(100vw - 28px), 300px" />
                      <source type="image/webp" srcSet={`/assets/team/responsive/${member.photoStem}-320.webp 320w, /assets/team/responsive/${member.photoStem}-640.webp 640w`} sizes="(max-width: 650px) calc(100vw - 28px), 300px" />
                      <img src={member.photo} alt={`${member.name}, ${member.role}`} width="1254" height="1254" loading="lazy" decoding="async" />
                    </picture>
                  </div>
                  <div className="team-card__copy"><span>{member.specialty}</span><h3>{member.name}</h3><strong>{member.role}</strong><p>{member.bio}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <ContactSection />
      <Footer />
    </div>
  )
}

function ProjectVisual({ project, index }: { project: typeof PROJECTS[number]; index: number }) {
  const cover = (folder: string) => (
    <picture>
      <source type="image/avif" srcSet={`/assets/${folder}/responsive/cover-384.avif 384w, /assets/${folder}/responsive/cover-744.avif 744w`} sizes="(max-width: 650px) calc(100vw - 48px), 377px" />
      <source type="image/webp" srcSet={`/assets/${folder}/responsive/cover-384.webp 384w, /assets/${folder}/responsive/cover-744.webp 744w`} sizes="(max-width: 650px) calc(100vw - 48px), 377px" />
      <img src={`/assets/${folder}/cover.png`} alt="" width="744" height="378" loading="lazy" decoding="async" />
    </picture>
  )
  if (project.caseStudy === 'lia') {
    return (
      <div className="project-visual project-visual--lia" aria-hidden="true">
        <div className="project-real-window project-real-window--lia">
          <div className="project-real-window__bar"><i/><i/><i/><span>lia.enterprise.ai</span></div>
          <div className="project-real-crop project-real-crop--lia">{cover('lia')}</div>
        </div>
      </div>
    )
  }
  if (project.caseStudy === 'nexus-pos') {
    return (
      <div className="project-visual project-visual--nexus" aria-hidden="true">
        <div className="project-real-window project-real-window--nexus">
          <div className="project-real-window__bar"><i/><i/><i/><span>app.nexuspos.co</span></div>
          <div className="project-real-crop project-real-crop--nexus">{cover('nexus-pos')}</div>
        </div>
      </div>
    )
  }
  if (project.caseStudy === 'formula-animal') {
    return (
      <div className="project-visual project-visual--real" aria-hidden="true">
        <div className="project-real-window">
          <div className="project-real-window__bar"><i/><i/><i/><span>crm.formulaanimal.com</span></div>
          <div className="project-real-crop">{cover('crm-formula-animal')}</div>
        </div>
      </div>
    )
  }
  if (project.caseStudy === 'native-haus') {
    return (
      <div className="project-visual project-visual--native" aria-hidden="true">
        <div className="project-real-window project-real-window--native">
          <div className="project-real-window__bar"><i/><i/><i/><span>nativehaus.co</span></div>
          <div className="project-real-crop project-real-crop--native">{cover('native-haus')}</div>
        </div>
      </div>
    )
  }
  return (
    <div className={`project-visual project-visual--${project.theme}`} aria-hidden="true">
      <div className="project-browser">
        <div className="project-browser__bar"><i/><i/><i/><span>{project.name.toLowerCase().replace(' ', '')}.app</span></div>
        <div className="project-browser__body">
          <aside><b>N</b><i/><i/><i/><i/></aside>
          <div className="project-browser__main">
            <span className="skeleton skeleton--title"/><span className="skeleton skeleton--short"/>
            <div className="project-browser__tiles"><i/><i/><i/></div>
            {index % 2 === 0 ? <div className="project-chart"><i/><i/><i/><i/><i/><i/><i/></div> : <div className="project-map"><span/><i/><i/><i/></div>}
          </div>
        </div>
      </div>
    </div>
  )
}

type CaseSlug = 'formula-animal' | 'native-haus' | 'nexus-pos' | 'lia'

function ProjectsSection({ onOpenCase }: { onOpenCase: (slug: CaseSlug) => void }) {
  const [visible, setVisible] = useState(3)
  const [position, setPosition] = useState(3)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [paused, setPaused] = useState(false)
  const systemPause = useSystemPause<HTMLElement>()
  const touchStart = useRef<number | null>(null)
  const motionLock = useRef(false)
  const queuedMoves = useRef<number[]>([])
  const projectCount = PROJECTS.length
  const index = ((position - visible) % projectCount + projectCount) % projectCount

  useEffect(() => {
    const update = () => setVisible(window.innerWidth < 700 ? 1 : window.innerWidth < 1050 ? 2 : 3)
    update(); window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  useEffect(() => {
    motionLock.current = false
    queuedMoves.current = []
    setTransitionEnabled(false)
    setPosition(visible)
    const frame = window.requestAnimationFrame(() => setTransitionEnabled(true))
    return () => window.cancelAnimationFrame(frame)
  }, [visible])
  useEffect(() => {
    if (paused || systemPause.paused) return
    const timer = window.setInterval(() => {
      if (motionLock.current) return
      motionLock.current = true
      setTransitionEnabled(true)
      setPosition((value) => value + 1)
    }, SITE.projectInterval)
    return () => window.clearInterval(timer)
  }, [paused, systemPause.paused])
  const continueQueuedMoves = () => {
    const direction = queuedMoves.current.shift()
    if (direction === undefined) {
      motionLock.current = false
      return
    }
    window.requestAnimationFrame(() => {
      setTransitionEnabled(true)
      setPosition((value) => value + direction)
    })
  }
  const next = (direction: number) => {
    const step = direction > 0 ? 1 : -1
    if (motionLock.current) {
      queuedMoves.current.push(step)
      return
    }
    motionLock.current = true
    setTransitionEnabled(true)
    setPosition((value) => value + step)
  }
  const select = (target: number) => {
    if (motionLock.current || visible + target === position) return
    motionLock.current = true
    setTransitionEnabled(true)
    setPosition(visible + target)
  }
  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    let resetPosition: number | null = null
    if (position >= visible + projectCount) resetPosition = visible
    if (position < visible) resetPosition = visible + projectCount - 1
    if (resetPosition === null) {
      continueQueuedMoves()
      return
    }
    setTransitionEnabled(false)
    setPosition(resetPosition)
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      setTransitionEnabled(true)
      continueQueuedMoves()
    }))
  }
  const renderedProjects = useMemo(() => {
    const indexed = PROJECTS.map((project, originalIndex) => ({ project, originalIndex }))
    return [...indexed.slice(-visible), ...indexed, ...indexed.slice(0, visible)]
  }, [visible])
  const cardWidth = useMemo(() => `calc(${100 / visible}% - ${(22 * (visible - 1)) / visible}px)`, [visible])
  const transform = useMemo(() => `translate3d(calc(-${(position * 100) / visible}% - ${(position * 22) / visible}px), 0, 0)`, [position, visible])
  return (
    <section ref={systemPause.ref} id="proyectos" className="section projects-section" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} onTouchStart={(event) => touchStart.current = event.touches[0].clientX} onTouchEnd={(event) => { if (touchStart.current !== null && Math.abs(event.changedTouches[0].clientX - touchStart.current) > 40) next(event.changedTouches[0].clientX < touchStart.current ? 1 : -1); touchStart.current = null }}>
      <div className="shell">
        <div className="projects-heading">
          <SectionIntro marker="Trabajo seleccionado" title="Productos digitales que ya trabajan para negocios reales." text="Casos como Lia, NexusPOS, Fórmula Animal y Nativhaus muestran cómo conectamos operación, experiencia y resultados comerciales." />
          <div className="carousel-buttons"><button type="button" aria-label="Proyectos anteriores" onClick={() => next(-1)}><Icon name="chevronLeft"/></button><button type="button" aria-label="Proyectos siguientes" onClick={() => next(1)}><Icon name="chevronRight"/></button></div>
        </div>
        <div className="projects-viewport">
          <div className={`projects-track ${transitionEnabled ? '' : 'is-resetting'}`} style={{ '--card-width': cardWidth, transform } as CSSProperties} onTransitionEnd={handleTransitionEnd}>
            {renderedProjects.map(({ project, originalIndex }, renderedIndex) => {
              const hiddenClone = renderedIndex < visible || renderedIndex >= visible + projectCount
              return (
                <article className={`project-card ${project.featured ? 'project-card--featured' : ''}`} key={`${project.name}-${renderedIndex}`} aria-hidden={hiddenClone}>
                  <ProjectVisual project={project} index={originalIndex}/>
                  <div className="project-card__content"><div className="project-card__top"><span>{project.category}</span><b>{project.name}</b></div>{hiddenClone ? <div className="project-card__title">{project.title}</div> : <h3>{project.title}</h3>}<div className="project-card__metric"><strong>{project.metric}</strong><span>{project.metricLabel}</span></div><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>{project.featured && <span className="project-card__action">Ver caso {project.name} <Icon name="arrow" size={16}/></span>}</div>
                  {project.caseStudy && (
                    <a className="project-card__open" href={CASE_ROUTES[project.caseStudy as CaseSlug]} tabIndex={hiddenClone ? -1 : 0} aria-label={`Ver caso real de ${project.name}`} onClick={(event) => { event.preventDefault(); onOpenCase(project.caseStudy as CaseSlug) }}/>
                  )}
                </article>
              )
            })}
          </div>
        </div>
        <div className="carousel-status"><div>{PROJECTS.map((project, dot) => <button key={project.name} aria-label={`Ver proyecto ${project.name}`} className={dot === index ? 'is-active' : ''} onClick={() => select(dot)}/>)}</div><span>0{index + 1} / 0{projectCount}</span></div>
      </div>
    </section>
  )
}

const SCREENSHOT_SIZES = {
  hero: '(max-width: 650px) calc(100vw - 30px), (max-width: 900px) calc(100vw - 36px), 635px',
  story: '(max-width: 650px) calc(100vw - 30px), (max-width: 900px) calc(100vw - 36px), 625px',
  viewer: '(max-width: 650px) calc(100vw - 30px), (max-width: 900px) calc(100vw - 36px), 1180px',
  lightbox: '96vw',
} as const

const SCREENSHOT_DIMENSIONS: Record<string, readonly [number, number]> = {
  '/assets/crm-formula-animal/calidad.png': [1902, 902],
  '/assets/crm-formula-animal/crear-pedido.png': [1901, 908],
  '/assets/crm-formula-animal/dashboard.png': [1905, 906],
  '/assets/crm-formula-animal/facturacion.png': [1905, 905],
  '/assets/crm-formula-animal/logistica.png': [1907, 887],
  '/assets/native-haus/catalogo.png': [1895, 867],
  '/assets/native-haus/cotizador.png': [1895, 867],
  '/assets/native-haus/hero.png': [1895, 867],
  '/assets/native-haus/universos.png': [1895, 867],
  '/assets/nexus-pos/caja.png': [1917, 900],
  '/assets/nexus-pos/domicilios.png': [1905, 902],
  '/assets/nexus-pos/inventario.png': [1912, 907],
  '/assets/nexus-pos/modulos.png': [1908, 907],
  '/assets/nexus-pos/pos.png': [1916, 901],
  '/assets/nexus-pos/reportes.png': [1910, 902],
  '/assets/lia/archivados.png': [288, 902],
  '/assets/lia/asistente.png': [1916, 911],
  '/assets/lia/configuracion.png': [1906, 897],
  '/assets/lia/estrategia.png': [1913, 903],
  '/assets/lia/exportados.png': [292, 896],
}

function ProjectScreenshot({ src, alt, sizes, priority = false, onClick }: { src: string; alt: string; sizes: string; priority?: boolean; onClick?: MouseEventHandler<HTMLImageElement> }) {
  const separator = src.lastIndexOf('/')
  const folder = src.slice(0, separator)
  const stem = src.slice(separator + 1).replace(/\.[^.]+$/, '')
  const narrow = src === '/assets/lia/archivados.png' || src === '/assets/lia/exportados.png'
  const smallWidth = narrow ? 384 : 1280
  const largeWidth = narrow ? 768 : 3200
  const srcSet = `${folder}/responsive/${stem}-${smallWidth}.png ${smallWidth}w, ${folder}/responsive/${stem}-${largeWidth}.png ${largeWidth}w`
  const webpSrcSet = `${folder}/responsive/${stem}-${smallWidth}.webp?v=2 ${smallWidth}w, ${folder}/responsive/${stem}-${largeWidth}.webp?v=2 ${largeWidth}w`
  const avifSrcSet = `${folder}/responsive/${stem}-${smallWidth}.avif ${smallWidth}w, ${folder}/responsive/${stem}-${largeWidth}.avif ${largeWidth}w`
  const [width, height] = SCREENSHOT_DIMENSIONS[src]

  return (
    <picture>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img src={src} srcSet={srcSet} sizes={sizes} alt={alt} width={width} height={height} loading={priority ? 'eager' : 'lazy'} decoding={priority ? 'auto' : 'async'} fetchPriority={priority ? 'high' : 'auto'} onClick={onClick} />
    </picture>
  )
}

const CRM_VIEWS = [
  {
    name: 'Pedido',
    src: '/assets/crm-formula-animal/crear-pedido.png',
    title: 'El pedido nace con contexto completo',
    text: 'Cliente, mascota, formulador, medicamento y tipo de entrega quedan relacionados desde el primer paso.',
  },
  {
    name: 'Logística',
    src: '/assets/crm-formula-animal/logistica.png',
    title: 'La operación continúa sin perder el hilo',
    text: 'El equipo filtra, asigna transportadora, actualiza estados y consulta el recorrido de cada entrega.',
  },
  {
    name: 'Calidad',
    src: '/assets/crm-formula-animal/calidad.png',
    title: 'Cada fórmula pasa por control técnico',
    text: 'Las revisiones se organizan por medicamento y estado antes de liberar el pedido a producción.',
  },
  {
    name: 'Facturación',
    src: '/assets/crm-formula-animal/facturacion.png',
    title: 'La facturación conserva la trazabilidad',
    text: 'Los pedidos listos se filtran y facturan desde el mismo flujo, con acceso a saldos e historial documental.',
  },
]

function FormulaAnimalCaseStudy({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState(0)
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null)
  const activeView = CRM_VIEWS[view]

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    if (!expandedImage) return
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setExpandedImage(null)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [expandedImage])

  return (
    <main className="case-study case-study--formula">
      <header className="case-header">
        <div className="shell case-header__inner">
          <Brand />
          <a className="case-back" href="/#proyectos" onClick={(event) => { event.preventDefault(); onClose() }}><Icon name="chevronLeft" size={18}/> Volver a proyectos</a>
        </div>
      </header>

      <section className="case-hero">
        <div className="shell case-hero__grid">
          <div className="case-hero__copy">
            <p className="case-kicker">Proyecto real para Fórmula Animal</p>
            <h1>Un CRM que acompaña todo el recorrido de una fórmula magistral.</h1>
            <p>Diseñamos una plataforma que reúne operación comercial, pedidos, logística, calidad, facturación y compensaciones en un solo entorno de trabajo.</p>
            <div className="case-signals">
              <span>Operación conectada</span><span>Trazabilidad por pedido</span><span>Accesos por rol</span>
            </div>
          </div>
          <div className="case-hero__visual">
            <div className="case-browser">
              <div className="case-browser__bar"><i/><i/><i/><span>crm.formulaanimal.com</span></div>
              <button className="case-image-trigger" type="button" aria-label="Ampliar dashboard del CRM" onClick={() => setExpandedImage({ src: '/assets/crm-formula-animal/dashboard.png', alt: 'Dashboard del CRM Fórmula Animal' })}>
                <ProjectScreenshot src="/assets/crm-formula-animal/dashboard.png" alt="Dashboard del CRM Fórmula Animal" sizes={SCREENSHOT_SIZES.hero} priority />
              </button>
            </div>
            <div className="case-hero__note"><strong>Información para decidir</strong><span>Indicadores, metas y actividad del mes en una sola vista.</span></div>
          </div>
        </div>
      </section>

      <section className="case-story">
        <div className="shell case-story__grid">
          <figure className="case-shot case-shot--tilted">
            <button className="case-image-trigger" type="button" aria-label="Ampliar pantalla de creación de pedidos" onClick={() => setExpandedImage({ src: '/assets/crm-formula-animal/crear-pedido.png', alt: 'Pantalla para crear un pedido en el CRM Fórmula Animal' })}>
              <ProjectScreenshot src="/assets/crm-formula-animal/crear-pedido.png" alt="Pantalla para crear un pedido en el CRM Fórmula Animal" sizes={SCREENSHOT_SIZES.story} />
            </button>
            <figcaption><span>Captura real del módulo de pedidos</span><button type="button" onClick={() => setExpandedImage({ src: '/assets/crm-formula-animal/crear-pedido.png', alt: 'Pantalla para crear un pedido en el CRM Fórmula Animal' })}>Ver captura completa</button></figcaption>
          </figure>
          <div className="case-story__copy">
            <span className="case-index">El punto de partida</span>
            <h2>Una captura ordenada evita correcciones durante el resto del proceso.</h2>
            <p>El formulario reúne los datos que necesitan las siguientes áreas. Cada medicamento puede asociarse a su mascota, formulador, presentación y dosis, conservando la relación dentro del mismo pedido.</p>
            <ul>
              <li><Icon name="check" size={17}/> Búsqueda y alta de clientes sin salir del flujo</li>
              <li><Icon name="check" size={17}/> Varias fórmulas dentro de un mismo pedido</li>
              <li><Icon name="check" size={17}/> Datos de envío listos para logística</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="case-flow">
        <div className="shell">
          <div className="case-flow__heading">
            <div><span className="case-index">Un recorrido, varias áreas</span><h2>El pedido cambia de manos, pero nunca pierde su historia.</h2></div>
            <p>Selecciona una etapa para ver cómo el mismo sistema se adapta al trabajo de cada equipo.</p>
          </div>
          <div className="module-path" aria-label="Flujo principal del CRM">
            {CRM_VIEWS.map((item, itemIndex) => (
              <div className="module-path__step" key={item.name}>
                <button type="button" className={itemIndex === view ? 'is-active' : ''} onClick={() => setView(itemIndex)}><span>{itemIndex + 1}</span>{item.name}</button>
                {itemIndex < CRM_VIEWS.length - 1 && <Icon name="arrow" size={20}/>} 
              </div>
            ))}
          </div>
          <div className="case-viewer">
            <div className="case-viewer__screen" key={activeView.src}>
              <button className="case-image-trigger" type="button" aria-label={`Ampliar vista de ${activeView.name}`} onClick={() => setExpandedImage({ src: activeView.src, alt: `Vista del módulo de ${activeView.name} en el CRM Fórmula Animal` })}>
                <ProjectScreenshot src={activeView.src} alt={`Vista del módulo de ${activeView.name} en el CRM Fórmula Animal`} sizes={SCREENSHOT_SIZES.viewer} />
              </button>
            </div>
            <div className="case-viewer__caption">
              <span>0{view + 1}</span><div><h3>{activeView.title}</h3><p>{activeView.text}</p></div><button type="button" onClick={() => setExpandedImage({ src: activeView.src, alt: `Vista del módulo de ${activeView.name} en el CRM Fórmula Animal` })}>Ver captura completa</button>
            </div>
          </div>
        </div>
      </section>

      <section className="case-result">
        <div className="shell case-result__inner">
          <div><span className="case-index">La idea detrás del sistema</span><h2>No digitalizamos pantallas. Conectamos decisiones.</h2></div>
          <p>Fórmula Animal muestra cómo una herramienta a medida puede reflejar una operación compleja sin obligar al equipo a trabajar alrededor del software. <a href="/servicios/">Conoce nuestros servicios de software a medida.</a></p>
          <a className="button" href={whatsappUrl('Hola, vi el caso del CRM Fórmula Animal y quiero conversar sobre un sistema para mi empresa.')} target="_blank" rel="noreferrer" data-analytics-cta="build_similar_formula_animal">Quiero construir algo así <Icon name="arrow"/></a>
        </div>
      </section>
      {expandedImage && (
        <div className="case-lightbox" role="dialog" aria-modal="true" aria-label="Captura ampliada" onClick={() => setExpandedImage(null)}>
          <button className="case-lightbox__close" type="button" aria-label="Cerrar captura" autoFocus onClick={() => setExpandedImage(null)}><Icon name="x" size={22}/></button>
          <ProjectScreenshot src={expandedImage.src} alt={expandedImage.alt} sizes={SCREENSHOT_SIZES.lightbox} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
      <Footer />
    </main>
  )
}

const NATIVE_HAUS_VIEWS = [
  {
    name: 'Líneas',
    src: '/assets/native-haus/universos.png',
    title: 'Tres públicos, una sola identidad',
    text: 'La navegación organiza la oferta para ciclistas, amantes de las mascotas y hogares que buscan aprovechar mejor cada espacio.',
  },
  {
    name: 'Catálogo',
    src: '/assets/native-haus/catalogo.png',
    title: 'El producto se entiende antes de preguntar',
    text: 'Filtros, fotografías, precios y descuentos convierten una oferta amplia en un catálogo fácil de explorar y comparar.',
  },
  {
    name: 'Cotizador',
    src: '/assets/native-haus/cotizador.png',
    title: 'La personalización termina en una conversación útil',
    text: 'El cotizador recopila proyecto, acabado, medidas y ciudad para iniciar en WhatsApp con el contexto que necesita el taller.',
  },
]

function NativeHausCaseStudy({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState(0)
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null)
  const activeView = NATIVE_HAUS_VIEWS[view]

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    if (!expandedImage) return
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setExpandedImage(null)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [expandedImage])

  const expand = (src: string, alt: string) => setExpandedImage({ src, alt })

  return (
    <main className="case-study case-study--native">
      <header className="case-header">
        <div className="shell case-header__inner">
          <Brand />
          <a className="case-back" href="/#proyectos" onClick={(event) => { event.preventDefault(); onClose() }}><Icon name="chevronLeft" size={18}/> Volver a proyectos</a>
        </div>
      </header>

      <section className="case-hero">
        <div className="shell case-hero__grid">
          <div className="case-hero__copy">
            <p className="case-kicker">Landing comercial para Nativhaus</p>
            <h1>Una vitrina digital que convierte madera en soluciones para cada estilo de vida.</h1>
            <p>Diseñamos una experiencia comercial que presenta la marca, ordena 24 productos y lleva cada consulta —incluidos los proyectos a medida— a una conversación lista para vender.</p>
            <div className="case-signals">
              <span>Catálogo filtrable</span><span>Cotización a medida</span><span>Conversión por WhatsApp</span>
            </div>
          </div>
          <div className="case-hero__visual">
            <div className="case-browser">
              <div className="case-browser__bar"><i/><i/><i/><span>nativehaus.co</span></div>
              <button className="case-image-trigger" type="button" aria-label="Ampliar portada de Nativhaus" onClick={() => expand('/assets/native-haus/hero.png', 'Portada de la landing de Nativhaus')}>
                <ProjectScreenshot src="/assets/native-haus/hero.png" alt="Portada de la landing de Nativhaus" sizes={SCREENSHOT_SIZES.hero} priority />
              </button>
            </div>
            <div className="case-hero__note"><strong>Propuesta clara desde el inicio</strong><span>Producto, oficio artesanal y dos caminos de conversión en el primer pantallazo.</span></div>
          </div>
        </div>
      </section>

      <section className="case-story">
        <div className="shell case-story__grid">
          <figure className="case-shot case-shot--tilted">
            <button className="case-image-trigger" type="button" aria-label="Ampliar líneas de diseño de Nativhaus" onClick={() => expand('/assets/native-haus/universos.png', 'Líneas de diseño de Nativhaus')}>
              <ProjectScreenshot src="/assets/native-haus/universos.png" alt="Líneas de diseño de Nativhaus" sizes={SCREENSHOT_SIZES.story} />
            </button>
            <figcaption><span>Captura real de las líneas de producto</span><button type="button" onClick={() => expand('/assets/native-haus/universos.png', 'Líneas de diseño de Nativhaus')}>Ver captura completa</button></figcaption>
          </figure>
          <div className="case-story__copy">
            <span className="case-index">Una oferta fácil de recorrer</span>
            <h2>La variedad deja de sentirse dispersa cuando cada persona encuentra su entrada.</h2>
            <p>Convertimos el portafolio del taller en tres universos reconocibles. Cada bloque combina contexto, fotografía y una acción directa hacia la categoría correspondiente.</p>
            <ul>
              <li><Icon name="check" size={17}/> Segmentación clara para ciclistas, mascotas y hogar</li>
              <li><Icon name="check" size={17}/> Fotografía protagonista sin perder legibilidad</li>
              <li><Icon name="check" size={17}/> Accesos directos al catálogo filtrado</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="case-flow">
        <div className="shell">
          <div className="case-flow__heading">
            <div><span className="case-index">Del descubrimiento al contacto</span><h2>La landing acompaña la decisión sin agregar fricción.</h2></div>
            <p>Selecciona una vista para recorrer cómo la experiencia organiza la oferta y prepara una consulta comercial más completa.</p>
          </div>
          <div className="module-path" aria-label="Recorrido principal de la landing Nativhaus">
            {NATIVE_HAUS_VIEWS.map((item, itemIndex) => (
              <div className="module-path__step" key={item.name}>
                <button type="button" className={itemIndex === view ? 'is-active' : ''} onClick={() => setView(itemIndex)}><span>{itemIndex + 1}</span>{item.name}</button>
                {itemIndex < NATIVE_HAUS_VIEWS.length - 1 && <Icon name="arrow" size={20}/>} 
              </div>
            ))}
          </div>
          <div className="case-viewer">
            <div className="case-viewer__screen" key={activeView.src}>
              <button className="case-image-trigger" type="button" aria-label={`Ampliar vista de ${activeView.name}`} onClick={() => expand(activeView.src, `${activeView.name} de la landing Nativhaus`)}>
                <ProjectScreenshot src={activeView.src} alt={`${activeView.name} de la landing Nativhaus`} sizes={SCREENSHOT_SIZES.viewer} />
              </button>
            </div>
            <div className="case-viewer__caption">
              <span>0{view + 1}</span><div><h3>{activeView.title}</h3><p>{activeView.text}</p></div><button type="button" onClick={() => expand(activeView.src, `${activeView.name} de la landing Nativhaus`)}>Ver captura completa</button>
            </div>
          </div>
        </div>
      </section>

      <section className="case-result">
        <div className="shell case-result__inner">
          <div><span className="case-index">El resultado</span><h2>Una presencia digital tan funcional como los muebles que presenta.</h2></div>
          <p>Nativhaus reúne identidad, catálogo y asesoría en una experiencia responsive pensada para vender productos terminados y captar solicitudes personalizadas. <a href="/servicios/">Conoce nuestros servicios de experiencias web.</a></p>
          <a className="button" href={whatsappUrl('Hola, vi el caso de Nativhaus y quiero conversar sobre una landing comercial para mi empresa.')} target="_blank" rel="noreferrer" data-analytics-cta="build_similar_native_haus">Quiero una landing así <Icon name="arrow"/></a>
        </div>
      </section>
      {expandedImage && (
        <div className="case-lightbox" role="dialog" aria-modal="true" aria-label="Captura ampliada" onClick={() => setExpandedImage(null)}>
          <button className="case-lightbox__close" type="button" aria-label="Cerrar captura" autoFocus onClick={() => setExpandedImage(null)}><Icon name="x" size={22}/></button>
          <ProjectScreenshot src={expandedImage.src} alt={expandedImage.alt} sizes={SCREENSHOT_SIZES.lightbox} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
      <Footer />
    </main>
  )
}

const NEXUS_POS_VIEWS = [
  {
    name: 'Domicilios',
    src: '/assets/nexus-pos/domicilios.png',
    title: 'Cada pedido avanza con un estado visible',
    text: 'El tablero organiza pedidos sin alistar, en preparación, listos, en camino y entregados para que el equipo conozca el siguiente paso.',
  },
  {
    name: 'Inventario',
    src: '/assets/nexus-pos/inventario.png',
    title: 'El stock acompaña la venta en tiempo real',
    text: 'Productos, costos, precios, mínimos y alertas de agotados quedan reunidos en una vista preparada para tomar decisiones rápidas.',
  },
  {
    name: 'Caja',
    src: '/assets/nexus-pos/caja.png',
    title: 'Cada turno cierra con el efectivo bajo control',
    text: 'Ventas por medio de pago, ingresos, egresos, base inicial y efectivo esperado quedan conciliados en un mismo resumen de caja.',
  },
  {
    name: 'Reportes',
    src: '/assets/nexus-pos/reportes.png',
    title: 'Los datos comerciales terminan en decisiones',
    text: 'Ventas, ticket promedio, transacciones, margen y productos rentables convierten la actividad diaria en información accionable.',
  },
]

function NexusPosCaseStudy({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState(0)
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null)
  const activeView = NEXUS_POS_VIEWS[view]
  const expand = (src: string, alt: string) => setExpandedImage({ src, alt })

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    if (!expandedImage) return
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setExpandedImage(null)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [expandedImage])

  return (
    <main className="case-study case-study--nexus">
      <header className="case-header">
        <div className="shell case-header__inner">
          <Brand />
          <a className="case-back" href="/#proyectos" onClick={(event) => { event.preventDefault(); onClose() }}><Icon name="chevronLeft" size={18}/> Volver a proyectos</a>
        </div>
      </header>

      <section className="case-hero">
        <div className="shell case-hero__grid">
          <div className="case-hero__copy">
            <p className="case-kicker">ERP comercial · NexusPOS</p>
            <h1>La operación completa de un comercio, conectada desde la primera venta.</h1>
            <p>Diseñamos un ERP que reúne punto de venta, inventario, clientes, cartera, domicilios, compras, caja y reportes sin perder velocidad en la atención.</p>
            <div className="case-signals"><span>Venta ágil</span><span>Stock conectado</span><span>Control financiero</span></div>
          </div>
          <div className="case-hero__visual">
            <div className="case-browser">
              <div className="case-browser__bar"><i/><i/><i/><span>app.nexuspos.co</span></div>
              <button className="case-image-trigger" type="button" aria-label="Ampliar punto de venta de NexusPOS" onClick={() => expand('/assets/nexus-pos/pos.png', 'Punto de venta de NexusPOS')}>
                <ProjectScreenshot src="/assets/nexus-pos/pos.png" alt="Punto de venta de NexusPOS" sizes={SCREENSHOT_SIZES.hero} priority />
              </button>
            </div>
            <div className="case-hero__note"><strong>Vender sin perder el contexto</strong><span>Catálogo, cliente, pedido y medios de pago conviven en el mismo flujo.</span></div>
          </div>
        </div>
      </section>

      <section className="case-story">
        <div className="shell case-story__grid">
          <figure className="case-shot case-shot--tilted">
            <button className="case-image-trigger" type="button" aria-label="Ampliar selector de módulos de NexusPOS" onClick={() => expand('/assets/nexus-pos/modulos.png', 'Selector de módulos del ERP NexusPOS')}>
              <ProjectScreenshot src="/assets/nexus-pos/modulos.png" alt="Selector de módulos del ERP NexusPOS" sizes={SCREENSHOT_SIZES.story} />
            </button>
            <figcaption><span>Acceso centralizado a los módulos del negocio</span><button type="button" onClick={() => expand('/assets/nexus-pos/modulos.png', 'Selector de módulos del ERP NexusPOS')}>Ver captura completa</button></figcaption>
          </figure>
          <div className="case-story__copy">
            <span className="case-index">Un sistema, varias áreas</span>
            <h2>Cada tarea tiene su espacio, pero toda la información permanece conectada.</h2>
            <p>El selector de módulos permite cambiar de contexto sin abandonar el sistema. Ventas, domicilios, inventario, compras, clientes, cartera, caja y reportes trabajan sobre una misma operación.</p>
            <ul>
              <li><Icon name="check" size={17}/> Diez módulos accesibles desde cualquier pantalla</li>
              <li><Icon name="check" size={17}/> Datos compartidos entre venta, stock y clientes</li>
              <li><Icon name="check" size={17}/> Configuración adaptada a cada comercio</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="case-flow">
        <div className="shell">
          <div className="case-flow__heading">
            <div><span className="case-index">Después de cobrar</span><h2>La venta alimenta el resto del negocio automáticamente.</h2></div>
            <p>Recorre algunas de las áreas que convierten cada transacción en seguimiento operativo e información para decidir.</p>
          </div>
          <div className="module-path" aria-label="Módulos principales de NexusPOS">
            {NEXUS_POS_VIEWS.map((item, itemIndex) => (
              <div className="module-path__step" key={item.name}>
                <button type="button" className={itemIndex === view ? 'is-active' : ''} onClick={() => setView(itemIndex)}><span>{itemIndex + 1}</span>{item.name}</button>
                {itemIndex < NEXUS_POS_VIEWS.length - 1 && <Icon name="arrow" size={20}/>} 
              </div>
            ))}
          </div>
          <div className="case-viewer">
            <div className="case-viewer__screen" key={activeView.src}>
              <button className="case-image-trigger" type="button" aria-label={`Ampliar vista de ${activeView.name}`} onClick={() => expand(activeView.src, `${activeView.name} en NexusPOS`)}>
                <ProjectScreenshot src={activeView.src} alt={`${activeView.name} en NexusPOS`} sizes={SCREENSHOT_SIZES.viewer} />
              </button>
            </div>
            <div className="case-viewer__caption">
              <span>0{view + 1}</span><div><h3>{activeView.title}</h3><p>{activeView.text}</p></div><button type="button" onClick={() => expand(activeView.src, `${activeView.name} en NexusPOS`)}>Ver captura completa</button>
            </div>
          </div>
        </div>
      </section>

      <section className="case-result">
        <div className="shell case-result__inner">
          <div><span className="case-index">El resultado</span><h2>Un ERP que acompaña la venta y también todo lo que ocurre después.</h2></div>
          <p>NexusPOS convierte actividades dispersas en una operación comercial trazable, preparada para atender, controlar y crecer desde una sola plataforma. <a href="/servicios/">Conoce nuestros servicios de software empresarial.</a></p>
          <a className="button" href={whatsappUrl('Hola, vi el caso de NexusPOS y quiero conversar sobre un ERP comercial para mi negocio.')} target="_blank" rel="noreferrer" data-analytics-cta="build_similar_nexus_pos">Quiero un ERP así <Icon name="arrow"/></a>
        </div>
      </section>

      {expandedImage && (
        <div className="case-lightbox" role="dialog" aria-modal="true" aria-label="Captura ampliada" onClick={() => setExpandedImage(null)}>
          <button className="case-lightbox__close" type="button" aria-label="Cerrar captura" autoFocus onClick={() => setExpandedImage(null)}><Icon name="x" size={22}/></button>
          <ProjectScreenshot src={expandedImage.src} alt={expandedImage.alt} sizes={SCREENSHOT_SIZES.lightbox} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
      <Footer />
    </main>
  )
}

const LIA_VIEWS = [
  {
    name: 'Decidir',
    src: '/assets/lia/estrategia.png',
    title: 'La información se convierte en una recomendación accionable',
    text: 'Lia analiza el contexto comercial, contrasta datos y entrega una respuesta concreta para apoyar decisiones de ventas, precios y seguimiento.',
  },
  {
    name: 'Configurar',
    src: '/assets/lia/configuracion.png',
    title: 'El agente se adapta a la identidad y al motor de cada empresa',
    text: 'La configuración permite personalizar su presencia, elegir el modo de operación y conectar capacidades externas sin exponer la experiencia al usuario.',
  },
  {
    name: 'Organizar',
    src: '/assets/lia/archivados.png',
    title: 'Cada conversación permanece disponible y ordenada',
    text: 'Chats, documentos y automatizaciones se conservan por estado para recuperar decisiones anteriores y mantener continuidad entre tareas.',
  },
  {
    name: 'Exportar',
    src: '/assets/lia/exportados.png',
    title: 'Los resultados pueden salir del chat y continuar el proceso',
    text: 'Reportes, análisis y entregables quedan disponibles para compartirlos con el equipo o integrarlos en otros flujos del negocio.',
  },
]

function LiaCaseStudy({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState(0)
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null)
  const activeView = LIA_VIEWS[view]
  const expand = (src: string, alt: string) => setExpandedImage({ src, alt })

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    if (!expandedImage) return
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setExpandedImage(null)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [expandedImage])

  return (
    <main className="case-study case-study--lia">
      <header className="case-header">
        <div className="shell case-header__inner">
          <Brand />
          <a className="case-back" href="/#proyectos" onClick={(event) => { event.preventDefault(); onClose() }}><Icon name="chevronLeft" size={18}/> Volver a proyectos</a>
        </div>
      </header>

      <section className="case-hero">
        <div className="shell case-hero__grid">
          <div className="case-hero__copy">
            <p className="case-kicker">Agente inteligente · Lia</p>
            <h1>Una asistente empresarial capaz de entender, actuar y automatizar.</h1>
            <p>Diseñamos un agente que reúne conversaciones, datos, documentos y acciones para ayudar a los equipos a resolver tareas operativas sin cambiar entre múltiples herramientas.</p>
            <div className="case-signals"><span>IA contextual</span><span>Automatización</span><span>Análisis empresarial</span></div>
          </div>
          <div className="case-hero__visual">
            <div className="case-browser">
              <div className="case-browser__bar"><i/><i/><i/><span>lia.enterprise.ai</span></div>
              <button className="case-image-trigger" type="button" aria-label="Ampliar agente inteligente Lia" onClick={() => expand('/assets/lia/asistente.png', 'Conversación con el agente inteligente Lia')}>
                <ProjectScreenshot src="/assets/lia/asistente.png" alt="Conversación con el agente inteligente Lia" sizes={SCREENSHOT_SIZES.hero} priority />
              </button>
            </div>
            <div className="case-hero__note"><strong>De la pregunta a la acción</strong><span>Lia consulta, analiza y propone el siguiente paso dentro de la misma conversación.</span></div>
          </div>
        </div>
      </section>

      <section className="case-story">
        <div className="shell case-story__grid">
          <figure className="case-shot case-shot--tilted">
            <button className="case-image-trigger" type="button" aria-label="Ampliar configuración de Lia" onClick={() => expand('/assets/lia/configuracion.png', 'Configuración y preferencias de Lia')}>
              <ProjectScreenshot src="/assets/lia/configuracion.png" alt="Configuración y preferencias de Lia" sizes={SCREENSHOT_SIZES.story} />
            </button>
            <figcaption><span>Identidad y motor de inteligencia configurables</span><button type="button" onClick={() => expand('/assets/lia/configuracion.png', 'Configuración y preferencias de Lia')}>Ver captura completa</button></figcaption>
          </figure>
          <div className="case-story__copy">
            <span className="case-index">Un agente conectado al negocio</span>
            <h2>No solo responde preguntas: entiende el contexto y ayuda a ejecutar.</h2>
            <p>Lia funciona como una capa inteligente sobre la información de la empresa. Puede revisar datos, analizar documentos, preparar seguimientos y convertir solicitudes en acciones listas para validar.</p>
            <ul>
              <li><Icon name="check" size={17}/> Consulta de clientes, ventas e inventario</li>
              <li><Icon name="check" size={17}/> Análisis de documentos y propuestas comerciales</li>
              <li><Icon name="check" size={17}/> Automatizaciones, recordatorios y reportes</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="case-flow">
        <div className="shell">
          <div className="case-flow__heading">
            <div><span className="case-index">Una interfaz, varias capacidades</span><h2>El agente acompaña cada proceso desde el análisis hasta la ejecución.</h2></div>
            <p>Explora cómo Lia apoya decisiones, se adapta a la empresa y mantiene organizados los resultados de cada conversación.</p>
          </div>
          <div className="module-path" aria-label="Capacidades principales de Lia">
            {LIA_VIEWS.map((item, itemIndex) => (
              <div className="module-path__step" key={item.name}>
                <button type="button" className={itemIndex === view ? 'is-active' : ''} onClick={() => setView(itemIndex)}><span>{itemIndex + 1}</span>{item.name}</button>
                {itemIndex < LIA_VIEWS.length - 1 && <Icon name="arrow" size={20}/>} 
              </div>
            ))}
          </div>
          <div className="case-viewer">
            <div className="case-viewer__screen" key={activeView.src}>
              <button className="case-image-trigger" type="button" aria-label={`Ampliar vista de ${activeView.name}`} onClick={() => expand(activeView.src, `${activeView.name} con Lia`)}>
                <ProjectScreenshot src={activeView.src} alt={`${activeView.name} con Lia`} sizes={SCREENSHOT_SIZES.viewer} />
              </button>
            </div>
            <div className="case-viewer__caption">
              <span>0{view + 1}</span><div><h3>{activeView.title}</h3><p>{activeView.text}</p></div><button type="button" onClick={() => expand(activeView.src, `${activeView.name} con Lia`)}>Ver captura completa</button>
            </div>
          </div>
        </div>
      </section>

      <section className="case-result">
        <div className="shell case-result__inner">
          <div><span className="case-index">El resultado</span><h2>Una nueva forma de automatizar procesos sin perder el criterio humano.</h2></div>
          <p>Lia concentra información y tareas repetitivas en una experiencia conversacional, para que cada equipo dedique menos tiempo a buscar y más tiempo a decidir. <a href="/servicios/">Conoce nuestros servicios de automatización.</a></p>
          <a className="button" href={whatsappUrl('Hola, vi el caso de Lia y quiero conversar sobre un agente inteligente para automatizar procesos en mi empresa.')} target="_blank" rel="noreferrer" data-analytics-cta="build_similar_lia">Quiero un agente así <Icon name="arrow"/></a>
        </div>
      </section>

      {expandedImage && (
        <div className="case-lightbox" role="dialog" aria-modal="true" aria-label="Captura ampliada" onClick={() => setExpandedImage(null)}>
          <button className="case-lightbox__close" type="button" aria-label="Cerrar captura" autoFocus onClick={() => setExpandedImage(null)}><Icon name="x" size={22}/></button>
          <ProjectScreenshot src={expandedImage.src} alt={expandedImage.alt} sizes={SCREENSHOT_SIZES.lightbox} onClick={(event) => event.stopPropagation()} />
        </div>
      )}
      <Footer />
    </main>
  )
}

function ContactSection({ dark = false }: { dark?: boolean }) {
  return (
    <section id="contacto" className={`contact-section ${dark ? 'contact-section--dark' : ''}`}>
      <div className="shell">
        <div className="contact-card">
          <div className="contact-card__copy">
            <span className="contact-card__marker">Hablemos de tu proyecto</span>
            <h2>La primera conversación puede aclarar mucho.</h2>
            <p>Cuéntanos qué está frenando a tu equipo. Te ayudamos a ordenar el alcance, los tiempos y el mejor siguiente paso.</p>
          </div>
          <div className="contact-card__action">
            <div className="contact-card__rings" aria-hidden="true"><i/><i/><i/></div>
            <span>Conversación directa</span>
            <a className="button button--whatsapp" href={whatsappUrl()} target="_blank" rel="noreferrer" data-analytics-cta="whatsapp_contact"><WhatsAppIcon size={25}/> Escribir por WhatsApp <Icon name="arrow" size={19}/></a>
            <small>Cuéntanos tu idea sin formularios ni compromiso.</small>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactPage() {
  const telephone = `+${SITE.whatsappNumber}`
  return (
    <>
      <Header darkHero />
      <main className="trust-page">
        <section className="trust-page__hero">
          <div className="shell trust-page__intro">
            <span>Contacto</span>
            <h1>Hablemos de lo que necesitas construir o mejorar.</h1>
            <p>NovaLine atiende las conversaciones iniciales por teléfono y WhatsApp. Puedes contarnos brevemente el contexto de tu empresa y la necesidad que quieres resolver.</p>
            <a className="button button--whatsapp trust-page__hero-action" href={whatsappUrl()} target="_blank" rel="noreferrer" data-analytics-cta="contact_hero_whatsapp"><WhatsAppIcon size={22}/> Escribir por WhatsApp <Icon name="arrow" size={18}/></a>
          </div>
        </section>
        <section className="trust-page__body">
          <div className="shell trust-page__grid">
            <article className="trust-card">
              <span>Canal directo</span>
              <h2>WhatsApp</h2>
              <p>Usa el canal de contacto existente para iniciar una conversación con NovaLine. WhatsApp se abrirá en una pestaña nueva con un mensaje inicial que puedes editar antes de enviarlo.</p>
              <a className="button button--whatsapp" href={whatsappUrl()} target="_blank" rel="noreferrer" data-analytics-cta="contact_page_whatsapp"><WhatsAppIcon size={22}/> Escribir por WhatsApp <Icon name="arrow" size={18}/></a>
            </article>
            <article className="trust-card">
              <span>Teléfono público</span>
              <h2>+57 322 896 8494</h2>
              <p>También puedes iniciar el contacto desde el número público de NovaLine. No publicamos correo, dirección física ni horarios porque el sitio no dispone actualmente de esos datos.</p>
              <a className="trust-card__link" href={`tel:${telephone}`}>Llamar al +57 322 896 8494</a>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function PrivacyPage() {
  return (
    <>
      <Header darkHero />
      <main className="trust-page">
        <section className="trust-page__hero">
          <div className="shell trust-page__intro">
            <span>Privacidad</span>
            <h1>Política de privacidad del sitio de NovaLine.</h1>
            <p>Esta página explica de forma sencilla qué tecnologías de medición utiliza novalinesoftware.com y qué ocurre cuando eliges contactar por WhatsApp.</p>
          </div>
        </section>
        <section className="trust-page__body">
          <div className="shell privacy-copy">
            <p className="privacy-copy__updated">Última actualización: 16 de septiembre de 2026.</p>
            <section>
              <h2>Datos de navegación y analítica</h2>
              <p>En el dominio público utilizamos Google Analytics 4 y Microsoft Clarity para entender, de forma agregada, cómo se usa el sitio y detectar oportunidades de mejora. Estas herramientas pueden tratar datos técnicos del navegador y del dispositivo, páginas visitadas, interacciones y datos asociados a cookies u otros identificadores de analítica.</p>
            </section>
            <section>
              <h2>Eventos medidos en el sitio</h2>
              <p>NovaLine mide interacciones como clics en enlaces de contacto, llamados a la acción y acceso a proyectos. Estos eventos incluyen datos técnicos como la ruta de la página y el destino general del enlace. El sitio no tiene formularios y la analítica implementada no envía nombres, correos, teléfonos, mensajes ni contenido escrito por el visitante.</p>
            </section>
            <section>
              <h2>Contacto mediante WhatsApp</h2>
              <p>Los botones de contacto abren WhatsApp mediante un enlace externo. Solo cuando decides continuar y enviar un mensaje, la información que compartas será tratada dentro de WhatsApp y recibida por NovaLine para responder a tu solicitud. Revisa también las condiciones y políticas de privacidad de WhatsApp antes de usar ese canal.</p>
            </section>
            <section>
              <h2>Control desde tu navegador</h2>
              <p>Puedes bloquear o eliminar cookies y otros datos del sitio desde la configuración de tu navegador. Al hacerlo, algunas mediciones de analítica pueden dejar de funcionar, pero el contenido principal del sitio seguirá disponible.</p>
            </section>
            <section>
              <h2>Consultas sobre privacidad</h2>
              <p>Si tienes una consulta relacionada con esta política, puedes comunicarte mediante la <a href="/contacto/">página de contacto</a> y el canal público de WhatsApp de NovaLine.</p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function Footer() {
  return <footer className="footer"><div className="shell footer__inner"><Brand/><div className="footer__nav">{NAV_ITEMS.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</div><div className="footer__meta"><div className="footer__trust"><a href="/contacto/">Contacto</a><a href="/privacidad/">Privacidad</a></div><span>© {new Date().getFullYear()} NovaLine</span></div></div></footer>
}

function ServicesPage() {
  const [demoIndex, setDemoIndex] = useState(0)
  const softwarePause = useSystemPause<HTMLElement>()
  const experiencePause = useSystemPause<HTMLElement>()
  const automationPause = useSystemPause<HTMLElement>()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    if (softwarePause.paused) return
    const timer = window.setInterval(() => setDemoIndex((value) => (value + 1) % PHONE_DEMOS.length), SITE.phoneInterval)
    return () => window.clearInterval(timer)
  }, [softwarePause.paused])

  return (
    <div className="services-page">
      <Header/>
      <main id="servicios">
        <section className="services-page__hero">
          <div className="shell services-page__hero-grid">
            <div className="services-page__hero-copy">
              <span className="services-page__eyebrow">Servicios de desarrollo</span>
              <h1>Servicios de software a la medida para operar mejor.</h1>
              <p>Diseñamos productos digitales alrededor de procesos reales: herramientas para operar mejor, experiencias que conectan y automatizaciones que liberan tiempo.</p>
              <a className="button" href="#software-a-medida">Explorar cómo podemos ayudarte <Icon name="arrow"/></a>
            </div>
            <div className="services-page__map" aria-label="Tres áreas de servicio">
              {SERVICES.map((service, index) => (
                <a href={['#software-a-medida', '#experiencias-web', '#automatizacion'][index]} key={service.title}>
                  <span>0{index + 1}</span>
                  <strong>{service.title}</strong>
                  <Icon name="arrow" size={17}/>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section ref={softwarePause.ref} id="software-a-medida" className={`service-story service-story--software ${softwarePause.paused ? 'is-paused' : ''}`}>
          <div className="shell service-story__grid">
            <div className="service-story__copy">
              <span className="service-story__number">01 · Software a la medida</span>
              <h2>Una plataforma clara para conectar toda tu operación.</h2>
              <p>Construimos CRM, ERP y herramientas internas adaptadas a tus roles, reglas e información. No obligamos a tu empresa a trabajar como una plantilla.</p>
              <ul className="service-story__benefits">
                <li><Icon name="check"/> Flujos y permisos según cada equipo</li>
                <li><Icon name="check"/> Información centralizada y trazable</li>
                <li><Icon name="check"/> Entregas funcionales por etapas</li>
              </ul>
              <div className="service-story__actions">
                <a className="button" href={whatsappUrl('Hola, quiero conversar sobre software a la medida para mi empresa.')} target="_blank" rel="noreferrer" data-analytics-cta="services_page_custom_software">Quiero una solución <Icon name="arrow"/></a>
                <a className="text-link" href={SERVICES[0].caseHref} aria-label={SERVICES[0].caseLabel}>Ver caso real <span className="text-link__arrow" aria-hidden="true">→</span></a>
              </div>
            </div>
            <div className="service-story__visual service-story__visual--phones" aria-label="Interfaces de software adaptadas a distintos procesos">
              <span className="service-story__demo-label">Demostración visual · datos ilustrativos</span>
              <PhoneStage demoIndex={demoIndex}/>
            </div>
          </div>
        </section>

        <section ref={experiencePause.ref} id="experiencias-web" className={`service-story service-story--experience ${experiencePause.paused ? 'is-paused' : ''}`}>
          <div className="shell service-story__grid service-story__grid--reverse">
            <div className="service-story__copy">
              <span className="service-story__number">02 · Experiencias web</span>
              <h2>Menos pasos entre una buena experiencia y una acción real.</h2>
              <p>Creamos portales y aplicaciones responsive que se entienden en cualquier pantalla. También conectamos presencia local, reseñas y tecnología NFC para reducir fricción.</p>
              <ul className="service-story__benefits">
                <li><Icon name="check"/> Experiencias responsive y accesibles</li>
                <li><Icon name="check"/> SEO local conectado con el recorrido</li>
                <li><Icon name="check"/> Acciones directas mediante NFC</li>
              </ul>
              <div className="service-story__actions">
                <a className="button" href={whatsappUrl('Hola, quiero crear una experiencia web clara y mejorar la visibilidad local de mi negocio.')} target="_blank" rel="noreferrer" data-analytics-cta="services_page_web_experience">Hablemos de la experiencia <Icon name="arrow"/></a>
                <a className="text-link" href={SERVICES[1].caseHref} aria-label={SERVICES[1].caseLabel}>Ver caso real <span className="text-link__arrow" aria-hidden="true">→</span></a>
              </div>
            </div>
            <div className="service-story__visual service-story__visual--nfc" aria-label="Tarjeta NFC para facilitar reseñas de Google">
              <NfcStage active={!experiencePause.paused}/>
              <div className="service-story__signal" aria-hidden="true"><span>1 toque</span><strong>Una acción clara</strong></div>
            </div>
          </div>
        </section>

        <section ref={automationPause.ref} id="automatizacion" className={`service-story service-story--automation ${automationPause.paused ? 'is-paused' : ''}`}>
          <div className="shell">
            <div className="service-story__automation-heading">
              <div className="service-story__copy">
                <span className="service-story__number">03 · Automatización y soporte</span>
                <h2>Procesos que avanzan sin perder contexto.</h2>
              </div>
              <div className="service-story__automation-intro">
                <p>Conectamos tareas, documentos y estados para reducir trabajo manual. Después del lanzamiento seguimos cerca para mantener y evolucionar cada solución.</p>
                <div className="service-story__actions">
                  <a className="button" href={whatsappUrl('Hola, quiero automatizar procesos y recibir acompañamiento técnico para mi empresa.')} target="_blank" rel="noreferrer" data-analytics-cta="services_page_automation">Automatizar un proceso <Icon name="arrow"/></a>
                </div>
              </div>
            </div>
            <div className="service-story__process-visual">
              <span className="service-story__demo-label service-story__demo-label--dark">Demostración visual · datos ilustrativos</span>
              <ProcessAnimationStage active={!automationPause.paused} paused={automationPause.paused}/>
            </div>
          </div>
        </section>

        <section className="services-guide" aria-labelledby="services-guide-title">
          <div className="shell">
            <div className="services-guide__intro">
              <span className="services-page__eyebrow">Elegir con contexto</span>
              <h2 id="services-guide-title">Cómo saber qué solución necesita tu empresa.</h2>
              <p>El software a la medida tiene sentido cuando los procesos importantes no encajan bien en herramientas genéricas, la información está repartida o el equipo repite tareas que podrían conectarse. Antes de proponer tecnología, NovaLine identifica el problema operativo, los usuarios, las reglas y el resultado que debe mejorar.</p>
            </div>
            <div className="services-guide__paths">
              <article>
                <span>01</span>
                <h3>Un sistema nuevo para un proceso propio</h3>
                <p>Diseñamos CRM, ERP y aplicaciones internas cuando la operación necesita permisos, flujos, estados o reportes particulares. La solución se organiza alrededor del trabajo real y puede crecer por etapas sin forzar al equipo a adoptar una plantilla ajena.</p>
                <a href="/proyectos/formula-animal/">Ver un CRM conectado <Icon name="arrow" size={16}/></a>
              </article>
              <article>
                <span>02</span>
                <h3>Una experiencia web para clientes o equipos</h3>
                <p>Creamos portales, catálogos y aplicaciones responsive cuando el objetivo es presentar información, facilitar una decisión o convertir una visita en una acción clara. El recorrido se adapta a cada pantalla y se conecta con los canales que ya usa la empresa.</p>
                <a href="/proyectos/native-haus/">Ver una experiencia comercial <Icon name="arrow" size={16}/></a>
              </article>
              <article>
                <span>03</span>
                <h3>Automatizar y evolucionar lo que ya existe</h3>
                <p>Conectamos tareas, documentos y estados para reducir trabajo manual y recuperar trazabilidad. También acompañamos productos en funcionamiento: entendemos su contexto, priorizamos cambios y hacemos entregas verificables para que la solución siga el ritmo del negocio.</p>
                <a href="/proyectos/lia/">Ver una automatización con IA <Icon name="arrow" size={16}/></a>
              </article>
            </div>
            <div className="services-guide__process">
              <div>
                <span className="services-page__eyebrow">Proceso de trabajo</span>
                <h2>De la necesidad a una entrega que el equipo puede validar.</h2>
                <p>El proceso de NovaLine tiene cuatro etapas: entender el negocio, validar un prototipo, construir entregas funcionales y acompañar la evolución después del lanzamiento.</p>
              </div>
              <ol>
                <li><strong>Entender</strong><span>Mapeamos el proceso, el problema y el resultado esperado.</span></li>
                <li><strong>Validar</strong><span>Convertimos los hallazgos en flujos y un prototipo navegable.</span></li>
                <li><strong>Construir</strong><span>Entregamos por etapas para revisar avances con usuarios reales.</span></li>
                <li><strong>Evolucionar</strong><span>Acompañamos la adopción, el mantenimiento y las nuevas prioridades.</span></li>
              </ol>
            </div>
            <div className="services-guide__questions">
              <div>
                <span className="services-page__eyebrow">Preguntas frecuentes</span>
                <h2>Lo que conviene definir antes de empezar.</h2>
              </div>
              <div className="services-guide__answers">
                <article><h3>¿Cuándo conviene desarrollar software a la medida?</h3><p>Cuando un proceso clave tiene reglas propias, varias herramientas no se comunican o el trabajo manual dificulta el control. Primero revisamos si una solución personalizada aporta una ventaja real.</p></article>
                <article><h3>¿Qué necesitan para estimar el alcance?</h3><p>Una conversación sobre el problema, las personas que usarán la solución, la información disponible y el resultado esperado. Con ese contexto se pueden ordenar prioridades y plantear una primera etapa verificable.</p></article>
                <article><h3>¿Pueden evolucionar una solución existente?</h3><p>Sí. El punto de partida es comprender el producto actual, sus dependencias y los riesgos del cambio. Después se priorizan mejoras que puedan probarse sin perder el contexto operativo.</p></article>
                <article><h3>¿Qué ocurre después del lanzamiento?</h3><p>La solución se observa en uso, se atienden ajustes y se planifican nuevas necesidades. El soporte cercano permite conservar conocimiento del negocio mientras el producto evoluciona.</p></article>
              </div>
            </div>
          </div>
        </section>

        <section className="services-page__closing">
          <div className="shell services-page__closing-inner">
            <div><span>Una solución empieza por entender</span><h2>Cuéntanos qué necesita funcionar mejor.</h2></div>
            <a className="button" href={whatsappUrl()} target="_blank" rel="noreferrer" data-analytics-cta="services_page_closing">Conversemos sobre tu proyecto <Icon name="arrow"/></a>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  )
}

export default function App({ initialPath }: { initialPath?: string }) {
  useClarityTracking()
  useGoogleAnalytics()
  const [pathname, setPathname] = useState(() => initialPath ?? (typeof window === 'undefined' ? '/' : window.location.pathname))
  const route = resolveRoute(pathname)

  const navigate = useCallback((href: string) => {
    const url = new URL(href, window.location.origin)
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    setPathname(url.pathname)

    if (url.hash) {
      window.requestAnimationFrame(() => document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [])

  useEffect(() => {
    const syncRoute = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  useEffect(() => {
    const handleInternalLink = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest<HTMLAnchorElement>('a[href]')
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return

      const url = new URL(anchor.href, window.location.origin)
      const isPublicRoute = PUBLIC_ROUTES.some((publicRoute) => publicRoute.path === normalizePathname(url.pathname))
      if (url.origin !== window.location.origin || !isPublicRoute) return

      event.preventDefault()
      navigate(`${url.pathname}${url.search}${url.hash}`)
    }

    document.addEventListener('click', handleInternalLink)
    return () => document.removeEventListener('click', handleInternalLink)
  }, [navigate])

  useEffect(() => applySeoToDocument(route.path), [route.path])

  const openCase = (slug: CaseSlug) => {
    navigate(CASE_ROUTES[slug])
  }
  const closeCase = () => {
    navigate('/#proyectos')
  }

  if (route.key === 'formula-animal') return <FormulaAnimalCaseStudy onClose={closeCase}/>
  if (route.key === 'native-haus') return <NativeHausCaseStudy onClose={closeCase}/>
  if (route.key === 'nexus-pos') return <NexusPosCaseStudy onClose={closeCase}/>
  if (route.key === 'lia') return <LiaCaseStudy onClose={closeCase}/>
  if (route.key === 'about') return <AboutPage />
  if (route.key === 'services') return <ServicesPage />
  if (route.key === 'contact') return <ContactPage />
  if (route.key === 'privacy') return <PrivacyPage />
  return <><Header/><main><Hero/><ProcessSection/><ServicesSection/><ProjectsSection onOpenCase={openCase}/><ContactSection dark/></main><Footer/></>
}
