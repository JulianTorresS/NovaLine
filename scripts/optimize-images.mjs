import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const publicDir = path.join(root, 'public')
const generated = []

async function encode(inputRelative, outputRelative, width, { preserveDetail = false } = {}) {
  const input = path.join(publicDir, inputRelative)
  const outputBase = path.join(publicDir, outputRelative)
  await mkdir(path.dirname(outputBase), { recursive: true })

  const source = sharp(input).resize({ width, withoutEnlargement: true })
  const webpPath = `${outputBase}.webp`

  if (preserveDetail) {
    await source.webp({ nearLossless: true, quality: 90, effort: 6 }).toFile(webpPath)
    generated.push({
      file: path.relative(root, webpPath).replaceAll('\\', '/'),
      bytes: (await stat(webpPath)).size,
    })
    return
  }

  const avifPath = `${outputBase}.avif`
  await Promise.all([
    source.clone().avif({ quality: 65, effort: 6, chromaSubsampling: '4:4:4' }).toFile(avifPath),
    source.clone().webp({ quality: 82, effort: 6, smartSubsample: true }).toFile(webpPath),
  ])

  for (const output of [avifPath, webpPath]) {
    generated.push({
      file: path.relative(root, output).replaceAll('\\', '/'),
      bytes: (await stat(output)).size,
    })
  }
}

await Promise.all([
  ...[320, 640, 1063].map((width) => encode(
    'assets/google-review-nfc-card-real.png',
    `assets/responsive/google-review-nfc-card-real-${width}`,
    width,
  )),
  ...[
    ['crm-formula-animal', 'cover.png'],
    ['native-haus', 'cover.png'],
    ['nexus-pos', 'cover.png'],
    ['lia', 'cover.png'],
  ].flatMap(([folder, filename]) => [384, 744].map((width) => encode(
    `assets/${folder}/${filename}`,
    `assets/${folder}/responsive/cover-${width}`,
    width,
  ))),
  ...[
    ['team/WhatsApp Image 2026-09-15 at 12.24.01 PM.jpeg', 'santiago'],
    ['team/ChatGPT Image 15 sept 2026, 04_50_50 p.m.png', 'julian'],
  ].flatMap(([filename, stem]) => [320, 640].map((width) => encode(
    `assets/${filename}`,
    `assets/team/responsive/${stem}-${width}`,
    width,
  ))),
])

for (const project of ['crm-formula-animal', 'native-haus', 'nexus-pos', 'lia']) {
  const responsiveDir = path.join(publicDir, 'assets', project, 'responsive')
  const files = await readdir(responsiveDir)
  for (const filename of files.filter((file) => file.endsWith('.png') && !file.startsWith('cover-'))) {
    const width = Number(filename.match(/-(\d+)\.png$/)?.[1])
    if (!width) continue
    await encode(
      `assets/${project}/responsive/${filename}`,
      `assets/${project}/responsive/${filename.replace(/\.png$/, '')}`,
      width,
      { preserveDetail: true },
    )
  }
}

generated.sort((a, b) => b.bytes - a.bytes)
const total = generated.reduce((sum, item) => sum + item.bytes, 0)
console.log(`Generated ${generated.length} optimized images (${(total / 1024 / 1024).toFixed(2)} MiB).`)
for (const item of generated) console.log(`${(item.bytes / 1024).toFixed(1).padStart(8)} KiB  ${item.file}`)
