import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, useMotionValue, type MotionValue, type PanInfo } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, Clock, MapPin, Navigation } from 'lucide-react'
import { CTABand, RL, Reveal, SectionHeader, WhatsAppIcon, useMeta } from '../components/ui'
import { DoctorCard, TodayBadge } from '../components/cards'
import { Magnetic, ScrollRibbon, canHover } from '../components/motion'
import { Embryo, EMBRYO_LABELS } from '../components/Embryo'
import { doctors, scheduleSummary } from '../data/doctors'
import { treatmentBySlug, groups, byGroup } from '../data/treatments'
import { centres, ivfJourney, journeys, nextMonthly, testimonials, whyMeena } from '../data/content'
import { waLink } from '../data/site'
import blog from '../data/blog.json'

const EASE = [0.22, 1, 0.36, 1] as const
const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

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
    <section ref={ref} className="grain relative overflow-hidden bg-paper">
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
          <div className="absolute inset-0 bg-paper/70 md:bg-transparent md:bg-[linear-gradient(to_right,rgba(251,247,242,.88)_0%,rgba(251,247,242,.7)_35%,rgba(251,247,242,0)_58%)]" />
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

function ArchManifesto() {
  const reduce = useReducedMotion()
  const desktop = useMedia('(min-width: 768px)')
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const side = desktop ? '31%' : '14%'
  const clip = useTransform(p, [0, 0.42], [`inset(12% ${side} 10% ${side} round 999px 999px 28px 28px)`, 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)'])
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
    <section ref={ref} className="relative h-[260vh] bg-paper" aria-label="Our promise">
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
  return <motion.span style={{ opacity, y }} className={`mx-[0.12em] inline-block ${em ? 'italic text-lilac' : ''}`}>{children}</motion.span>
}

/* ───────────────── 3. Journey selector ───────────────── */
function JourneySelector() {
  const [active, setActive] = useState(0)
  // Auto-advance through the options in a loop
  useEffect(() => {
    const t = window.setTimeout(() => setActive((a) => (a + 1) % journeys.length), 5000)
    return () => window.clearTimeout(t)
  }, [active])
  const onKey = (e: React.KeyboardEvent) => {
    const cols = 2
    const map: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }
    const move = map[e.key]
    if (!move) return
    e.preventDefault()
    const next = (active + move + journeys.length) % journeys.length
    setActive(next)
    document.getElementById(`tab-${journeys[next].key}`)?.focus()
  }
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeader title={<>Where are you in your <em className="text-plum">journey</em>?</>} />
        <div className="grid gap-5 lg:gap-8">
          <div role="tablist" aria-label="Your situation" aria-orientation="horizontal" onKeyDown={onKey} className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {journeys.map((x, i) => {
              const on = active === i
              return (
                <button key={x.key} role="tab" id={`tab-${x.key}`} aria-selected={on} tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`group relative overflow-hidden rounded-panel text-left outline-offset-4 transition duration-300 ease-out ${on ? 'shadow-lift ring-2 ring-plum ring-offset-2 ring-offset-paper' : 'hover:-translate-y-0.5'}`}>
                  <div className="relative aspect-square">
                    <img src={x.image} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${on ? 'scale-105' : 'group-hover:scale-105'}`} />
                    <div className={`absolute inset-0 transition duration-300 ${on ? 'bg-gradient-to-t from-plum-900/95 via-plum-900/45 to-plum-900/5' : 'bg-gradient-to-t from-plum-900/85 via-plum-900/35 to-plum-900/10'}`} />
                    {on && (
                      <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-plum transition md:left-4 md:top-4">
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                      <p className="font-display text-[1.15rem] leading-[1.12] text-paper sm:text-[1.4rem] md:text-[1.55rem]">{x.label}?</p>                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────── 4. Treatment index ───────────────── */
const INDEX = [
  { slug: 'ivf', img: '/img/lab-microscope.webp' },
  { slug: 'icsi', img: '/img/embryo-1.webp' },
  { slug: 'iui', img: '/img/consult.webp' },
  { slug: 'egg-freezing', img: '/img/egg-1.webp' },
  { slug: 'embryo-freezing', img: '/img/embryo-3.webp' },
  { slug: 'folliculometry', img: '/img/folliculometry.webp' },
  { slug: 'laparoscopy', img: '/img/laparoscopy.webp' },
  { slug: 'tesa', img: '/img/semen-2.webp' },
]

function TreatmentIndex() {
  const [hover, setHover] = useState<number | null>(null)
  const [pointer, setPointer] = useState(false)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 26 }), y = useSpring(my, { stiffness: 220, damping: 26 })
  useEffect(() => setPointer(canHover()), [])

  return (
    <section className="section bg-white">
      <div className="container-x">
        <SectionHeader eyebrow="Treatments" title={<>Advanced care, <em className="text-plum">under one roof</em>.</>}
          text="From the first scan to the embryology lab, every step happens here, planned around your diagnosis rather than a template."
          action={<Link to="/treatments" className="btn-secondary">All 18 treatments <ArrowRight className="h-4 w-4" /></Link>} />
        <ul className="border-t border-ink/15" onPointerMove={(e) => { mx.set(e.clientX); my.set(e.clientY) }} onPointerLeave={() => setHover(null)}>
          {INDEX.map((it, i) => {
            const t = treatmentBySlug(it.slug)!
            return (
              <Reveal as="li" key={it.slug} delay={i * 0.03} y={12}>
                <Link to={`/treatments/${t.slug}`} onPointerEnter={() => setHover(i)} onFocus={() => setHover(null)}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-ink/15 py-5 md:grid-cols-[4rem_1fr_1fr_auto] md:py-7">
                  <span className="font-display text-sm text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display leading-none transition duration-300 ease-out group-hover:translate-x-3 group-hover:text-plum group-focus-visible:text-plum" style={{ fontSize: 'clamp(2rem, 1.2rem + 3vw, 4.5rem)' }}>{t.name}</span>
                  <span className="hidden max-w-sm text-[0.9375rem] leading-snug text-muted md:block">{t.short}</span>
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-line transition duration-200 group-hover:border-plum group-hover:bg-plum group-hover:text-white"><ArrowUpRight className="h-5 w-5" /></span>
                </Link>
              </Reveal>
            )
          })}
        </ul>
        <div className="mt-8 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-6">
          {groups.map((g) => (
            <Link key={g.key} to={`/treatments#${g.key}`} className="group bg-paper p-5 transition hover:bg-mist">
              <p className="text-sm font-semibold text-ink group-hover:text-plum">{g.label}</p>
              <p className="mt-1 text-xs text-muted">{byGroup(g.key).map((t) => t.name).join(' · ')}</p>
            </Link>
          ))}
        </div>
      </div>
      {pointer && (
        <motion.div aria-hidden style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block">
          <AnimatePresence>
            {hover !== null && (
              <motion.div key={hover} initial={{ opacity: 0, scale: 0.85, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: -2 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2, ease: 'easeOut' }}
                className="arch absolute -translate-x-1/2 -translate-y-[60%] overflow-hidden shadow-lift" style={{ width: '15rem', height: '19rem' }}>
                <img src={INDEX[hover].img} alt="" className="h-full w-full object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
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
      <h2 className={`h2 text-balance ${light ? '!text-paper' : ''}`}>From one cell to a <em className={light ? 'text-lilac' : 'text-plum'}>new life</em>.</h2>
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
  const bar = useTransform(p, [0.05, 0.95], [0, 1])
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
            <div className="mt-8 h-px w-full bg-white/15"><motion.div style={{ scaleX: bar }} className="h-px origin-left bg-lilac" /></div>
            <Link to="/treatments/ivf" className="mt-4 inline-flex min-h-[2.75rem] items-center gap-2 text-sm font-semibold text-lilac hover:text-white">Read about IVF <ArrowRight className="h-4 w-4" /></Link>
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

function SpecialistsSticky() {
  const [active, setActive] = useState(0)
  const d = doctors[active]
  const tint = d.tint === 'blush' ? 'bg-blush' : d.tint === 'mist' ? 'bg-[#E6E0EF]' : 'bg-lilac'
  return (
    <section className="section bg-paper">
      <div className="container-x">
        <SectionHeader eyebrow="Our specialists" title="Expert hands. Gentle hearts." text="Five senior consultants trained in Bangladesh, India and Germany, each with their own chamber days at our Banani centre." action={<Link to="/doctors" className="btn-secondary">All specialists <ArrowRight className="h-4 w-4" /></Link>} />
        <div className="grid grid-cols-[.85fr_1.15fr] gap-16">
          <div className="sticky top-[12vh] h-[76vh] self-start">
            <div className={`arch relative h-full overflow-hidden transition-colors duration-500 ${tint}`}>
              <div aria-hidden className="arch-full absolute inset-x-[12%] bottom-0 top-[12%] bg-white/50" />
              <AnimatePresence mode="popLayout">
                <motion.img key={d.slug} src={d.image} alt={d.name}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute inset-x-0 bottom-0 mx-auto h-[92%] w-auto object-contain object-bottom" />
              </AnimatePresence>
              <div className="absolute bottom-6 left-5"><TodayBadge doctor={d} /></div>
              <div className="absolute bottom-5 right-5 rounded-full bg-white/90 px-4 py-2 font-display text-lg shadow-soft">0{active + 1} <span className="text-muted">/ 0{doctors.length}</span></div>
            </div>
          </div>
          <ol>
            {doctors.map((doc, i) => (
              <motion.li key={doc.slug} onViewportEnter={() => setActive(i)} viewport={{ margin: '-48% 0px -48% 0px' }}
                className={`flex min-h-[58vh] flex-col justify-center border-t border-line py-10 transition-opacity duration-300 ${active === i ? 'opacity-100' : 'opacity-40'}`}>
                <p className="text-sm font-semibold text-plum">{doc.title} · {doc.experience}+ years</p>
                <h3 className="mt-2 font-display leading-[1.05]" style={{ fontSize: 'clamp(2rem, 1.2rem + 1.8vw, 3.25rem)' }}><Link to={`/doctors/${doc.slug}`} className="hover:text-plum">{doc.name}</Link></h3>
                <p className="mt-3 text-lg text-ink-2">{doc.role}</p>
                <div className="mt-5 flex flex-wrap gap-2">{doc.focus.slice(0, 4).map((f) => <span key={f} className="chip">{f}</span>)}</div>
                <p className="mt-5 flex items-start gap-2 text-sm text-ink-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-lavender" />{scheduleSummary(doc)}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to={`/book?doctor=${doc.slug}`} className="btn-primary">Book with {doc.short}</Link>
                  <Link to={`/doctors/${doc.slug}`} className="btn-secondary">View profile</Link>
                </div>
              </motion.li>
            ))}
          </ol>
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
        <SectionHeader eyebrow="Our specialists" title="Expert hands. Gentle hearts." text="Five senior consultants trained in Bangladesh, India and Germany, each with their own chamber days at our Banani centre."
          action={<div className="flex gap-2">
            <button onClick={() => scroll(-1)} aria-label="Previous doctors" className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-white transition hover:border-plum hover:text-plum"><ArrowLeft className="h-5 w-5" /></button>
            <button onClick={() => scroll(1)} aria-label="Next doctors" className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-white transition hover:border-plum hover:text-plum"><ArrowRight className="h-5 w-5" /></button>
          </div>} />
      </div>
      <div ref={track} data-lenis-prevent-wheel className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-2 scroll-px-5 md:px-8 md:scroll-px-8">
        {doctors.map((d) => (
          <div key={d.slug} className="w-[78%] shrink-0 snap-start sm:w-[46%]"><DoctorCard d={d} /></div>
        ))}
        <div className="w-px shrink-0" />
      </div>
    </section>
  )
}

/* ───────────────── 7. Why Meena bento ───────────────── */
function WhyBento() {
  const w = Object.fromEntries(whyMeena.map((x) => [x.title, x.text]))
  const tile = 'rounded-panel p-6 md:p-7 flex flex-col justify-between'
  return (
    <section className="section bg-mist">
      <div className="container-x">
        <SectionHeader eyebrow="Why Meena" title={<>Clinically strong. <em className="text-plum">Emotionally reassuring.</em></>} text="We guide you through every stage with expert medical care, modern technology and compassionate support." />
        <div className="grid auto-rows-[minmax(13rem,auto)] gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Reveal className="relative overflow-hidden rounded-panel md:col-span-2 lg:row-span-2">
            <img src="/img/reception.webp" alt="Meena IVF reception, Banani centre" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-[1.2s] hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-plum-900/90 via-plum-900/20 to-transparent" />
            <div className="relative flex h-full min-h-[22rem] flex-col justify-end p-7 text-paper md:p-9">
              <p className="text-eyebrow font-semibold uppercase text-lilac">Under one roof</p>
              <h3 className="mt-2 font-display text-3xl !text-paper md:text-4xl">In-house OT &amp; IVF lab</h3>
              <p className="mt-2 max-w-md text-paper/80">{w['In-house OT & IVF lab']}</p>
            </div>
          </Reveal>
          <Reveal delay={0.05} className={`${tile} bg-plum-900 text-paper md:col-span-2`}>
            <p className="text-eyebrow font-semibold uppercase text-lilac">Our approach</p>
            <div><h3 className="font-display text-3xl !text-paper">Self-cycle first</h3><p className="mt-2 max-w-md text-paper/75">{w['Self-cycle first']}</p></div>
          </Reveal>
          {(['Personalised plans', 'Transparent & affordable'] as const).map((k, i) => (
            <Reveal key={k} delay={i * 0.05} className={`${tile} border border-line bg-white`}>
              <span className="font-display text-sm text-muted">0{i + 1}</span>
              <div><h3 className="font-display text-2xl">{k}</h3><p className="mt-2 text-[0.9375rem] text-ink-2">{w[k]}</p></div>
            </Reveal>
          ))}
          <Reveal delay={0.1} className="relative overflow-hidden rounded-panel md:col-span-2">
            <img src="/img/patient-care.webp" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-plum-900/85 to-plum-900/10" />
            <div className="relative flex h-full flex-col justify-end p-7 text-paper"><h3 className="font-display text-2xl !text-paper">Complete support</h3><p className="mt-2 max-w-sm text-paper/80">{w['Complete support']}</p></div>
          </Reveal>
          <Reveal delay={0.05} className={`${tile} border border-line bg-white md:col-span-2 lg:col-span-1`}>
            <span className="font-display text-sm text-muted">03</span>
            <div><h3 className="font-display text-2xl">Proven protocols</h3><p className="mt-2 text-[0.9375rem] text-ink-2">{w['Proven protocols']}</p></div>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-2 lg:col-span-1">
            <Link to="/why-meena" className={`${tile} group h-full bg-plum text-white transition hover:bg-plum-700`}>
              <ArrowUpRight className="h-7 w-7 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
              <span className="font-display text-2xl">Why families choose Meena</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ───────────────── 8. Testimonial deck ───────────────── */
function TestimonialDeck() {
  const [order, setOrder] = useState(testimonials.map((_, i) => i))
  const reduce = useReducedMotion()
  const next = () => setOrder((o) => [...o.slice(1), o[0]])
  const prev = () => setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)])
  const onDragEnd = (_: unknown, info: PanInfo) => { if (Math.abs(info.offset.x) > 90) next() }
  const current = testimonials[order[0]]
  return (
    <section className="section overflow-hidden">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:items-center">
        <Reveal>
          <p className="eyebrow mb-5">Families’ words</p>
          <h2 className="h2 text-balance">Hope, returned, in their own words.</h2>
          <p className="mt-4 max-w-md text-ink-2">Swipe through what families tell us after their journey with Meena.</p>
          <div className="mt-8 grid grid-cols-4 gap-3">
            {['success-1', 'success-2', 'success-3', 'success-4'].map((s, i) => (
              <motion.img key={s} src={`/img/${s}.webp`} alt="An IVF baby born to a Meena family" loading="lazy" className="aspect-square w-full rounded-2xl object-cover"
                initial={reduce ? false : { opacity: 0, y: 16, rotate: i % 2 ? 3 : -3 }} whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 2 : -2 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }} />
            ))}
          </div>
          <Link to="/stories" className="link-quiet mt-6">See all stories <ArrowRight className="h-4 w-4" /></Link>
        </Reveal>
        <div>
          <div className="relative mx-auto grid max-w-xl" aria-live="polite" aria-atomic="true">
            <span className="sr-only">{`Testimonial from ${current.name}: ${current.quote}`}</span>
            {order.slice().reverse().map((idx) => {
              const pos = order.indexOf(idx)
              const t = testimonials[idx]
              const top = pos === 0
              return (
                <motion.figure key={t.name} aria-hidden
                  drag={top && !reduce ? 'x' : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.7} onDragEnd={top ? onDragEnd : undefined}
                  animate={{ y: pos * 14, scale: 1 - pos * 0.045, rotate: pos === 0 ? 0 : pos % 2 ? 2.5 : -2.5, opacity: pos > 2 ? 0 : 1 }}
                  transition={{ duration: reduce ? 0 : 0.3, ease: 'easeOut' }}
                  style={{ zIndex: testimonials.length - pos }}
                  className={`flex flex-col rounded-panel border border-line p-7 shadow-lift [grid-area:1/1] md:p-10 ${top ? 'cursor-grab bg-white active:cursor-grabbing' : 'bg-mist'}`}>
                  <div className={`flex flex-1 flex-col transition-opacity duration-200 ${top ? 'opacity-100' : 'opacity-0'}`}>
                  <span aria-hidden className="font-display text-7xl leading-[0.6] text-lilac">“</span>
                  <blockquote className="mt-4 flex-1 font-display text-[1.35rem] leading-snug text-ink md:text-[1.6rem]">{t.quote}</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-plum font-semibold text-white">{t.name[0]}</span>
                    <span><span className="block font-semibold">{t.name}</span><span className="text-sm text-muted">{t.city} · {t.date}</span></span>
                  </figcaption>
                  </div>
                </motion.figure>
              )
            })}
          </div>
          <div className="mx-auto mt-12 flex max-w-xl items-center justify-between">
            <p className="font-display text-lg">0{order[0] + 1} <span className="text-muted">/ 0{testimonials.length}</span></p>
            <div className="flex gap-2">
              <button onClick={prev} aria-label="Previous testimonial" className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-white hover:border-plum hover:text-plum"><ArrowLeft className="h-5 w-5" /></button>
              <button onClick={next} aria-label="Next testimonial" className="grid h-12 w-12 place-items-center rounded-full border border-ink/15 bg-white hover:border-plum hover:text-plum"><ArrowRight className="h-5 w-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────── 9. Centres: expanding arches ───────────────── */
function CentresArches() {
  const [active, setActive] = useState(0)
  const wide = useMedia('(min-width: 1024px)')
  return (
    <section className="section bg-white">
      <div className="container-x">
        <SectionHeader eyebrow="Our centres" title="Care that comes closer to home." text="Advanced treatment in Banani, with monthly specialist OPDs in Khulna and Cumilla so you can begin without travelling to Dhaka." action={<Link to="/centres" className="btn-secondary">Explore centres <ArrowRight className="h-4 w-4" /></Link>} />
        <div className={wide ? 'flex h-[36rem] gap-4' : 'grid gap-4 md:grid-cols-2'}>
          {centres.map((c, i) => {
            const next = c.monthly ? nextMonthly(c.monthly.nth, c.monthly.day, 1)[0] : null
            const open = !wide || active === i
            return (
              <motion.div key={c.slug} onPointerEnter={() => wide && setActive(i)} onFocusCapture={() => setActive(i)}
                animate={wide ? { flexGrow: active === i ? 2.3 : 1 } : undefined} transition={{ duration: 0.5, ease: EASE }}
                className={`group relative overflow-hidden rounded-t-[999px] rounded-b-panel ${wide ? 'basis-0' : `min-h-[30rem] ${i === 2 ? 'md:col-span-2 md:rounded-t-[12rem]' : ''}`}`}>
                <img src={c.image} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-plum-900/95 via-plum-900/35 to-transparent" />
                {wide && active !== i && (
                  <button onClick={() => setActive(i)} className="absolute inset-0 z-10" aria-label={`Show ${c.name}`} />
                )}
                <div className="absolute inset-x-0 bottom-0 p-6 text-paper md:p-8">
                  <p className="text-eyebrow font-semibold uppercase text-lilac">{c.kind}</p>
                  <h3 className="mt-2 font-display text-3xl !text-paper">{c.name}</h3>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: wide ? 0.15 : 0 }}>
                        <p className="mt-3 flex gap-2 text-sm text-paper/85"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lilac" />{c.address}</p>
                        <p className="mt-2 flex gap-2 text-sm text-paper/85"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-lilac" />{next ? <>Next OPD: <strong className="font-semibold text-white">{fmtDate(next)}</strong></> : 'Saturday to Thursday · 9 AM to 5 PM'}</p>
                        <div className="btn-pair mt-5">
                          <Link to="/book" className="btn-light !min-h-[2.75rem]">Book here</Link>
                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.map)}`} target="_blank" rel="noreferrer" className="btn-ghost-light !min-h-[2.75rem]"><Navigation className="h-4 w-4" /> Directions</a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
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
        <SectionHeader eyebrow="Learn" title="Knowledge that calms the mind." text="Doctor-informed articles in Bangla on AMH, azoospermia, IVF and more." action={<Link to="/blog" className="btn-secondary">Visit the blog <ArrowRight className="h-4 w-4" /></Link>} />
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
      <ScrollRibbon className="border-y border-line bg-paper py-6 font-display text-[clamp(2.5rem,1.5rem+4vw,6rem)] leading-none md:py-10" words={['IVF', 'ICSI', 'IUI', 'Egg freezing', 'Embryo freezing', 'Laparoscopy', 'Hysteroscopy', 'TESA', 'Counselling']} />
      <IvfStory />
      <Specialists />
      <WhyBento />
      <TestimonialDeck />
      <CentresArches />
      <Learn />
      <CTABand />
    </>
  )
}
