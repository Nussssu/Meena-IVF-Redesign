import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1] as const

/** True on devices with a precise pointer that can hover (mouse / trackpad). */
export const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** A statement whose words fill from pale to ink as it scrolls through the viewport. */
export function ScrollWords({ text, className = '', light = false }: { text: string; className?: string; light?: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 45%'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} reduce={!!reduce} light={light}>{w}</Word>
      ))}
    </p>
  )
}
function Word({ children, progress, range, reduce, light }: { children: string; progress: MotionValue<number>; range: [number, number]; reduce: boolean; light: boolean }) {
  const opacity = useTransform(progress, range, [light ? 0.25 : 0.18, 1])
  return <motion.span style={{ opacity: reduce ? 1 : opacity }} className="mr-[0.25em] inline-block">{children}</motion.span>
}

/** Primary buttons lean gently toward the cursor (pointer devices only). */
export function Magnetic({ children, strength = 6, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 300, damping: 30 }), sy = useSpring(y, { stiffness: 300, damping: 30 })
  return (
    <motion.span className={`inline-flex ${className}`} style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        x.set(((e.clientX - r.left) / r.width - 0.5) * strength * 2)
        y.set(((e.clientY - r.top) / r.height - 0.5) * strength * 2)
      }}
      onPointerLeave={() => { x.set(0); y.set(0) }}>
      {children}
    </motion.span>
  )
}

/** Photo unveils with a vertical wipe when it enters the screen. */
export function ImageReveal({ src, alt = '', className = '', imgClassName = '' }: { src: string; alt?: string; className?: string; imgClassName?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div className={`overflow-hidden ${className}`}
      initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}>
      <motion.img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${imgClassName}`}
        initial={reduce ? false : { scale: 1.15 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE }} />
    </motion.div>
  )
}

/** A ribbon of large words that slides only while the visitor scrolls (no idle looping). */
export function ScrollRibbon({ words, reverse = false, className = '' }: { words: string[]; reverse?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], reverse ? ['-25%', '0%'] : ['0%', '-25%'])
  const row = [...words, ...words, ...words]
  return (
    <div ref={ref} className={`overflow-hidden ${className}`} aria-hidden>
      <motion.div style={{ x: reduce ? 0 : x }} className="flex w-max items-center gap-8 whitespace-nowrap md:gap-12">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8 md:gap-12">
            <span className={i % 2 ? 'text-transparent [-webkit-text-stroke:1px_#80298F]' : 'italic text-plum'}>{w}</span>
            <svg viewBox="0 0 24 24" className="h-[0.35em] w-[0.35em] text-lavender" fill="currentColor"><path d="M12 0c1 6.5 5.5 11 12 12-6.5 1-11 5.5-12 12-1-6.5-5.5-11-12-12C6.5 11 11 6.5 12 0z" /></svg>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/** Plum curtain that lifts on every route change. */
export function PageCurtain({ routeKey }: { routeKey: string }) {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <motion.div key={routeKey} aria-hidden className="pointer-events-none fixed inset-0 z-[90] grid origin-top place-items-center bg-plum-900"
      initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ duration: 0.3, delay: 0.1, ease: [0.7, 0, 0.84, 0] }}>
      <motion.img src="/img/logo-mark.webp" alt="" className="h-14 w-14" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.15 }} />
    </motion.div>
  )
}

/** Hides on scroll down, returns on scroll up. */
export function useHideOnScroll(threshold = 140) {
  const [hidden, setHidden] = useState(false)
  const last = useRef(0)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => {
    const dy = y - last.current
    if (y < threshold) setHidden(false)
    else if (dy > 6) setHidden(true)
    else if (dy < -6) setHidden(false)
    last.current = y
  })
  return hidden
}
