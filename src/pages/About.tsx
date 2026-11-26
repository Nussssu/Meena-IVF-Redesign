import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Eye, FlaskConical, HandHeart, HeartHandshake, Lock, MessageCircle, Target, Upload, Users } from 'lucide-react'
import { CTABand, Counter, CurveHero, Reveal, SectionHeader, TwoTone, useMeta } from '../components/ui'
import { ImageReveal } from '../components/motion'
import { milestones, team, whyMeena } from '../data/content'
import { doctors } from '../data/doctors'
import { site } from '../data/site'

/** Team photos that have a transparent-background copy in /img/team/ (so the hover colour shows behind the person) */
const TEAM_CUTOUTS = new Set(['embryo-team', 't-ariful', 't-ashik', 't-beli', 't-bilkis', 't-eva', 't-iffat', 't-ismat', 't-jannatul', 't-jinia', 't-joy', 't-kamrul', 't-lipi', 't-mushfikur', 't-mushfiq', 't-natasha', 't-nayeem', 't-nishat', 't-rayhan', 't-sabbir', 't-sariful', 't-selim', 't-shammy', 't-shaurov', 't-simja', 't-smriti', 't-snigdha', 't-sonia', 't-stela', 't-sumon', 't-synthya', 't-tajkia', 't-tanij', 't-tonima', 't-yeasmin'])

/* Our journey: on desktop the section pins to the screen; as the visitor scrolls, a line grows from the first dot to the
   right and each milestone lights up when the line reaches its dot. All four are always shown; the reached ones are highlighted. Mobile and reduced-motion show them plainly. */
function MilestoneTimeline() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(min-width: 1024px)')
    const on = () => setWide(m.matches)
    on(); m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  const pinned = wide && !reduce
  const n = milestones.length
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })
  const START = 0.06, SPAN = 0.7
  const at = (i: number) => START + (SPAN * i) / (n - 1)
  // the line runs the full width of the page; the last dot sits at 75%, so it keeps growing to the edge after it
  const fill = useTransform(p, [START, START + (SPAN * 4) / 3], ['0%', '100%'])
  const [reached, setReached] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    let k = 0
    for (let i = 0; i < n; i++) if (v >= at(i) - 0.02) k = i + 1
    setReached(Math.max(1, k))
  })
  const shown = (i: number) => !pinned || i < reached

  return (
    <section ref={ref} className={`relative bg-plum-900 text-paper ${pinned ? '' : 'section'}`} style={pinned ? { height: `${n * 70 + 60}vh` } : undefined}>
      <div className={pinned ? 'sticky top-0 flex h-screen flex-col justify-center overflow-hidden' : ''}>
        <div className="container-x w-full">
          <SectionHeader light eyebrow="Our journey" title={<>Milestones that shape our story</>} />
          <div className="relative">
            {/* the track and the growing line, from the first dot to the last */}
            {pinned && (
              <div aria-hidden className="absolute left-0 right-0 top-[7px] h-[2px] bg-white/15">
                <motion.div className="h-full bg-gradient-to-r from-lilac to-[#E7A6F0]" style={{ width: fill }} />
              </div>
            )}
            <ol className={`grid ${pinned ? 'grid-cols-4' : 'gap-8 md:grid-cols-4'}`}>
              {milestones.map((m, i) => (
                <li key={m.title} className={pinned ? 'relative pr-10' : 'border-t border-white/20 pt-6'}>
                  {pinned && (
                    <span aria-hidden className={`relative z-10 block h-4 w-4 rounded-full border-2 transition-all duration-500 ${shown(i) ? 'scale-110 border-[#E7A6F0] bg-[#E7A6F0] shadow-[0_0_0_6px_rgba(231,166,240,.18)]' : 'border-white/30 bg-plum-900'}`} />
                  )}
                  {/* every milestone is always on the page; the ones the line has reached light up in pink */}
                  <div className={`transition duration-500 ${pinned ? 'pt-8' : ''} ${shown(i) ? 'opacity-100' : 'opacity-40'}`}>
                    <p className={`font-display text-4xl transition-colors duration-500 ${pinned && shown(i) ? 'text-[#E7A6F0]' : 'text-lilac'}`}>{m.year}</p>
                    <h3 className={`mt-4 font-display text-xl transition-colors duration-500 ${pinned && shown(i) ? '!text-[#F6D3FA]' : '!text-paper'}`}>{m.title}</h3>
                    <p className="mt-2 text-paper/70">{m.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Who we are cards: on desktop they start as a rising staircase (first card lowest) and, as the visitor scrolls,
   glide smoothly up/down into one straight row of four. Mobile and reduced-motion show the plain grid. */
function StairCard({ i, n, progress, stair, children }: { i: number; n: number; progress: MotionValue<number>; stair: boolean; children: ReactNode }) {
  const y = useTransform(progress, [0, 1], [(n - 1 - i) * 130, 0])
  return (
    <motion.div style={stair ? { y } : undefined} className="h-full rounded-[1.75rem] border border-plum/10 bg-white p-8 shadow-[0_18px_40px_-28px_rgba(74,21,84,.35)]">
      {children}
    </motion.div>
  )
}

function StairCards({ items }: { items: [typeof Eye, string, string][] }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(min-width: 1024px)')
    const on = () => setWide(m.matches)
    on(); m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'start 25%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  return (
    <div ref={ref} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {items.map(([Icon, t, d], i) => (
        <StairCard key={t} i={i} n={items.length} progress={progress} stair={wide && !reduce}>
          <Icon className="h-9 w-9 text-plum" strokeWidth={1.6} />
          <h3 className="mt-10 font-display text-2xl">{t}</h3>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{d}</p>
        </StairCard>
      ))}
    </div>
  )
}

export function About() {
  useMeta('About us', 'Meena IVF & Fertility Care Ltd.: advanced fertility care with compassion, trust and hope.')
  return (
    <>
      {/* hero in the treatment-page style: clinic photo behind, plum wash, curved bottom edge */}
      <CurveHero image="/img/reception-wide.webp" alt="Reception at the Meena IVF Banani centre"
        title={<>About <em className="text-[#E7A6F0]">Meena IVF</em> &amp; Fertility Care Ltd.</>}
        subtitle="We help individuals and couples move closer to parenthood through ethical guidance, modern reproductive treatment and deeply compassionate care.">
        <Link to="/book" className="btn-light">Book appointment</Link>
        <Link to="/team" className="btn-ghost-light">Meet our team</Link>
      </CurveHero>

      <section className="section pb-10 md:pb-12 lg:pb-14">
        <div className="container-x">
          <SectionHeader title={<>What makes our care <em className="text-plum">different</em></>} />
          <StairCards items={[
            [HeartHandshake, 'Compassionate care', 'Every journey is handled with empathy, privacy and respect.'],
            [FlaskConical, 'Advanced technology', 'Modern fertility methods and updated clinical systems for safer, precise treatment.'],
            [Target, 'Personalised treatment', 'A care plan tailored to your condition and goals.'],
            [Eye, 'Transparent guidance', 'Clear communication, ethical advice and trust at every stage.'],
          ]} />
        </div>
      </section>

      <section className="section bg-mist pt-10 md:pt-12 lg:pt-14">
        <div className="container-x">
          <SectionHeader align="center" eyebrow="Our foundation" title="Mission, vision and values" />
          {/* three cards, the middle one raised; icon, title and text. On hover a card lifts,
              its border and shadow warm to plum, and the icon turns plum and wiggles */}
          <div className="grid gap-6 md:grid-cols-3 md:items-start md:pt-12">
            {([
              ['Our mission', 'To provide advanced fertility care with compassion, precision and trust, helping every patient feel supported throughout their journey.', HandHeart],
              ['Our vision', 'To be a leading fertility care centre known for ethical treatment, modern reproductive solutions and patient-centred excellence.', PeakFlag],
              ['Our values', 'Compassion, professionalism, transparency, quality, safety and continuous improvement guide everything we do.', HeartHandshake],
            ] as const).map(([t, d, Icon], i) => (
              <Reveal key={t} delay={i * 0.08} className={i === 1 ? 'md:-mt-10' : i === 2 ? 'md:mt-6' : ''}>
                <div className="group h-full rounded-[1.75rem] border border-plum/10 bg-white/80 p-8 shadow-[0_18px_40px_-28px_rgba(74,21,84,.35)] backdrop-blur transition duration-500 ease-out hover:-translate-y-2 hover:border-plum/30 hover:bg-white hover:shadow-[0_30px_60px_-28px_rgba(128,41,143,.45)] md:p-10">
                  <span className="block w-fit text-plum-700 transition duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-plum">
                    <Icon className="h-14 w-14" strokeWidth={1.3} />
                  </span>
                  <h3 className="mt-6 font-display text-[1.75rem] font-semibold leading-tight text-ink md:text-[2rem]">{t}</h3>
                  <p className="mt-6 text-[1.0625rem] leading-relaxed text-ink-2">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <MilestoneTimeline />

      {[
        { img: '/img/chairman.webp', cut: '/img/chairman-cut.webp', pos: '50% 20%', eyebrow: 'Message from the Chairman', title: 'A commitment to hope, dignity and care.', name: 'Md. Moniruzzaman', role: 'Chairman', body: ['At Meena IVF & Fertility Care, we believe fertility care is about more than treatment. It is about trust, emotional strength and responsible medical guidance.', 'Our vision has always been to build a centre where every patient feels respected, supported and confident in the care they receive. We remain committed to ethical treatment, advanced reproductive support and a warm, reassuring environment for every family that places their trust in us.'] },
        { img: '/img/director.webp', cut: '', pos: '58% 30%', eyebrow: 'Message from the Director', title: 'Guiding every journey with expertise and compassion.', name: 'Farhin Zaman', role: 'Director', body: ['We see fertility care as a responsibility that goes beyond clinical treatment: understanding emotions, respecting individual journeys and delivering care with honesty, empathy and precision.', 'Every patient who walks through our doors deserves clarity, confidence and reassurance. Your trust is the foundation of our work, and we remain dedicated to supporting you with integrity at every step toward parenthood.'] },
      ].map((m, i) => (
        <section key={m.name} className={`section ${i === 0 ? 'pb-8 md:pb-10 lg:pb-12' : 'pt-8 md:pt-10 lg:pt-12'}`}>
          <div className={`container-x grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
            {/* same arch as the landing page's "Meet our specialists": the Chairman's cut-out stands in a lilac arch with a
                soft white inner arch; the Director's photo fills the same arch shape */}
            <Reveal>
              <div className="relative mx-auto aspect-[5/7] w-full max-w-[420px]">
                <div className="arch absolute inset-0 overflow-hidden bg-lilac shadow-[0_30px_60px_-34px_rgba(74,21,84,.45)]">
                  {m.cut ? (
                    <>
                      <div aria-hidden className="arch-full absolute inset-x-[12%] bottom-0 top-[12%] bg-white/50" />
                      <img src={m.cut} alt={m.name} loading="lazy" className="absolute bottom-0 left-1/2 h-[82%] w-auto max-w-none -translate-x-1/2" />
                    </>
                  ) : (
                    <img src={m.img} alt={m.name} loading="lazy" className="h-full w-full object-cover" style={{ objectPosition: m.pos }} />
                  )}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="inline-flex rounded-full bg-lilac px-4 py-1.5 text-eyebrow font-semibold uppercase text-plum">{m.eyebrow}</p>
              <h2 className="h2 mt-6 text-balance"><TwoTone text={m.title} /></h2>
              <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-ink-2">{m.body.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}</div>
              <div className="mt-8 border-l-4 border-plum pl-5">
                <p className="font-display text-2xl text-ink">{m.name}</p>
                <p className="mt-1 text-sm text-ink-2">{m.role}, {site.legal}</p>
              </div>
            </Reveal>
          </div>
        </section>
      ))}
      <CTABand title="Let Meena IVF guide your next step." />
    </>
  )
}

/* mountain peak with a flag (vision), drawn in the same line style as the lucide icons */
function PeakFlag({ className = '', strokeWidth = 1.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M2 20 L8 13 L10.5 15.5 L14 9 L22 20" />
      <path d="M14 9 V2.5 H19 L17.6 4.2 L19 6 H14" />
    </svg>
  )
}

export function WhyMeena() {
  useMeta('Why Meena', 'Why families choose Meena IVF: experienced specialists, in-house OT and IVF lab, self-cycle first, transparent pricing and complete support.')
  return (
    <>
      {/* hero in the treatment-page style, with its own photo: the consultation room at Banani */}
      <CurveHero image="/img/banani-gallery-2.webp" alt="Consultation room at the Meena IVF Banani centre"
        title={<>Why <em className="text-[#E7A6F0]">Meena IVF</em></>}
        subtitle="Fertility treatment is more than a medical service. It needs trust, sensitivity, precision, and a team that understands your journey.">
        <Link to="/book" className="btn-light">Book appointment</Link>
      </CurveHero>
      {/* counters in a plum card that rises over the hero's curved edge, so it reads as part of the hero */}
      <section className="relative z-10 -mt-10 md:-mt-16">
        <div className="container-x">
          <div className="grid grid-cols-2 overflow-hidden rounded-panel bg-gradient-to-br from-plum-800 via-plum-900 to-plum-900 text-paper shadow-[0_30px_60px_-30px_rgba(46,13,54,.6)] ring-1 ring-white/10 md:grid-cols-4">
            {site.stats.map((s, i) => (
              <div key={s.label} className={`relative px-6 py-7 md:px-8 md:py-9 ${i ? 'md:border-l md:border-white/10' : ''} ${i % 2 ? 'border-l border-white/10 md:border-l' : ''} ${i > 1 ? 'border-t border-white/10 md:border-t-0' : ''}`}>
                <p className="font-display text-5xl text-[#E7A6F0]"><Counter to={s.value} suffix={s.suffix} /></p>
                <p className="mt-2 text-sm text-paper/75">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-14 md:py-16 lg:py-20">
        <div className="container-x grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {whyMeena.map((w, i) => (
            <Reveal key={w.title} delay={(i % 3) * 0.06}>
              <div className="card h-full p-8">
                <span className="font-display text-sm text-muted">0{i + 1}</span>
                <h3 className="mt-6 font-display text-2xl">{w.title}</h3>
                <p className="mt-3 text-ink-2">{w.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      {[
        { img: '/img/doctors-duo-hd.webp', eyebrow: 'Expert-led care', title: 'Guided by experienced fertility professionals.', text: 'Accurate diagnosis, ethical treatment planning and a patient-first approach that builds confidence at every stage.', points: ['Clear evaluation and treatment explanation', 'Structured, evidence-based fertility planning', 'Professional care with compassion and transparency'] },
        { img: '/img/lab-microscope-hd.webp', eyebrow: 'Technology & precision', title: 'An in-house OT and modern IVF laboratory.', text: 'Egg retrieval, embryo transfer and sperm retrieval are performed safely under controlled conditions, without moving between facilities.', points: ['Advanced IVF, IUI and ICSI procedures', 'Embryology lab with vitrification', 'Precision-driven, quality-focused systems'] },
        { img: '/img/patient-care-hd.webp', eyebrow: 'Comfort & support', title: 'A journey designed with sensitivity and respect.', text: 'Privacy, comfort, respectful care and continuous support, plus psychological and financial counselling when you need it.', points: ['Respectful, confidential environment', 'Transparent communication and realistic guidance', 'Support from first visit to treatment and beyond'] },
      ].map((b, i) => (
        <section key={b.title} className={`py-14 md:py-16 lg:py-20 ${i % 2 ? 'bg-mist' : ''}`}>
          <div className={`container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
            <ImageReveal src={b.img} className="aspect-[5/4] rounded-panel" />
            <Reveal delay={0.1}>
              <p className="eyebrow mb-5">{b.eyebrow}</p>
              <h2 className="h2 text-balance"><TwoTone text={b.title} /></h2>
              <p className="mt-5 text-lg text-ink-2">{b.text}</p>
              <ul className="mt-7 space-y-3">{b.points.map((p) => <li key={p} className="flex items-start gap-3"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lilac text-plum"><Check className="h-3.5 w-3.5" strokeWidth={2.5} /></span>{p}</li>)}</ul>
            </Reveal>
          </div>
        </section>
      ))}
      <section className="pb-20 pt-14 md:pb-24 md:pt-16 lg:pt-20">
        <div className="container-x">
          <SectionHeader align="center" eyebrow="How it works" title="From first conversation to confident next step" />
          <div className="grid gap-4 md:grid-cols-4">
            {[[MessageCircle, 'Consultation', 'Understand your fertility concerns clearly'], [Eye, 'Diagnosis', 'Identify the most suitable treatment path'], [FlaskConical, 'Treatment', 'Receive a personalised fertility care plan'], [Lock, 'Support', 'Move forward with confidence and guidance']].map(([I, t, d], i) => { const Icon = I as typeof Eye; return (
              <Reveal key={t as string} delay={i * 0.08} className="card p-7 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-lilac text-plum"><Icon className="h-6 w-6" /></span>
                <p className="mt-5 font-display text-xl">{t as string}</p><p className="mt-2 text-sm text-ink-2">{d as string}</p>
              </Reveal>
            ) })}
          </div>
        </div>
      </section>
      <CTABand />
    </>
  )
}

export function Team() {
  useMeta('Our team', 'Meet the people behind Meena IVF & Fertility Care: consultants, embryologists, medical officers, nurses, counsellors and support teams.')
  const total = team.reduce((n, t) => n + t.members.length, 0)
  return (
    <>
      <CurveHero image="/img/event-2.webp" title="The people behind every journey."
        subtitle={`${total} consultants, embryologists, medical officers, nurses, coordinators, counsellors and support staff, each contributing to trusted, compassionate fertility care.`} />
      <div className="container-x py-12 md:py-16">
        {team.map((g) => (
          <section key={g.key} className="border-b border-line py-12 last:border-0">
            <div className="mb-8 flex flex-col justify-between gap-2 md:flex-row md:items-end">
              <div><p className="eyebrow mb-3">{g.label}</p><h2 className="h2 text-balance"><TwoTone text={g.title} /></h2></div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {g.members.map((m, i) => {
                const cut = m.img && TEAM_CUTOUTS.has(m.img)
                // Dr. Shamima's and Dr. Lubna's team photos have no clean cut-out; their doctor portraits already have transparent backgrounds
                const portrait = m.img === 't-shamima' ? '/img/dr-shamima.webp' : m.img === 't-lubna' ? '/img/dr-lubna.webp' : undefined
                const photo = portrait ?? (cut ? `/img/team/${m.img}.webp` : `/img/${m.img}.webp`)
                const doc = m.img ? doctors.find((d) => d.image === `/img/dr-${m.img!.replace(/^t-/, '')}.webp`) : undefined
                return (
                <Reveal key={m.name} delay={(i % 4) * 0.05} className="h-full">
                  {/* Team card: soft lilac frame with a white photo panel; the only hover effect is a gentle photo zoom */}
                  <div className="group relative isolate flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-lilac p-2 md:p-2.5">
                    <div className="overflow-hidden rounded-[0.9rem] bg-white">
                      {m.img ? <img src={photo} alt={m.name} loading="lazy" className="aspect-[6/5] w-full object-cover object-top transition duration-700 group-hover:scale-[1.03]" /> : <div className="grid aspect-[6/5] place-items-center"><Users className="h-8 w-8 text-muted" /></div>}
                    </div>
                    <div className="mt-2 flex flex-1 flex-col items-center rounded-[0.9rem] px-3 pb-5 pt-5 text-center md:mt-2.5 md:pb-6 md:pt-6">
                      {doc
                        ? <Link to={`/doctors/${doc.slug}`} className="font-display text-lg leading-snug text-lavender md:text-[1.35rem]">{m.name}</Link>
                        : <p className="font-display text-lg leading-snug text-lavender md:text-[1.35rem]">{m.name}</p>}
                      <p className="mt-1 text-sm text-ink-2 md:text-[0.9375rem]">{m.role}</p>
                    </div>
                  </div>
                </Reveal>
                )
              })}
            </div>
          </section>
        ))}
      </div>
      <CTABand title="Want to join this team?" text="We are always looking for caring, talented people in reproductive healthcare." />
    </>
  )
}

export function Careers() {
  useMeta('Careers', 'Join Meena IVF & Fertility Care Ltd. Careers for medical officers, nurses, embryologists and more.')
  const [sent, setSent] = useState(false)
  const [file, setFile] = useState('')
  const [fileErr, setFileErr] = useState(false)
  return (
    <>
      {/* no page hero or heading: the page opens straight on the content, clear of the fixed header */}
      <section className="section pt-28 md:pt-36 lg:pt-36">
        <div className="container-x grid gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <Reveal>
            <h2 className="h2 text-balance">Build a career that helps <em className="text-plum">families begin</em>.</h2>
            <p className="mt-5 text-lg text-ink-2">We provide advanced fertility treatment and compassionate care to every patient, and a supportive environment for every professional.</p>
            <p className="mt-4 text-ink-2">We are always looking for talented, motivated and caring people who want to make a real difference in reproductive healthcare.</p>
            <div className="mt-8 flex flex-wrap gap-2">{['Medical Officer', 'Nurse', 'Embryologist', 'Administration', 'Marketing', 'Customer Support'].map((d) => <span key={d} className="chip">{d}</span>)}</div>
            <img src="/img/event-6.webp" alt="The Meena IVF team at the Banani centre" loading="lazy" className="mt-10 aspect-[4/3] w-full rounded-panel object-cover" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card p-6 md:p-10">
              {sent ? (
                <div className="py-10 text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ok text-white"><Check className="h-7 w-7" /></span>
                  <p className="mt-5 font-display text-2xl">Application received.</p>
                  <p className="mt-2 text-muted">Demo preview: in the live site this goes to {site.careersEmail}.</p>
                </div>
              ) : (
                <form noValidate onSubmit={(e) => { e.preventDefault(); const f = e.target as HTMLFormElement; setFileErr(!file); const valid = f.reportValidity(); if (valid && file) setSent(true) }} className="grid gap-5 sm:grid-cols-2">
                  <h2 className="h3 sm:col-span-2">Submit your CV</h2>
                  <div><label htmlFor="c-name" className="label">Full name <span className="text-plum">*</span></label><input id="c-name" required autoComplete="name" className="field" /></div>
                  <div><label htmlFor="c-email" className="label">Email <span className="text-plum">*</span></label><input id="c-email" type="email" required autoComplete="email" className="field" /></div>
                  <div><label htmlFor="c-phone" className="label">Phone <span className="text-plum">*</span></label><input id="c-phone" type="tel" required autoComplete="tel" className="field" /></div>
                  <div><label htmlFor="c-dept" className="label">Position <span className="text-plum">*</span></label>
                    <select id="c-dept" required className="field" defaultValue=""><option value="" disabled>Select department</option>{['Medical Officer', 'Nurse', 'Embryologist', 'Administration', 'Marketing', 'Customer Support'].map((d) => <option key={d}>{d}</option>)}</select></div>
                  <div className="sm:col-span-2"><label htmlFor="c-exp" className="label">Years of experience</label><input id="c-exp" type="number" min={0} max={50} className="field" /></div>
                  <div className="sm:col-span-2"><label htmlFor="c-msg" className="label">Short message</label><textarea id="c-msg" rows={3} className="field !py-3" /></div>
                  <div className="sm:col-span-2">
                    <span className="label">CV <span className="text-plum">*</span></span>
                    <label htmlFor="c-cv" className="flex cursor-pointer items-center gap-4 rounded-card border border-dashed border-ink/20 p-5 transition hover:border-plum hover:bg-mist/50">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-lilac text-plum"><Upload className="h-5 w-5" /></span>
                      <span className="text-sm"><span className="block font-semibold">{file || 'Upload your CV'}</span><span className="text-muted">PDF or Word, up to 5 MB</span></span>
                    </label>
                    <input id="c-cv" type="file" accept=".pdf,.doc,.docx" className="sr-only" aria-describedby="c-cv-err" onChange={(e) => { setFile(e.target.files?.[0]?.name ?? ''); setFileErr(false) }} />
                    {fileErr && <p id="c-cv-err" className="mt-1.5 text-sm text-err">Please attach your CV.</p>}
                  </div>
                  <button className="btn-primary sm:col-span-2 sm:justify-self-start">Submit application <ArrowRight className="h-4 w-4" /></button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
