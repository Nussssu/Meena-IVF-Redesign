import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { Activity, ArrowLeft, ArrowRight, CalendarDays, ChartNoAxesColumnIncreasing, Clock, Egg, FlaskConical, GraduationCap, Heart, MapPin, Microscope, Pause, Play, ScanLine, ShieldCheck, Snowflake, Stethoscope, Syringe, TestTube } from 'lucide-react'
import { RL, Reveal, SectionHeader, WhatsAppIcon, useMeta } from '../components/ui'
import { DoctorCard, TodayBadge } from '../components/cards'
import { Magnetic, ScrollRibbon } from '../components/motion'
import { Embryo, EMBRYO_LABELS } from '../components/Embryo'
import { doctors, scheduleSummary } from '../data/doctors'
import { treatmentBySlug } from '../data/treatments'
import { centres, ivfJourney, journeys, testimonials } from '../data/content'
import { waLink } from '../data/site'
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
  // Card copy and where each card leads (image, title, short line, text link)
  const CARD: Record<string, { label: string; desc: string; to: string; img: string; pos: string }> = {
    conceive: { label: 'Trying to conceive', desc: 'Start with a careful evaluation of both partners.', to: '/treatments/medical-history-evaluation', img: '/img/embryo-2.webp', pos: 'object-[50%_50%]' },
    miscarriage: { label: 'Miscarriage support', desc: 'Gentle care to find the cause and try again.', to: '/treatments/hysteroscopy', img: '/img/journey-conceive.webp', pos: 'object-[45%_50%]' },
    preparing: { label: 'Preparing for treatment', desc: 'Clear steps, clear costs and a consultant by your side.', to: '/treatments/ivf', img: '/img/journey-miscarriage.webp', pos: 'object-[60%_50%]' },
    freezing: { label: 'Egg freezing', desc: 'Preserve your eggs today, on your own timeline.', to: '/treatments/egg-freezing', img: '/img/egg-2.webp', pos: 'object-[50%_50%]' },
  }
  return (
    <section className="section">
      <div className="container-x">
        <Reveal className="mb-10 text-center md:mb-14">
          <h2 className="h2">Your fertility <em className="text-plum">journey</em></h2>
        </Reveal>
        <ul className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {journeys.map((x, i) => {
            const c = CARD[x.key] ?? { label: x.label, desc: x.title, to: '/treatments', img: x.image, pos: '' }
            return (
              <Reveal as="li" key={x.key} delay={i * 0.06} className="h-full">
                <Link to={c.to} className="group flex h-full flex-col">
                  <div className="relative aspect-[9/10] overflow-hidden rounded-none bg-mist">
                    <img src={c.img} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${c.pos} transition duration-700 group-hover:scale-[1.03]`} />
                  </div>
                  <h3 className="mt-6 font-sans text-xl font-semibold leading-snug tracking-[0.01em] text-ink transition-colors group-hover:text-plum md:text-2xl">{c.label}</h3>
                  <p className="mt-2 text-base font-light leading-relaxed text-ink-2 md:text-lg">{c.desc}</p>
                  <span className="mt-auto pt-6 text-[0.9375rem] font-semibold uppercase text-ink underline decoration-[1.5px] underline-offset-[5px] transition-colors group-hover:text-plum md:text-base">Explore care</span>
                </Link>
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
  { slug: 'ivf', img: '/img/lab-microscope.webp', Icon: FlaskConical },
  { slug: 'icsi', img: '/img/embryo-1.webp', Icon: Microscope },
  { slug: 'iui', img: '/img/consult.webp', Icon: Syringe },
  { slug: 'egg-freezing', img: '/img/egg-1.webp', Icon: Egg },
  { slug: 'embryo-freezing', img: '/img/embryo-3.webp', Icon: Snowflake },
  { slug: 'folliculometry', img: '/img/folliculometry.webp', Icon: ScanLine },
  { slug: 'laparoscopy', img: '/img/laparoscopy.webp', Icon: Activity },
  { slug: 'tesa', img: '/img/semen-2.webp', Icon: TestTube },
]

function TreatmentIndex() {
  return (
    <section className="section bg-white">
      <div className="container-x">
        <SectionHeader title={<>Wherever you are, there&rsquo;s a <em className="text-plum">next step</em>.</>}
          text="From your first scan to IVF, every treatment you need is here, planned just for you."
          action={<Link to="/treatments" className="btn-secondary">All 18 treatments <ArrowRight className="h-4 w-4" /></Link>} />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {INDEX.map((it, i) => {
            const t = treatmentBySlug(it.slug)!
            return (
              <Reveal as="li" key={it.slug} delay={i * 0.03} y={12} className="h-full">
                {/* Clean square card; on hover it turns plum and the treatment photo fades in on the right */}
                <Link to={`/treatments/${t.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden border border-line bg-white p-7 transition duration-300 ease-out hover:border-plum hover:bg-plum hover:shadow-lift focus-visible:border-plum md:p-8">
                  <img src={it.img} alt="" loading="lazy" className="pointer-events-none absolute inset-y-0 right-0 h-full w-[75%] object-cover opacity-0 transition duration-500 group-hover:opacity-100" />
                  <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-plum via-plum/90 to-plum/40 opacity-0 transition duration-500 group-hover:opacity-100" />
                  <div className="relative flex flex-1 flex-col">
                    <span className="grid h-14 w-14 place-items-center bg-lilac/60 text-plum transition duration-300 group-hover:bg-white"><it.Icon className="h-6 w-6" strokeWidth={1.75} /></span>
                    <p className="mt-8 font-display text-[1.75rem] leading-none text-ink transition group-hover:text-white md:text-[2rem]">{t.name}</p>
                    <p className="mt-3 line-clamp-2 text-[0.9375rem] leading-relaxed text-muted transition group-hover:text-white/85">{t.short}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-7 text-[0.9375rem] font-medium text-plum transition group-hover:text-white">Learn more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
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
      <h2 className={`h2 text-balance ${light ? '!text-paper' : ''}`}>From one cell to a <em className="text-inherit">new life</em>.</h2>
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
  const tint = d.tint === 'blush' ? 'bg-blush' : d.tint === 'mist' ? 'bg-[#E6E0EF]' : 'bg-lilac'
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
            <div className="h-[min(64vh,40rem)]">
              <div className={`arch relative h-full overflow-hidden transition-colors duration-500 ${tint}`}>
                <div aria-hidden className="arch-full absolute inset-x-[12%] bottom-0 top-[12%] bg-white/50" />
                <AnimatePresence mode="popLayout" initial={false} custom={dir.current}>
                  <motion.img key={d.slug} src={d.image} alt={d.name} custom={dir.current}
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
            <DoctorCard d={d} compact />
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
const WHY_VIDEO = '/img/IVF%20Video.mp4'

function WhyBento() {
  const reduce = useReducedMotion()
  const desktop = useMedia('(min-width: 1024px)')
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(!reduce)
  const [active, setActive] = useState(0)

  const items = [
    { label: 'Self-cycle first', Icon: Stethoscope, img: 'folliculometry', alt: 'Doctor explaining a natural cycle scan to a patient', head: 'A natural start for your', em: 'journey.', text: 'We try your natural cycle first, before any medication.' },
    { label: 'Personalised treatment plans', Icon: CalendarDays, img: 'consult', alt: 'Couple planning treatment with their doctor', head: 'A plan built around', em: 'you.', text: 'Built around your medical history, condition and goals.' },
    { label: 'Transparent & affordable care', Icon: ShieldCheck, img: 'journey-miscarriage', alt: 'Couple talking openly with their doctor about the treatment plan', head: 'Clear costs, no', em: 'surprises.', text: 'Clear pricing upfront, with no hidden costs.' },
    { label: 'Proven treatment protocols', Icon: ChartNoAxesColumnIncreasing, img: 'doctors-duo', alt: 'Meena IVF fertility specialists', head: 'Protocols you can', em: 'trust.', text: 'Internationally recognised protocols for consistent results.' },
    { label: 'Advanced fertility technology', Icon: Microscope, img: 'lab-microscope', alt: 'Microscope in the Meena IVF lab', head: 'Modern science, in expert', em: 'hands.', text: 'Our in-house OT and IVF lab, all under one roof.' },
    { label: 'Complete patient support', Icon: Heart, img: 'couple-doctor', alt: 'Doctor supporting an expecting couple', head: 'Cared for at every', em: 'step.', text: 'Counselling and guidance at every stage of treatment.' },
  ]
  const n = items.length
  const cur = items[active]

  // Desktop: the section pins to the screen and scrolling steps through the options
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (desktop) setActive(Math.min(n - 1, Math.max(0, Math.floor(p * n))))
  })

  const pick = (i: number) => {
    const el = sectionRef.current
    if (!desktop || !el) { setActive(i); return }
    const top = el.getBoundingClientRect().top + window.scrollY
    const travel = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + travel * ((i + 0.5) / n), behavior: reduce ? 'auto' : 'smooth' })
  }

  const toggleVideo = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play().catch(() => {}); setPlaying(true) } else { v.pause(); setPlaying(false) }
  }

  return (
    <section ref={sectionRef} className="section bg-mist lg:h-[420vh] lg:py-0">
      <div className="container-x lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center">
        <Reveal className="mb-10 md:mb-14 lg:mb-8">
          <h2 className="h2 lg:whitespace-nowrap">Why couples trust <em className="text-plum">Meena IVF</em></h2>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {/* Video screen */}
          <Reveal className="relative min-h-[22rem] overflow-hidden rounded-panel bg-plum-900 shadow-lift">
            <video ref={videoRef} src={WHY_VIDEO} autoPlay={!reduce} muted loop playsInline preload="metadata"
              aria-label="Inside Meena IVF: reception, operation theatre and IVF lab"
              className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-plum-800/95 via-plum-800/25 to-transparent" />
            <div className="relative flex h-full min-h-[22rem] items-end justify-between gap-4 p-7 text-paper md:p-9">
              <div className="flex-1">
                <p className="text-eyebrow font-semibold uppercase text-paper/85">Take a look inside</p>
                <h3 className="mt-2 font-display text-3xl !text-paper md:text-[2rem]">Our clinic, OT &amp; IVF lab</h3>
              </div>
              <button type="button" onClick={toggleVideo} aria-label={playing ? 'Pause video' : 'Play video'}
                className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-paper/90 text-paper backdrop-blur-sm transition hover:bg-paper/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper">
                {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="ml-0.5 h-5 w-5 fill-current" />}
              </button>
            </div>
          </Reveal>

          {/* Options + detail share one box; each half matches the video's width */}
          <Reveal delay={0.05} className="grid overflow-hidden rounded-panel bg-white/60 shadow-lift ring-1 ring-line lg:col-span-2 lg:grid-cols-[1fr_calc((100%-1.25rem)/2)]">
          <div className="p-4 md:p-5">
            <ul className="flex h-full flex-col justify-center gap-3 lg:gap-[12px]">
              {items.map((it, i) => {
                const on = i === active
                return (
                  <li key={it.label} className="lg:h-[68px]">
                    <button type="button" onClick={() => pick(i)} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} aria-pressed={on}
                      className={`flex h-full w-full items-center gap-3 rounded-full border py-2 pl-2 pr-5 text-left transition duration-300 ${on ? 'border-plum/25 bg-white shadow-[0_14px_30px_-14px_rgba(128,41,143,.55)]' : 'border-line bg-white/70 hover:bg-white'}`}>
                      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition ${on ? 'bg-plum text-white' : 'bg-lilac/70 text-ink'}`}><it.Icon className="h-5 w-5" strokeWidth={1.75} /></span>
                      <span className={`text-[0.9375rem] font-semibold leading-snug ${on ? 'text-ink' : 'text-ink-2'}`}>{it.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Inset card: clean photo on top, text below */}
          <div className="p-4 md:p-5 lg:pl-0">
            <div className="flex h-full min-h-[28rem] flex-col overflow-hidden rounded-panel bg-gradient-to-br from-plum-700 via-plum-800 to-plum-900 text-paper ring-1 ring-line">
              <div className="relative h-48 shrink-0 overflow-hidden lg:h-[45%]">
                <AnimatePresence initial={false}>
                  <motion.img key={cur.img} src={`/img/${cur.img}.webp`} alt={cur.alt} loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={reduce ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }} />
                </AnimatePresence>
              </div>
              <div className="flex flex-1 flex-col px-6 pb-6 pt-5 md:px-7 md:pb-7" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.div key={active} className="mb-5" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }}>
                    <p className="text-eyebrow font-semibold uppercase text-paper/85">{cur.label}</p>
                    <h3 className="mt-3 font-display text-2xl leading-[1.1] !text-paper xl:text-[2rem]">{cur.head} <em className="text-[#E7A6F0]">{cur.em}</em></h3>
                    <p className="mt-3 max-w-md leading-relaxed text-paper/85">{cur.text}</p>
                  </motion.div>
                </AnimatePresence>
                <Link to="/why-meena" className="btn-light group mt-auto shrink-0 self-start !text-ink">
                  Explore Our Approach <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ───────────────── 8. Testimonial deck ───────────────── */
function TestimonialDeck() {
  const reduce = useReducedMotion()
  const photos = ['success-1', 'success-2', 'success-3', 'success-4']
  // The wire is a quadratic curve y = 10 + 320·x(1−x) (px); each photo hangs at its column centre
  const sag = (x: number) => 10 + 320 * x * (1 - x)
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
        <div className="relative mt-10 md:mt-14">
          <svg aria-hidden viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[100px] w-full overflow-visible">
            <path d="M0 10 Q500 170 1000 10" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="text-ink/35" />
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

      {/* Reviews: continuous right-to-left marquee, no edge fades */}
      <div className="group mt-14 overflow-hidden md:mt-20 motion-reduce:overflow-x-auto">
        <ul className="flex w-max animate-[marquee_60s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...testimonials, ...testimonials].map((t, i) => (
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
    </section>
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
  const stage = useRef<HTMLDivElement>(null)
  const show = useInView(stage, { once: true, amount: 0.3 })
  return (
    <section className="section bg-mist pb-10 pt-0 md:pb-12 md:pt-0 lg:pb-14 lg:pt-0">
      <div className="container-x">
        <SectionHeader title={<>Find a Meena IVF centre <em className="text-plum">near you</em></>} />

        {/* md+: pins on a stage, joined by dashed routes */}
        <div ref={stage} className="relative hidden aspect-[1000/340] md:block">
          <svg aria-hidden viewBox="0 0 1000 340" className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <radialGradient id="tip-glow"><stop offset="0%" stopColor="#E7A6F0" stopOpacity=".85" /><stop offset="100%" stopColor="#E7A6F0" stopOpacity="0" /></radialGradient>
            </defs>
            {/* ground rings and glow under each pin */}
            {list.map((c) => {
              const L = P(c.slug)
              const big = c.slug === 'banani'
              const rx = big ? 70 : 48
              const ry = big ? 20 : 13
              return (
                <g key={c.slug} transform={`translate(${toX(L.x)} ${toY(L.y)})`}>
                  {[1, 1.8, 2.7].map((k, i) => (
                    <motion.ellipse key={i} rx={rx * k} ry={ry * k} fill="none" stroke="#B25FBF" strokeWidth="1"
                      initial={reduce ? false : { opacity: 0 }} animate={show ? { opacity: 0.35 - i * 0.09 } : undefined}
                      transition={{ duration: 0.8, delay: pinDelay(c.slug) + 0.3 + i * 0.12 }} />
                  ))}
                  {/* two rings leave the tip and each settles into one of the outer ground lines */}
                  {!reduce && [1.8, 2.7].map((k, i) => (
                    <motion.ellipse key={k} rx={rx} ry={ry} fill="none" stroke="#B25FBF" strokeWidth="1.5" vectorEffect="non-scaling-stroke"
                      initial={{ scale: 1, opacity: 0 }} animate={{ scale: [1, k, k], opacity: [0.6, 0.35 - (i + 1) * 0.09, 0] }}
                      transition={{ duration: 2.6, times: [0, 0.8, 1], repeat: Infinity, ease: 'easeOut', delay: pinDelay(c.slug) + 1 + i * 0.5 }} />
                  ))}
                  <ellipse rx={big ? 46 : 30} ry={big ? 14 : 9} fill="url(#tip-glow)" />
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
                <p className="mt-5 text-sm text-muted">{p.categories.join(' · ')} · {p.readMinutes} min read</p>
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
      <ScrollRibbon className="border-y border-line bg-mist py-6 font-display text-[clamp(2.5rem,1.5rem+4vw,6rem)] leading-none md:py-10" words={['IVF', 'ICSI', 'IUI', 'Egg freezing', 'Embryo freezing', 'Laparoscopy', 'Hysteroscopy', 'TESA', 'Counselling']} />
      <IvfStory />
      <Specialists />
      <WhyBento />
      <TestimonialDeck />
      <CentresArches />
      <Learn />
    </>
  )
}
