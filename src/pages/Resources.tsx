import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Handshake, Heart, Megaphone, Phone, Play, Quote, X } from 'lucide-react'
import { CurveHero, FacebookIcon, InstagramIcon, LinkedinIcon, SliderArrows, TwoTone, WhatsAppIcon, YoutubeIcon, useMeta } from '../components/ui'
import { site, waLink } from '../data/site'
import { TestimonialCard } from '../components/cards'
import { centres, channelVideos, events, testimonials, videos } from '../data/content'
import blog from '../data/blog.json'
import { lockScroll, scrollToTarget } from '../lib/smooth'
import { useHideOnScroll } from '../components/motion'

/** Tabs, in the same order as the Resources menu on meenaivf.com */
export const RESOURCE_TABS = [
  { key: 'success-story', label: 'Success Story' },
  { key: 'patient-review', label: 'Patient Review' },
  { key: 'doctors-speak', label: 'Doctor’s Speak' },
  { key: 'events', label: 'Events' },
  { key: 'videos', label: 'Videos' },
  { key: 'gallery', label: 'Gallery' },
] as const
type TabKey = (typeof RESOURCE_TABS)[number]['key']

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const posts = blog.slice().reverse()

export function Resources() {
  useMeta('Journeys', 'Success stories, patient reviews, doctor talks, events, videos, gallery and fertility articles from Meena IVF & Fertility Care.')
  const [params, setParams] = useSearchParams()
  const oldBlogTab = params.get('tab') === 'blog'
  const tab = (RESOURCE_TABS.find((t) => t.key === params.get('tab'))?.key ?? 'success-story') as TabKey
  const menuHidden = useHideOnScroll()
  const pick = (k: TabKey) => setParams(k === 'success-story' ? {} : { tab: k }, { replace: true })
  // Previous / next page at the bottom of every tab: switch tab, then bring the visitor back to the top of the new page
  const tabsRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const idx = RESOURCE_TABS.findIndex((t) => t.key === tab)
  const prev = idx > 0 ? RESOURCE_TABS[idx - 1] : undefined
  const next = idx < RESOURCE_TABS.length - 1 ? RESOURCE_TABS[idx + 1] : undefined
  const go = (k: TabKey) => {
    pick(k)
    // phones: go to the first section of the new page, just below the sticky site menu + tabs bar
    if (window.matchMedia('(max-width: 767px)').matches) {
      const panel = panelRef.current
      if (panel) scrollToTarget(panel.getBoundingClientRect().top + window.scrollY - 72 - (tabsRef.current?.offsetHeight ?? 0), { immediate: true })
      return
    }
    // the tabs bar is sticky, so measure from the header just above it (where the bar naturally sits)
    const header = tabsRef.current?.previousElementSibling
    if (header) window.scrollTo({ top: header.getBoundingClientRect().bottom + window.scrollY, behavior: 'smooth' })
  }

  // Keep the selected tab in the middle of the tabs bar (on phones the bar is wider than the screen), so the page you are
  // on is always in view: instantly on first load, gliding when you switch tabs
  const tabBar = useRef<HTMLElement>(null)
  const firstCentre = useRef(true)
  useEffect(() => {
    const bar = tabBar.current
    const btn = bar?.querySelector('[aria-selected="true"]') as HTMLElement | null
    if (!bar || !btn) return
    const left = btn.offsetLeft - (bar.clientWidth - btn.offsetWidth) / 2
    bar.scrollTo({ left: Math.max(0, left), behavior: firstCentre.current ? 'auto' : 'smooth' })
    firstCentre.current = false
  }, [tab])

  // The Fertility Blog now has its own page in the main menu
  if (oldBlogTab) return <Navigate to="/blog" replace />

  return (
    <>
      <ChannelHeader />

      {/* Tabs */}
      {/* YouTube-style tabs: plain labels, active one lavender with an underline the width of the label */}
      {/* Sticks to the very top while the site menu is hidden, and slides down under the menu when it reappears */}
      <div ref={tabsRef} className={`sticky z-30 border-b border-line bg-white transition-[top] duration-300 ${menuHidden ? 'top-0' : 'top-[72px]'}`}>
        <nav ref={tabBar} aria-label="Journeys" role="tablist" className="container-x no-scrollbar relative flex gap-8 overflow-x-auto">
          {RESOURCE_TABS.map((t) => {
            const on = t.key === tab
            return (
              <button key={t.key} role="tab" aria-selected={on} aria-controls={`panel-${t.key}`} onClick={() => pick(t.key)}
                className={`relative inline-flex min-h-[3rem] items-center whitespace-nowrap text-[1rem] font-medium transition ${on ? 'text-lavender' : 'text-muted hover:text-ink'}`}>
                {t.label}
                {on && <motion.span layoutId="res-tab" className="absolute inset-x-0 bottom-0 h-[2px] bg-lavender" />}
              </button>
            )
          })}
        </nav>
      </div>

      <div ref={panelRef} id={`panel-${tab}`} role="tabpanel" className="container-x min-h-[50vh] py-12 md:py-16">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
            {tab === 'success-story' && <SuccessStory />}
            {tab === 'patient-review' && <PatientReview />}
            {tab === 'doctors-speak' && <DoctorsSpeak />}
            {tab === 'events' && <EventsTab />}
            {tab === 'videos' && <VideosTab />}
            {tab === 'gallery' && <GalleryTab />}

            {/* Previous / next page: plain "← Previous" and "Next →" links; an underline slides in on hover, focus and click */}
            <nav aria-label="Journeys pages" className="mt-16 flex items-center justify-between border-t border-line pt-8 md:mt-20">
              {prev ? (
                <button type="button" onClick={() => go(prev.key)} aria-label={`Previous: ${prev.label}`}
                  className="group relative inline-flex min-h-[2.75rem] items-center gap-2 text-[1.0625rem] font-semibold text-plum">
                  <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" /> Previous
                  <span aria-hidden className="absolute inset-x-0 bottom-1.5 h-[2px] origin-right scale-x-0 bg-plum transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100 group-focus-visible:scale-x-100 group-active:scale-x-100" />
                </button>
              ) : <span />}
              {next ? (
                <button type="button" onClick={() => go(next.key)} aria-label={`Next: ${next.label}`}
                  className="group relative inline-flex min-h-[2.75rem] items-center gap-2 text-[1.0625rem] font-semibold text-plum">
                  Next <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  <span aria-hidden className="absolute inset-x-0 bottom-1.5 h-[2px] origin-left scale-x-0 bg-plum transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100 group-active:scale-x-100" />
                </button>
              ) : <span />}
            </nav>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

/* ───────── Channel-style profile header ───────── */
/* Clean, YouTube-channel style header: logo, name, handle + counts, short description, Subscribe */
const YT = 'https://www.youtube.com/@MeenaIVF'
function ChannelHeader() {
  const [more, setMore] = useState(false)
  return (
    <header className="bg-white pt-28 md:pt-32">
      <div className="container-x flex flex-col gap-5 pb-6 sm:flex-row sm:items-center sm:gap-10 md:gap-12 md:pb-8">
        {/* Logo box (no stroke, no shadow); not a link, clicking it does nothing */}
        <div className="group shrink-0 self-center rounded-[1.75rem] transition duration-500 hover:rotate-[8deg] sm:self-auto">
          <span className="grid h-32 w-32 place-items-center rounded-[1.45rem] bg-white p-1.5 ring-4 ring-white md:h-44 md:w-44">
            <span className="grid h-full w-full place-items-center rounded-[1.1rem] bg-gradient-to-br from-lilac/70 via-white to-blush/70 transition duration-500 group-hover:-rotate-[8deg]">
              <img src="/img/logo-color.webp" alt="Meena IVF & Fertility Care" className="w-[74%] object-contain" />
            </span>
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="sr-only">Meena IVF</h1>
          <p className="text-[0.9375rem] text-muted">
            <a href={YT} target="_blank" rel="noreferrer" className="font-semibold text-ink hover:underline">@MeenaIVF</a> · {site.stats[0].value}{site.stats[0].suffix} success stories
          </p>
          <p className="mt-2 max-w-2xl text-[0.9375rem] text-muted">
            {more
              ? <>Meena IVF &amp; Fertility Care is a trusted fertility centre in Banani, Dhaka, with OPDs in Khulna and Cumilla. Here you will find success stories, patient reviews, doctor talks, events, videos and fertility articles. </>
              : <>More about Meena IVF </>}
            <button type="button" onClick={() => setMore((m) => !m)} className="font-semibold text-ink hover:underline">{more ? 'less' : '...more'}</button>
          </p>
          {/* Social links (YouTube first) */}
          {/* phones: two per row (2 x 2); 640px+: one row */}
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[0.9375rem] sm:flex sm:flex-wrap sm:items-center">
            {[
              { href: YT, label: 'YouTube', Icon: YoutubeIcon, c: 'text-[#FF0000]' },
              { href: site.social.facebook, label: 'Facebook', Icon: FacebookIcon, c: 'text-[#1877F2]' },
              { href: site.social.instagram, label: 'Instagram', Icon: InstagramIcon, c: 'text-[#E4405F]' },
              { href: site.social.linkedin, label: 'LinkedIn', Icon: LinkedinIcon, c: 'text-[#0A66C2]' },
            ].map(({ href, label, Icon, c }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-[2.25rem] items-center gap-1.5 font-medium text-ink-2 hover:text-ink hover:underline">
                <Icon className={`h-4 w-4 ${c}`} />{label}
              </a>
            ))}
          </div>
          {/* WhatsApp + Call in place of Subscribe */}
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={waLink()} target="_blank" rel="noreferrer" className="inline-flex min-h-[2.5rem] items-center gap-2 rounded-full bg-ink px-5 text-[0.9375rem] font-semibold text-white transition hover:bg-ink/85"><WhatsAppIcon className="h-[1.125rem] w-[1.125rem] text-whatsapp" /> WhatsApp</a>
            <a href={site.hotlineHref} className="inline-flex min-h-[2.5rem] items-center gap-2 rounded-full bg-mist px-5 text-[0.9375rem] font-semibold text-ink transition hover:bg-lilac"><Phone className="h-4 w-4" /> Call</a>
          </div>
        </div>
      </div>
    </header>
  )
}

function PanelTitle({ title, text }: { title: string; text?: string }) {
  return (
    <div className="mb-8">
      <h2 className="h2 text-balance"><TwoTone text={title} /></h2>
      {text && <p className="mt-2 max-w-2xl text-ink-2">{text}</p>}
    </div>
  )
}

/* ───────── Tabs ───────── */
function SuccessStory() {
  // measure where the content box sits so the wire can run from the page's left edge to its right edge
  const wireBox = useRef<HTMLDivElement>(null)
  const [wire, setWire] = useState({ left: 0, cw: 0, vw: 0, md: false })
  useLayoutEffect(() => {
    const el = wireBox.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setWire({ left: r.left, cw: r.width, vw: document.documentElement.clientWidth, md: window.matchMedia('(min-width: 768px)').matches })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [wire.md]) // re-attach when the phone/desktop layout swaps (it renders a different box)
  // Like the landing page: on desktop the wire sags in a curve (WIRE_SAG px lower in the middle than at the page edges)
  // and each polaroid hangs where the wire crosses its column. On mobile (horizontal scroll) it stays straight.
  const WIRE_SAG = 80
  const WIRE_Y = 26
  const dip = (X: number) => { if (!wire.md || !wire.vw) return 0; const t = X / wire.vw; return 4 * WIRE_SAG * t * (1 - t) }
  const hang = (i: number) => dip(wire.left + ((i + 0.5) / 4) * wire.cw)
  // phones: the clothesline exactly as on the landing page (all four polaroids in one row on a gently sagging wire)
  const PHONE_SAG = 18
  const phoneY = (X: number) => { const t = wire.vw ? X / wire.vw : 0.5; return 10 + 4 * PHONE_SAG * t * (1 - t) }
  const phoneHang = (i: number) => phoneY(wire.left + ((i + 0.5) / 4) * wire.cw)
  return (
    <>
      <PanelTitle title="Welcome to the world" text="Every IVF baby carries a story of faith and determination." />
      {!wire.md ? (
        <div ref={wireBox} className="relative">
          <svg aria-hidden viewBox={`0 0 ${wire.vw || 1} 100`} preserveAspectRatio="none" className="absolute top-0 h-[100px] overflow-visible" style={{ left: -wire.left, width: wire.vw }}>
            <path d={`M0 10 Q${wire.vw / 2} ${10 + 2 * PHONE_SAG} ${wire.vw} 10`} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="text-ink/35" />
          </svg>
          <ul className="relative grid grid-cols-4 gap-3">
            {['success-1', 'success-2', 'success-3', 'success-4'].map((s, i) => (
              <li key={s} className="flex flex-col items-center" style={{ marginTop: phoneHang(i) - 14 }}>
                <motion.div className="flex w-full max-w-[15rem] flex-col items-center" style={{ transformOrigin: '50% 0%' }}
                  initial={{ opacity: 0, y: -24, rotate: i % 2 ? 6 : -6 }}
                  whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 2 : -2 }}
                  viewport={{ once: true }} transition={{ type: 'spring', stiffness: 120, damping: 9, delay: i * 0.12 }}>
                  <span aria-hidden className="relative z-10 flex h-7 w-4 gap-px">
                    <span className="flex-1 rounded-t-sm rounded-b-[2px] bg-[#C9965A]" />
                    <span className="flex-1 rounded-t-sm rounded-b-[2px] bg-[#B9844A]" />
                    <span className="absolute inset-x-[-2px] top-[38%] h-1 rounded-full bg-[#8A8A8A]" />
                  </span>
                  <div className="-mt-3 w-full rounded-[4px] bg-white p-1.5 pb-5 ring-1 ring-line">
                    <img src={`/img/${s}.webp`} alt="An IVF baby born to a Meena family" loading="lazy" className="aspect-square w-full rounded-[2px] object-cover" />
                  </div>
                </motion.div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
      /* tablet/desktop: cute polaroids clipped to one wire that runs edge to edge of the page, with balloons tied on */
      <div ref={wireBox} className="relative pt-3">
        {/* the wire: measured to the full page width */}
        {wire.md ? (
          <svg aria-hidden viewBox={`0 0 ${wire.vw || 1} 200`} preserveAspectRatio="none" className="absolute top-0 h-[200px] overflow-visible" style={{ left: -wire.left, width: wire.vw }}>
            <path d={`M0 ${WIRE_Y} Q${wire.vw / 2} ${WIRE_Y + 2 * WIRE_SAG} ${wire.vw} ${WIRE_Y}`} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" className="text-ink/25" />
          </svg>
        ) : (
          <div aria-hidden className="absolute top-[24px] h-[2px] bg-ink/25 md:top-[26px]" style={{ left: -wire.left, width: wire.vw }} />
        )}
        {/* balloon bunches tied to the wire */}
        <Balloons className="left-0 md:-left-16 xl:-left-24" />
        <Balloons className="right-0 md:-right-16 xl:-right-24" flip />
        <ul className="no-scrollbar relative -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 pt-1 md:mx-0 md:grid md:grid-cols-4 md:gap-x-8 md:overflow-visible md:p-0">
          {['success-1', 'success-2', 'success-3', 'success-4'].map((s, i) => (
            <li key={s} className="relative flex w-[68%] shrink-0 snap-center justify-center sm:w-[45%] md:w-auto" style={{ marginTop: hang(i) }}>
              <motion.div className="flex w-full max-w-[16rem] flex-col items-center" style={{ transformOrigin: '50% 0%' }}
                initial={{ opacity: 0, y: -20, rotate: i % 2 ? 7 : -7 }}
                whileInView={{ opacity: 1, y: 0, rotate: [-3, 2, -1, 1][i] }}
                whileHover={{ rotate: [-3, 2, -1, 1][i] * -1, y: 4 }}
                viewport={{ once: true }} transition={{ type: 'spring', stiffness: 120, damping: 9, delay: i * 0.1 }}>
                {/* clothespin */}
                <span aria-hidden className="relative z-10 flex h-8 w-[1.15rem] gap-px md:h-10 md:w-5">
                  <span className="flex-1 rounded-t-sm rounded-b-[2px] bg-[#E7A6F0]" />
                  <span className="flex-1 rounded-t-sm rounded-b-[2px] bg-[#D88BE4]" />
                  <span className="absolute inset-x-[-2px] top-[38%] h-1 rounded-full bg-[#B25FBF]" />
                </span>
                {/* polaroid */}
                <div className="-mt-3 w-full rounded-[6px] bg-white p-2 pb-3 shadow-[0_18px_30px_-18px_rgba(46,13,54,.45)] ring-1 ring-line md:p-3 md:pb-4">
                  <img src={`/img/${s}.webp`} alt="An IVF baby born to a Meena family" loading="lazy" className="aspect-square w-full rounded-[3px] object-cover" />
                  <p className="mt-2.5 text-center font-display text-lg italic text-plum md:text-xl">little miracle <span aria-hidden className="not-italic">♥</span></p>
                </div>
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
      )}
      <Link to="/blog/second-child-after-long-treatment" className="group mt-14 grid md:mt-20 items-center overflow-hidden rounded-panel bg-white shadow-soft ring-1 ring-line md:grid-cols-[1fr_1.2fr]">
        <img src="/img/blog-second-child.webp" alt="" loading="lazy" className="h-full w-full object-cover" />
        <div className="p-7 md:p-10">
          <p className="eyebrow mb-3">Success story</p>
          <h3 lang="bn" className="font-bn text-2xl font-semibold leading-snug group-hover:text-plum md:text-3xl">দীর্ঘ চিকিৎসা গ্রহণের পর ২য় সন্তানের মুখ দেখলেন দম্পতি</h3>
          <p className="mt-3 text-ink-2">After years of trying for a second child, this couple found Dr. Lubna Yasmin and welcomed a baby boy through IVF.</p>
          <span className="link-quiet mt-5">Read the story <ArrowRight className="h-4 w-4" /></span>
        </div>
      </Link>
    </>
  )
}

/* Balloons play once per page load: when the section comes into view, two balloons on each side bob up and down,
   then float away upwards and disappear. After that they are not shown again until the page is refreshed. */
let balloonsPlayed = false
function Balloons({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  const reduce = useReducedMotion()
  const box = useRef<HTMLDivElement>(null)
  const inView = useInView(box, { once: true, amount: 0.4 })
  const [gone, setGone] = useState(balloonsPlayed || !!reduce)
  useEffect(() => { if (inView) balloonsPlayed = true }, [inView])
  const set = [
    { c: '#E7A6F0', x: 0, h: 96, d: 0 },
    { c: '#B25FBF', x: 30, h: 108, d: 0.25 },
  ]
  if (gone) return null
  return (
    // anchored to the bottom of the cards; hidden until the section is seen, then they rise in, bob, and float away
    <div ref={box} aria-hidden className={`pointer-events-none absolute bottom-0 z-10 h-[150px] w-[86px] md:h-[190px] md:w-[104px] ${className} ${flip ? '-scale-x-100' : ''}`}>
      {set.map((b, i) => (
        <motion.svg key={i} viewBox="0 0 40 150" preserveAspectRatio="xMidYMax meet" className="absolute bottom-0 w-9 md:w-11" style={{ left: b.x, height: `${(b.h / 108) * 100}%` }}
          initial={{ y: 80, opacity: 0 }}
          animate={inView ? { y: [80, 0, -12, 0, -12, 0, -12, 0, -900], opacity: [0, 1, 1, 1, 1, 1, 1, 1, 0], rotate: [0, 0, -3, 0, 3, 0, -3, 0, i ? 8 : -8] } : undefined}
          transition={{ duration: 6.5, times: [0, 0.12, 0.2, 0.28, 0.36, 0.44, 0.52, 0.6, 1], ease: 'easeInOut', delay: b.d }}
          onAnimationComplete={() => { if (inView && i === set.length - 1) setGone(true) }}>
          <defs>
            <radialGradient id={`bl-${i}-${flip ? 'r' : 'l'}`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fff" stopOpacity=".75" />
              <stop offset="35%" stopColor={b.c} />
              <stop offset="100%" stopColor={b.c} />
            </radialGradient>
          </defs>
          <ellipse cx="20" cy="22" rx="17" ry="21" fill={`url(#bl-${i}-${flip ? 'r' : 'l'})`} />
          <path d="M17 42 L23 42 L20 46 Z" fill={b.c} />
          <path d="M20 46 C 14 70, 26 92, 18 118 S 22 140, 20 150" fill="none" stroke="#7a6a80" strokeOpacity=".55" strokeWidth="0.9" />
        </motion.svg>
      ))}
    </div>
  )
}

function PatientReview() {
  return (
    <>
      <PanelTitle title="What families say" text="Real words from patients, shared with their permission." />
      {/* four reviews side by side; each rises in one after another as it scrolls into view */}
      {/* phones: swipe slider moved by touch or the arrows below; tablet: two across; desktop: four */}
      <div className="m-slider patient-reviews-slider grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t, i) => (
          <motion.div key={t.name} className="h-full [&>*]:h-full"
            initial={{ opacity: 0, y: 40, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}>
            <TestimonialCard t={t} compact />
          </motion.div>
        ))}
      </div>
      <SliderArrows label="reviews" />
      <motion.h3 className="mb-6 mt-14 font-display text-2xl" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
        Shared on WhatsApp and social media
      </motion.h3>
      {/* review screenshots fade and lift in as you scroll down */}
      <div className="columns-2 gap-4 md:columns-3 lg:columns-5 [&>*]:mb-4">
        {Array.from({ length: 10 }, (_, i) => (
          <motion.img key={i} src={`/img/review-${i + 1}.webp`} alt="A patient review message" loading="lazy"
            className="w-full break-inside-avoid rounded-card border border-line"
            initial={{ opacity: 0, y: 36, rotate: i % 2 ? 1.5 : -1.5 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i % 5) * 0.07 }} />
        ))}
      </div>
    </>
  )
}

function DoctorsSpeak() {
  const v = videos.find((x) => x.by === 'Dr. Lubna Yasmin') ?? videos[0]
  return (
    <>
      <PanelTitle title="Doctor’s Speak" />
      <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-12">
        {/* Doctor: photo first, name right under it so the card ends with the doctor; stays in view while the right side scrolls */}
        <Link to="/doctors/dr-lubna-yasmin" className="group block self-start overflow-hidden rounded-panel lg:sticky lg:top-40">
          <div className="relative bg-gradient-to-b from-lilac/25 via-lilac/50 to-lilac/80">
            <div aria-hidden className="arch-full absolute inset-x-[12%] bottom-0 top-[8%] bg-white/45" />
            <img src="/img/dr-lubna.webp" alt="Dr. Lubna Yasmin" loading="lazy" className="relative mx-auto aspect-[3/4] h-auto w-full object-contain object-bottom" />
          </div>
          <div className="bg-white px-5 py-4">
            <p className="font-display text-xl group-hover:text-plum">Dr. Lubna Yasmin</p>
            <p className="text-sm text-muted">Chief Consultant, Meena IVF</p>
          </div>
        </Link>
        <div>
          <Quote className="h-9 w-9 text-lilac" />
          {/* justified (hyphenated so narrow lines don't open wide gaps) */}
          <div className="mt-3 space-y-4 text-justify text-lg leading-relaxed text-ink-2 [hyphens:auto]">
            <p className="font-display text-[1.4rem] leading-snug text-ink">Infertility can have many causes, in the woman, the man or both, and finding the right one is always the first step towards the right treatment.</p>
            <p>When simpler treatments have not worked, IVF is one of the most effective options. We approach it holistically, with a multidisciplinary team guiding every stage of the journey.</p>
            <p>Just as important is emotional support. Fertility treatment can be stressful, and no couple should feel alone while they go through it.</p>
          </div>
          <div className="mt-10"><VideoCard v={v} tv /></div>
        </div>
      </div>
    </>
  )
}

function VideoCard({ v, tv = false }: { v: (typeof videos)[number]; tv?: boolean }) {
  const [play, setPlay] = useState(false)
  const screen = (
    <>
        {play ? (
          <iframe className="aspect-video w-full" src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`} title={v.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        ) : (
          <button onClick={() => setPlay(true)} className="group relative block aspect-video w-full" aria-label={`Play video: ${v.title}`}>
            <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-85 transition group-hover:opacity-100" />
            <span className="absolute inset-0 grid place-items-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-plum shadow-lift transition group-hover:scale-110"><Play className="ml-1 h-7 w-7" fill="currentColor" /></span></span>
          </button>
        )}
    </>
  )
  return (
    <div>
      {tv ? (
        /* TV: dark bezel around the screen, a small power light, then neck and base */
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[1.5rem] bg-gradient-to-b from-[#2a2230] to-[#120d15] p-3 shadow-[0_30px_60px_-25px_rgba(46,13,54,.7)] ring-1 ring-black/40 md:p-4">
            <div className="overflow-hidden rounded-[0.6rem] bg-black ring-1 ring-white/10">{screen}</div>
            <div className="mt-2 flex items-center justify-between px-1">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white/35">Meena IVF</span>
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#E7A6F0] shadow-[0_0_8px_#E7A6F0]" />
            </div>
          </div>
          <div aria-hidden className="mx-auto h-7 w-16 bg-gradient-to-b from-[#1b151f] to-[#2a2230] [clip-path:polygon(20%_0,80%_0,100%_100%,0_100%)]" />
          <div aria-hidden className="mx-auto h-2.5 w-56 rounded-full bg-gradient-to-b from-[#2a2230] to-[#120d15] shadow-[0_10px_20px_-8px_rgba(46,13,54,.6)]" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-panel bg-plum-900">{screen}</div>
      )}
      <p className={`text-sm text-muted ${tv ? 'mt-5 text-center' : 'mt-3'}`}>{v.by}</p>
      <h3 lang="bn" className={`mt-1 font-bn text-xl font-semibold ${tv ? 'text-center' : ''}`}>{v.title}</h3>
    </div>
  )
}

function EventsTab() {
  const [open, setOpen] = useState<number | null>(null)
  const list = events.map((e) => ({ src: `/img/${e.img}.webp`, title: e.title, cat: e.cat }))
  return (
    <>
      <PanelTitle title="Events" />
      {/* Each event as a card: inset photo, category pill over its bottom edge, title and a round arrow button */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((e, i) => {
          const CatIcon = e.cat === 'Partnerships' ? Handshake : e.cat === 'Awareness' ? Megaphone : Heart
          return (
            <button key={e.src} onClick={() => setOpen(i)} aria-label={`Open photo: ${e.title}`}
              className="group flex flex-col rounded-[1.5rem] bg-white p-2.5 text-left shadow-[0_14px_34px_-22px_rgba(74,21,84,.4)] ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-22px_rgba(128,41,143,.5)]">
              <span className="relative block">
                <span className="block overflow-hidden rounded-[1.1rem]">
                  <img src={e.src} alt={e.title} loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                </span>
                <span className="absolute -bottom-4 left-3 inline-flex items-center gap-2 rounded-full bg-lilac px-4 py-2 text-[0.9375rem] font-medium text-plum-700 ring-4 ring-white">
                  <CatIcon className="h-4 w-4" /> {e.cat}
                </span>
              </span>
              <span className="flex flex-1 items-center gap-4 px-3 pb-3 pt-8">
                <span className="min-w-0 flex-1 text-[1.0625rem] font-semibold leading-snug text-ink">{e.title}</span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lilac text-plum transition group-hover:bg-plum group-hover:text-white">
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                </span>
              </span>
            </button>
          )
        })}
      </div>
      <Lightbox list={list} open={open} setOpen={setOpen} />
    </>
  )
}

function VideosTab() {
  return (
    <>
      <PanelTitle title="Videos" text="Infertility awareness and IVF treatment talks from our specialists." />
      {/* all videos from the Meena IVF YouTube channel */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{channelVideos.map((v) => <VideoCard key={v.id} v={v} />)}</div>
    </>
  )
}

function GalleryTab() {
  const [open, setOpen] = useState<number | null>(null)
  const banani = centres.find((c) => c.slug === 'banani')
  const list = [
    ...(banani?.gallery ?? []).map((src) => ({ src, title: 'Inside the Banani centre', cat: 'Centre' })),
    ...events.map((e) => ({ src: `/img/${e.img}.webp`, title: e.title, cat: e.cat })),
    ...['success-1', 'success-2', 'success-3', 'success-4'].map((s) => ({ src: `/img/${s}.webp`, title: 'An IVF baby born to a Meena family', cat: 'Success story' })),
  ]
  return (
    <>
      <PanelTitle title="Gallery" text="Our centre, our people and the moments we share." />
      <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
        {list.map((g, i) => (
          <button key={g.src + i} onClick={() => setOpen(i)} className="group relative block w-full break-inside-avoid overflow-hidden rounded-card" aria-label={`Open photo: ${g.title}`}>
            <img src={g.src} alt={g.title} loading="lazy" className="w-full transition duration-700 group-hover:scale-[1.03]" />
          </button>
        ))}
      </div>
      <Lightbox list={list} open={open} setOpen={setOpen} />
    </>
  )
}

/** Blog page (main menu → Blog): the Fertility Blog that used to be a Journeys tab, on its own page */
export function FertilityBlog() {
  useMeta('Fertility Blog', 'Infertility blog and fertility awareness hub: articles on IVF, IUI, PCOS, AMH, and male and female infertility.')
  return (
    <>
    {/* hero in the treatment-page style: a woman looking at a pregnancy test, the moment many readers come here from */}
    <CurveHero image="/img/blog-hero.webp" alt="A woman looking at a pregnancy test"
      title="Fertility Blog" subtitle="Infertility blog and fertility awareness hub: articles on IVF, IUI, PCOS, AMH, and male and female infertility." />
    <div className="container-x pb-20 pt-12 md:pb-28 md:pt-16">
      {/* phones: more space between posts plus a thin divider, so each post reads as its own block; tablet/desktop: grid */}
      <div className="grid gap-8 max-md:gap-0 max-md:divide-y max-md:divide-line md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.slug} to={`/blog/${p.slug}`} className="group block max-md:py-10 max-md:first:pt-0 max-md:last:pb-0">
            <div className="aspect-[16/10] overflow-hidden rounded-card bg-mist"><img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
            <p className="mt-4 text-sm text-muted">{p.categories.join(' · ')} · {fmtDate(p.date)}</p>
            <h3 lang="bn" className="mt-2 font-bn text-xl font-semibold leading-snug group-hover:text-plum">{p.title}</h3>
            <p lang="bn" className="mt-2 line-clamp-2 font-bn text-ink-2">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
    </>
  )
}

/* ───────── Lightbox shared by Events and Gallery ───────── */
function Lightbox({ list, open, setOpen }: { list: { src: string; title: string; cat: string }[]; open: number | null; setOpen: (v: number | null) => void }) {
  useEffect(() => () => lockScroll(false), [])
  useEffect(() => {
    lockScroll(open !== null)
    if (open === null) return
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((open + 1) % list.length)
      if (e.key === 'ArrowLeft') setOpen((open - 1 + list.length) % list.length)
    }
    window.addEventListener('keydown', on); return () => window.removeEventListener('keydown', on)
  }, [open, list.length, setOpen])
  return (
    <AnimatePresence>
      {open !== null && (
        <motion.div data-lenis-prevent role="dialog" aria-modal="true" aria-label={list[open].title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] grid place-items-center bg-plum-900/95 p-4" onClick={() => setOpen(null)}>
          <button autoFocus className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close" onClick={() => setOpen(null)}><X className="h-6 w-6" /></button>
          <button className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + list.length) % list.length) }}><ChevronLeft className="h-6 w-6" /></button>
          <button className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % list.length) }}><ChevronRight className="h-6 w-6" /></button>
          <figure onClick={(e) => e.stopPropagation()} className="max-w-4xl">
            <img src={list[open].src} alt={list[open].title} className="max-h-[78vh] w-auto rounded-card" />
            <figcaption className="mt-4 text-center text-white"><span className="text-sm text-lilac">{list[open].cat} · {open + 1} / {list.length}</span><br />{list[open].title}</figcaption>
          </figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
