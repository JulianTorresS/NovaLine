import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const projectRoot = process.cwd()
const distDir = path.join(projectRoot, 'dist')
const serverDir = path.join(projectRoot, '.ssr-dist')
const templatePath = path.join(distDir, 'index.html')
const serverEntry = path.join(serverDir, 'entry-server.js')

const template = await readFile(templatePath, 'utf8')
const { prerenderRoutes, renderPage } = await import(pathToFileURL(serverEntry).href)

function renderSitemap(routes) {
  const lastmod = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date())
  const urls = routes.map((route) => `  <url><loc>https://novalinesoftware.com${route}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

try {
  for (const route of prerenderRoutes) {
    const { appHtml, headHtml } = renderPage(route)
    const html = template
      .replace('<!--seo-head-->', headHtml)
      .replace('<!--app-html-->', appHtml)
    const outputDir = route === '/' ? distDir : path.join(distDir, route.slice(1))
    await mkdir(outputDir, { recursive: true })
    await writeFile(path.join(outputDir, 'index.html'), html, 'utf8')
  }
  await writeFile(path.join(distDir, 'sitemap.xml'), renderSitemap(prerenderRoutes), 'utf8')
} finally {
  await rm(serverDir, { recursive: true, force: true })
}

console.log(`Prerendered ${prerenderRoutes.length} public routes.`)
