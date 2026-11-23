import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, CalendarDays, Check, Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { CTABand, PageHero, Reveal, SectionHeader, useMeta } from '../components/ui'
import { centres, nextMonthly } from '../data/content'
import { site } from '../data/site'
import { scrollToHash } from '../lib/smooth'

const fmt = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

export default function Centres() {
  useMeta('Our centres', 'Meena IVF centres: Banani main treatment centre in Dhaka, and regional OPDs in Khulna and Cumilla.')
  const { hash } = useLocation()
  useEffect(() => { if (hash) scrollToHash(hash.slice(1), -80) }, [hash])

  return (
    <>
      <PageHero crumbs={[{ label: 'Centres' }]} eyebrow="Our centres" image="/img/reception.webp"
        title={<>Premium fertility care, designed for <em className="text-plum">access</em> and trust.</>}
        text="Advanced treatment at our Banani hub, with consultation-focused OPD access in Khulna and Cumilla, each designed to support you with care and clarity.">
        <Link to="/book" className="btn-primary">Book appointment</Link>
      </PageHero>

      <section className="section">
        <div className="container-x">
          <SectionHeader eyebrow="How to start" title="Begin at the centre nearest you." />
          <ol className="grid gap-4 md:grid-cols-3">
            {[['Choose your nearest centre', 'Start from the most convenient centre or OPD based on where you live.'], ['Get a fertility evaluation', 'Discuss your history, concerns and next steps with a specialist.'], ['Move to next-step care', 'Continue follow-up locally, or proceed to advanced treatment in Banani.']].map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 0.08} className="card p-7">
                <span className="font-display text-4xl italic text-lavender">0{i + 1}</span>
                <h3 className="mt-4 font-display text-xl">{t}</h3><p className="mt-2 text-ink-2">{d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {centres.map((c, i) => {
        const next = c.monthly ? nextMonthly(c.monthly.nth, c.monthly.day, 3) : []
        return (
          <section key={c.slug} id={c.slug} className={`section ${i % 2 === 0 ? 'bg-mist' : ''}`}>
            <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal>
                <p className="eyebrow mb-4">{c.kind}</p>
                <h2 className="h2">{c.name}</h2>
                <p className="mt-4 text-lg text-ink-2">{c.summary}</p>
                <dl className="mt-8 space-y-5">
                  <div className="flex gap-4"><MapPin className="mt-1 h-5 w-5 shrink-0 text-plum" /><div>{c.venue && <dt className="font-semibold">{c.venue}</dt>}<dd className="text-ink-2">{c.address}</dd><dd lang="bn" className="font-bn text-muted">{c.venueBn ? `${c.venueBn}, ` : ''}{c.addressBn}</dd></div></div>
                  <div className="flex gap-4"><Clock className="mt-1 h-5 w-5 shrink-0 text-plum" /><div><dt className="font-semibold">Visiting</dt><dd className="text-ink-2">{c.schedule}</dd></div></div>
                  {next.length > 0 && (
                    <div className="flex gap-4"><CalendarDays className="mt-1 h-5 w-5 shrink-0 text-plum" /><div><dt className="font-semibold">Upcoming OPD dates</dt>
                      <dd className="mt-2 flex flex-wrap gap-2">{next.map((d, k) => <span key={k} className={`rounded-full px-3 py-1 text-sm font-semibold ${k === 0 ? 'bg-plum text-white' : 'bg-white text-ink ring-1 ring-line'}`}>{fmt(d)}</span>)}</dd></div></div>
                  )}
                </dl>
                <ul className="mt-8 grid gap-2 sm:grid-cols-2">{c.services.map((s) => <li key={s} className="flex items-center gap-2 text-[0.9375rem]"><Check className="h-4 w-4 text-plum" />{s}</li>)}</ul>
                <div className="btn-pair mt-9">
                  <Link to="/book" className="btn-primary">Book at {c.city} <ArrowRight className="h-4 w-4" /></Link>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.map)}`} target="_blank" rel="noreferrer" className="btn-secondary"><Navigation className="h-4 w-4" /> Directions</a>
                </div>
              </Reveal>
              <Reveal delay={0.1} className="grid gap-4">
                <div className="overflow-hidden rounded-panel"><img src={c.image} alt={c.name} loading="lazy" className="aspect-[16/10] w-full object-cover" /></div>
                {c.slug === 'banani' && (
                  <div className="grid grid-cols-3 gap-4">{['banani-1', 'banani-2', 'banani-3'].map((b) => <img key={b} src={`/img/${b}.webp`} alt="Inside the Banani centre" loading="lazy" className="aspect-[4/3] w-full rounded-card object-cover" />)}</div>
                )}
                <iframe title={`Map of ${c.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-64 w-full rounded-panel border border-line grayscale-[30%]"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(c.map)}&z=15&output=embed`} />
              </Reveal>
            </div>
          </section>
        )
      })}

      <section className="section">
        <div className="container-x">
          <SectionHeader align="center" eyebrow="Centre overview" title="Which centre fits which need?" />
          <div className="overflow-x-auto rounded-panel border border-line bg-white">
            <table className="w-full min-w-[640px] text-left text-[0.9375rem]">
              <thead className="bg-mist"><tr>{['', 'Banani', 'Khulna OPD', 'Cumilla OPD'].map((h) => <th key={h} scope="col" className="px-6 py-4 font-display text-lg font-normal">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-line">
                {[['Consultation', true, true, true], ['Initial evaluation & history review', true, true, true], ['Follow-up visits', true, true, true], ['Ultrasound & diagnostics', true, false, false], ['IVF / ICSI / IUI procedures', true, false, false], ['In-house OT & embryology lab', true, false, false], ['Schedule', 'Sat – Thu', '2nd Friday monthly', '2nd Tuesday monthly']].map(([r, ...v]) => (
                  <tr key={r as string}><th scope="row" className="px-6 py-4 font-semibold">{r as string}</th>{v.map((x, k) => <td key={k} className="px-6 py-4">{typeof x === 'string' ? x : x ? <Check className="h-5 w-5 text-ok" aria-label="Yes" /> : <span className="text-sm text-muted">Not here</span>}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-center text-sm text-muted">Questions about where to begin? Call <a href={site.phone2Href} className="font-semibold text-plum">{site.phone2}</a> or <a href={site.hotlineHref} className="font-semibold text-plum"><Phone className="inline h-3.5 w-3.5" /> {site.hotline}</a></p>
        </div>
      </section>
      <CTABand />
    </>
  )
}
