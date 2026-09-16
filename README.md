# NovaLine

Landing page de NovaLine, un estudio de software a la medida para negocios en Colombia.

## Requisitos

- Node.js 24 o superior
- npm 10 o superior

## Desarrollo local

```bash
npm install
npm run dev
```

Vite mostrará la URL local en la terminal.

## Comandos disponibles

```bash
npm run test     # Ejecuta las pruebas automatizadas
npm run build    # Comprueba tipos y genera la versión de producción
npm run preview  # Sirve localmente la compilación de producción
```

## Estructura principal

- `src/App.tsx`: interfaz y comportamiento de la landing page.
- `src/config.ts`: contenido, navegación y datos de contacto.
- `src/styles.css`: estilos globales y responsive.
- `public/`: recursos estáticos.

## Despliegue

El proyecto es compatible con servicios de despliegue para aplicaciones Vite, como GitHub Pages, Netlify o Vercel. El comando de compilación es `npm run build` y la carpeta generada es `dist/`.

No subas credenciales ni archivos `.env`. Las variables de entorno locales están excluidas por `.gitignore`.
