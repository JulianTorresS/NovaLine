import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import { SITE, whatsappUrl } from './config'

describe('NovaLine landing', () => {
  it('muestra la navegación principal y sus destinos', () => {
    render(<App />)
    const navigation = screen.getByRole('navigation', { name: 'Navegación principal' })
    expect(navigation).toHaveTextContent('Proyectos')
    expect(navigation).toHaveTextContent('Proceso')
    expect(navigation).toHaveTextContent('Servicios')
    expect(navigation).toHaveTextContent('Nosotros')
    expect(navigation).toHaveTextContent('Contacto')
  })

  it('presenta las dos propuestas del hero', () => {
    render(<App />)
    expect(screen.getByRole('tab', { name: /Software a medida/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /SEO \+ reseñas NFC/i })).toBeInTheDocument()
  })

  it('presenta la identidad y la sección Nosotros de NovaLine', () => {
    window.history.replaceState({}, '', '/#nosotros')
    render(<App />)
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
    fireEvent.click(screen.getByRole('button', { name: 'Ver caso real de Fórmula Animal' }))
    expect(screen.getByRole('heading', { name: /Un CRM que acompaña todo el recorrido/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('#proyecto-formula-animal')
    fireEvent.click(screen.getByRole('button', { name: /Facturación/i }))
    expect(screen.getByRole('heading', { name: 'La facturación conserva la trazabilidad' })).toBeInTheDocument()
  })

  it('abre el caso real de Native Haus y permite recorrer sus vistas', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Ver caso real de Nativhaus' }))
    expect(screen.getByRole('heading', { name: /Una vitrina digital que convierte madera/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('#proyecto-native-haus')
    fireEvent.click(screen.getByRole('button', { name: /Cotizador/ }))
    expect(screen.getByRole('heading', { name: 'La personalización termina en una conversación útil' })).toBeInTheDocument()
  })

  it('abre el ERP comercial NexusPOS y permite recorrer sus módulos', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Ver caso real de NexusPOS' }))
    expect(screen.getByRole('heading', { name: /La operación completa de un comercio/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('#proyecto-nexus-pos')
    fireEvent.click(screen.getByRole('button', { name: /Inventario/ }))
    expect(screen.getByRole('heading', { name: 'El stock acompaña la venta en tiempo real' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Caja/ }))
    expect(screen.getByRole('heading', { name: 'Cada turno cierra con el efectivo bajo control' })).toBeInTheDocument()
  })

  it('abre el caso de Lia y permite recorrer sus capacidades', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Ver caso real de Lia' }))
    expect(screen.getByRole('heading', { name: /Una asistente empresarial capaz de entender/i })).toBeInTheDocument()
    expect(window.location.hash).toBe('#proyecto-lia')
    const heroScreenshot = screen.getByAltText('Conversación con el agente inteligente Lia')
    expect(heroScreenshot).toHaveAttribute('srcset', expect.stringContaining('/assets/lia/responsive/asistente-1280.png'))
    expect(heroScreenshot).toHaveAttribute('sizes', expect.stringContaining('635px'))
    fireEvent.click(screen.getByRole('button', { name: /Configurar/ }))
    expect(screen.getByRole('heading', { name: 'El agente se adapta a la identidad y al motor de cada empresa' })).toBeInTheDocument()
  })
})
