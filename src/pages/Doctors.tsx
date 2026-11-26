import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Mail, MapPin, Phone } from 'lucide-react'
import { CTABand, PageHero, Reveal, useMeta } from '../components/ui'
import { DoctorCard } from '../components/cards'
import { dayNames, dhakaDay, doctorBySlug, doctors, sessionsOn } from '../data/doctors'
import { site } from '../data/site'
import NotFound from './NotFound'

const filters = [
  { key: 'all', label: 'All specialists', match: () => true },
  { key: 'today', label: 'In clinic today', match: (d: (typeof doctors)[number]) => sessionsOn(d, dhakaDay()).length > 0 },
  { key: 'ivf', label: 'IVF & ICSI', match: (d: (typeof doctors)[number]) => d.focus.some((f) => /IVF|ICSI|ART/.test(f)) },
  { key: 'surgery', label: 'Laparoscopy & hysteroscopy', match: (d: (typeof doctors)[number]) => d.focus.some((f) => /Laparo|Hystero/.test(f)) },
  { key: 'male', label: 'Male infertility', match: (d: (typeof doctors)[number]) => d.focus.some((f) => /Male|TESA/.test(f)) },
  { key: 'evening', label: 'Evening chambers', match: (d: (typeof doctors)[number]) => d.schedule.some((s) => s.to.includes('PM') && parseInt(s.to) >= 8 && parseInt(s.to) < 12) },
]

export function DoctorsIndex() {
  useMeta('Our fertility experts', 'Meet the five senior fertility consultants at Meena IVF & Fertility Care, Banani, Dhaka.')
  const [f, setF] = useState('all')
  const list = useMemo(() => doctors.filter(filters.find((x) => x.key === f)!.match), [f])
  return (
    <>
      <PageHero crumbs={[{ label: 'Doctors' }]} eyebrow="Our fertility experts" tone="blush"
        title={<>Bangladesh’s leading specialists, <em className="text-plum">by your side</em>.</>}
        text="Five senior consultants with 15 to 26 years of experience each, trained in Dhaka, Mumbai, Ahmedabad, Bengaluru, Delhi and Germany." />
      <div className="container-x py-12 md:py-16">
        <div role="group" aria-label="Filter specialists" className="no-scrollbar -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
          {filters.map((x) => (
            <button key={x.key} onClick={() => setF(x.key)} aria-pressed={f === x.key}
              className={`inline-flex min-h-[2.75rem] items-center whitespace-nowrap rounded-full border px-4 text-sm font-semibold transition ${f === x.key ? 'border-plum bg-plum text-white' : 'border-line bg-white text-ink-2 hover:border-plum/40'}`}>
              {x.label}{x.key !== 'all' && <span className="ml-1.5 opacity-60">{doctors.filter(x.match).length}</span>}
            </button>
          ))}
        </div>
        {list.length ? (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((d, i) => <Reveal key={d.slug} delay={i * 0.05}><DoctorCard d={d} /></Reveal>)}
          </div>
        ) : (
          <div className="rounded-panel border border-dashed border-line p-12 text-center">
            <p className="font-display text-2xl">No consultant chambers today.</p>
            <p className="mt-2 text-muted">The Banani centre is closed on Fridays. You can still book ahead for Saturday.</p>
            <Link to="/book" className="btn-primary mt-6">Book for another day</Link>
          </div>
        )}
      </div>
      <CTABand />
    </>
  )
}

/* Doctor profile, laid out like the reference: back pill; left column with photo, contact card and a dark weekly
   schedule; right column with About, stat cards, areas of expertise and education & experience. */

export function DoctorProfile() {
  const { slug } = useParams()
  const d = doctorBySlug(slug)
  useMeta(d ? d.name : 'Not found', d?.intro)
  // each column sticks at the top if it fits the screen, otherwise once its bottom comes into view
  const leftCol = useRef<HTMLDivElement>(null)
  const rightCol = useRef<HTMLDivElement>(null)
  const [tops, setTops] = useState<[number, number]>([112, 112])
  useEffect(() => {
    const calc = () => {
      const t = (el: HTMLDivElement | null) => (el ? Math.min(112, window.innerHeight - el.offsetHeight - 32) : 112)
      setTops([t(leftCol.current), t(rightCol.current)])
    }
    calc()
    const ro = new ResizeObserver(calc)
    if (leftCol.current) ro.observe(leftCol.current)
    if (rightCol.current) ro.observe(rightCol.current)
    window.addEventListener('resize', calc)
    return () => { ro.disconnect(); window.removeEventListener('resize', calc) }
  }, [slug])
  if (!d) return <NotFound />
  const today = dhakaDay()
  const week = [6, 0, 1, 2, 3, 4, 5]
  const available = d.schedule.length > 0

  return (
    <>
      <div className="bg-mist pb-16 pt-28 md:pb-24 md:pt-32">
        <div className="container-x">
          <Link to="/doctors" className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-full bg-white px-5 text-[0.9375rem] font-medium text-ink shadow-soft transition hover:text-plum">
            <ArrowLeft className="h-4 w-4" /> All Doctors
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[400px_1fr] lg:gap-14">
            {/* left column (sticky: whichever column ends first stays in view, then both scroll up together) */}
            <div ref={leftCol} className="space-y-6 lg:sticky lg:self-start" style={{ top: tops[0] }}>
              <Reveal className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-lilac via-[#E3D3F1] to-[#C9A6E2]">
                <img src={d.image} alt={d.name} className="mx-auto block aspect-[5/6] w-full object-contain object-bottom pt-6" />
                {available && (
                  <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[0.9375rem] font-medium text-ink shadow-soft">
                    <span className="h-2.5 w-2.5 rounded-full bg-ok" /> Available this week
                  </span>
                )}
              </Reveal>

              <Reveal className="rounded-[1.5rem] bg-white p-7 shadow-soft md:p-8">
                <h2 className="font-display text-[1.75rem] leading-tight text-ink">{d.name}</h2>
                <p className="mt-1 text-ink-2">{d.title} · {d.role}</p>
                <ul className="mt-6 space-y-4">
                  {[
                    { Icon: Phone, label: 'Phone', value: d.phone.replace('+880', '0'), href: `tel:${d.phone}` },
                    { Icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
                    { Icon: MapPin, label: 'Clinic', value: 'Banani Centre, Dhaka' },
                  ].map(({ Icon, label, value, href }) => (
                    <li key={label} className="flex items-center gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-plum text-white"><Icon className="h-5 w-5" /></span>
                      <span className="min-w-0">
                        <span className="block text-sm text-muted">{label}</span>
                        {href ? <a href={href} className="block truncate font-medium text-ink hover:text-plum">{value}</a> : <span className="block font-medium text-ink">{value}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="rounded-[1.5rem] bg-plum-900 p-7 text-paper md:p-8">
                <h3 className="font-display text-2xl !text-paper">Weekly schedule</h3>
                <ul className="mt-5">
                  {week.map((day) => {
                    const s = sessionsOn(d, day)
                    return (
                      <li key={day} className={`flex items-center justify-between gap-4 border-b border-white/15 py-3.5 text-[0.9375rem] ${day === today ? 'text-[#E7A6F0]' : ''}`}>
                        <span>{dayNames[day]}{day === today && <span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-xs">Today</span>}</span>
                        <span className={s.length ? '' : 'text-paper/50'}>{s.length ? s.map((x) => `${x.from} – ${x.to}`).join(', ') : 'Closed'}</span>
                      </li>
                    )
                  })}
                </ul>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span><span className="block text-sm text-paper/70">Chamber</span><span className="font-semibold">Banani Centre</span></span>
                  <Link to={`/book?doctor=${d.slug}`} className="btn-light !min-h-[44px] !px-5">Book Appointment</Link>
                </div>
              </Reveal>
            </div>

            {/* right column (sticky the same way) */}
            <div ref={rightCol} className="min-w-0 lg:sticky lg:self-start" style={{ top: tops[1] }}>
              <Reveal>
                <h1 className="font-display text-ink" style={{ fontSize: 'clamp(2.25rem, 1.5rem + 2.6vw, 4rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                  About <em className="text-plum">{d.name}</em>
                </h1>
                <div className="mt-6 space-y-5 text-[1.0625rem] leading-[1.75] text-ink-2">{d.about.map((p, i) => <p key={i}>{p}</p>)}</div>
              </Reveal>

              {d.stats.length > 0 && (
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {d.stats.slice(0, 3).map((st, i) => (
                    <Reveal key={st.label} delay={i * 0.06} className="rounded-[1.25rem] bg-white p-7 shadow-soft">
                      <p className="font-display text-4xl text-plum-900">{st.value}</p>
                      <p className="mt-2 text-ink-2">{st.label}</p>
                    </Reveal>
                  ))}
                </div>
              )}

              <Reveal className="mt-14">
                <h2 className="h2 text-balance">Areas of <em className="text-plum">expertise</em></h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {d.focus.map((f) => (
                    <li key={f} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-ink">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-plum text-white"><Check className="h-4 w-4" strokeWidth={2.5} /></span>{f}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="mt-14">
                <h2 className="h2 text-balance">Education &amp; <em className="text-plum">experience</em></h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {d.qualifications.map((q) => {
                    const yr = q.detail.match(/(19|20)\d{2}/)?.[0]
                    return (
                      <div key={q.title} className="flex flex-col rounded-[1.25rem] bg-lilac/60 p-6">
                        <span className="w-fit rounded-full bg-white px-3 py-1 text-sm text-ink">{yr ?? 'Training'}</span>
                        <h3 className="mt-8 text-lg font-semibold leading-snug text-ink">{q.title}</h3>
                        <p className="mt-2 text-ink-2">{q.detail}</p>
                      </div>
                    )
                  })}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      <CTABand title={`Book your consultation with ${d.short}.`} />
    </>
  )
}
