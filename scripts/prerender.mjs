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
} finally {
  await rm(serverDir, { recursive: true, force: true })
}

console.log(`Prerendered ${prerenderRoutes.length} public routes.`)
