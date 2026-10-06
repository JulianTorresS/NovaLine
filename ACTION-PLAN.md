# Plan de acción SEO de NovaLine

Fecha base: 5 de octubre de 2026

## P0 — Despliegue y comprobación (mismo día)

| Acción | Responsable sugerido | Esfuerzo | Criterio de cierre |
|---|---|---:|---|
| Desplegar el build auditado | Desarrollo | 15 min | Producción usa los nuevos hashes y metadatos |
| Verificar `www → apex` | Desarrollo | 10 min | `https://www.novalinesoftware.com/*` devuelve 308/301 al canonical |
| Verificar barra final | Desarrollo | 10 min | `/servicios` redirige en un salto a `/servicios/` |
| Verificar cabeceras | Desarrollo | 10 min | `nosniff`, frame protection, Referrer-Policy y Permissions-Policy presentes |
| Repetir Lighthouse móvil | Desarrollo/SEO | 20 min | Sin regresión; documentar LCP, CLS, TBT y transferencia de video |

## P1 — Indexación y medición (primera semana)

1. Crear o validar la propiedad de dominio en Google Search Console.
2. Enviar `https://novalinesoftware.com/sitemap.xml`.
3. Inspeccionar las nueve URLs y solicitar indexación solo después del despliegue.
4. Revisar cobertura, canonical elegido por Google y páginas descubiertas durante 14–28 días.
5. Conectar CrUX/PageSpeed o guardar un baseline Lighthouse recurrente.
6. Confirmar en GA4 que los eventos `contact_click`, `project_view` y `cta_click` siguen llegando con la carga diferida.

## P1 — Evidencia y confianza (2–4 semanas)

Completar cada caso con datos que el equipo o cliente pueda autorizar:

- fecha o periodo del proyecto;
- rol y alcance de NovaLine;
- tecnologías e integraciones reales;
- situación inicial y criterio de éxito;
- resultado medible con unidad y periodo;
- testimonio atribuible o evidencia visual;
- estado actual del producto.

No publicar métricas aproximadas como hechos. Si un dato es confidencial, usar una descripción cualitativa explícita.

Añadir, cuando existan realmente:

- correo profesional del dominio;
- perfiles oficiales del equipo o la empresa;
- información legal/comercial aplicable;
- política de soporte, propiedad del código y variables de estimación.

## P1 — Autoridad externa (primeros 60 días)

1. Crear perfiles coherentes de empresa en LinkedIn, GitHub y directorios B2B relevantes, enlazando el dominio canonical.
2. Solicitar a clientes autorización para enlazar el caso desde su sitio o perfil oficial.
3. Publicar dos piezas técnicas originales basadas en experiencia real: arquitectura de un CRM operativo y automatización con IA/documentos.
4. Buscar alianzas con cámaras, comunidades tecnológicas y proveedores colombianos; priorizar relevancia sobre volumen.
5. Evitar paquetes de enlaces, directorios masivos y anchors exactos repetitivos.

KPI inicial: conseguir las primeras 5–10 menciones de dominios reales y relevantes, no una cifra de “autoridad” aislada.

## P2 — Contenido y arquitectura (30–90 días)

- Crear una página índice `/proyectos/` solo cuando pueda aportar resumen único, filtros útiles y enlaces a todos los casos; después actualizar breadcrumbs.
- Profundizar cada caso por encima de la simple descripción visual, sin rellenar con texto genérico.
- Publicar páginas específicas únicamente para servicios con demanda y evidencia suficiente, por ejemplo CRM a medida o automatización de procesos. Evitar páginas clonadas.
- Incorporar una sección de criterios técnicos: integraciones, seguridad, migración, mantenimiento y propiedad del código, previa validación comercial.
- Revisar consultas y CTR en Search Console antes de crear un calendario editorial.

## P2 — Rendimiento (30–60 días)

- Medir el ahorro real de la carga diferida del video y analítica.
- Considerar una versión WebM/AV1 del hero si mejora tamaño y compatibilidad.
- Dividir los casos con imports dinámicos si el JS móvil continúa mostrando código no usado significativo.
- Separar CSS crítico/rutas solo si Lighthouse mantiene un bloqueo material; hoy el score visual inicial ya es alto.
- Versionar cualquier asset público que se vaya a servir con caché inmutable.

## Seguimiento mensual

| KPI | Fuente | Punto de partida |
|---|---|---|
| URLs indexadas válidas | Search Console | Sin datos autenticados |
| Clics, impresiones, CTR y posición | Search Console | Sin datos autenticados |
| Conversiones a WhatsApp por landing | GA4 | Eventos implementados; validar post-despliegue |
| LCP, INP y CLS de campo | CrUX/Search Console | Sin datos de campo |
| Dominios de referencia relevantes | Herramienta de backlinks/GSC | Sin baseline autenticado |
| Leads por servicio/caso | GA4/CRM | Definir con el equipo |

