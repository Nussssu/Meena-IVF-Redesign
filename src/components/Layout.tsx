import { Suspense, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll } from 'motion/react'
import { ArrowRight, ArrowUpRight, CalendarCheck, ChevronDown, Clock, Mail, MapPin, Phone, X } from 'lucide-react'
import { nav, site, waLink } from '../data/site'
import { groups, byGroup, type Treatment } from '../data/treatments'
import { PageCurtain, useHideOnScroll } from './motion'
import { initSmoothScroll, lockScroll, scrollToTarget } from '../lib/smooth'
import { FacebookIcon, InstagramIcon, LinkedinIcon, Logo, WhatsAppIcon, YoutubeIcon } from './ui'

function useScrolled(px = 24) {
  const [s, set] = useState(false)
  useEffect(() => {
    const on = () => set(window.scrollY > px)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [px])
  return s
}

function Header() {
  const scrolled = useScrolled()
  const [open, setOpen] = useState<string | null>(null)
  // Treatment under the pointer in the mega menu; its photo shows in the right-hand card
  const [hovered, setHovered] = useState<Treatment | null>(null)
  useEffect(() => { if (open !== 'Treatments') setHovered(null) }, [open])
  const [mobile, setMobile] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)
  useEffect(() => { if (wasOpen.current && !mobile) toggleRef.current?.focus({ preventScroll: true }); wasOpen.current = mobile }, [mobile])
  const hiddenOnScroll = useHideOnScroll()
  const hide = hiddenOnScroll && !open && !mobile
  const { scrollYProgress } = useScroll()
  const loc = useLocation()
  const closeTimer = useRef<number | undefined>(undefined)

  useEffect(() => { setOpen(null); setMobile(false) }, [loc.pathname])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(null); setMobile(false) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => { lockScroll(mobile) }, [mobile])

  const enter = (k: string) => { window.clearTimeout(closeTimer.current); setOpen(k) }
  const leave = () => { closeTimer.current = window.setTimeout(() => setOpen(null), 140) }

  return (
    <>
    <header className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-300 ease-out ${hide ? '-translate-y-full' : ''} ${scrolled || open || mobile ? 'border-b border-line/70 bg-paper/85 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'}`}>
      <motion.div aria-hidden style={{ scaleX: scrollYProgress }} className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-plum/70" />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-plum focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <Link to="/" aria-label="Meena IVF home" className="flex min-h-[2.75rem] shrink-0 items-center"><Logo className="h-7 md:h-8" /></Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {nav.map((item) => {
              const hasPanel = 'mega' in item || 'children' in item
              return (
                <li key={item.label} className="relative" onMouseEnter={() => hasPanel && enter(item.label)} onMouseLeave={leave}>
                  {hasPanel ? (
                    <button
                      className={`flex min-h-[2.75rem] items-center gap-1 rounded-full px-2.5 text-[0.9375rem] font-medium transition hover:text-plum xl:px-4 ${open === item.label ? 'text-plum' : 'text-ink'}`}
                      aria-expanded={open === item.label}
                      onClick={() => setOpen(open === item.label ? null : item.label)}
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition ${open === item.label ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <NavLink to={item.to} className={({ isActive }) => `flex min-h-[2.75rem] items-center rounded-full px-2.5 text-[0.9375rem] font-medium transition hover:text-plum xl:px-4 ${isActive ? 'text-plum' : 'text-ink'}`}>{item.label}</NavLink>
                  )}
                  <AnimatePresence>
                    {open === item.label && 'children' in item && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.18 }}
                        className="absolute left-1/2 top-full w-[340px] -translate-x-1/2 pt-3">
                        <div className="card p-2 shadow-lift">
                          {item.children.map((c) => (
                            <Link key={c.to} to={c.to} className="group block rounded-xl px-4 py-3 transition hover:bg-mist">
                              <span className="flex items-center justify-between font-semibold text-ink group-hover:text-plum">{c.label}<ArrowRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" /></span>
                              <span className="text-sm text-muted">{c.desc}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={site.hotlineHref} className="hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[0.9375rem] font-semibold text-ink hover:text-plum 2xl:flex"><Phone className="h-4 w-4" />{site.hotline}</a>
          <Link to="/book" className="btn-primary hidden !min-h-[44px] whitespace-nowrap !px-5 sm:inline-flex"><span>Book<span className="hidden xl:inline"> appointment</span></span></Link>
          <button ref={toggleRef} className="group grid h-11 w-11 place-items-center rounded-full bg-plum-900 text-paper shadow-soft transition hover:bg-plum lg:hidden" aria-label="Open menu" aria-expanded={mobile} aria-controls="mobile-drawer" onClick={() => setMobile(true)} data-mobile-toggle>
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Treatments mega panel */}
      <AnimatePresence>
        {open === 'Treatments' && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
            onMouseEnter={() => enter('Treatments')} onMouseLeave={leave}
            className="absolute inset-x-0 top-full hidden border-b border-line bg-paper/95 backdrop-blur-xl lg:block">
            <div className="container-x grid grid-cols-[1fr_1fr_1fr_17.5rem] gap-x-8 gap-y-8 py-10 xl:gap-x-10">
              {groups.map((g) => (
                <div key={g.key}>
                  <p className="mb-3 text-eyebrow font-semibold uppercase text-muted">{g.label}</p>
                  <ul className="space-y-1">
                    {byGroup(g.key).map((t) => (
                      <li key={t.slug}><Link to={`/treatments/${t.slug}`} onMouseEnter={() => setHovered(t)} onFocus={() => setHovered(t)} className="group flex items-baseline gap-2 py-1 text-[0.9375rem] font-medium text-ink hover:text-plum">
                        {t.name}<span className="truncate text-xs font-normal text-muted group-hover:text-plum/70">{t.full}</span>
                      </Link></li>
                    ))}
                  </ul>
                </div>
              )).reduce<React.ReactNode[]>((acc, el, i) => { acc.push(el); if (i === 2) acc.push(<MegaFeature key="feat" t={hovered} />); return acc }, [])}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
      <MobileDrawer open={mobile} onClose={() => setMobile(false)} />
    </>
  )
}

// Photo for treatments that have none of their own
const MEGA_FALLBACK: Partial<Record<Treatment['group'], string>> = { female: '/img/laparoscopy.webp', male: '/img/semen-2.webp' }

function MegaFeature({ t }: { t: Treatment | null }) {
  const img = t ? t.image ?? MEGA_FALLBACK[t.group] ?? '/img/doctors-duo.webp' : '/img/doctors-duo.webp'
  return (
    <Link to={t ? `/treatments/${t.slug}` : '/treatments'} className="group row-span-2 flex flex-col justify-between overflow-hidden rounded-card bg-plum-900 p-6 text-paper">
      <div className="min-h-[6.5rem]">
        <p className="text-eyebrow font-semibold uppercase text-lilac">{t ? groups.find((g) => g.key === t.group)?.label : 'Not sure where to start?'}</p>
        <p className="mt-3 font-display text-2xl leading-tight">{t ? t.name : 'Explore all 18 treatments and find the right first step.'}</p>
        {t && <p className="mt-1 text-sm text-paper/70">{t.full}</p>}
      </div>
      <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-xl bg-plum-800">
        <AnimatePresence initial={false}>
          <motion.img key={img} src={img} alt="" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full object-cover" />
        </AnimatePresence>
      </div>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">{t ? `View ${t.name}` : 'View treatments'} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
    </Link>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M4 8h16" />
      <path d="M10 16h10" className="transition-[d] duration-200" />
    </svg>
  )
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="lg:hidden">
          <motion.div key="backdrop" aria-hidden onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }} exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
            className="fixed inset-0 z-[60] bg-plum-900/45 backdrop-blur-[2px]" />
          <motion.aside key="drawer" id="mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu" data-lenis-prevent
            initial={{ x: '100%' }} animate={{ x: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }} exit={{ x: '100%', transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] } }}
            className="fixed inset-y-0 right-0 z-[61] flex w-[min(88vw,24rem)] flex-col bg-paper shadow-[0_0_60px_-10px_rgba(46,13,54,.45)]"
            onKeyDown={(e) => {
              if (e.key !== 'Tab') return
              const f = [...e.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')]
              if (!f.length) return
              const first = f[0], last = f[f.length - 1]
              if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
              else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
            }}>
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-line px-5">
              <Link to="/" onClick={onClose} aria-label="Meena IVF home" className="flex min-h-[2.75rem] items-center"><Logo className="h-7" /></Link>
              <button autoFocus onClick={onClose} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white transition hover:border-plum hover:text-plum"><X className="h-5 w-5" /></button>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-5 pb-6">
              <MobileGroup title="Treatments">
                {groups.map((g) => (
                  <div key={g.key} className="mb-4">
                    <p className="mb-2 text-eyebrow font-semibold uppercase text-muted">{g.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {byGroup(g.key).map((t) => <Link key={t.slug} to={`/treatments/${t.slug}`} onClick={onClose} className="inline-flex min-h-[2.75rem] items-center rounded-full bg-white px-3.5 text-[0.875rem] font-medium text-ink ring-1 ring-line transition hover:text-plum hover:ring-plum">{t.name}</Link>)}
                    </div>
                  </div>
                ))}
                <Link to="/treatments" onClick={onClose} className="link-quiet">All treatments <ArrowRight className="h-4 w-4" /></Link>
              </MobileGroup>
              {nav.filter((n) => !('mega' in n)).map((n) => 'children' in n ? (
                <MobileGroup key={n.label} title={n.label}>
                  <div className="grid">{n.children.map((c) => <Link key={c.to} to={c.to} onClick={onClose} className="flex min-h-[2.75rem] items-center justify-between text-[1.0625rem] text-ink hover:text-plum">{c.label}<ArrowRight className="h-4 w-4 text-muted" /></Link>)}</div>
                </MobileGroup>
              ) : (
                <Link key={n.label} to={n.to} onClick={onClose} className="flex min-h-[4rem] items-center justify-between border-b border-line font-display text-[1.6rem] hover:text-plum">{n.label}<ArrowUpRight className="h-5 w-5 text-muted" /></Link>
              ))}
              <Link to="/contact" onClick={onClose} className="flex min-h-[4rem] items-center justify-between border-b border-line font-display text-[1.6rem] hover:text-plum">Contact<ArrowUpRight className="h-5 w-5 text-muted" /></Link>
            </nav>
            <div className="shrink-0 border-t border-line bg-white/70 px-5 pb-5 pt-4">
              <div className="btn-pair">
                <Link to="/book" onClick={onClose} className="btn-primary">Book now</Link>
                <a href={site.hotlineHref} className="btn-secondary"><Phone className="h-4 w-4" /> Call us</a>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted">Sat to Thu · 9 AM to 5 PM</p>
                <div className="flex gap-1">
                  {[[site.social.facebook, FacebookIcon, 'Facebook'], [site.social.instagram, InstagramIcon, 'Instagram'], [site.social.youtube, YoutubeIcon, 'YouTube']].map(([href, Icon, label]) => {
                    const I = Icon as typeof FacebookIcon
                    return <a key={label as string} href={href as string} target="_blank" rel="noreferrer" aria-label={label as string} className="grid h-11 w-11 place-items-center rounded-full text-ink-2 hover:text-plum"><I className="h-[1.125rem] w-[1.125rem]" /></a>
                  })}
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}

function MobileGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [o, setO] = useState(false)
  return (
    <div className="border-b border-line">
      <button className="flex min-h-[4rem] w-full items-center justify-between font-display text-[1.6rem] hover:text-plum" aria-expanded={o} onClick={() => setO(!o)}>
        {title}<ChevronDown className={`h-5 w-5 text-muted transition ${o ? 'rotate-180' : ''}`} />
      </button>
      {o && <div className="pb-6">{children}</div>}
    </div>
  )
}

function Footer() {
  const cols = [
    { title: 'Treatments', links: [['IVF', '/treatments/ivf'], ['ICSI', '/treatments/icsi'], ['IUI', '/treatments/iui'], ['Egg freezing', '/treatments/egg-freezing'], ['TESA', '/treatments/tesa'], ['All treatments', '/treatments']] },
    { title: 'Meena IVF', links: [['About us', '/about'], ['Why Meena', '/why-meena'], ['Our doctors', '/doctors'], ['Our team', '/team'], ['Centres', '/centres'], ['Careers', '/careers']] },
    { title: 'Learn', links: [['Patient stories', '/stories'], ['Fertility blog', '/blog'], ['Videos', '/videos'], ['Events & gallery', '/events'], ['FAQ', '/faq'], ['Contact', '/contact']] },
  ]
  return (
    <footer className="relative overflow-hidden bg-plum-900 text-paper">
      <div aria-hidden className="absolute -right-24 bottom-0 h-[420px] w-[420px] rounded-t-full bg-plum/30" />
      <div className="container-x relative pb-28 pt-20 lg:pb-12">
        <FooterSignOff />
        <div className="grid gap-12 lg:grid-cols-[1fr_3fr]">
          <div>
            <Logo light className="h-9" />
            <div className="mt-8 flex gap-2">
              {[
                [site.social.facebook, FacebookIcon, 'Facebook'],
                [site.social.instagram, InstagramIcon, 'Instagram'],
                [site.social.youtube, YoutubeIcon, 'YouTube'],
                [site.social.linkedin, LinkedinIcon, 'LinkedIn'],
              ].map(([href, Icon, label]) => {
                const I = Icon as typeof FacebookIcon
                return <a key={label as string} href={href as string} target="_blank" rel="noreferrer" aria-label={label as string} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 transition hover:bg-white hover:text-plum-900"><I className="h-[18px] w-[18px]" /></a>
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1fr_1fr_1fr_1.5fr]">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="mb-4 text-eyebrow font-semibold uppercase text-lilac">{c.title}</p>
                <ul className="lg:space-y-1">
                  {c.links.map(([l, to]) => <li key={to}><Link to={to} className="inline-flex min-h-[2.75rem] items-center text-paper/75 transition hover:text-white lg:min-h-[2rem]">{l}</Link></li>)}
                </ul>
              </div>
            ))}
            <div className="col-span-2 md:col-span-1">
              <p className="mb-4 text-eyebrow font-semibold uppercase text-lilac">Visit</p>
              <ul className="space-y-3 text-paper/75">
                <li className="flex gap-2.5"><MapPin className="mt-1 h-4 w-4 shrink-0 text-lilac" />{site.address}</li>
                <li className="flex gap-2.5"><Clock className="mt-1 h-4 w-4 shrink-0 text-lilac" />Saturday to Thursday, 9 AM to 5 PM</li>
                <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0 text-lilac" /><a href={site.hotlineHref} className="inline-flex min-h-[2.75rem] items-center whitespace-nowrap hover:text-white">{site.hotline}</a></li>
                <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0 text-lilac" /><a href={`mailto:${site.email}`} className="inline-flex min-h-[2.75rem] items-center hover:text-white">{site.email}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-paper/50 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} {site.legal} All rights reserved.</p>
          <p>Images of patients are shared with their informed consent, for educational purposes.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterSignOff() {
  const words = ['Where', 'family', 'begins.']
  return (
    <div className="mb-16 flex flex-col gap-8 border-b border-white/10 pb-14 md:mb-20 lg:flex-row lg:items-end lg:justify-between">
      <p className="font-display leading-[1.02] tracking-[-0.035em] text-paper" style={{ fontSize: 'clamp(2.75rem, 1.4rem + 4.6vw, 6.5rem)' }} aria-label="Where family begins.">
        {words.map((w, i) => (
          <span key={w} className="-mb-[0.18em] inline-block overflow-hidden pb-[0.22em] pr-[0.06em] align-bottom">
            <motion.span className={`inline-block ${w === 'family' ? 'italic text-lilac' : ''}`} initial={{ y: '105%' }} whileInView={{ y: 0 }} viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}>{w}&nbsp;</motion.span>
          </span>
        ))}
      </p>
      <p className="max-w-xs text-paper/60 lg:pb-5">Specialist-led fertility care in Banani, Dhaka, with regional OPDs in Khulna and Cumilla.</p>
    </div>
  )
}

function MobileActionBar() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-3 gap-1 rounded-full border border-line bg-paper/90 p-1.5 shadow-lift backdrop-blur-xl lg:hidden">
      <a href={site.hotlineHref} className="flex min-h-[3.5rem] flex-col items-center justify-center gap-1.5 rounded-full leading-none text-xs font-semibold text-ink"><Phone className="h-5 w-5" /><span>Call</span></a>
      <a href={waLink()} target="_blank" rel="noreferrer" className="flex min-h-[3.5rem] flex-col items-center justify-center gap-1.5 rounded-full leading-none text-xs font-semibold text-ink"><WhatsAppIcon className="h-5 w-5 text-whatsapp" /><span>WhatsApp</span></a>
      <Link to="/book" className="flex min-h-[3.5rem] flex-col items-center justify-center gap-1.5 rounded-full leading-none bg-plum text-xs font-semibold text-white"><CalendarCheck className="h-5 w-5" /><span>Book</span></Link>
    </div>
  )
}

function FloatingWhatsApp() {
  return (
    <a href={waLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-40 hidden items-center rounded-full bg-whatsapp p-3 text-whatsapp-ink shadow-lift transition hover:-translate-y-0.5 lg:flex">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-whatsapp"><WhatsAppIcon className="h-5 w-5" /></span>
    </a>
  )
}

export default function Layout() {
  const { pathname, hash } = useLocation()
  useEffect(() => { initSmoothScroll() }, [])
  useEffect(() => { if (!hash) scrollToTarget(0, { immediate: true }) }, [pathname, hash])
  return (
    <>
      <PageCurtain routeKey={pathname} />
      <Header />
      <main id="main"><Suspense fallback={<div className="min-h-screen" />}><Outlet /></Suspense></main>
      <Footer />
      <MobileActionBar />
      {pathname !== '/book' && <FloatingWhatsApp />}
    </>
  )
}
