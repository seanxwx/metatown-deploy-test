import '@testing-library/jest-dom/vitest'
import failOnConsole from 'vitest-fail-on-console'
import { vi } from 'vitest'

failOnConsole()

beforeEach(() => {
  const modalRoot = document.createElement('div')
  modalRoot.setAttribute('id', 'modal-root')
  document.body.appendChild(modalRoot)
})

afterEach(() => {
  const modalRoot = document.getElementById('modal-root')
  if (modalRoot) {
    document.body.removeChild(modalRoot)
  }
})

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })
  )

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      disconnect = vi.fn()
      observe = vi.fn()
      unobserve = vi.fn()
    }
  )

  vi.stubGlobal(
    'ResizeObserver',
    class {
      disconnect = vi.fn()
      observe = vi.fn()
      unobserve = vi.fn()
    }
  )
})

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

beforeEach(() => {
  HTMLElement.prototype.scrollIntoView = vi.fn()
})

/* eslint-disable no-var */
declare global {
  var jest: typeof vi
}
/* eslint-enable no-var */
// https://github.com/testing-library/react-testing-library/issues/1197
global.jest = vi
