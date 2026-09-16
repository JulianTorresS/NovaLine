import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(cleanup)

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly scrollMargin = ''
  readonly thresholds = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}

Object.defineProperty(window, 'IntersectionObserver', { value: IntersectionObserverMock, writable: true })
Object.defineProperty(globalThis, 'IntersectionObserver', { value: IntersectionObserverMock, writable: true })
Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true })
