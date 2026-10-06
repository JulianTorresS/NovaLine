# Auditoría SEO integral de NovaLine

Fecha: 5 de octubre de 2026  
Sitio: https://novalinesoftware.com/  
Tipo de negocio: servicios B2B de desarrollo de software a la medida en Colombia  
Alcance: código fuente, build prerenderizado, nueve URLs públicas y comprobaciones de producción

## Resumen ejecutivo

NovaLine parte de una base técnica sana: las nueve páginas se prerenderizan, cada una tiene un solo H1, metadatos únicos, canonical autorreferencial, contenido HTML sin depender de JavaScript, sitemap, robots.txt, datos estructurados y recursos responsive. La medición Lighthouse realizada durante la auditoría obtuvo 93/100 en móvil y 100/100 en escritorio.

La mayor brecha era comercial y de consolidación: la página de Servicios tenía unas 225 palabras útiles, producción aceptaba variantes duplicadas con `www` y sin barra final, el logo de Organization era demasiado pequeño para la recomendación de Google, y el video del hero transfería 2,79 MB de inmediato. También faltaban señales de evidencia verificable en los casos de estudio y la marca no apareció en las consultas de indexación realizadas durante la revisión.

Las correcciones locales elevan la estimación ponderada de 76/100 a 88/100. Esta puntuación posterior corresponde al build local; redirecciones, cabeceras, sitemap y metadatos no estarán activos públicamente hasta desplegar.

| Categoría | Peso | Antes | Después local | Estado |
|---|---:|---:|---:|---|
| SEO técnico | 22% | 82 | 94 | Corregido; falta verificar tras despliegue |
| Calidad de contenido | 23% | 61 | 78 | Mejorado; casos aún necesitan evidencia cuantitativa |
| SEO on-page | 20% | 76 | 91 | Corregido en títulos, H1, intención y enlaces |
| Datos estructurados | 10% | 84 | 96 | Corregido y cubierto por pruebas |
| Rendimiento/CWV | 10% | 93 | 93* | Medición previa buena; optimizaciones posteriores aún no remedidas |
| Preparación para búsqueda con IA | 10% | 67 | 75 | Base técnica fuerte; evidencia externa todavía débil |
| Imágenes | 5% | 82 | 97 | AVIF, HTML descubrible, dimensiones y carga correctos |
| **SEO Health Score** | **100%** | **76** | **88** | **Bueno, con trabajo externo pendiente** |

\* No se aumenta el score de rendimiento sin una nueva medición independiente. El cambio sí evita solicitar el video antes del tiempo ocioso y difiere scripts de analítica.

## Cambios implementados

### Rastreo, indexación y URLs

- Se añadió consolidación permanente de `www.novalinesoftware.com` hacia el dominio principal.
- Se activó la política de barra final para evitar que `/servicios` y `/servicios/` sigan accesibles como variantes 200.
- Se conservaron canonicals absolutos, HTTPS y autorreferenciales en las nueve rutas.
- El sitemap sigue conteniendo exactamente las nueve URLs públicas y ahora incluye `lastmod` preciso del 2026-10-05 para esta actualización global.
- `robots.txt` continúa permitiendo rastreo y enlazando el sitemap canónico.
- Se mantuvo la negociación `text/markdown` en la misma URL con `Vary: Accept`; no crea una URL competidora.

Estado en producción antes del despliegue: las nueve URLs canónicas respondían 200; HTTP redirigía a HTTPS; `/about` redirigía a `/nosotros/`; las variantes `www` y sin barra todavía respondían 200.

### Contenido e intención de búsqueda

- H1 de inicio reforzado: “Software a la medida que entiende cómo funciona tu empresa”.
- H1 de Servicios orientado a la consulta: “Servicios de software a la medida para operar mejor”.
- Se optimizaron los títulos de Servicios, Nosotros, Contacto y Lia sin superar 60 caracteres.
- Servicios creció de aproximadamente 225 a 658 palabras útiles. Ahora explica cuándo conviene una solución a medida, tres caminos de servicio, el proceso de cuatro etapas, preguntas frecuentes y enlaces contextuales a casos reales.
- Se añadieron etiquetas visibles de “datos ilustrativos” a las demostraciones animadas para no confundir ejemplos de interfaz con resultados de clientes.
- El contenido Markdown para agentes se alineó con las nuevas páginas y dirige el contacto a `/contacto/`.
- Los clones del carrusel dejaron de duplicar encabezados H3 en el HTML.

Brecha pendiente: los cuatro casos explican problema y solución, pero todavía carecen de fechas, alcance del equipo, tecnologías, testimonio autorizado y resultados verificables. No se inventaron esos datos.

### Metadatos y on-page

- Las nueve páginas conservan títulos y descripciones únicos, entre 120 y 160 caracteres para las descripciones.
- Todas tienen exactamente un H1, idioma `es-CO`, robots `index,follow,max-image-preview:large`, Open Graph y Twitter Cards coherentes.
- Inicio, Servicios y Nosotros cuentan con imágenes sociales; los casos usan su portada real.
- Los enlaces internos relevantes apuntan a URLs canónicas con barra final.
- Se mantuvieron Servicios y Nosotros como pestañas independientes del estado de scroll de Inicio.

### Schema.org

- `Organization.logo` ahora usa un PNG real de 512×512 en lugar del favicon SVG de 64×64.
- Se añadió descripción verificable de la organización.
- Se agregó `BreadcrumbList` a las ocho páginas internas.
- Nosotros usa `AboutPage`; Contacto usa `ContactPage`; Servicios relaciona sus tres entidades `Service`.
- Las personas incluyen biografía y áreas de conocimiento tomadas del contenido visible.
- Los casos `CreativeWork` se conectan mediante `mainEntityOfPage`.
- Privacidad conserva su fecha real de actualización.
- No se añadieron ratings, precios, dirección, correo, ofertas ni testimonios no publicados.

### Rendimiento y experiencia móvil

Medición Lighthouse de producción durante la auditoría:

- Móvil: 93/100; FCP 1,74 s; LCP 1,74 s; CLS 0,0008; TBT 286 ms.
- Escritorio: 100/100; FCP/LCP 0,51 s; CLS 0,00007; TBT 9 ms.
- No hubo datos de campo de CrUX/INP: PageSpeed Insights respondió 429 y no hay credenciales de CrUX o Search Console.

Cambios aplicados después de la medición:

- El video de 2,79 MB ya no se solicita durante el render inicial; usa un póster WebP local de 15 KB, `preload="metadata"` y carga en tiempo ocioso.
- El video no se carga con ahorro de datos ni con preferencia de movimiento reducido.
- Google Analytics y Microsoft Clarity conservan su cola de eventos, pero difieren la descarga de sus scripts hasta tiempo ocioso.
- El marquee deja de leer/escribir layout cuando está pausado, seleccionado, en interacción o fuera del hero.
- Se añadió caché inmutable para JS/CSS versionados y la fuente.
- Menú, pausa, marca y botón de regreso alcanzan un área táctil mínima de 48 px.
- Contacto y Privacidad usan navegación clara sobre el hero oscuro; Contacto incorpora CTA visible en la primera pantalla móvil.

### Imágenes

- Todas las imágenes HTML tienen `width` y `height`; no se detectó riesgo de CLS por dimensiones ausentes.
- Las capturas de producto usan `srcset`, AVIF, WebP y versiones responsive; el NFC también ofrece AVIF y WebP.
- Todas las capturas conservan `src`, `srcset` y `<source>` en el HTML prerenderizado; las inferiores usan lazy loading nativo.
- La imagen NFC dejó de cargarse como eager.
- Los textos alternativos describen capturas informativas; las portadas decorativas mantienen `alt=""`.
- Permanecen originales PNG grandes como fallback y fuente de generación. No afectan la transferencia habitual de navegadores modernos, pero sí aumentan el tamaño del despliegue.
- NexusPOS ahora puede servir el AVIF de 67,9 KB en lugar del WebP de 452,8 KB para su imagen principal, un ahorro aproximado del 85% en navegadores compatibles.

### GEO y búsqueda con IA

- `llms.txt` ofrece rutas principales, casos, contacto y reglas para no inventar precios o capacidades.
- Cada ruta puede responder Markdown mediante negociación de contenido y publica descubrimiento en el `<head>`.
- Organization, WebSite, WebPage, Service, Person y CreativeWork forman un grafo consistente con IDs estables.
- Se añadieron dos pasajes breves y autocontenidos sobre qué es NovaLine y cómo trabaja, adecuados para extracción/citación.
- `robots.txt` permite crawlers de IA de forma intencional.

La auditoría especializada inicial puntuó la preparación GEO en 67/100: Google AI Overviews 71, ChatGPT Search 73, Perplexity 57 y Bing Copilot 62. La estimación local posterior sube a 75/100 por los bloques y Markdown reforzados, pero no se considera resuelta la falta de autoridad externa.

Brechas: faltan menciones externas verificables, perfiles oficiales enlazables (`sameAs`) y evidencia de terceros. Esas señales no pueden resolverse solo con código.

### SXO y competencia SERP

La consulta “desarrollo de software a la medida Colombia” devuelve principalmente páginas de servicio o híbridas, no artículos. La página de Servicios tiene el tipo correcto. La auditoría SXO previa puntuó Inicio en 72/100 y Servicios en 74/100; la ampliación local corrige parte de la orientación y profundidad, pero no sustituye evidencia comercial real. Los resultados visibles suelen resolver cinco preguntas: qué se construye, cuándo conviene, proceso, costo/plazo y propiedad/soporte.

NovaLine ya cubre qué se construye, criterios, proceso y soporte. No publica costos, plazos ni propiedad de código; se mantuvieron fuera porque no había información verificable. Las personas prioritarias son:

1. Dirección/operaciones: necesita encaje con procesos y reducción de trabajo manual.
2. Evaluador técnico: necesita arquitectura, integración, seguridad, propiedad y mantenimiento.
3. Comprador sensible al presupuesto: necesita entender variables de alcance, etapas y forma de estimación.
4. Empresa colombiana: busca cercanía, contexto local y un canal directo.

### Autoridad y backlinks

- Las consultas de marca, dominio y teléfono no mostraron menciones externas relevantes.
- La búsqueda `site:novalinesoftware.com` no devolvió resultados durante la revisión. Esto sugiere visibilidad/indexación incipiente, pero no confirma exclusión sin datos de Google Search Console.
- No se encontraron credenciales de Moz, DataForSEO, Bing Webmaster Tools ni Google Search Console; por tanto, no se reportan cifras inventadas de autoridad, dominios de referencia o enlaces tóxicos.

## Validaciones ejecutadas

- `npm run build`: correcto; 9/9 rutas prerenderizadas.
- `npm test -- --run`: 68/68 pruebas correctas.
- `npm run test:seo`: correcto para las nueve rutas.
- JSON-LD parseable en todas las páginas.
- Sitemap: 9/9 rutas, cero duplicados, HTTPS y barra final.
- Producción: 9/9 rutas canónicas respondieron 200 durante la auditoría.
- Viewports revisados: 375×812, 768×1024, 1366×768 y 1920×1080; no se encontró overflow horizontal global.

## Limitaciones

- Los cambios no se desplegaron desde esta auditoría.
- No hubo acceso autenticado a Search Console, GA4, CrUX, Bing Webmaster Tools, DataForSEO o un índice de backlinks de pago.
- La ausencia en búsquedas manuales no sustituye el estado de indexación de Search Console.
- La nueva estrategia de carga del video y analítica necesita una nueva medición Lighthouse después del despliegue; el intento local final no produjo un informe fiable.
- La comprobación visual final automatizada a 375×812 quedó inconclusa porque Edge/CDP se bloqueó. El build y el preview sí arrancaron; la auditoría visual previa no mostraba corte gris ni overflow, y las correcciones de header/CTA quedaron cubiertas por código y pruebas, no por una captura nueva.

## Referencias principales

- Google: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google: https://developers.google.com/search/docs/appearance/structured-data/organization
- Google: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- Google: https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping
- Vercel: https://vercel.com/docs/caching/cache-control-headers
