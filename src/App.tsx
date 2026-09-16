import { CSSProperties, MouseEventHandler, ReactNode, TouchEvent, TransitionEvent, useEffect, useMemo, useRef, useState } from 'react'
import { NAV_ITEMS, PHONE_DEMOS, PROCESS, PROJECTS, SERVICES, SITE, whatsappUrl } from './config'

type IconName = 'arrow' | 'check' | 'chevronLeft' | 'chevronRight' | 'code' | 'layers' | 'menu' | 'pulse' | 'quote' | 'search' | 'x'

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
    <a className={`brand ${light ? 'brand--light' : ''}`} href="#inicio" aria-label="NovaLine, ir al inicio">
      <span className="brand__mark"><BrandGlyph /></span>
      <span>NovaLine</span>
    </a>
  )
}

function Header({ aboutMode = false, onAboutBrandChange }: { aboutMode?: boolean; onAboutBrandChange?: (visible: boolean) => void }) {
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
    const sections = NAV_ITEMS.map((item) => document.querySelector(item.href)).filter(Boolean) as Element[]
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-35% 0px -55% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className={`header ${aboutMode ? 'header--about' : ''} ${scrolled ? 'header--scrolled' : ''} ${aboutMode && !aboutBrandVisible ? 'header--about-open' : ''} ${aboutMode && aboutBrandVisible ? 'header--brand-arrived' : ''}`}>
      <div className="header__inner shell">
        <div className="header__brand-slot"><Brand /></div>
        <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} className={active === item.href.slice(1) ? 'is-active' : ''} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>
          ))}
          <a className="button button--small nav__mobile-cta" href={whatsappUrl()} target="_blank" rel="noreferrer"><WhatsAppIcon /> Cotizar proyecto</a>
        </nav>
        <a className="button button--small header__cta" href={whatsappUrl()} target="_blank" rel="noreferrer">Cotizar proyecto <Icon name="arrow" /></a>
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

function NfcStage() {
  return (
    <div className="nfc-stage">
      <div className="nfc-photo-card">
        <img
          src="/assets/google-review-nfc-card-real.png"
          alt="Tarjeta física para solicitar reseñas de Google mediante NFC"
          draggable="false"
        />
        <div className="nfc-radar" aria-hidden="true"><i/><i/><i/></div>
      </div>
    </div>
  )
}

function Hero() {
  const [slide, setSlide] = useState(() => new URLSearchParams(window.location.search).get('service') === 'seo' ? 1 : 0)
  const [demoIndex, setDemoIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const systemPause = useSystemPause<HTMLElement>()
  const touchStart = useRef<number | null>(null)

  useEffect(() => {
    if (paused || systemPause.paused) return
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % 2), SITE.heroInterval)
    return () => window.clearInterval(timer)
  }, [paused, systemPause.paused])

  useEffect(() => {
    if (paused || systemPause.paused) return
    const timer = window.setInterval(() => setDemoIndex((value) => (value + 1) % PHONE_DEMOS.length), SITE.phoneInterval)
    return () => window.clearInterval(timer)
  }, [paused, systemPause.paused])

  const select = (index: number) => setSlide((index + 2) % 2)
  const onTouchStart = (event: TouchEvent) => { touchStart.current = event.touches[0].clientX }
  const onTouchEnd = (event: TouchEvent) => {
    if (touchStart.current === null) return
    const delta = event.changedTouches[0].clientX - touchStart.current
    if (Math.abs(delta) > 45) select(slide + (delta < 0 ? 1 : -1))
    touchStart.current = null
  }

  return (
    <main ref={systemPause.ref} id="inicio" className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="hero__wash"/>
      <div className="shell">
        <div className="hero__rail" role="tablist" aria-label="Soluciones destacadas">
          <button role="tab" aria-selected={slide === 0} className={slide === 0 ? 'is-active' : ''} onClick={() => select(0)}><Icon name="code"/> Software a medida</button>
          <button role="tab" aria-selected={slide === 1} className={slide === 1 ? 'is-active' : ''} onClick={() => select(1)}><Icon name="search"/> SEO + reseñas NFC</button>
          <span className="hero__count">0{slide + 1} / 02</span>
          <div className="hero__arrows">
            <button type="button" aria-label="Ver propuesta anterior" onClick={() => select(slide - 1)}><Icon name="chevronLeft"/></button>
            <button type="button" aria-label="Ver propuesta siguiente" onClick={() => select(slide + 1)}><Icon name="chevronRight"/></button>
          </div>
        </div>

        <div className="hero__viewport">
          <section className={`hero-slide ${slide === 0 ? 'is-active' : ''}`} aria-hidden={slide !== 0}>
            <div className="hero-copy">
              <h1>Software que entiende cómo funciona tu empresa.</h1>
              <p>Diseñamos herramientas a la medida para que tu equipo trabaje con menos pasos, vea mejor la operación y pueda crecer sin improvisar.</p>
              <div className="hero-copy__actions">
                <a className="button" href={whatsappUrl()} target="_blank" rel="noreferrer">Cuéntanos qué necesitas <Icon name="arrow"/></a>
                <a className="text-link" href="#proyectos">Ver proyectos <span className="text-link__arrow" aria-hidden="true">↓</span></a>
              </div>
              <div className="hero-proof"><span><Icon name="check"/> Alcance claro</span><span><Icon name="check"/> Entregas por etapas</span><span><Icon name="check"/> Soporte cercano</span></div>
            </div>
            <PhoneStage demoIndex={demoIndex}/>
          </section>

          <section className={`hero-slide ${slide === 1 ? 'is-active' : ''}`} aria-hidden={slide !== 1}>
            <div className="hero-copy">
              <h2>Convierte una buena experiencia en una reseña fácil de compartir.</h2>
              <p>Posicionamos tu negocio en búsquedas locales y conectamos cada atención con una tarjeta NFC: el cliente acerca su celular y llega directo a dejar su opinión.</p>
              <div className="hero-copy__actions">
                <a className="button" href={whatsappUrl('Hola, quiero mejorar la visibilidad local de mi negocio con SEO y tarjetas NFC.')} target="_blank" rel="noreferrer">Quiero más reseñas <Icon name="arrow"/></a>
                <span className="rating"><b>5.0</b> ★★★★★</span>
              </div>
              <div className="hero-proof"><span><Icon name="check"/> Perfil optimizado</span><span><Icon name="check"/> Acceso directo a la reseña</span></div>
            </div>
            <NfcStage />
          </section>
        </div>

        <div className="hero__progress" aria-hidden="true"><i className={slide === 0 ? 'is-active' : ''}/><i className={slide === 1 ? 'is-active' : ''}/></div>
      </div>
    </main>
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
    <section id="servicios" className="section services-section">
      <div className="shell">
        <SectionIntro marker="Lo que hacemos" title="Tecnología útil, diseñada alrededor del trabajo real." />
        <div className="services-grid">
          {SERVICES.map((service, index) => (
            <article className={`service-card service-card--${index + 1}`} key={service.title}>
              <div className="service-card__icon"><Icon name={service.icon as IconName} size={25}/></div>
              <span className="service-card__index">0{index + 1}</span>
              <h3>{service.title}</h3><p>{service.text}</p>
              <a href={whatsappUrl(`Hola, ${service.link.toLowerCase()}.`)} target="_blank" rel="noreferrer">{service.link} <Icon name="arrow"/></a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const TEAM_MEMBERS = [
  {
    name: 'Santiago Fraile Arevalo',
    role: 'Ingeniero de software',
    specialty: 'Back-end y arquitectura',
    bio: 'Desarrollador enfocado en construir sistemas sólidos, APIs claras y procesos que respondan a las necesidades reales de cada negocio.',
    photo: '/assets/team/WhatsApp Image 2026-09-15 at 12.24.01 PM.jpeg',
  },
  {
    name: 'Julian David Torres Saavedra',
    role: 'Ingeniero de software',
    specialty: 'Front-end · UX/UI',
    bio: 'Desarrollador especializado en crear interfaces claras, funcionales y visualmente cuidadas, conectando las necesidades de las personas con experiencias digitales intuitivas.',
    photo: '/assets/team/ChatGPT Image 15 sept 2026, 04_50_50 p.m.png',
  },
]

function AboutPage() {
  const [brandDocked, setBrandDocked] = useState(false)
  const [methodVisible, setMethodVisible] = useState(false)
  const methodRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Nosotros | NovaLine'
    window.scrollTo({ top: 0 })
    return () => { document.title = 'NovaLine' }
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
              <p>Diseñamos productos digitales entendiendo primero a las personas, los procesos y las decisiones que deben facilitar.</p>
            </div>
          </div>
        </section>

        <section className="about-story-section">
          <div className="shell">
            <div className="about-story__heading"><span className="about-eyebrow">Nuestra manera de crear</span><h2>Primero entendemos. Después diseñamos. Finalmente construimos.</h2><p>NovaLine nace para acercar la tecnología a empresas que necesitan soluciones propias, sin procesos confusos ni herramientas que obliguen al equipo a cambiar su forma de trabajar.</p></div>
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
                  <div className="team-card__portrait"><img src={member.photo} alt={`Retrato de ${member.name}`} loading="lazy" /></div>
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
  if (project.caseStudy === 'lia') {
    return (
      <div className="project-visual project-visual--lia" aria-hidden="true">
        <div className="project-real-window project-real-window--lia">
          <div className="project-real-window__bar"><i/><i/><i/><span>lia.enterprise.ai</span></div>
          <div className="project-real-crop project-real-crop--lia"><img src="/assets/lia/cover.png" alt="" width="744" height="378" loading="lazy" decoding="async" /></div>
        </div>
      </div>
    )
  }
  if (project.caseStudy === 'nexus-pos') {
    return (
      <div className="project-visual project-visual--nexus" aria-hidden="true">
        <div className="project-real-window project-real-window--nexus">
          <div className="project-real-window__bar"><i/><i/><i/><span>app.nexuspos.co</span></div>
          <div className="project-real-crop project-real-crop--nexus"><img src="/assets/nexus-pos/cover.png" alt="" width="744" height="378" loading="lazy" decoding="async" /></div>
        </div>
      </div>
    )
  }
  if (project.caseStudy === 'formula-animal') {
    return (
      <div className="project-visual project-visual--real" aria-hidden="true">
        <div className="project-real-window">
          <div className="project-real-window__bar"><i/><i/><i/><span>crm.formulaanimal.com</span></div>
          <div className="project-real-crop"><img src="/assets/crm-formula-animal/cover.png" alt="" width="744" height="378" loading="lazy" decoding="async" /></div>
        </div>
      </div>
    )
  }
  if (project.caseStudy === 'native-haus') {
    return (
      <div className="project-visual project-visual--native" aria-hidden="true">
        <div className="project-real-window project-real-window--native">
          <div className="project-real-window__bar"><i/><i/><i/><span>nativehaus.co</span></div>
          <div className="project-real-crop project-real-crop--native"><img src="/assets/native-haus/cover.png" alt="" width="744" height="378" loading="lazy" decoding="async" /></div>
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
            {renderedProjects.map(({ project, originalIndex }, renderedIndex) => (
              <article className={`project-card ${project.featured ? 'project-card--featured' : ''}`} key={`${project.name}-${renderedIndex}`} aria-hidden={renderedIndex < visible || renderedIndex >= visible + projectCount}>
                <ProjectVisual project={project} index={originalIndex}/>
                <div className="project-card__content"><div className="project-card__top"><span>{project.category}</span><b>{project.name}</b></div><h3>{project.title}</h3><div className="project-card__metric"><strong>{project.metric}</strong><span>{project.metricLabel}</span></div><div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>{project.featured && <span className="project-card__action">Ver caso real <Icon name="arrow" size={16}/></span>}</div>
                {project.caseStudy && <button className="project-card__open" type="button" aria-label={`Ver caso real de ${project.name}`} onClick={() => onOpenCase(project.caseStudy as CaseSlug)}/>} 
              </article>
            ))}
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

function ProjectScreenshot({ src, alt, sizes, priority = false, onClick }: { src: string; alt: string; sizes: string; priority?: boolean; onClick?: MouseEventHandler<HTMLImageElement> }) {
  const separator = src.lastIndexOf('/')
  const folder = src.slice(0, separator)
  const stem = src.slice(separator + 1).replace(/\.[^.]+$/, '')
  const narrow = src === '/assets/lia/archivados.png' || src === '/assets/lia/exportados.png'
  const smallWidth = narrow ? 384 : 1280
  const largeWidth = narrow ? 768 : 3200
  const srcSet = `${folder}/responsive/${stem}-${smallWidth}.png ${smallWidth}w, ${folder}/responsive/${stem}-${largeWidth}.png ${largeWidth}w`

  return <img src={src} srcSet={srcSet} sizes={sizes} alt={alt} loading={priority ? 'eager' : 'lazy'} decoding={priority ? 'auto' : 'async'} fetchPriority={priority ? 'high' : 'auto'} onClick={onClick} />
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
    document.title = 'Fórmula Animal CRM | NovaLine'
    window.scrollTo({ top: 0 })
    return () => { document.title = 'NovaLine' }
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
          <span onClick={onClose}><Brand /></span>
          <button className="case-back" type="button" onClick={onClose}><Icon name="chevronLeft" size={18}/> Volver a proyectos</button>
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
          <p>Fórmula Animal muestra cómo una herramienta a medida puede reflejar una operación compleja sin obligar al equipo a trabajar alrededor del software.</p>
          <a className="button" href={whatsappUrl('Hola, vi el caso del CRM Fórmula Animal y quiero conversar sobre un sistema para mi empresa.')} target="_blank" rel="noreferrer">Quiero construir algo así <Icon name="arrow"/></a>
        </div>
      </section>
      {expandedImage && (
        <div className="case-lightbox" role="dialog" aria-modal="true" aria-label="Captura ampliada" onClick={() => setExpandedImage(null)}>
          <button className="case-lightbox__close" type="button" aria-label="Cerrar captura" onClick={() => setExpandedImage(null)}><Icon name="x" size={22}/></button>
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
    document.title = 'Nativhaus | NovaLine'
    window.scrollTo({ top: 0 })
    return () => { document.title = 'NovaLine' }
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
          <span onClick={onClose}><Brand /></span>
          <button className="case-back" type="button" onClick={onClose}><Icon name="chevronLeft" size={18}/> Volver a proyectos</button>
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
          <p>Nativhaus reúne identidad, catálogo y asesoría en una experiencia responsive pensada para vender productos terminados y captar solicitudes personalizadas.</p>
          <a className="button" href={whatsappUrl('Hola, vi el caso de Nativhaus y quiero conversar sobre una landing comercial para mi empresa.')} target="_blank" rel="noreferrer">Quiero una landing así <Icon name="arrow"/></a>
        </div>
      </section>
      {expandedImage && (
        <div className="case-lightbox" role="dialog" aria-modal="true" aria-label="Captura ampliada" onClick={() => setExpandedImage(null)}>
          <button className="case-lightbox__close" type="button" aria-label="Cerrar captura" onClick={() => setExpandedImage(null)}><Icon name="x" size={22}/></button>
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
    document.title = 'NexusPOS ERP comercial | NovaLine'
    window.scrollTo({ top: 0 })
    return () => { document.title = 'NovaLine' }
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
          <span onClick={onClose}><Brand /></span>
          <button className="case-back" type="button" onClick={onClose}><Icon name="chevronLeft" size={18}/> Volver a proyectos</button>
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
          <p>NexusPOS convierte actividades dispersas en una operación comercial trazable, preparada para atender, controlar y crecer desde una sola plataforma.</p>
          <a className="button" href={whatsappUrl('Hola, vi el caso de NexusPOS y quiero conversar sobre un ERP comercial para mi negocio.')} target="_blank" rel="noreferrer">Quiero un ERP así <Icon name="arrow"/></a>
        </div>
      </section>

      {expandedImage && (
        <div className="case-lightbox" role="dialog" aria-modal="true" aria-label="Captura ampliada" onClick={() => setExpandedImage(null)}>
          <button className="case-lightbox__close" type="button" aria-label="Cerrar captura" onClick={() => setExpandedImage(null)}><Icon name="x" size={22}/></button>
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
    document.title = 'Lia, agente inteligente empresarial | NovaLine'
    window.scrollTo({ top: 0 })
    return () => { document.title = 'NovaLine' }
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
          <span onClick={onClose}><Brand /></span>
          <button className="case-back" type="button" onClick={onClose}><Icon name="chevronLeft" size={18}/> Volver a proyectos</button>
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
          <p>Lia concentra información y tareas repetitivas en una experiencia conversacional, para que cada equipo dedique menos tiempo a buscar y más tiempo a decidir.</p>
          <a className="button" href={whatsappUrl('Hola, vi el caso de Lia y quiero conversar sobre un agente inteligente para automatizar procesos en mi empresa.')} target="_blank" rel="noreferrer">Quiero un agente así <Icon name="arrow"/></a>
        </div>
      </section>

      {expandedImage && (
        <div className="case-lightbox" role="dialog" aria-modal="true" aria-label="Captura ampliada" onClick={() => setExpandedImage(null)}>
          <button className="case-lightbox__close" type="button" aria-label="Cerrar captura" onClick={() => setExpandedImage(null)}><Icon name="x" size={22}/></button>
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
            <a className="button button--whatsapp" href={whatsappUrl()} target="_blank" rel="noreferrer"><WhatsAppIcon size={25}/> Escribir por WhatsApp <Icon name="arrow" size={19}/></a>
            <small>Cuéntanos tu idea sin formularios ni compromiso.</small>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return <footer className="footer"><div className="shell footer__inner"><Brand/><div className="footer__nav">{NAV_ITEMS.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</div><span>© {new Date().getFullYear()} NovaLine</span></div></footer>
}

export default function App() {
  type PageRoute = CaseSlug | 'nosotros' | null
  const getRouteFromHash = (): PageRoute => window.location.hash === '#proyecto-formula-animal' ? 'formula-animal' : window.location.hash === '#proyecto-native-haus' ? 'native-haus' : window.location.hash === '#proyecto-nexus-pos' ? 'nexus-pos' : window.location.hash === '#proyecto-lia' ? 'lia' : window.location.hash === '#nosotros' ? 'nosotros' : null
  const [route, setRoute] = useState<PageRoute>(getRouteFromHash)

  useEffect(() => {
    const syncRoute = () => setRoute(getRouteFromHash())
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  const openCase = (slug: CaseSlug) => {
    window.location.hash = `proyecto-${slug}`
    setRoute(slug)
  }
  const closeCase = () => {
    setRoute(null)
    window.location.hash = 'proyectos'
    window.setTimeout(() => document.getElementById('proyectos')?.scrollIntoView(), 0)
  }

  if (route === 'formula-animal') return <FormulaAnimalCaseStudy onClose={closeCase}/>
  if (route === 'native-haus') return <NativeHausCaseStudy onClose={closeCase}/>
  if (route === 'nexus-pos') return <NexusPosCaseStudy onClose={closeCase}/>
  if (route === 'lia') return <LiaCaseStudy onClose={closeCase}/>
  if (route === 'nosotros') return <AboutPage />
  return <><Header/><Hero/><ProcessSection/><ServicesSection/><ProjectsSection onOpenCase={openCase}/><ContactSection dark/><Footer/></>
}
