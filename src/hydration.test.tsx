import React, { act } from 'react'
import { hydrateRoot, type Root } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { PUBLIC_ROUTES } from './routes'

describe('hidratación del HTML prerenderizado', () => {
  let root: Root | undefined

  ;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true

  afterEach(async () => {
    if (root) await act(async () => root?.unmount())
    root = undefined
  })

  it.each(PUBLIC_ROUTES)('hidrata $path sin diferencias recuperables', async (route) => {
    window.history.replaceState({}, '', route.path)
    const container = document.createElement('div')
    container.id = 'root'
    container.innerHTML = renderToString(
      <React.StrictMode>
        <App initialPath={route.path} />
      </React.StrictMode>,
    )
    document.body.appendChild(container)

    const recoverableErrors: unknown[] = []
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    await act(async () => {
      root = hydrateRoot(
        container,
        <React.StrictMode>
          <App initialPath={route.path} />
        </React.StrictMode>,
        { onRecoverableError: (error) => recoverableErrors.push(error) },
      )
      await Promise.resolve()
    })

    expect(recoverableErrors).toEqual([])
    expect(consoleError).not.toHaveBeenCalled()
    consoleError.mockRestore()
    container.remove()
  })
})
