import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion, useScroll, useTransform, animate } from 'motion/react'
import { ArrowRight, ChevronDown, ChevronRight, Phone } from 'lucide-react'
import { site, waLink } from '../data/site'

/** Short label on phones, full label from 640px. */
export function RL({ short, long }: { short: string; long: string }) {
  return <><span className="sm:hidden">{short}</span><span className="hidden sm:inline">{long}</span></>
}

export function useMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Meena IVF & Fertility Care` : 'Meena IVF & Fertility Care | Where family begins'
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}

export function Reveal({ children, delay = 0, className = '', y = 24, as = 'div', id }: { children: ReactNode; delay?: number; className?: string; y?: number; as?: 'div' | 'li' | 'section'; id?: string }) {
  const reduce = useReducedMotion()
  const M = as === 'li' ? motion.li : as === 'section' ? motion.section : motion.div
  return (
    <M
      id={id}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}

export function Counter({ to, suffix = '', className = '' }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, to, reduce])
  return <span ref={ref} className={className}>{val}{suffix}</span>
}

export function Logo({ light = false, className = 'h-8' }: { light?: boolean; className?: string }) {
  return <img src={light ? '/img/logo-white.webp' : '/img/logo-color.webp'} alt="Meena IVF" className={`${className} w-auto`} width={900} height={146} />
}

export function SectionHeader({ eyebrow, title, text, align = 'left', action, light = false }: { eyebrow?: string; title: ReactNode; text?: ReactNode; align?: 'left' | 'center'; action?: ReactNode; light?: boolean }) {
  return (
    <div className={`mb-10 flex flex-col gap-6 md:mb-14 ${align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'}`}>
      <Reveal className={align === 'center' ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <p className={`eyebrow mb-4 ${light ? '!text-lilac' : ''}`}>{eyebrow}</p>}
        <h2 className={`h2 text-balance ${light ? '!text-paper' : ''}`}>{title}</h2>
        {text && <p className={`mt-4 text-pretty text-lg leading-relaxed ${light ? 'text-paper/75' : 'text-ink-2'}`}>{text}</p>}
      </Reveal>
      {action && <Reveal delay={0.1} className="shrink-0">{action}</Reveal>}
    </div>
  )
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-x-1.5">
        <li><Link to="/" className="inline-flex min-h-[2.75rem] items-center hover:text-plum">Home</Link></li>
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
            {it.to ? <Link to={it.to} className="inline-flex min-h-[2.75rem] items-center hover:text-plum">{it.label}</Link> : <span aria-current="page" className="text-ink-2">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function PageHero({ eyebrow, title, text, crumbs, children, image, tone = 'mist' }: { eyebrow?: string; title: ReactNode; text?: ReactNode; crumbs: { label: string; to?: string }[]; children?: ReactNode; image?: string; tone?: 'mist' | 'blush' | 'paper' }) {
  const bg = tone === 'mist' ? 'bg-mist' : tone === 'blush' ? 'bg-blush' : 'bg-paper'
  return (
    <section className={`relative overflow-hidden ${bg} grain`}>
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(128,41,143,.10),transparent)]" />
      <div className={`container-x relative pb-14 pt-32 md:pb-20 md:pt-40 ${image ? 'grid items-end gap-10 lg:grid-cols-[1.2fr_.8fr]' : ''}`}>
        <div>
          <Breadcrumbs items={crumbs} />
          <Reveal>
            {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
            <h1 className="h1 max-w-3xl text-balance">{title}</h1>
            {text && <p className="lead mt-5 max-w-2xl text-pretty">{text}</p>}
            {children && <div className="btn-pair mt-8">{children}</div>}
          </Reveal>
        </div>
        {image && <HeroArch src={image} />}
      </div>
    </section>
  )
}

function HeroArch({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-8%', '8%'])
  return (
    <Reveal delay={0.15} className="hidden lg:block">
      <div ref={ref} className="arch aspect-[4/5] overflow-hidden shadow-lift">
        <motion.img style={{ y, scale: 1.18 }} src={src} alt="" className="h-full w-full object-cover" />
      </div>
    </Reveal>
  )
}

export function CTABand({ title = 'Your next step can be a gentle one.', text = 'Talk to our fertility team today. We will listen, explain your options clearly and help you choose the right specialist and centre.' }: { title?: string; text?: string }) {
  return (
    <section className="container-x pb-20 md:pb-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-panel bg-plum-900 px-6 py-14 text-paper md:px-16 md:py-20">
          <div aria-hidden className="absolute -bottom-1/2 right-[-10%] h-[140%] w-[60%] rounded-t-full bg-plum/40" />
          <div aria-hidden className="absolute -bottom-1/2 right-[12%] h-[110%] w-[38%] rounded-t-full bg-lavender/25" />
          <div className="relative max-w-2xl">
            <p className="eyebrow mb-5 !text-lilac">Book a consultation</p>
            <h2 className="h2 text-balance !text-paper">{title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-paper/75">{text}</p>
            <div className="btn-trio mt-9">
              <Link to="/book" className="btn-light">Book appointment <ArrowRight className="h-4 w-4" /></Link>
              <a href={site.hotlineHref} className="btn-ghost-light"><Phone className="h-4 w-4" /> <RL short="Call" long={site.hotline} /></a>
              <a href={waLink()} target="_blank" rel="noreferrer" className="btn-ghost-light"><WhatsAppIcon className="h-[1.125rem] w-[1.125rem] text-whatsapp" /> WhatsApp</a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export function Accordion({ items, defaultOpen = -1 }: { items: { q: string; a: ReactNode }[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === i
        const id = `acc-${it.q.replace(/\W+/g, '-').slice(0, 40)}-${i}`
        return (
          <div key={it.q}>
            <h3 className="font-sans text-base">
              <button
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left font-semibold text-ink transition hover:text-plum"
              >
                <span className="text-[1.0625rem] tracking-normal">{it.q}</span>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line transition ${isOpen ? 'rotate-180 border-plum bg-plum text-white' : ''}`}>
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>
            </h3>
            <div id={id} role="region" hidden={!isOpen} className="pb-6 pr-12 text-[1rem] leading-relaxed text-ink-2">{it.a}</div>
          </div>
        )
      })}
    </div>
  )
}

export function Img({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) {
  return <img src={src} alt={alt} loading="lazy" decoding="async" className={className} />
}

/* Brand icons (lucide no longer ships brand marks) */
export const WhatsAppIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.700 15.600 2.200 13.800 2.200 12 2.200 6.600 6.600 2.200 12 2.200S21.800 6.600 21.800 12 17.400 21.800 12 21.800zM12 0C5.400 0 0 5.400 0 12c0 2.100.6 4.200 1.600 6L0 24l6.200-1.600c1.700 1 3.700 1.500 5.800 1.500 6.600 0 12-5.400 12-12S18.600 0 12 0z" /></svg>
)
export const FacebookIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.800c0-.9.3-1.500 1.600-1.500h1.700V4.400c-.3 0-1.300-.1-2.500-.1-2.400 0-4.100 1.500-4.100 4.200v2.300H7.500V14h2.700v8h3.300z" /></svg>
)
export const InstagramIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
)
export const YoutubeIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M23 7.200a3 3 0 0 0-2.100-2.100C19 4.600 12 4.600 12 4.600s-7 0-8.900.5A3 3 0 0 0 1 7.200 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.800 3 3 0 0 0 2.100 2.100c1.900.5 8.900.5 8.900.5s7 0 8.900-.5a3 3 0 0 0 2.100-2.100 31 31 0 0 0 .5-4.800 31 31 0 0 0-.5-4.800zM9.700 15.100V8.900l5.800 3.100-5.800 3.100z" /></svg>
)
export const LinkedinIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M4.500 3.500a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h3v12H3zM9 9h2.900v1.600h.1c.4-.8 1.400-1.700 2.900-1.700 3.100 0 3.700 2 3.700 4.700V21h-3v-6.500c0-1.500 0-3.500-2.100-3.500s-2.500 1.600-2.500 3.400V21H9z" /></svg>
)
