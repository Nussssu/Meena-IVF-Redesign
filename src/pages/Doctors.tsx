import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, GraduationCap, MapPin, Phone } from 'lucide-react'
import { CTABand, PageHero, RL, Reveal, useMeta } from '../components/ui'
import { DoctorCard, TodayBadge } from '../components/cards'
import { dayShort, dhakaDay, doctorBySlug, doctors, sessionsOn } from '../data/doctors'
import { treatmentBySlug } from '../data/treatments'
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

export function DoctorProfile() {
  const { slug } = useParams()
  const d = doctorBySlug(slug)
  useMeta(d ? d.name : 'Not found', d?.intro)
  const [expanded, setExpanded] = useState(false)
  if (!d) return <NotFound />
  const today = dhakaDay()
  const week = [6, 0, 1, 2, 3, 4, 5]
  const tint = d.tint === 'blush' ? 'bg-blush' : d.tint === 'mist' ? 'bg-[#E6E0EF]' : 'bg-lilac'

  return (
    <>
      <section className={`grain relative overflow-hidden ${tint}`}>
        <div className="container-x relative grid items-end gap-6 pt-28 md:pt-32 lg:grid-cols-[1.15fr_.85fr]">
          <div className="pb-12 md:pb-20">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-2/80">
              <Link to="/" className="inline-flex min-h-[2.75rem] items-center hover:text-plum">Home</Link> <span className="mx-1.5 opacity-50">/</span>
              <Link to="/doctors" className="inline-flex min-h-[2.75rem] items-center hover:text-plum">Doctors</Link>
            </nav>
            <Reveal>
              <div className="flex flex-wrap items-center gap-3"><span className="chip !bg-white">{d.title}</span><TodayBadge doctor={d} /></div>
              <h1 className="h1 mt-5 text-balance">{d.name}</h1>
              <p className="mt-3 text-lg font-medium text-plum">{d.role}</p>
              <p className="lead mt-5 max-w-xl">{d.intro}</p>
              <div className="btn-pair mt-8">
                <Link to={`/book?doctor=${d.slug}`} className="btn-primary"><RL short="Book now" long={`Book with ${d.short}`} /> <ArrowRight className="h-4 w-4" /></Link>
                <a href={`tel:${d.phone}`} className="btn-secondary !bg-white/60"><Phone className="h-4 w-4" /> <RL short="Call" long="Call for appointment" /></a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="relative mx-auto w-full max-w-[460px]">
            <div aria-hidden className="arch-full absolute inset-x-[6%] bottom-0 top-[8%] bg-white/55" />
            <img src={d.image} alt={d.name} className="relative mx-auto h-auto w-full max-w-[440px] object-contain" />
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className={`container-x grid divide-line ${d.stats.length > 2 ? 'grid-cols-2 md:grid-cols-4 md:divide-x' : 'grid-cols-2 divide-x'}`}>
          {d.stats.map((s) => (
            <div key={s.label} className="py-7 md:px-8 md:first:pl-0">
              <p className="font-display text-4xl text-ink">{s.value}</p><p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container-x grid gap-14 py-16 md:py-24 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <Reveal>
            <p className="eyebrow mb-4">About</p>
            <div className="space-y-5 text-[1.0625rem] leading-[1.75] text-ink-2">
              {(expanded ? d.about : d.about.slice(0, 1)).map((p, i) => <p key={i} className={i === 0 ? 'font-display text-[1.35rem] leading-snug text-ink' : ''}>{p}</p>)}
            </div>
            {d.about.length > 1 && <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="link-quiet mt-5">{expanded ? 'Show less' : 'Read full biography'}</button>}
          </Reveal>

          <Reveal className="mt-14">
            <h2 className="h3">Areas of expertise</h2>
            <div className="mt-5 flex flex-wrap gap-2">{d.focus.map((f) => <span key={f} className="chip !px-4 !py-2 !text-sm">{f}</span>)}</div>
            {d.treatments.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-x-5 text-sm">
                <span className="text-muted">Treatments:</span>
                {d.treatments.map((s) => { const t = treatmentBySlug(s); return t && <Link key={s} to={`/treatments/${s}`} className="inline-flex min-h-[2.75rem] items-center font-semibold text-plum hover:underline">{t.name}</Link> })}
              </div>
            )}
          </Reveal>

          <Reveal className="mt-14">
            <h2 className="h3">Qualifications &amp; training</h2>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2">
              {d.qualifications.map((q) => (
                <li key={q.title} className="flex gap-4 rounded-card border border-line bg-white p-5">
                  <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-lavender" />
                  <span><span className="block font-semibold text-ink">{q.title}</span><span className="text-sm text-muted">{q.detail}</span></span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card overflow-hidden shadow-soft">
            <div className="border-b border-line p-6">
              <p className="text-eyebrow font-semibold uppercase text-muted">Weekly chamber</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-ink-2"><MapPin className="h-4 w-4 text-lavender" />Banani Centre, Dhaka</p>
            </div>
            <ul className="divide-y divide-line">
              {week.map((day) => {
                const s = sessionsOn(d, day)
                const isToday = day === today
                return (
                  <li key={day} className={`flex items-center justify-between px-6 py-3 text-sm ${isToday ? 'bg-mist' : ''}`}>
                    <span className={`font-semibold ${s.length ? 'text-ink' : 'text-muted/60'}`}>{dayShort[day]}{isToday && <span className="ml-2 rounded-full bg-plum px-2 py-0.5 text-xs text-white">Today</span>}</span>
                    <span className={s.length ? 'font-medium text-ink' : 'text-muted/60'}>{s.length ? s.map((x) => `${x.from} – ${x.to}`).join(', ') : 'Off'}</span>
                  </li>
                )
              })}
            </ul>
            <div className="btn-pair p-6 sm:!grid sm:grid-cols-1 sm:!gap-2">
              <Link to={`/book?doctor=${d.slug}`} className="btn-primary sm:!w-full">Book<span className="hidden sm:inline">&nbsp;appointment</span></Link>
              <a href={`tel:${d.phone}`} className="btn-secondary sm:!w-full"><Phone className="h-4 w-4" /> <RL short="Call" long={d.phone.replace('+880', '0')} /></a>
            </div>
          </div>
        </aside>
      </div>

      <section className="section bg-mist">
        <div className="container-x">
          <h2 className="h2 mb-10">Other specialists</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.filter((x) => x.slug !== d.slug).map((x) => <DoctorCard key={x.slug} d={x} compact />)}
          </div>
        </div>
      </section>
    </>
  )
}
