# Auditoría SEO de NovaLine

Fecha: 2026-09-16  
Alcance: página principal del proyecto Vite/React, medida en producción local (`http://127.0.0.1:4173/`).  
Limitación principal: el repositorio no define un dominio público. No fue posible validar Search Console, CrUX, backlinks, posiciones reales ni cabeceras del hosting final.

## Resumen ejecutivo

**Puntuación SEO provisional: 52/100.** La página tiene una propuesta clara, contenido suficiente y una buena base visual, pero todavía no está preparada para competir orgánicamente. Los bloqueos principales son la ausencia de URLs indexables para los casos de estudio, el HTML inicial vacío de la SPA, `robots.txt` y `sitemap.xml` inexistentes, falta de canonical y Schema, y una señal de entidad pública prácticamente nula para buscadores con IA.

| Área | Puntuación | Hallazgo principal |
|---|---:|---|
| SEO técnico e indexación | 42/100 | El contenido depende de JavaScript y las rutas usan fragmentos `#`, que no crean páginas indexables independientes. |
| Contenido | 72/100 | 695 palabras renderizadas, un H1 y jerarquía clara; faltan pruebas, fuentes y páginas temáticas profundas. |
| On-page y metadatos | 67/100 | Buen title; descripción corta y faltan canonical, `og:url`, `og:image` y Twitter Cards. |
| Schema | 0/100 | No se detectó JSON-LD, Microdata ni RDFa. |
| Rendimiento | 71/100 móvil | Lighthouse móvil: LCP simulado 11,3 s, FCP 2,5 s, TBT 0 ms y CLS 0. |
| Preparación para buscadores con IA | 28/100 | Sin HTML prerenderizado, `llms.txt`, Schema, fuentes citables ni señales de entidad verificables. |
| Imágenes | 64/100 | Buen uso general de `alt`, pero 2,27 MB transferidos y una imagen NFC de 1,50 MB sin dimensiones. |

## Evidencia

### Rendimiento

| Métrica Lighthouse | Móvil | Escritorio |
|---|---:|---:|
| Performance | 71 | 90 |
| SEO | 91 | 91 |
| Accessibility | 86 | 86 |
| Best Practices | 100 | 100 |
| FCP | 2,5 s | 0,8 s |
| LCP simulado | 11,3 s | 2,0 s |
| TBT | 0 ms | 0 ms |
| CLS | 0 | 0,001 |
| Transferencia | 2,27 MB | 2,27 MB |

El LCP móvil observado en la traza fue 1,43 s, pero el modelo de throttling de Lighthouse lo estimó en 11,3 s. Sin datos de campo de CrUX no debe tratarse como un Core Web Vital real; sí es una señal de riesgo que justifica optimización y una nueva medición sobre el dominio público.

Principales costes:

- `/assets/google-review-nfc-card-real.png`: 1,50 MB; carga de forma eager aunque su slide esté oculto y no declara `width`/`height`.
- Los cuatro covers PNG cargados en la home suman cerca de 589 KB; Lighthouse estima unos 537 KiB de ahorro con AVIF/WebP y tamaños adecuados.
- La hoja de Google Fonts es bloqueante; Lighthouse estima 949 ms de ahorro potencial en esa cadena.
- El bundle principal pesa 281 KB sin comprimir (83,94 KB gzip) y contiene la home, Nosotros y cuatro casos de estudio en una sola ruta.

### Metadatos y on-page

- `title`: “NovaLine | Software a la medida en Colombia”, 43 caracteres. Es relevante y está dentro del rango seguro, aunque puede reforzarse con “desarrollo”.
- Meta description: 106 caracteres; queda por debajo del objetivo de 120–160 y no contiene una llamada a la acción.
- H1: uno, correcto, pero no usa la frase objetivo completa “software a la medida”.
- Contenido renderizado: aproximadamente 695 palabras; supera el mínimo de 500 para una home.
- Jerarquía: 1 H1, 6 H2 y 17 H3, sin un fallo estructural grave.
- Open Graph parcial: existen título, descripción y tipo; faltan URL e imagen.
- Faltan canonical, Twitter Card y `meta robots` explícita.
- Los casos y la página Nosotros usan fragmentos (`#proyecto-*`, `#nosotros`) y cambian el title con JavaScript. Para el rastreador son variantes de la misma URL, sin metadatos, canonical ni contenido inicial propios.

### Indexación y rastreo

- No existen `public/robots.txt`, `public/sitemap.xml` ni `public/llms.txt`.
- La fallback de Vite devuelve el HTML de la home con estado 200 para esas rutas. Lighthouse interpreta `/robots.txt` como un archivo inválido con 22 errores.
- El HTML inicial contiene solamente `<div id="root"></div>`; el texto, los enlaces, las imágenes y los encabezados aparecen después de ejecutar JavaScript.
- No hay dominio canónico ni sitemap que permita descubrir páginas porque actualmente no existen URLs HTML independientes.
- HTTPS, redirecciones, HSTS, CSP y demás cabeceras de producción no son evaluables hasta disponer del despliegue público.

### Imágenes

- La home renderiza 11 elementos `img`; los covers decorativos usan `alt=""` correctamente y la imagen NFC tiene un alt descriptivo.
- La imagen NFC no tiene dimensiones explícitas y es el mayor recurso de la página.
- Los covers tienen dimensiones, lazy loading y decoding asíncrono, pero solo se sirven como PNG y a 744 px incluso cuando se muestran cerca de 377 px.
- Los assets del repositorio ocupan 42,91 MiB; hay variantes de hasta 3,15 MiB. Las imágenes de casos deben cargarse únicamente en sus páginas, no formar parte de una carga o bundle compartido innecesario.

### Schema

No se detectó ningún marcado estructurado. Para la home se recomiendan, una vez definido el dominio público y solo con datos verificables:

1. `Organization` con `name`, `url`, `logo`, `contactPoint` y perfiles reales en `sameAs`.
2. `WebSite` y `WebPage` enlazados mediante `@id`.
3. `Service` para “software a la medida”, con `provider` y `areaServed: Colombia`.
4. `Person` en la página del equipo y `CreativeWork`/`WebPage` en casos de estudio, si se convierten en URLs reales.

No se recomienda `HowTo`. Tampoco conviene añadir `FAQPage` buscando rich results: NovaLine no es un sitio gubernamental ni sanitario.

### Posicionamiento en buscadores con IA (GEO)

La preparación actual es baja (28/100):

- El contenido crítico no está en el HTML inicial; esto limita a rastreadores que no ejecutan JavaScript.
- No hay `llms.txt`, Schema ni una política explícita para GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot y PerplexityBot.
- La home explica servicios, pero no contiene bloques autocontenidos con definiciones, datos originales, resultados cuantificados o fuentes primarias.
- Los casos de estudio son útiles para autoridad, pero no tienen URLs indexables, fechas, autoría ni métricas verificables.
- Una búsqueda pública de muestra por marca + servicio + Colombia no mostró esta entidad; sí mostró homónimos y competidores. La marca necesita un dominio propio, perfiles consistentes y menciones externas para desambiguarse.

## Plan priorizado

### Crítico

1. Publicar bajo un dominio definitivo y convertir Nosotros, Servicios y cada caso de estudio en URLs reales (`/nosotros/`, `/servicios/software-a-la-medida/`, `/proyectos/lia/`, etc.).
2. Servir HTML prerenderizado o SSR con title, description, canonical, H1, contenido y JSON-LD presentes en la respuesta inicial.
3. Crear `robots.txt` y `sitemap.xml` reales; evitar que la fallback SPA responda HTML con 200 para archivos técnicos inexistentes.

### Alto

4. Añadir canonical, `og:url`, `og:image`, Twitter Cards y una meta description de 120–160 caracteres con propuesta y CTA.
5. Implementar JSON-LD de `Organization`, `WebSite`, `WebPage` y `Service` cuando se conozcan las URLs absolutas, el logo público y los perfiles oficiales.
6. Optimizar la imagen NFC a AVIF/WebP, añadir dimensiones y cargarla solo cuando su slide vaya a mostrarse. Servir covers responsivos en formato moderno.
7. Repetir Lighthouse en el dominio público y activar Search Console/CrUX; el LCP actual es de laboratorio, no de usuarios reales.

### Medio

8. Crear una página específica para “desarrollo de software a la medida en Colombia” y enlazarla desde la home con texto descriptivo.
9. Convertir cada caso en una prueba citable: problema, solución, alcance, resultado medible, fecha, responsables y capturas con contexto.
10. Añadir `/llms.txt`, permitir los bots de búsqueda con IA deseados y diferenciar, si se quiere, bots de búsqueda de bots de entrenamiento.
11. Publicar bloques de respuesta directa de 134–167 palabras, datos propios y fuentes primarias; reforzar perfiles de LinkedIn y otras menciones de entidad mediante `sameAs`.
12. Corregir los fallos de accesibilidad de Lighthouse: contraste, estructura del `tablist` y controles enfocables dentro de elementos `aria-hidden`.

## Criterio de éxito tras la primera implementación

- HTML inicial con contenido completo y Schema válido.
- URLs independientes indexables, sitemap enviado y URL Inspection sin bloqueos.
- Lighthouse móvil ≥90 y LCP de campo ≤2,5 s en p75.
- Cero imágenes críticas por encima de 300 KB y cero imágenes de contenido sin dimensiones.
- La consulta de marca identifica inequívocamente a NovaLine y los servicios objetivo empiezan a registrar impresiones no branded en Search Console.

