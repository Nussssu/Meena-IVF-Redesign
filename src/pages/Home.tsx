import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { Activity, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, ChartNoAxesColumnIncreasing, Clock, Egg, FlaskConical, GraduationCap, Heart, MapPin, Microscope, ScanLine, ShieldCheck, Snowflake, Stethoscope, Syringe, TestTube } from 'lucide-react'
import { RL, Reveal, SectionHeader, WhatsAppIcon, useMeta } from '../components/ui'
import { DoctorCard, TodayBadge } from '../components/cards'
import { Magnetic, ScrollRibbon } from '../components/motion'
import { Embryo, EMBRYO_LABELS } from '../components/Embryo'
import { doctors, scheduleSummary } from '../data/doctors'
import { treatmentBySlug } from '../data/treatments'
import { centres, ivfJourney, journeys, testimonials } from '../data/content'
import { site, waLink } from '../data/site'
import blog from '../data/blog.json'

const EASE = [0.22, 1, 0.36, 1] as const

function useMedia(query: string) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on); on()
    return () => mq.removeEventListener('change', on)
  }, [query])
  return m
}

/* ───────────────────────── 1. Hero ───────────────────────── */
function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '14%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-18%'])

  return (
    <section ref={ref} className="grain relative overflow-hidden bg-mist">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[56rem] w-[56rem] -translate-x-1/4 -translate-y-1/3 rounded-full bg-[radial-gradient(closest-side,rgba(235,227,244,.9),transparent)]" />
      <div className="relative">
      {/* Background video — mother & baby sit on the right */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, ease: EASE }}
          className="absolute inset-0 overflow-hidden">
          <motion.video style={{ y: imgY }} src="/img/hero-video.mp4" poster="/img/hero-video-poster.webp"
            autoPlay muted loop playsInline preload="auto"
            className="h-[114%] w-full max-w-none object-cover object-[70%_30%] md:w-[135%]" />
          {/* Soft wash behind the headline so the text reads clearly */}
          <div className="absolute inset-0 bg-mist/70 md:bg-transparent md:bg-[linear-gradient(to_right,rgba(243,238,246,.88)_0%,rgba(243,238,246,.7)_35%,rgba(243,238,246,0)_58%)]" />
        </motion.div>
      </div>
      <div className="container-x relative grid items-center gap-12 pb-16 pt-28 md:grid-cols-[1.05fr_.95fr] md:gap-8 md:pt-32 lg:pb-24 lg:pt-36">
        <motion.div style={{ y: textY }}>
          <h1 className="display text-balance">
            {['Where', 'family', 'begins.'].map((w, i) => (
              <span key={w} className="-mb-[0.16em] inline-block overflow-hidden pb-[0.2em] pr-[0.04em] align-bottom">
                <motion.span className={`inline-block ${w === 'family' ? 'italic text-plum' : ''}`}
                  initial={reduce ? false : { y: '110%' }} animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.1 + i * 0.12, ease: EASE }}>{w}&nbsp;</motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="lead mt-6 max-w-xl text-pretty">
            Specialist-led fertility care with an in-house IVF lab and operation theatre, and a team that walks beside you from your first question to your first heartbeat scan.
          </motion.p>
          <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.62 }} className="btn-pair mt-9">
            <Magnetic className="w-full sm:w-auto"><Link to="/book" className="btn-primary"><RL short="Book now" long="Book a consultation" /> <ArrowRight className="h-4 w-4" /></Link></Magnetic>
            <a href={waLink()} target="_blank" rel="noreferrer" className="btn-secondary"><WhatsAppIcon className="h-[1.125rem] w-[1.125rem] text-whatsapp" /> <RL short="WhatsApp" long="Ask on WhatsApp" /></a>
          </motion.div>
        </motion.div>

        <div className="relative mx-auto w-full max-w-[34rem] md:mr-0">
          <div aria-hidden className="aspect-[4/5] w-[88%]" />
        </div>
      </div>
      </div>
    </section>
  )
}

/* ───────────────── 2. Arch window + manifesto ───────────────── */
const MANIFESTO = 'Every family begins with hope. We bring the science, the specialists and the patience to carry it, one gentle step at a time, until the day you hold your baby.'

/* "M" outline traced from the logo mark (0–1 inside its box, top edge left→right then bottom edge right→left),
   and where each point ends up when the window fills the screen: top-edge points go to the top, bottom-edge points to the bottom */
const M_SHAPE: [number, number][] = [[0.0, 0.926], [0.018, 0.866], [0.037, 0.801], [0.054, 0.738], [0.072, 0.678], [0.091, 0.61], [0.109, 0.55], [0.127, 0.49], [0.146, 0.425], [0.163, 0.365], [0.181, 0.305], [0.2, 0.24], [0.218, 0.177], [0.236, 0.114], [0.255, 0.063], [0.272, 0.033], [0.292, 0.014], [0.309, 0.003], [0.327, 0.0], [0.346, 0.003], [0.364, 0.014], [0.381, 0.027], [0.401, 0.057], [0.418, 0.104], [0.436, 0.161], [0.455, 0.232], [0.473, 0.294], [0.49, 0.354], [0.51, 0.36], [0.527, 0.297], [0.545, 0.226], [0.564, 0.155], [0.582, 0.095], [0.599, 0.054], [0.619, 0.025], [0.636, 0.011], [0.654, 0.003], [0.673, 0.0], [0.691, 0.005], [0.708, 0.014], [0.728, 0.035], [0.745, 0.068], [0.764, 0.12], [0.782, 0.183], [0.8, 0.245], [0.819, 0.308], [0.837, 0.371], [0.854, 0.433], [0.873, 0.496], [0.891, 0.556], [0.909, 0.619], [0.928, 0.681], [0.946, 0.744], [0.963, 0.807], [0.982, 0.872], [1.0, 0.932], [1.0, 0.943], [0.982, 0.965], [0.963, 0.978], [0.946, 0.989], [0.928, 0.995], [0.909, 1.0], [0.891, 1.0], [0.873, 0.995], [0.854, 0.989], [0.837, 0.978], [0.819, 0.965], [0.8, 0.946], [0.782, 0.924], [0.764, 0.896], [0.745, 0.858], [0.728, 0.809], [0.708, 0.744], [0.691, 0.684], [0.673, 0.627], [0.654, 0.678], [0.636, 0.738], [0.619, 0.801], [0.599, 0.866], [0.582, 0.921], [0.564, 0.956], [0.545, 0.981], [0.527, 0.992], [0.51, 0.997], [0.49, 0.997], [0.473, 0.992], [0.455, 0.978], [0.436, 0.954], [0.418, 0.916], [0.401, 0.861], [0.381, 0.796], [0.364, 0.733], [0.346, 0.67], [0.327, 0.621], [0.309, 0.676], [0.292, 0.738], [0.272, 0.804], [0.255, 0.853], [0.236, 0.891], [0.218, 0.918], [0.2, 0.94], [0.181, 0.959], [0.163, 0.973], [0.146, 0.981], [0.127, 0.989], [0.109, 0.992], [0.091, 0.992], [0.072, 0.989], [0.054, 0.981], [0.037, 0.973], [0.018, 0.959], [0.0, 0.935]]
const M_FULL: [number, number][] = [[0.0, 0], [0.018, 0], [0.037, 0], [0.054, 0], [0.072, 0], [0.091, 0], [0.109, 0], [0.127, 0], [0.146, 0], [0.163, 0], [0.181, 0], [0.2, 0], [0.218, 0], [0.236, 0], [0.255, 0], [0.272, 0], [0.292, 0], [0.309, 0], [0.327, 0], [0.346, 0], [0.364, 0], [0.381, 0], [0.401, 0], [0.418, 0], [0.436, 0], [0.455, 0], [0.473, 0], [0.49, 0], [0.51, 0], [0.527, 0], [0.545, 0], [0.564, 0], [0.582, 0], [0.599, 0], [0.619, 0], [0.636, 0], [0.654, 0], [0.673, 0], [0.691, 0], [0.708, 0], [0.728, 0], [0.745, 0], [0.764, 0], [0.782, 0], [0.8, 0], [0.819, 0], [0.837, 0], [0.854, 0], [0.873, 0], [0.891, 0], [0.909, 0], [0.928, 0], [0.946, 0], [0.963, 0], [0.982, 0], [1.0, 0], [1.0, 1], [0.982, 1], [0.963, 1], [0.946, 1], [0.928, 1], [0.909, 1], [0.891, 1], [0.873, 1], [0.854, 1], [0.837, 1], [0.819, 1], [0.8, 1], [0.782, 1], [0.764, 1], [0.745, 1], [0.728, 1], [0.708, 1], [0.691, 1], [0.673, 1], [0.654, 1], [0.636, 1], [0.619, 1], [0.599, 1], [0.582, 1], [0.564, 1], [0.545, 1], [0.527, 1], [0.51, 1], [0.49, 1], [0.473, 1], [0.455, 1], [0.436, 1], [0.418, 1], [0.401, 1], [0.381, 1], [0.364, 1], [0.346, 1], [0.327, 1], [0.309, 1], [0.292, 1], [0.272, 1], [0.255, 1], [0.236, 1], [0.218, 1], [0.2, 1], [0.181, 1], [0.163, 1], [0.146, 1], [0.127, 1], [0.109, 1], [0.091, 1], [0.072, 1], [0.054, 1], [0.037, 1], [0.018, 1], [0.0, 1]]
const M_ASPECT = 2 // logo M is twice as wide as it is tall

function ArchManifesto() {
  const reduce = useReducedMotion()
  const desktop = useMedia('(min-width: 768px)')
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // The photo starts as a large "M" and opens out to the full screen as you scroll
  const clip = useTransform(p, (v) => {
    // box keeps the logo's proportions: width in % of the screen, height derived from it
    const wPct = desktop ? 56 : 84
    const hPct = typeof window === 'undefined' ? 30 : (wPct / 100) * window.innerWidth / M_ASPECT / window.innerHeight * 100
    const cy = desktop ? 52 : 48
    const box = { l: (100 - wPct) / 2, r: (100 + wPct) / 2, t: cy - hPct / 2, b: cy + hPct / 2 }
    const k = Math.min(Math.max(v / 0.42, 0), 1)
    const e = 1 - Math.pow(1 - k, 3) // ease-out
    const pts = M_SHAPE.map(([u0, v0], i) => {
      const x0 = box.l + (box.r - box.l) * u0, y0 = box.t + (box.b - box.t) * v0 // inside the M box
      const x1 = M_FULL[i][0] * 100, y1 = M_FULL[i][1] * 100 // on the screen edge
      return `${(x0 + (x1 - x0) * e).toFixed(2)}% ${(y0 + (y1 - y0) * e).toFixed(2)}%`
    })
    return `polygon(${pts.join(', ')})`
  })
  const scale = useTransform(p, [0, 0.42], [1.25, 1])
  const veil = useTransform(p, [0.3, 0.5], [0, 0.66])
  const caption = useTransform(p, [0, 0.18], [1, 0])
  const words = MANIFESTO.split(' ')

  if (reduce) {
    return (
      <section className="relative overflow-hidden">
        <img src="/img/reception-wide.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-plum-900/70" />
        <div className="container-x relative py-28"><p className="mx-auto max-w-4xl text-balance text-center font-display text-paper" style={{ fontSize: 'clamp(1.75rem, 1rem + 2.6vw, 3.6rem)', lineHeight: 1.15 }}>{MANIFESTO}</p></div>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative h-[260vh] bg-mist" aria-label="Our promise">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.p style={{ opacity: caption }} className="absolute inset-x-0 top-[4%] z-10 text-center text-eyebrow font-semibold uppercase text-plum">Inside Meena IVF · Banani, Dhaka</motion.p>
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 will-change-[clip-path]">
          <motion.img style={{ scale }} src="/img/reception-wide.webp" alt="The reception at Meena IVF's Banani centre" className="h-full w-full object-cover" />
          <motion.div style={{ opacity: veil }} className="absolute inset-0 bg-plum-900" />
        </motion.div>
        <div className="container-x relative z-10 flex h-full items-center justify-center">
          <p className="mx-auto max-w-5xl text-balance text-center font-display text-paper" style={{ fontSize: 'clamp(1.75rem, 1rem + 2.8vw, 4rem)', lineHeight: 1.12, letterSpacing: '-0.02em' }}>
            {words.map((w, i) => <ManifestoWord key={i} p={p} i={i} n={words.length}>{w}</ManifestoWord>)}
          </p>
        </div>
      </div>
    </section>
  )
}
function ManifestoWord({ p, i, n, children }: { p: MotionValue<number>; i: number; n: number; children: string }) {
  const start = 0.46 + (i / n) * 0.44
  const opacity = useTransform(p, [start, start + 0.05], [0, 1])
  const y = useTransform(p, [start, start + 0.05], [8, 0])
  const em = children === 'hope.' || children === 'baby.'
  return <motion.span style={{ opacity, y }} className={`mx-[0.12em] inline-block ${em ? 'italic' : ''}`}>{children}</motion.span>
}

/* ───────────────── 3. Journey selector ───────────────── */
function JourneySelector() {
  // Photo cards: a full photo, a small arrow tile in the corner (the only link) and a white caption bar with the question, a short line
  // and an icon tile. Every other card sits lower on desktop, for a staggered look.
  const CARD: Record<string, { q: string; sub: string; to: string; img: string; pos: string; Icon: typeof Heart }> = {
    conceive: { q: 'Trying to conceive?', sub: 'A careful check for both partners', to: '/treatments/medical-history-evaluation', img: '/img/journey-card-conceive.webp', pos: '50% 50%', Icon: Stethoscope },
    miscarriage: { q: 'After a miscarriage?', sub: 'Gentle care to find the cause', to: '/treatments/hysteroscopy', img: '/img/journey-card-miscarriage.webp', pos: '50% 50%', Icon: Heart },
    preparing: { q: 'Preparing for treatment?', sub: 'A consultant beside every step', to: '/treatments/ivf', img: '/img/journey-card-preparing.webp', pos: '50% 50%', Icon: CalendarDays },
    freezing: { q: 'Freezing your eggs?', sub: 'Protect your fertility for later', to: '/treatments/egg-freezing', img: '/img/journey-card-freezing.webp', pos: '50% 50%', Icon: Snowflake },
  }
  return (
    <section className="section">
      <div className="container-x">
        <Reveal className="mb-10 text-center md:mb-14">
          <h2 className="h2">Where are you on your <em className="text-plum">journey</em>?</h2>
        </Reveal>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
          {journeys.map((x, i) => {
            const c = CARD[x.key] ?? { q: `${x.label}?`, sub: x.title, to: '/treatments', img: x.image, pos: '50% 50%', Icon: Heart }
            return (
              <Reveal as="li" key={x.key} delay={i * 0.06} className={i % 2 ? 'lg:mt-16' : ''}>
                <div className="group relative block aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-mist shadow-[0_30px_60px_-34px_rgba(46,13,54,.45)]">
                  <img src={c.img} alt="" loading="lazy" style={{ objectPosition: c.pos }}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]" />
                  {/* only this arrow opens the page */}
                  <Link to={c.to} aria-label={`${c.q} Explore care`}
                    className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-lg bg-ink/25 text-white backdrop-blur-md transition duration-300 hover:bg-plum focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    <ArrowUpRight className="h-5 w-5 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                  <span className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 shadow-[0_10px_30px_-12px_rgba(46,13,54,.35)]">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[1.0625rem] font-semibold text-ink">{c.q}</span>
                      <span className="mt-0.5 block truncate text-[0.8125rem] text-ink-2">{c.sub}</span>
                    </span>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-plum-900 text-white">
                      <c.Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                  </span>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* ───────────────── 4. Treatment index ───────────────── */
const INDEX = [
  { slug: 'ivf', img: '/img/lab-microscope.webp', Icon: FlaskConical, desc: 'In vitro fertilization to help you achieve pregnancy.' },
  { slug: 'icsi', img: '/img/embryo-1.webp', Icon: Microscope, desc: 'A specialised IVF technique where a single sperm is injected into each egg.' },
  { slug: 'iui', img: '/img/semen-3.webp', Icon: Syringe, desc: 'Carefully prepared sperm is placed directly into the uterus.' },
  { slug: 'egg-freezing', img: '/img/journey-freezing.webp', Icon: Egg, desc: 'Preserve your eggs today for a more flexible tomorrow.' },
  { slug: 'embryo-freezing', img: '/img/embryo-3.webp', Icon: Snowflake, desc: 'Safely freeze and store healthy embryos for future use.' },
  { slug: 'folliculometry', img: '/img/folliculometry.webp', Icon: ScanLine, desc: 'Monitors your ovarian response to plan the right treatment time.' },
  { slug: 'laparoscopy', img: '/img/laparoscopy.webp', Icon: Activity, desc: 'A minimally invasive procedure to diagnose and treat fertility issues.' },
  { slug: 'tesa', img: '/img/semen-2.webp', Icon: TestTube, desc: 'A sperm retrieval procedure that helps men with fertility challenges.' },
]

function TreatmentIndex() {
  // One card is highlighted in plum: IVF by default, otherwise the card under the mouse (or focused)
  const [active, setActive] = useState(0)
  return (
    <section className="section relative isolate overflow-hidden bg-gradient-to-b from-[#F6EEF9] via-[#F3EAF7] to-[#F6EEF9]">
      {/* soft decorative shapes */}
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-56 -z-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(178,95,191,.16),transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(231,166,240,.18),transparent)]" />
      <div className="container-x">
        <SectionHeader title={<>Wherever you are, there&rsquo;s a <em className="text-plum">next step</em>.</>}
          text="From your first scan to IVF, every treatment you need is here, planned just for you."
          action={<Link to="/treatments" className="inline-flex min-h-[3.25rem] items-center gap-3 rounded-full border border-plum/20 bg-white/60 px-7 text-[0.9375rem] font-semibold text-ink backdrop-blur transition hover:border-plum/40 hover:bg-white">All 18 treatments <ArrowRight className="h-4 w-4" /></Link>} />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4" onMouseLeave={() => setActive(0)}>
          {INDEX.map((it, i) => {
            const t = treatmentBySlug(it.slug)!
            const on = active === i
            return (
              <Reveal as="li" key={it.slug} delay={i * 0.04} y={14} className="h-full">
                <Link to={`/treatments/${t.slug}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}
                  className={`group relative flex h-full min-h-[17rem] flex-col overflow-hidden rounded-[1.5rem] p-6 ring-4 transition duration-500 ease-out md:min-h-[19rem] md:p-7 ${on ? 'bg-gradient-to-br from-plum via-plum-700 to-plum-800 ring-white/70' : 'bg-white/75 ring-white backdrop-blur'}`}>
                  {/* photo on the right, fading into the card on the left */}
                  <img src={it.img} alt="" loading="lazy"
                    className={`pointer-events-none absolute inset-y-0 right-0 h-full w-[56%] object-cover transition duration-700 [mask-image:linear-gradient(to_left,#000_40%,transparent)] group-hover:scale-[1.04] ${on ? 'opacity-90 mix-blend-luminosity' : 'opacity-85'}`} />
                  {on && <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-plum/90 via-plum-700/50 to-transparent" />}
                  <div className="relative flex flex-1 flex-col">
                    <span className={`grid h-12 w-12 place-items-center rounded-xl transition duration-500 ${on ? 'bg-white/25 text-white' : 'bg-lilac text-plum'}`}><it.Icon className="h-6 w-6" strokeWidth={1.6} /></span>
                    <p className={`mt-5 max-w-[66%] font-display text-[1.75rem] font-semibold leading-[1.02] tracking-tight transition-colors duration-500 md:text-[1.85rem] ${on ? '!text-white' : 'text-ink'}`}>{t.name}</p>
                    <p className={`mt-3 max-w-[60%] text-[0.9375rem] leading-relaxed transition-colors duration-500 ${on ? 'text-white/90' : 'text-ink-2'}`}>{it.desc}</p>
                    <span className="mt-auto grid h-11 w-11 place-items-center rounded-full bg-white text-ink transition duration-300 group-hover:translate-x-1"><ArrowRight className="h-5 w-5" /></span>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* ───────────────── 5. From one cell to a new life ───────────────── */
function IvfStory() {
  const reduce = useReducedMotion()
  const wide = useMedia('(min-width: 1024px)')
  return wide && !reduce ? <IvfStoryPinned /> : <IvfStoryStacked />
}

function StoryHeading({ light = false }: { light?: boolean }) {
  return (
    <>
      <p className={`eyebrow mb-4 ${light ? '!text-lilac' : ''}`}>The IVF journey</p>
      <h2 className={`h2 text-balance ${light ? '!text-paper' : ''}`}>From one cell to a <em className={light ? 'text-[#E7A6F0]' : 'text-plum'}>new life</em>.</h2>
      <p className={`mt-4 max-w-md ${light ? 'text-paper/70' : 'text-ink-2'}`}>Six steps, about four to six weeks. Knowing what comes next makes everything lighter.</p>
    </>
  )
}

function IvfStoryPinned() {
  const ref = useRef<HTMLElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLOListElement>(null)
  const [dist, setDist] = useState(0)
  const [stage, setStage] = useState(0)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(p, [0.05, 0.95], [0, -dist])
  useMotionValueEvent(p, 'change', (v) => setStage(Math.max(0, Math.min(5, Math.floor(((v - 0.05) / 0.9) * 6)))))
  useLayoutEffect(() => {
    const measure = () => { if (track.current && viewport.current) setDist(Math.max(0, track.current.scrollWidth - viewport.current.clientWidth)) }
    measure()
    const ro = new ResizeObserver(measure); if (track.current) ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [])

  return (
    <section ref={ref} className="relative h-[340vh] bg-plum-900 text-paper" aria-label="The IVF journey">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -left-40 top-1/2 h-[44rem] w-[44rem] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(148,64,160,.35),transparent)]" />
        <div className="container-x relative grid w-full grid-cols-[minmax(0,26rem)_1fr] items-center gap-12">
          <div>
            <StoryHeading light />
            <div className="mt-8 flex items-center gap-6">
              <Embryo stage={stage} dark className="h-44 w-44 shrink-0 xl:h-56 xl:w-56" />
              <div>
                <p className="font-display text-5xl text-paper">0{stage + 1}<span className="text-2xl text-paper/40"> / 06</span></p>
                <p className="mt-1 text-sm text-lilac">{EMBRYO_LABELS[stage]}</p>
              </div>
            </div>
            <Link to="/treatments/ivf" className="mt-8 inline-flex min-h-[2.75rem] items-center gap-2 text-sm font-semibold text-lilac hover:text-white">Read about IVF <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div ref={viewport} className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_92%,transparent)]">
            <motion.ol ref={track} style={{ x }} className="flex w-max gap-5 pl-[3vw] pr-[10vw]">
              {ivfJourney.map((s, i) => (
                <li key={s.title} className={`flex h-[24rem] w-[19rem] flex-col justify-between rounded-panel border p-7 transition-colors duration-300 xl:w-[21rem] ${i === stage ? 'border-lilac/60 bg-white/[0.08]' : 'border-white/10 bg-white/[0.03]'}`}>
                  <div className="flex items-start justify-between">
                    <span className="font-display text-7xl italic leading-none text-lilac/90">{i + 1}</span>
                    <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-paper/80">{s.when}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-3xl !text-paper">{s.title}</h3>
                    <p className="mt-3 leading-relaxed text-paper/75">{s.text}</p>
                  </div>
                </li>
              ))}
            </motion.ol>
          </div>
        </div>
      </div>
    </section>
  )
}

function IvfStoryStacked() {
  return (
    <section className="section bg-plum-900 text-paper" aria-label="The IVF journey">
      <div className="container-x">
        <Reveal className="mb-10"><StoryHeading light /></Reveal>
        <ol className="grid gap-4 md:grid-cols-2">
          {ivfJourney.map((s, i) => (
            <Reveal as="li" key={s.title} delay={(i % 2) * 0.06} className="flex gap-5 rounded-panel border border-white/10 bg-white/[0.04] p-5 md:p-6">
              <Embryo stage={i} dark className="h-20 w-20 shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-lilac">{String(i + 1).padStart(2, '0')} · {s.when}</p>
                <h3 className="mt-1 font-display text-2xl !text-paper">{s.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-paper/75">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <Link to="/treatments/ivf" className="mt-6 inline-flex min-h-[2.75rem] items-center gap-2 text-sm font-semibold text-lilac">Read about IVF <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  )
}

/* ───────────────── 6. Specialists ───────────────── */
// Landing page only: Dr. Shamima is shown in her side-angle photo here
const landingPhoto = (d: (typeof doctors)[number]) => (d.slug === 'dr-shamima-nargis-neela' ? '/img/dr-shamima-side.webp' : d.image)

function Specialists() {
  const wide = useMedia('(min-width: 1024px)')
  return wide ? <SpecialistsSticky /> : <SpecialistsCarousel />
}

function DoctorDetails({ doc, compact = false }: { doc: (typeof doctors)[number]; compact?: boolean }) {
  return (
    <>
      {compact ? (
        <ul className="mt-4 space-y-1.5">
          {doc.qualificationsShort.map((q) => (
            <li key={q} className="flex items-start gap-2.5 text-sm text-ink-2"><GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-plum" />{q}</li>
          ))}
        </ul>
      ) : (
        <ul className="mt-6 space-y-2.5">
          {doc.qualificationsShort.map((q) => (
            <li key={q} className="flex items-center gap-3 text-[0.9375rem] text-ink-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lilac/80 text-plum"><GraduationCap className="h-4 w-4" /></span>{q}
            </li>
          ))}
        </ul>
      )}
      {!compact && doc.stats.length > 0 && (
        <dl className="mt-6 grid max-w-2xl divide-x divide-line rounded-[1.25rem] border border-line bg-white/60 py-5" style={{ gridTemplateColumns: `repeat(${Math.min(doc.stats.length, 3)}, minmax(0, 1fr))` }}>
          {doc.stats.slice(0, 3).map((st) => (
            <div key={st.label} className="px-6 lg:px-8">
              <dt className="sr-only">{st.label}</dt>
              <dd className="font-display text-[1.75rem] leading-none text-plum-900">{st.value}</dd>
              <dd className="mt-2 text-sm leading-tight text-ink-2">{st.label}</dd>
            </div>
          ))}
        </dl>
      )}
      {compact && doc.stats.length > 0 && (
        <dl style={{ gridTemplateColumns: `repeat(${Math.min(doc.stats.length, 3)}, minmax(0, 1fr))` }} className={`grid gap-px overflow-hidden rounded-card border border-line bg-line ${compact ? 'mt-4' : 'mt-6 max-w-xl'}`}>
          {doc.stats.slice(0, 3).map((st) => (
            <div key={st.label} className={`bg-white ${compact ? 'px-3 py-2.5' : 'px-4 py-3.5'}`}>
              <dt className="sr-only">{st.label}</dt>
              <dd className={`font-display leading-none text-plum ${compact ? 'text-xl' : 'text-2xl'}`}>{st.value}</dd>
              <dd className="mt-1 text-[0.7rem] leading-tight text-muted">{st.label}</dd>
            </div>
          ))}
        </dl>
      )}
      {!compact && <div className="mt-6 flex flex-wrap gap-2.5">{doc.focus.slice(0, 5).map((f) => <span key={f} className="rounded-full bg-lilac/80 px-5 py-2 text-[0.9375rem] font-medium text-plum-700">{f}</span>)}</div>}
      {!compact && <p className="mt-5 flex max-w-2xl items-center gap-3 rounded-[1.25rem] bg-lilac/50 px-6 py-3.5 text-[0.9375rem] text-ink-2"><Clock className="h-5 w-5 shrink-0 text-plum" />{scheduleSummary(doc)}</p>}
    </>
  )
}

function SpecialistsSticky() {
  const reduce = useReducedMotion()
  const n = doctors.length
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const dir = useRef(1)
  const d = doctors[active]
  // Every doctor uses the first doctor's arch colour
  const first = doctors[0].tint
  const tint = first === 'blush' ? 'bg-blush' : first === 'mist' ? 'bg-[#E6E0EF]' : 'bg-lilac'
  // The section pins to the screen; scrolling brings each doctor in from the right, one after another
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(p * n)))
    setActive((cur) => { if (i !== cur) dir.current = i > cur ? 1 : -1; return i })
  })
  const slide = {
    enter: (k: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: k > 0 ? 120 : -120 }),
    center: { opacity: 1, x: 0 },
    exit: (k: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: k > 0 ? -120 : 120 }),
  }
  return (
    <section ref={ref} className="relative bg-mist" style={{ height: `${n * 85 + 15}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="container-x w-full">
          <SectionHeader title={<>Meet our <em className="text-plum">specialists</em></>} />
          <div className="grid grid-cols-[.85fr_1.15fr] items-center gap-16">
            <div className="h-[min(72vh,45rem)]">
              {/* taller, narrower arch (5:7), centred in its column */}
              <div className={`arch relative mx-auto aspect-[5/7] h-full max-w-full overflow-hidden transition-colors duration-500 ${tint}`}>
                <div aria-hidden className="arch-full absolute inset-x-[12%] bottom-0 top-[12%] bg-white/50" />
                <AnimatePresence mode="popLayout" initial={false} custom={dir.current}>
                  <motion.img key={d.slug} src={landingPhoto(d)} alt={d.name} custom={dir.current}
                    variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: EASE }}
                    className="absolute inset-x-0 bottom-0 mx-auto h-[92%] w-auto object-contain object-bottom" />
                </AnimatePresence>
                <div className="absolute bottom-6 left-5"><TodayBadge doctor={d} /></div>
                <div className="absolute bottom-5 right-5 rounded-full bg-white/90 px-4 py-2 font-display text-lg shadow-soft">0{active + 1} <span className="text-muted">/ 0{n}</span></div>
              </div>
            </div>
            <div className="relative">
              <AnimatePresence mode="wait" initial={false} custom={dir.current}>
                <motion.div key={d.slug} custom={dir.current} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: EASE }}>
                  <h3 className="font-display leading-[1.05] text-plum-900" style={{ fontSize: 'clamp(2rem, 1.2rem + 1.8vw, 3.25rem)' }}><Link to={`/doctors/${d.slug}`} className="hover:text-plum">{d.name}</Link></h3>
                  <p className="mt-3 text-lg text-ink-2">{d.role}</p>
                  <DoctorDetails doc={d} />
                  <div className="mt-7 flex flex-wrap gap-4">
                    <Link to={`/book?doctor=${d.slug}`} className="btn-primary !min-h-[3.25rem] !px-8">Book with {d.short}</Link>
                    <Link to={`/doctors/${d.slug}`} className="btn-secondary">View profile</Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SpecialistsCarousel() {
  const track = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * (track.current.clientWidth * 0.8), behavior: 'smooth' })
  return (
    <section className="section bg-blush/60">
      <div className="container-x">
        <SectionHeader title={<>Meet our <em className="text-plum">specialists</em></>}
          action={<div className="flex gap-2">
            <button onClick={() => scroll(-1)} aria-label="Previous doctors" className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-white transition hover:border-plum hover:text-plum"><ArrowLeft className="h-5 w-5" /></button>
            <button onClick={() => scroll(1)} aria-label="Next doctors" className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-white transition hover:border-plum hover:text-plum"><ArrowRight className="h-5 w-5" /></button>
          </div>} />
      </div>
      <div ref={track} data-lenis-prevent-wheel className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-2 scroll-px-5 md:px-8 md:scroll-px-8">
        {doctors.map((d) => (
          <div key={d.slug} className="flex w-[85%] shrink-0 snap-start flex-col rounded-panel bg-white p-4 shadow-soft sm:w-[46%]">
            <DoctorCard d={{ ...d, image: landingPhoto(d) }} compact />
            <p className="mt-2 text-sm text-ink-2">{d.role}</p>
            <DoctorDetails doc={d} compact />
            <div className="mt-auto flex gap-2 pt-5">
              <Link to={`/book?doctor=${d.slug}`} className="btn-primary !min-h-[2.75rem] flex-1 !px-4 text-sm">Book</Link>
              <Link to={`/doctors/${d.slug}`} className="btn-secondary !min-h-[2.75rem] flex-1 !px-4 text-sm">Profile</Link>
            </div>
          </div>
        ))}
        <div className="w-px shrink-0" />
      </div>
      {/* swipe hint */}
      <p className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-ink-2">
        <ArrowLeft className="h-4 w-4 text-plum" />
        Swipe to see all doctors
        <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}><ArrowRight className="h-4 w-4 text-plum" /></motion.span>
      </p>
    </section>
  )
}

/* ───────────────── 7. Why Meena ───────────────── */

function WhyBento() {
  const reduce = useReducedMotion()
  const items = [
    { label: 'Self-cycle first', Icon: Stethoscope },
    { label: 'Personalised treatment plans', Icon: CalendarDays },
    { label: 'Transparent & affordable care', Icon: ShieldCheck },
    { label: 'Proven treatment protocols', Icon: ChartNoAxesColumnIncreasing },
    { label: 'Advanced fertility technology', Icon: Microscope },
    { label: 'Complete patient support', Icon: Heart },
  ]

  return (
    // Solid theme background; the right side is the TrustOrbit animation
    <section className="section overflow-hidden bg-mist">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* Left: eyebrow, heading, six reason cards and the button */}
        <div>
          <Reveal>
            <h2 className="h2 lg:whitespace-nowrap">Why couples trust <em className="text-plum">Meena IVF</em></h2>
          </Reveal>

          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-12 md:gap-4">
            {items.map(({ label, Icon }, i) => (
              <motion.li key={label}
                initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.5, ease: EASE, delay: i * 0.06 }}
                className="group flex min-h-[9.5rem] flex-col gap-4 rounded-[1.25rem] bg-white p-5 shadow-[0_14px_34px_-22px_rgba(74,21,84,.45)] ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-22px_rgba(128,41,143,.55)] md:min-h-[11rem] md:p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-lilac text-plum transition duration-300 group-hover:bg-plum group-hover:text-white">
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <span className="text-[1rem] font-semibold leading-snug text-ink md:text-[1.0625rem]">{label}</span>
              </motion.li>
            ))}
          </ul>

          <Reveal delay={0.1} className="mt-10">
            <Link to="/why-meena" className="btn-primary group !min-h-[56px] !px-8">
              Explore Our Approach <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* Right: a looping, made-in-code animation in place of a photo (see TrustOrbit) */}
        <Reveal delay={0.1} className="relative mx-auto w-full max-w-[36rem]">
          <TrustOrbit items={items} />
        </Reveal>
      </div>
    </section>
  )
}

/* Why couples trust Meena IVF: the clinic's results (IVF babies, success rate, consultants, centres) change in the middle of
   a glowing circle while the six reasons orbit around it on slow counter-turning rings. One reason at a time lights up in
   plum and its name shows under the circle. */
function TrustOrbit({ items }: { items: { label: string; Icon: typeof Heart }[] }) {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setStep((s) => s + 1), 2200)
    return () => window.clearInterval(id)
  }, [reduce])
  const active = step % items.length
  const stat = step % site.stats.length
  const RADIUS = 38 // orbit radius, % of the box
  const spin = (sec: number, dir = 1) => (reduce ? {} : { animate: { rotate: dir * 360 }, transition: { duration: sec, ease: 'linear' as const, repeat: Infinity } })
  return (
    <div className="relative aspect-square w-full">
      {/* backdrop: lilac disc and two dashed rings turning in opposite directions */}
      <svg aria-hidden viewBox="0 0 600 600" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="to-disc" cx="0.4" cy="0.35" r="0.7">
            <stop offset="0%" stopColor="#FBF7FD" />
            <stop offset="60%" stopColor="#EADCF4" />
            <stop offset="100%" stopColor="#D4B6E8" />
          </radialGradient>
        </defs>
        <circle cx="300" cy="300" r="290" fill="url(#to-disc)" />
      </svg>
      <motion.svg aria-hidden viewBox="0 0 600 600" className="absolute inset-0 h-full w-full" {...spin(70)}>
        <circle cx="300" cy="300" r="228" fill="none" stroke="#B25FBF" strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="2 10" strokeLinecap="round" />
        <circle cx="300" cy="72" r="5" fill="#B25FBF" />
      </motion.svg>
      <motion.svg aria-hidden viewBox="0 0 600 600" className="absolute inset-0 h-full w-full" {...spin(45, -1)}>
        <circle cx="300" cy="300" r="160" fill="none" stroke="#7B6BB0" strokeOpacity=".3" strokeWidth="1.5" strokeDasharray="14 12" />
        <circle cx="460" cy="300" r="4" fill="#7B6BB0" />
      </motion.svg>

      {/* the six reasons orbiting; each chip turns back against the orbit so its icon stays upright */}
      <motion.div className="pointer-events-none absolute inset-0 z-10" {...spin(60)}>
        {items.map(({ label, Icon }, i) => {
          const a = (i / items.length) * Math.PI * 2 - Math.PI / 2
          const on = i === active
          return (
            <div key={label} className="absolute" style={{ left: `${50 + RADIUS * Math.cos(a)}%`, top: `${50 + RADIUS * Math.sin(a)}%`, transform: 'translate(-50%, -50%)' }}>
              <motion.div {...spin(60, -1)}>
                <motion.span animate={{ scale: on ? 1.15 : 1 }} transition={{ duration: 0.4, ease: EASE }}
                  className={`grid h-12 w-12 place-items-center rounded-2xl shadow-[0_12px_24px_-12px_rgba(74,21,84,.5)] ring-4 ring-white/70 transition-colors duration-500 md:h-16 md:w-16 ${on ? 'bg-plum text-white' : 'bg-white text-plum'}`}>
                  <Icon className="h-5 w-5 md:h-7 md:w-7" strokeWidth={1.75} />
                </motion.span>
              </motion.div>
            </div>
          )
        })}
      </motion.div>

      {/* centre: heartbeat rings and the clinic's results */}
      <div className="absolute inset-[29%]">
        {!reduce && [0, 1].map((k) => (
          <motion.span key={k} aria-hidden className="absolute inset-0 rounded-full border-2 border-plum/30"
            animate={{ scale: [1, 1.45], opacity: [0.6, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: k * 1.1 }} />
        ))}
        <div className="relative grid h-full w-full place-items-center rounded-full bg-white shadow-[0_30px_60px_-30px_rgba(74,21,84,.55)] ring-8 ring-white/60">
          {/* the clinic's published results, one at a time, in the middle of the orbit */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={stat} initial={reduce ? false : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.45, ease: EASE }} className="px-4 text-center">
              <p className="font-display leading-none text-plum" style={{ fontSize: 'clamp(2.5rem, 1.6rem + 3vw, 4.25rem)' }}>
                {site.stats[stat].value}{site.stats[stat].suffix}
              </p>
              <p className="mx-auto mt-2 max-w-[11rem] text-[0.8125rem] font-semibold uppercase leading-snug tracking-wide text-ink-2 md:text-sm">{site.stats[stat].label}</p>
            </motion.div>
          </AnimatePresence>
          {/* the reason that is lit up right now */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={active} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}
                className="block whitespace-nowrap rounded-full bg-plum px-4 py-2 text-[0.8125rem] font-semibold text-white shadow-[0_10px_24px_-12px_rgba(128,41,143,.8)] md:text-sm">
                {items[active].label}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* a few floating sparkles */}
      {!reduce && [[14, 22, 0], [84, 16, 0.8], [90, 74, 1.6], [10, 80, 2.4]].map(([x, y, d], k) => (
        <motion.svg key={k} aria-hidden viewBox="0 0 24 24" className="absolute h-4 w-4 text-lavender md:h-5 md:w-5" style={{ left: `${x}%`, top: `${y}%` }}
          animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4], rotate: [0, 45, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: d }}>
          <path fill="currentColor" d="M12 0c1 6.5 5.5 11 12 12-6.5 1-11 5.5-12 12-1-6.5-5.5-11-12-12C6.5 11 11 6.5 12 0z" />
        </motion.svg>
      ))}
    </div>
  )
}

/* ───────────────── 8. Testimonial deck ───────────────── */
function TestimonialDeck() {
  const reduce = useReducedMotion()
  const photos = ['success-1', 'success-2', 'success-3', 'success-4']
  // The wire runs edge to edge of the page: a quadratic curve that sits at 10px at both page edges and sags
  // WIRE_SAG px at the middle. Each photo hangs at its column centre (x = fraction of the content width).
  const line = useRef<HTMLDivElement>(null)
  const [wire, setWire] = useState({ left: 0, cw: 1000, vw: 1000 })
  useLayoutEffect(() => {
    const el = line.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setWire({ left: r.left, cw: r.width, vw: document.documentElement.clientWidth })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [])
  const WIRE_SAG = 80
  const wireY = (X: number) => { const t = X / wire.vw; return 10 + 4 * WIRE_SAG * t * (1 - t) }
  const sag = (x: number) => wireY(wire.left + x * wire.cw)
  return (
    <section className="section overflow-hidden">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="h2 text-balance">Little miracles, and the families <em className="text-plum">who waited</em> for them.</h2>
            <p className="mt-4 max-w-md text-ink-2">What families tell us after their journey with Meena.</p>
          </div>
          <Link to="/stories" className="link-quiet">See all stories <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>

        {/* Clothesline */}
        <div ref={line} className="relative mt-10 md:mt-14">
          <svg aria-hidden viewBox={`0 0 ${wire.vw} 100`} preserveAspectRatio="none" className="absolute top-0 h-[100px] overflow-visible"
            style={{ left: -wire.left, width: wire.vw }}>
            <path d={`M0 10 Q${wire.vw / 2} ${10 + 2 * WIRE_SAG} ${wire.vw} 10`} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="text-ink/35" />
          </svg>
          <ul className="relative grid grid-cols-4 gap-3 md:gap-10">
            {photos.map((s, i) => (
              <li key={s} className="flex flex-col items-center" style={{ marginTop: sag((i + 0.5) / photos.length) - 14 }}>
                <motion.div className="flex w-full max-w-[15rem] flex-col items-center" style={{ transformOrigin: '50% 0%' }}
                  initial={reduce ? false : { opacity: 0, y: -24, rotate: i % 2 ? 6 : -6 }}
                  whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 2 : -2 }}
                  viewport={{ once: true }} transition={{ type: 'spring', stiffness: 120, damping: 9, delay: i * 0.12 }}>
                  {/* Clothespin */}
                  <span aria-hidden className="relative z-10 flex h-7 w-4 gap-px md:h-9 md:w-5">
                    <span className="flex-1 rounded-t-sm rounded-b-[2px] bg-[#C9965A]" />
                    <span className="flex-1 rounded-t-sm rounded-b-[2px] bg-[#B9844A]" />
                    <span className="absolute inset-x-[-2px] top-[38%] h-1 rounded-full bg-[#8A8A8A]" />
                  </span>
                  {/* Polaroid */}
                  <div className="-mt-3 w-full rounded-[4px] bg-white p-1.5 pb-5 ring-1 ring-line md:p-2.5 md:pb-8">
                    <img src={`/img/${s}.webp`} alt="An IVF baby born to a Meena family" loading="lazy" className="aspect-square w-full rounded-[2px] object-cover" />
                  </div>
                </motion.div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ReviewMarquee />
    </section>
  )
}

/* Reviews: keeps drifting right-to-left; hovering pauses it and the reviews can be dragged (or scrolled sideways) by hand. */
function ReviewMarquee() {
  const reduce = useReducedMotion()
  const track = useRef<HTMLDivElement>(null)
  const hovering = useRef(false)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const [dragging, setDragging] = useState(false)
  const list = [...testimonials, ...testimonials]

  // keep the scroll position inside the first copy so the loop never runs out
  const wrap = (el: HTMLDivElement) => {
    const half = el.scrollWidth / 2
    if (half <= 0) return
    if (el.scrollLeft >= half) el.scrollLeft -= half
    else if (el.scrollLeft < 0) el.scrollLeft += half
  }

  // distance still to travel from a left/right arrow press, eased out frame by frame
  const nudge = useRef(0)

  useEffect(() => {
    if (reduce) return
    let raf = 0
    let last = performance.now()
    let pos = track.current?.scrollLeft ?? 0
    const tick = (now: number) => {
      const el = track.current
      const dt = Math.min(64, now - last); last = now
      if (el) {
        if (hovering.current || drag.current) { pos = el.scrollLeft; nudge.current = 0 }
        else {
          const step = Math.abs(nudge.current) < 0.5 ? nudge.current : nudge.current * Math.min(1, dt * 0.009)
          nudge.current -= step
          pos += dt * 0.045 + step
          const half = el.scrollWidth / 2
          if (pos < 0 && half > 0) pos += half
          el.scrollLeft = pos; wrap(el); pos = el.scrollLeft
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  // arrows move the reviews by one card
  const move = (dir: number) => {
    const el = track.current
    if (!el) return
    const card = (el.querySelector('li') as HTMLElement | null)?.offsetWidth ?? 400
    if (reduce) {
      if (dir < 0 && el.scrollLeft < card) el.scrollLeft += el.scrollWidth / 2
      el.scrollBy({ left: dir * card, behavior: 'smooth' })
    } else nudge.current += dir * card
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !track.current) return
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false }
    setDragging(true)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = track.current, d = drag.current
    if (!el || !d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 3) d.moved = true
    el.scrollLeft = d.left - dx
    wrap(el)
    if (el.scrollLeft !== d.left - dx) { d.left = el.scrollLeft + dx }
  }
  const endDrag = () => { drag.current = null; setDragging(false) }

  return (
    <>
    <div ref={track}
      onMouseEnter={() => { hovering.current = true }} onMouseLeave={() => { hovering.current = false; endDrag() }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag}
      onScroll={(e) => wrap(e.currentTarget)}
      className={`no-scrollbar mt-14 select-none overflow-x-auto md:mt-20 ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
      <ul className="flex w-max py-2">
        {list.map((t, i) => (
          <li key={`${t.name}-${i}`} aria-hidden={i >= testimonials.length || undefined} className="w-[19rem] shrink-0 pr-5 md:w-[26rem]">
            <figure className="flex h-full flex-col rounded-panel border border-line bg-white p-6 md:p-8">
              <span aria-hidden className="font-display text-6xl leading-[0.6] text-lilac">“</span>
              <blockquote className="mt-3 flex-1 font-display text-[1.1rem] leading-snug text-ink md:text-[1.25rem]">{t.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-plum font-semibold text-white">{t.name[0]}</span>
                <span><span className="block font-semibold">{t.name}</span><span className="text-sm text-muted">{t.city} · {t.date}</span></span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
    {/* Left / right controls, so visitors can see the reviews can be moved by hand */}
    <div className="container-x mt-6 flex justify-end gap-2">
      <button type="button" onClick={() => move(-1)} aria-label="Previous reviews" className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-white transition hover:border-plum hover:text-plum"><ArrowLeft className="h-5 w-5" /></button>
      <button type="button" onClick={() => move(1)} aria-label="Next reviews" className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-white transition hover:border-plum hover:text-plum"><ArrowRight className="h-5 w-5" /></button>
    </div>
    </>
  )
}

/* ───────────────── 9. Centres ───────────────── */
// Map-pin layout (md+): tip position of each pin in % of the stage, and pin width in % of the stage
const PIN_LAYOUT: Record<string, { x: number; y: number; w: number; order: number }> = {
  khulna: { x: 22, y: 88, w: 15, order: 1 },
  banani: { x: 50, y: 94.5, w: 24, order: 0 },
  cumilla: { x: 80, y: 88, w: 15, order: 2 },
}
// Teardrop outline (ring) and the inner window the photo is clipped to, in a 100×130 box
const PIN_OUTER = 'M50 128 C38 108 4 86 4 50 A46 46 0 1 1 96 50 C96 86 62 108 50 128 Z'
const PIN_INNER = 'M50 114 C40 99 11 81 11 50 A39 39 0 1 1 89 50 C89 81 60 99 50 114 Z'
// Location ripple copied from the reference Lottie (60 frames at 30fps = 2s): rings start at frames 0, 9 and 19
const PIN_ENTER = 0.8
const LOC_RING_OFFSETS = [0, 9, 19]

function CentrePin({ c, featured, delay, positioned, show }: { c: (typeof centres)[number]; featured: boolean; delay: number; positioned: boolean; show?: boolean }) {
  const reduce = useReducedMotion()
  const L = PIN_LAYOUT[c.slug]
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.55 }}
      {...(show === undefined ? { whileInView: { opacity: 1, scale: 1 }, viewport: { once: true, amount: 0.3 } } : { animate: show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.55 } })}
      transition={{ duration: 0.7, delay, ease: [0.34, 1.56, 0.64, 1] }}
      style={positioned ? { left: `${L.x}%`, top: `${L.y}%`, width: `${L.w}%`, x: '-50%', y: '-100%', transformOrigin: '50% 100%' } : { transformOrigin: '50% 100%' }}
      className={positioned ? 'absolute z-10' : `relative mx-auto ${featured ? 'w-56' : 'w-44'}`}>
      <Link to={`/centres/${c.slug}`} aria-label={`${c.name}: see centre details`} className="group relative block transition duration-500 hover:-translate-y-1.5">
        <svg viewBox="0 0 100 130" className="block w-full overflow-visible drop-shadow-[0_22px_28px_rgba(107,31,120,.35)]">
          <defs>
            <linearGradient id={`pin-ring-${c.slug}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EBC4F0" />
              <stop offset="45%" stopColor="#B25FBF" />
              <stop offset="100%" stopColor="#6B1F78" />
            </linearGradient>
            <clipPath id={`pin-clip-${c.slug}`}><path d={PIN_INNER} /></clipPath>
          </defs>
          <path d={PIN_OUTER} fill={`url(#pin-ring-${c.slug})`} />
          <path d={PIN_OUTER} fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1" />
          <image href={c.image} x="0" y="0" width="100" height="118" preserveAspectRatio="xMidYMid slice" clipPath={`url(#pin-clip-${c.slug})`} />
          <path d={PIN_INNER} fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="1.2" />
        </svg>
        <span className={`absolute left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white/90 font-semibold text-ink shadow-soft backdrop-blur transition group-hover:bg-white ${featured ? 'top-[74%] px-6 py-2.5 text-base xl:text-lg' : 'top-[70%] px-4 py-2 text-sm xl:text-[0.9375rem]'}`}>
          <MapPin className={`${featured ? 'h-5 w-5' : 'h-4 w-4'} shrink-0 text-plum`} />{c.name}
        </span>
      </Link>
    </motion.div>
  )
}

function CentresArches() {
  const reduce = useReducedMotion()
  const list = ['khulna', 'banani', 'cumilla'].map((slug) => centres.find((c) => c.slug === slug)!).filter(Boolean)
  const P = (k: string) => PIN_LAYOUT[k]
  // Dashed routes from each OPD up to the Banani label (viewBox matches the stage: 1000 × 340)
  const toX = (v: number) => v * 10
  const toY = (v: number) => v * 3.4
  const routes = [
    { d: 'M258,290 C320,238 370,238 425,252', end: [258, 290] },
    { d: 'M575,252 C630,238 680,238 742,290', end: [742, 290] },
  ]
  const pinDelay = (slug: string) => P(slug).order * 0.22
  const pinLoopStart = (slug: string) => pinDelay(slug) + PIN_ENTER
  const stage = useRef<HTMLDivElement>(null)
  const show = useInView(stage, { once: true, amount: 0.3 })
  return (
    <section className="section bg-mist pb-10 pt-0 md:pb-12 md:pt-0 lg:pb-14 lg:pt-0">
      <div className="container-x">
        <SectionHeader title={<>Find a Meena IVF centre <em className="text-plum">near you</em></>} />

        {/* md+: pins on a stage, joined by dashed routes */}
        <div ref={stage} className="relative hidden aspect-[1000/340] md:block">
          <svg aria-hidden viewBox="0 0 1000 340" className="absolute inset-0 h-full w-full overflow-visible">
            {/* ground rings and glow under each pin */}
            {list.map((c) => {
              const L = P(c.slug)
              const big = c.slug === 'banani'
              // full ring size: about 1.6× the pin's width, 2.77:1 ellipse
              const rx = L.w * 10 * 0.8
              const ry = rx / 2.77
              return (
                <g key={c.slug} transform={`translate(${toX(L.x)} ${toY(L.y)})`}>
                  {/* location ripple (same timing as the reference Lottie): three rings grow from the tip and fade, on a slow 6s loop and fully opaque at their peak */}
                  {!reduce && show && LOC_RING_OFFSETS.map((o, i) => {
                    const a = o / 60, b = (o + 21) / 60, e = (o + 31) / 60
                    return (
                      <motion.ellipse key={i} rx={rx} ry={ry} fill="none" stroke="#DDB3E6" strokeWidth={big ? 2 : 1.5} vectorEffect="non-scaling-stroke"
                        initial={{ scale: 0.03, opacity: 0 }}
                        animate={{ scale: [0.03, 0.03, 1, 1], opacity: [0, 0, 1, 0, 0] }}
                        transition={{
                          scale: { duration: 6, times: [0, a, e, 1], ease: ['linear', i === 0 ? [0.333, 0, 0.554, 1] : [0.333, 0, 0.667, 1], 'linear'], repeat: Infinity, delay: pinLoopStart(c.slug) },
                          opacity: { duration: 6, times: [0, a, b, e, 1], ease: ['linear', [0.333, 0, 0.667, 1], [0.333, 0, 0.667, 1], 'linear'], repeat: Infinity, delay: pinLoopStart(c.slug) },
                        }} />
                    )
                  })}
                </g>
              )
            })}
            {/* routes: dashed line fades in after the pins */}
            {routes.map((r, i) => (
              <g key={i}>
                <motion.path d={r.d} fill="none" stroke="#9440A0" strokeWidth="1.6" strokeDasharray="5 6" strokeLinecap="round"
                  initial={reduce ? false : { opacity: 0 }} animate={show ? { opacity: 0.85 } : undefined}
                  transition={{ duration: 0.8, delay: 0.8 + i * 0.15 }} />
                <motion.circle cx={r.end[0]} cy={r.end[1]} r="4" fill="#9440A0"
                  initial={reduce ? false : { opacity: 0, scale: 0 }} animate={show ? { opacity: 1, scale: 1 } : undefined}
                  transition={{ duration: 0.4, delay: 1.1 + i * 0.15 }} />
              </g>
            ))}
          </svg>
          {list.map((c) => <CentrePin key={c.slug} c={c} featured={c.slug === 'banani'} delay={pinDelay(c.slug)} positioned show={show || !!reduce} />)}
        </div>

        {/* mobile: the same pins, stacked */}
        <div className="flex flex-col items-center gap-10 md:hidden">
          {[...list].sort((a, b) => P(a.slug).order - P(b.slug).order).map((c, i) => (
            <CentrePin key={c.slug} c={c} featured={c.slug === 'banani'} delay={i * 0.15} positioned={false} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────── 10. Learn ───────────────── */
function Learn() {
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeader title={<>Fertility articles from our <em className="text-plum">doctors</em></>} action={<Link to="/blog" className="btn-secondary">Visit the blog <ArrowRight className="h-4 w-4" /></Link>} />
        <div className="grid gap-6 md:grid-cols-3">
          {blog.slice().reverse().slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link to={`/blog/${p.slug}`} className="group block">
                <div className="aspect-[16/10] overflow-hidden rounded-card bg-mist"><img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
                <p className="mt-5 text-sm text-muted">{p.categories.join(' · ')}</p>
                <h3 lang="bn" className="mt-2 font-bn text-[1.4rem] font-semibold leading-snug text-ink group-hover:text-plum">{p.title}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  useMeta('', 'Meena IVF & Fertility Care, Banani, Dhaka. IVF, ICSI, IUI, fertility preservation and compassionate specialist-led care.')
  return (
    <>
      <Hero />
      <ArchManifesto />
      <JourneySelector />
      <TreatmentIndex />
      <Specialists />
      <ScrollRibbon auto className="mt-16 border-y border-line bg-mist py-6 md:mt-24 lg:mt-28 font-display text-[clamp(2.5rem,1.5rem+4vw,6rem)] leading-none md:py-10" words={['IVF', 'ICSI', 'IUI', 'Egg freezing', 'Embryo freezing', 'Laparoscopy', 'Hysteroscopy', 'TESA', 'Counselling']} />
      <IvfStory />
      <WhyBento />
      <TestimonialDeck />
      <CentresArches />
      <Learn />
    </>
  )
}
