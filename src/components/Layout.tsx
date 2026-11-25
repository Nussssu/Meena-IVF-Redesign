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
  // Centre and treatment pages open on a dark photo hero: keep the transparent header's text light until it gets its solid background
  const onDark = /^\/(centres|treatments)\/[^/]+/.test(loc.pathname) && !(scrolled || open || mobile)

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
    <header className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-300 ease-out ${hide ? '-translate-y-full' : ''} ${scrolled || open || mobile ? 'border-b border-lilac bg-gradient-to-r from-white/90 via-white/90 to-lilac/90 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'}`}>
      <motion.div aria-hidden style={{ scaleX: scrollYProgress }} className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-plum/70" />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-plum focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <Link to="/" aria-label="Meena IVF home" className="flex min-h-[2.75rem] shrink-0 items-center"><Logo light={onDark} className="h-7 md:h-8" /></Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {nav.map((item) => {
              const hasPanel = 'mega' in item || 'children' in item
              return (
                <li key={item.label} className="relative" onMouseEnter={() => hasPanel && enter(item.label)} onMouseLeave={leave}>
                  {hasPanel ? (
                    <button
                      className={`flex min-h-[2.75rem] items-center gap-1 rounded-full px-2.5 text-[0.9375rem] font-medium transition hover:text-plum xl:px-4 ${open === item.label ? 'text-plum' : onDark ? 'text-paper hover:!text-lilac' : 'text-ink'}`}
                      aria-expanded={open === item.label}
                      onClick={() => setOpen(open === item.label ? null : item.label)}
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition ${open === item.label ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <NavLink to={item.to} className={({ isActive }) => `flex min-h-[2.75rem] items-center rounded-full px-2.5 text-[0.9375rem] font-medium transition hover:text-plum xl:px-4 ${isActive ? 'text-plum' : onDark ? 'text-paper hover:!text-lilac' : 'text-ink'}`}>{item.label}</NavLink>
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
          <a href={site.hotlineHref} className={`hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[0.9375rem] font-semibold ${onDark ? 'text-paper hover:text-lilac' : 'text-ink hover:text-plum'} 2xl:flex`}><Phone className="h-4 w-4" />{site.hotline}</a>
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
            className="absolute inset-x-0 top-full hidden border-b border-lilac bg-gradient-to-r from-white/95 via-white/95 to-lilac/95 backdrop-blur-xl lg:block">
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

// Final frame of the reference animation's mother + baby strokes, in a 320 × 475 box
const FOOTER_MOTHER_BABY = [
  'M264.6 342.8 C264.5 343 264.5 343.2 264.7 343.4 C264.9 343.5 265.1 343.5 265.3 343.3 C279.4 324.2 319.7 266.3 319.7 226.3 C319.7 192.8 310.7 164.4 301.9 135.7 C293.1 107 284.6 94.3 284.6 76.1 C284.6 53 260.7 0 202.9 0 C155 0 138.5 32.7 131.1 52.2 C130.9 52.8 131.1 53.4 131.5 53.7 C132 54.1 132.7 54 133.1 53.6 C146.8 40.7 161 22.8 202.9 22.8 C246.5 22.8 258.3 61.8 258.3 76.1 C258.3 90.3 272.1 116.7 280.9 143.5 C289.6 170.3 297.5 194.1 297.5 226.3 C297.5 279.8 274.3 325.9 264.6 342.8Z',
  'M117.3 127.4 C115 123.6 112.8 99.4 119.2 91 C125.8 82.3 137.9 79.2 146.3 76.1 C153.4 73.5 164.5 70.6 170.8 64.9 C171.5 64.2 172.4 64 173.3 64.2 C174.2 64.4 175 65.1 175.3 66 C178.2 74 183.5 80.9 196.9 92 C212.9 105.2 239.8 135.2 238.9 158.9 C238.1 182.7 233.3 188.1 225.1 202.5 C215.8 219 210.3 228.8 216.1 251.2 C216.2 251.6 216 252 215.6 252.3 C215.3 252.5 214.8 252.5 214.4 252.2 C210.8 248.5 205 240.9 205 232.3 C205 223.4 211 213.1 217.9 199.3 C220.7 193.6 230.1 177.5 228.6 158.9 C227 137.9 208.5 117.9 194.4 106.2 C180.2 94.4 175.6 84.9 172.7 78.4 C172.2 77.5 171.4 76.8 170.4 76.6 C169.4 76.4 168.4 76.6 167.6 77.2 C160.9 82.6 156.2 84.7 146.3 88.8 C126.3 97.1 118.8 107.8 117.3 127.4Z',
  'M165.6 210.9 C165.2 211 165 211.4 165.1 211.7 C165.2 212.1 165.5 212.3 165.9 212.3 C210.1 208.6 222.5 191.6 221.5 148.8 C221.5 148.4 221.2 148.1 220.8 148 C220.5 148 220.1 148.3 220 148.6 C212.9 190.3 201.3 199.3 165.6 210.9Z',
  'M129.8 130.9 C129.5 130.7 129.1 130.7 128.9 130.8 C128.6 131 128.4 131.3 128.5 131.6 C131.3 143.5 145.3 146 156.1 139.2 C156.4 139 156.5 138.7 156.4 138.4 C156.3 138.1 156 137.9 155.7 137.9 C146.7 138 138.1 138.7 129.8 130.9Z',
  'M175.5 144.2 C175.2 144.1 174.9 144.1 174.6 144.4 C174.4 144.6 174.4 144.9 174.5 145.2 C179 155.8 197.8 157.2 206.4 147.6 C206.6 147.3 206.7 147 206.5 146.7 C206.4 146.4 206.1 146.2 205.8 146.3 C197.7 147.4 190.1 151.2 175.5 144.2Z',
  'M43.7 395.7 C32 394.2 16 395.2 16 395.2 C16 395.2 18 397.2 22.7 399.6 C39.9 408.1 47.9 397.3 78.5 422.2 C80.7 423.9 84.3 424.9 89.6 421 C114.3 402.5 140.6 373.7 163.2 342.3 C180 319 196.1 294.4 208.8 279 C221.3 263.8 234.6 254.9 248.5 247.4 C248.9 247.2 249 246.7 248.9 246.3 C248.8 245.9 248.4 245.6 247.9 245.7 C234.2 247.8 225 250.9 215.8 258.2 C203.8 267.6 184.6 291.7 174.3 302.7 C169.9 307.4 150 338.7 139.5 353.6 C128.8 368.9 100.4 399.6 83.5 407.3 C80.8 400.5 72.8 399.6 43.7 395.7Z',
  'M12.8 420.6 C12.6 420.5 12.4 420.4 12.2 420.5 C12 420.7 12 420.9 12 421.1 C31.4 464.8 67.7 473.5 80.4 474.4 C106.1 476.1 121 473.4 147.3 454.4 C169.6 438.3 186.7 422.3 197.4 412.4 C197.4 412.4 237.4 370.6 246.8 351.9 C254.1 337.5 256.5 327.6 257.3 322.3 C257.3 321.7 257 321.1 256.4 320.9 C255.8 320.7 255.2 320.9 254.8 321.3 C243.2 335.5 200 387.8 190.9 397.8 C179 410.7 151.9 437.5 138.3 447.1 C126.4 455.5 105.1 470.1 81.1 465.4 C62 461.6 43.8 458.5 12.8 420.6Z',
  'M58.1 257.3 C58.4 256.9 58.4 256.3 58 255.9 C57.6 255.5 57.1 255.4 56.6 255.7 C47 262.1 24.1 279.5 10.5 309.6 C-5.9 345.8 -4.1 386.7 22.7 400 C39.9 408.5 47.9 397.7 78.6 422.5 C80.8 424.3 85.8 413.3 83.6 407.7 C80.9 400.9 72.9 400 43.7 396.1 C27.6 394 -1.5 388.1 22.7 323.9 C33.3 295.8 51.1 267.8 58.1 257.3Z',
  'M121.6 375.1 C114.4 369.3 101.2 355.5 64.4 355.7 C64.2 355.7 64 355.9 64 356.1 C64 356.3 64.1 356.6 64.3 356.6 C99 365.6 105.9 374.5 114.4 383 C118.1 386.7 125.7 378.4 121.6 375.1Z',
  'M101.2 364 C106.3 355.2 116.1 337 107.9 329.5 C104.6 326.5 116.1 327 116.9 332.7 C119 349.2 112 360.7 107 366.8 C104.9 369.3 100.1 365.8 101.2 364Z',
  'M179.5 297.1 C160.5 315.2 149.3 327.1 131.3 327.1 C108.6 327.1 81.3 308.7 69.9 296.8 C69.7 296.6 69.5 296.6 69.3 296.7 C69.1 296.8 69 297.1 69.2 297.3 C74.7 307.8 81.1 321.4 96 325 C109.1 328.2 109.1 333.4 130.4 333.4 C140.3 333.4 154.6 329.6 160.4 327.1 C166.6 316.5 172.9 312.1 179.5 297.1Z',
  'M68.3 251.8 C68.1 251.7 67.9 251.3 68 251 C68.1 250.7 68.5 250.5 68.8 250.5 C101.7 254 120.2 274 129.1 287.3 C129.6 288 130.4 288.5 131.2 288.6 C132 288.8 132.9 288.6 133.6 288.1 C149.7 276.4 169.7 270.3 190.6 266.3 C190.8 266.3 191 266.4 191.1 266.7 C191.2 266.9 191.1 267.2 190.8 267.3 C174.6 274.7 148.9 284.5 131.5 303.2 C130.8 303.9 129.8 304.3 128.8 304.3 C127.8 304.2 126.8 303.7 126.2 302.8 C107.3 275.7 81 259.6 68.3 251.8Z',
  'M71 232.5 C81.5 273.9 114.2 271.1 132.9 263 C109.3 264.7 88.1 260.8 71 232.5Z',
  'M62 233.4 C62.2 233.9 62.2 234.4 61.8 234.8 C61.4 235.1 60.9 235.2 60.5 234.9 C42.4 221.6 14.9 172.3 62.6 141 C107.5 111.6 157.8 153 151 211.6 C160.6 225.7 160.6 240.3 142.6 258.2 C142.4 258.4 142.1 258.4 141.9 258.3 C141.7 258.1 141.6 257.8 141.8 257.6 C150.9 242.4 157.8 229.2 147.3 212.8 C150.2 205 141.8 132.4 80.4 153 C45.5 164.8 46.7 206.3 62 233.4Z',
  'M95.2 228.9 C95 228.6 94.9 228.3 95.1 228 C95.3 227.8 95.7 227.7 96 227.9 C103.2 232 107.5 227.7 111.3 223.7 C111.5 223.5 111.9 223.4 112.2 223.6 C112.5 223.8 112.6 224.1 112.5 224.4 C110.1 230.8 101.5 236.3 95.2 228.9Z',
  'M126.3 219.3 C126 219.1 125.9 218.8 126.1 218.5 C126.2 218.2 126.5 218.1 126.8 218.1 C135.5 220.9 137.8 216.1 141.3 211.9 C141.5 211.7 141.8 211.6 142.1 211.7 C142.4 211.8 142.6 212.1 142.5 212.4 C141.9 220.7 132.9 224.3 126.3 219.3Z',
]

function Footer() {
  const cols = [
    { title: 'Treatments', links: [['IVF', '/treatments/ivf'], ['ICSI', '/treatments/icsi'], ['IUI', '/treatments/iui'], ['Egg freezing', '/treatments/egg-freezing'], ['TESA', '/treatments/tesa'], ['All treatments', '/treatments']] },
    { title: 'Meena IVF', links: [['About us', '/about'], ['Why Meena', '/why-meena'], ['Our doctors', '/doctors'], ['Our team', '/team'], ['Centres', '/centres'], ['Careers', '/careers']] },
    { title: 'Learn', links: [['Patient stories', '/stories'], ['Fertility blog', '/blog'], ['Videos', '/videos'], ['Events & gallery', '/events'], ['FAQ', '/faq'], ['Contact', '/contact']] },
  ]
  return (
    <footer className="relative overflow-hidden bg-plum-900 text-paper">
      {/* mother cradling her baby (line-art structure after LottieFiles "Baby" by Pietro barcarollo), in the same soft plum the old arch used */}
      <svg aria-hidden viewBox="0 0 320 475" className="absolute bottom-0 right-6 h-[420px] w-[283px]">
        <g fill="#80298F" opacity=".3">{FOOTER_MOTHER_BABY.map((d, i) => <path key={i} d={d} />)}</g>
      </svg>
      <div className="container-x relative pb-28 pt-20 lg:pb-12">
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
