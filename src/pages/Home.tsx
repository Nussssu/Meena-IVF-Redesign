import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, ChartNoAxesColumnIncreasing, Clock, GraduationCap, Heart, MapPin, Microscope, Pause, Play, ShieldCheck, Snowflake, Sprout, Stethoscope } from 'lucide-react'
import { CTABand, RL, Reveal, SectionHeader, WhatsAppIcon, useMeta } from '../components/ui'
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
  // Card copy, icons and the staggered (up/down) offsets from the design
  const CARD: Record<string, { label: string; Icon: typeof Sprout; offset: string }> = {
    conceive: { label: 'Trying to conceive', Icon: Sprout, offset: 'lg:mt-20' },
    miscarriage: { label: 'Miscarriage support', Icon: Heart, offset: 'lg:mt-0' },
    preparing: { label: 'Preparing for treatment', Icon: Stethoscope, offset: 'lg:mt-24' },
    freezing: { label: 'Egg freezing', Icon: Snowflake, offset: 'lg:mt-0' },
  }
  return (
    <section className="section">
      <div className="container-x">
        <Reveal className="mb-10 md:mb-14">
          <h2 className="h2">Your fertility <em className="text-plum">journey</em></h2>
        </Reveal>
        <div role="tablist" aria-label="Your situation" aria-orientation="horizontal" onKeyDown={onKey} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-start lg:gap-6">
          {journeys.map((x, i) => {
            const on = active === i
            const c = CARD[x.key] ?? { label: x.label, Icon: Heart, offset: '' }
            return (
              <button key={x.key} role="tab" id={`tab-${x.key}`} aria-selected={on} tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                className={`group relative overflow-hidden rounded-[1.75rem] border-2 border-white bg-gradient-to-b from-[#FBF6F3] to-[#F2E8E5] text-left outline-offset-4 transition duration-500 ease-out ${c.offset} ${on ? '-translate-y-1.5 shadow-[0_30px_60px_-28px_rgba(46,13,54,.45)]' : 'shadow-[0_24px_48px_-28px_rgba(46,13,54,.32)] hover:-translate-y-1'}`}>
                <div className="relative aspect-[6/5] overflow-hidden">
                  <img src={x.key === 'conceive' ? '/img/journey-conceive.webp' : x.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  {/* Soft wave that blends the photo into the card */}
                  <svg aria-hidden viewBox="0 0 400 60" preserveAspectRatio="none" className="absolute inset-x-0 -bottom-px h-14 w-full">
                    <path d="M0,38 C70,0 150,8 220,30 C290,52 350,40 400,22 L400,60 L0,60 Z" fill="#FBF6F3" />
                  </svg>
                </div>
                <div className="flex items-center gap-3 px-5 pb-6 pt-1">
                  <c.Icon className="h-7 w-7 shrink-0 text-plum-900" strokeWidth={1.5} />
                  <p className="font-display text-lg leading-snug text-ink">{x.label}?</p>
                </div>
              </button>
            )
          })}
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
  return (
    <section className="section bg-white">
      <div className="container-x">
        <SectionHeader title={<>Wherever you are, there&rsquo;s a <em className="text-plum">next step</em>.</>}
          text="From your first scan to IVF, every treatment you need is here, planned just for you."
          action={<Link to="/treatments" className="btn-secondary">All 18 treatments <ArrowRight className="h-4 w-4" /></Link>} />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {INDEX.map((it, i) => {
            const t = treatmentBySlug(it.slug)!
            return (
              <Reveal as="li" key={it.slug} delay={i * 0.03} y={12} className="h-full">
                <Link to={`/treatments/${t.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-paper shadow-soft transition duration-300 ease-out hover:-translate-y-1 hover:border-plum hover:bg-plum hover:shadow-lift focus-visible:border-plum">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={it.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-plum-900/40 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-end gap-3 p-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink transition duration-300 group-hover:rotate-45 group-hover:text-plum"><ArrowUpRight className="h-4 w-4" /></span>
                    </div>
                  </div>
                  <div className="relative flex flex-1 flex-col p-5 md:p-6">
                    <p className="text-eyebrow uppercase text-muted transition group-hover:text-lilac">{t.full}</p>
                    <p className="mt-2 font-display text-[1.75rem] leading-none text-ink transition group-hover:text-white md:text-[2rem]">{t.name}</p>
                    <p className="mt-3 line-clamp-2 text-sm leading-snug text-muted transition group-hover:text-white/80">{t.short}</p>
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
              <p className="text-sm text-lilac">{EMBRYO_LABELS[stage]}</p>
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
  const [active, setActive] = useState(0)
  const d = doctors[active]
  const tint = d.tint === 'blush' ? 'bg-blush' : d.tint === 'mist' ? 'bg-[#E6E0EF]' : 'bg-lilac'
  return (
    <section className="section bg-mist">
      <div className="container-x">
        <SectionHeader title={<>Meet our <em className="text-plum">specialists</em></>} />
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
                className={`flex min-h-[76vh] flex-col justify-center py-12 transition-opacity duration-300 ${active === i ? 'opacity-100' : 'opacity-40'}`}>
                <p className="self-start rounded-full bg-lilac/80 px-4 py-1.5 text-sm font-medium text-plum-700">{doc.title} · {doc.experience}+ years</p>
                <h3 className="mt-4 font-display leading-[1.05] text-plum-900" style={{ fontSize: 'clamp(2rem, 1.2rem + 1.8vw, 3.25rem)' }}><Link to={`/doctors/${doc.slug}`} className="hover:text-plum">{doc.name}</Link></h3>
                <p className="mt-3 text-lg text-ink-2">{doc.role}</p>
                <DoctorDetails doc={doc} />
                <div className="mt-7 flex flex-wrap gap-4">
                  <Link to={`/book?doctor=${doc.slug}`} className="btn-primary !min-h-[3.25rem] !px-8">Book with {doc.short}</Link>
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
    </section>
  )
}

/* ───────────────── 7. Why Meena ───────────────── */
const WHY_VIDEO = '/img/IVF%20Video.mp4'
// Stepper geometry (lg+): fixed row pitch so the curved connector can be drawn in px
const WHY_ROW = 68, WHY_GAP = 12, WHY_X = [14, 30, 42, 30, 16, 24]
function curveThrough(pts: [number, number][]) {
  // Catmull-Rom → cubic Bézier, gives one smooth line through every node
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`
  }
  return d
}

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
    { label: 'Transparent & affordable care', Icon: ShieldCheck, img: 'couple-doctor', alt: 'Doctor talking openly with an expecting couple', head: 'Clear costs, no', em: 'surprises.', text: 'Clear pricing upfront, with no hidden costs.' },
    { label: 'Proven treatment protocols', Icon: ChartNoAxesColumnIncreasing, img: 'embryo-team', alt: 'Meena IVF embryology team at work', head: 'Protocols you can', em: 'trust.', text: 'Internationally recognised protocols for consistent results.' },
    { label: 'Advanced fertility technology', Icon: Microscope, img: 'lab-microscope', alt: 'Embryologist at a microscope in the IVF lab', head: 'Modern science, in expert', em: 'hands.', text: 'Our in-house OT and IVF lab, all under one roof.' },
    { label: 'Complete patient support', Icon: Heart, img: 'patient-care', alt: 'Patient being cared for by the Meena IVF team', head: 'Cared for at every', em: 'step.', text: 'Counselling and guidance at every stage of treatment.' },
  ]
  const n = items.length
  const cur = items[active]
  const pts = WHY_X.map((x, i) => [x, i * (WHY_ROW + WHY_GAP) + WHY_ROW / 2] as [number, number])
  const svgH = n * (WHY_ROW + WHY_GAP) - WHY_GAP

  // Desktop: the section pins to the screen and scrolling walks the line from dot to dot
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const lineFill = useTransform(scrollYProgress, [0, (n - 1) / n], [0, 1], { clamp: true })
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
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.95fr_1fr] lg:items-stretch">
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

          {/* Curved stepper */}
          <Reveal delay={0.05} className="relative">
            <svg aria-hidden className="pointer-events-none absolute left-0 top-0 hidden lg:block" width="60" height={svgH} viewBox={`0 0 60 ${svgH}`}>
              <path d={curveThrough(pts)} fill="none" stroke="#80298F" strokeOpacity=".22" strokeWidth="1.5" />
              <motion.path d={curveThrough(pts)} fill="none" stroke="#80298F" strokeWidth="2" strokeLinecap="round" style={{ pathLength: lineFill }} />
              {pts.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i === active ? 6.5 : 5} fill={i <= active ? '#80298F' : '#F3EEF6'} stroke="#80298F" strokeOpacity={i <= active ? 1 : 0.45} strokeWidth="1.5"
                  style={{ transition: 'fill .3s, r .3s' }} />
              ))}
            </svg>
            <ul className="flex flex-col gap-3 lg:gap-[12px]">
              {items.map((it, i) => {
                const on = i === active
                return (
                  <li key={it.label} className="lg:h-[68px]" style={{ ['--why-x' as string]: `${WHY_X[i] + 16}px` }}>
                    <button type="button" onClick={() => pick(i)} aria-pressed={on}
                      className={`flex h-full w-full items-center gap-3 rounded-full border py-2 pl-2 pr-5 text-left transition duration-300 lg:ml-[var(--why-x)] lg:w-[calc(100%-var(--why-x))] ${on ? 'border-plum/25 bg-white shadow-[0_14px_30px_-14px_rgba(128,41,143,.55)]' : 'border-line bg-white/70 hover:bg-white'}`}>
                      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition ${on ? 'bg-plum text-white' : 'bg-lilac/70 text-ink'}`}><it.Icon className="h-5 w-5" strokeWidth={1.75} /></span>
                      <span className={`text-[0.9375rem] font-semibold leading-snug ${on ? 'text-ink' : 'text-ink-2'}`}>{it.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </Reveal>

          {/* Detail panel with an image per option */}
          <Reveal delay={0.1} className="relative flex min-h-[30rem] flex-col overflow-hidden rounded-panel bg-gradient-to-br from-plum-700 via-plum-800 to-plum-900 text-paper shadow-lift">
            <div className="relative h-44 shrink-0 overflow-hidden lg:h-[42%]">
              <AnimatePresence initial={false}>
                <motion.img key={cur.img} src={`/img/${cur.img}.webp`} alt={cur.alt} loading="lazy"
                  initial={reduce ? false : { opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="absolute inset-0 h-full w-full object-cover" />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-plum-800/10 to-plum-800" />
            </div>
            <div className="relative flex flex-1 flex-col px-7 pb-7 pt-6 md:px-8 md:pb-8 md:pt-7" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div key={active} className="mb-6" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }}>
                  <p className="text-eyebrow font-semibold uppercase text-paper/85">{cur.label}</p>
                  <h3 className="mt-4 font-display text-3xl leading-[1.1] !text-paper xl:text-[2.25rem]">{cur.head} <em className="text-[#E7A6F0]">{cur.em}</em></h3>
                  <p className="mt-3 max-w-md leading-relaxed text-paper/85">{cur.text}</p>
                </motion.div>
              </AnimatePresence>
              <Link to="/why-meena" className="btn-light group mt-auto shrink-0 self-start !text-ink">
                Explore Our Approach <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
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
  khulna: { x: 29, y: 62, w: 15, order: 1 },
  banani: { x: 50, y: 84, w: 23, order: 0 },
  cumilla: { x: 71, y: 54, w: 15, order: 2 },
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
  // Glowing routes from Banani out to each OPD (viewBox matches the stage: 1000 × 420)
  const toX = (v: number) => v * 10
  const toY = (v: number) => v * 4.2
  const route = (from: string, to: string, lift: number) => {
    const a = P(from), b = P(to)
    const ax = toX(a.x), ay = toY(a.y), bx = toX(b.x), by = toY(b.y)
    return `M${ax},${ay} C${ax + (bx - ax) * 0.35},${ay - lift} ${bx - (bx - ax) * 0.25},${by - lift * 0.6} ${bx},${by}`
  }
  const routes = [route('banani', 'khulna', 110), route('banani', 'cumilla', 130)]
  const pinDelay = (slug: string) => P(slug).order * 0.22
  const stage = useRef<HTMLDivElement>(null)
  const show = useInView(stage, { once: true, amount: 0.3 })
  return (
    <section className="section bg-mist">
      <div className="container-x">
        <SectionHeader title={<>Find a Meena IVF centre <em className="text-plum">near you</em></>} />

        {/* md+: pins on a stage, joined by glowing routes */}
        <div ref={stage} className="relative mb-6 hidden aspect-[1000/420] md:block lg:mb-10">
          <svg aria-hidden viewBox="0 0 1000 420" className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id="route-glow" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F7C98F" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#F9D7A8" />
                <stop offset="100%" stopColor="#E7A6F0" stopOpacity="0.5" />
              </linearGradient>
              <filter id="route-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" /></filter>
              <radialGradient id="tip-glow"><stop offset="0%" stopColor="#FFE7C2" /><stop offset="35%" stopColor="#E7A6F0" stopOpacity=".7" /><stop offset="100%" stopColor="#E7A6F0" stopOpacity="0" /></radialGradient>
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
                  {!reduce && (
                    <motion.ellipse rx={rx} ry={ry} fill="none" stroke="#B25FBF" strokeWidth="1.5"
                      initial={{ scale: 1, opacity: 0 }} animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: pinDelay(c.slug) + 1 }} />
                  )}
                  <ellipse rx={big ? 46 : 30} ry={big ? 14 : 9} fill="url(#tip-glow)" />
                </g>
              )
            })}
            {/* routes: blurred glow + bright core that draw in, then a light pulse travels along */}
            {routes.map((d, i) => (
              <g key={i}>
                <motion.path d={d} fill="none" stroke="url(#route-glow)" strokeWidth="8" strokeLinecap="round" filter="url(#route-blur)"
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }} animate={show ? { pathLength: 1, opacity: 0.9 } : undefined}
                  transition={{ duration: 1.2, delay: 0.75 + i * 0.15, ease: 'easeInOut' }} />
                <motion.path d={d} fill="none" stroke="#FCE3C4" strokeWidth="2" strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0 }} animate={show ? { pathLength: 1 } : undefined}
                  transition={{ duration: 1.2, delay: 0.75 + i * 0.15, ease: 'easeInOut' }} />
                {!reduce && (
                  <motion.path d={d} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" pathLength={1} strokeDasharray="0.08 1"
                    initial={{ strokeDashoffset: 0.08, opacity: 0 }} animate={{ strokeDashoffset: -1, opacity: 1 }}
                    transition={{ strokeDashoffset: { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 2.2 + i * 0.6, repeatDelay: 0.8 }, opacity: { delay: 2.2 } }}
                    style={{ filter: 'drop-shadow(0 0 6px #FCE3C4)' }} />
                )}
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
      <CTABand />
    </>
  )
}
