import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { PUBLIC_ROUTES } from './routes'
import { renderSeoHead } from './seo'

export const prerenderRoutes = PUBLIC_ROUTES.map((route) => route.path)

export function renderPage(pathname: string) {
  return {
    appHtml: renderToString(
      <React.StrictMode>
        <App initialPath={pathname} />
      </React.StrictMode>,
    ),
    headHtml: renderSeoHead(pathname),
  }
}
