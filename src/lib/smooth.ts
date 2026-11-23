import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

let lenis: Lenis | null = null

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Start inertial smooth scrolling (skipped for reduced-motion users). */
export function initSmoothScroll() {
  if (lenis || reduced()) return lenis
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.1,
    wheelMultiplier: 1,
    touchMultiplier: 1.2,
  })
  return lenis
}

export function destroySmoothScroll() {
  lenis?.destroy()
  lenis = null
}

/** Scroll to an element id or a y position, through Lenis when active. */
export function scrollToTarget(target: string | number, opts: { immediate?: boolean; offset?: number } = {}) {
  const offset = opts.offset ?? -96
  if (typeof target === 'string') {
    const el = document.getElementById(target)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset, immediate: opts.immediate })
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: reduced() || opts.immediate ? 'auto' : 'smooth' })
    return
  }
  if (lenis) lenis.scrollTo(target, { immediate: opts.immediate, force: true })
  else window.scrollTo({ top: target, behavior: reduced() || opts.immediate ? 'auto' : 'smooth' })
}

/** Pause page scrolling while an overlay (menu, lightbox) is open. */
export function lockScroll(locked: boolean) {
  if (lenis) (locked ? lenis.stop() : lenis.start())
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

/**
 * Scroll to an in-page section from a URL hash once fonts and layout have settled,
 * then correct once more if the page grew above it. Stops correcting if the visitor scrolls.
 */
export function scrollToHash(id: string, offset = -96) {
  let userMoved = false
  const stop = () => { userMoved = true }
  window.addEventListener('wheel', stop, { once: true, passive: true })
  window.addEventListener('touchstart', stop, { once: true, passive: true })
  window.addEventListener('keydown', stop, { once: true })
  const go = (immediate: boolean) => { if (!userMoved) scrollToTarget(id, { offset, immediate }) }
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
  const ready = fonts?.ready ?? Promise.resolve()
  ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
    go(false)
    window.setTimeout(() => {
      const el = document.getElementById(id)
      if (el && Math.abs(el.getBoundingClientRect().top + offset) > 40) go(false)
    }, 1300)
    window.setTimeout(() => {
      window.removeEventListener('wheel', stop); window.removeEventListener('touchstart', stop); window.removeEventListener('keydown', stop)
    }, 2500)
  })))
}
