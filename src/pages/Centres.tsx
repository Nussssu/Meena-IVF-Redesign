import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CalendarDays, Check, Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { CTABand, PageHero, Reveal, SectionHeader, useMeta } from '../components/ui'
import { centres, nextMonthly } from '../data/content'
import { site } from '../data/site'
import NotFound from './NotFound'

const fmt = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

export function CentreDetail() {
  const { slug } = useParams()
  const c = centres.find((x) => x.slug === slug)
  useMeta(c ? c.name : 'Centre not found', c ? `${c.name}, ${c.city}: ${c.summary}` : '')
  if (!c) return <NotFound />
  const next = c.monthly ? nextMonthly(c.monthly.nth, c.monthly.day, 3) : []
  const others = centres.filter((x) => x.slug !== c.slug)
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.map)}`

  return (
    <>
      <PageHero crumbs={[{ label: 'Centres' }, { label: c.name }]} eyebrow={c.kind} image={c.image}
        title={<>{c.name.replace(/ (Centre|OPD)$/, '')} <em className="text-plum">{c.name.match(/(Centre|OPD)$/)?.[0] ?? ''}</em></>}
        text={c.summary}>
        <Link to="/book" className="btn-primary">Book at {c.city} <ArrowRight className="h-4 w-4" /></Link>
        <a href={directions} target="_blank" rel="noreferrer" className="btn-secondary"><Navigation className="h-4 w-4" /> Directions</a>
      </PageHero>

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeader eyebrow="Visit us" title="Where and when" />
            <dl className="-mt-4 space-y-5">
              <div className="flex gap-4"><MapPin className="mt-1 h-5 w-5 shrink-0 text-plum" /><div>{c.venue && <dt className="font-semibold">{c.venue}</dt>}<dd className="text-ink-2">{c.address}</dd><dd lang="bn" className="font-bn text-muted">{c.venueBn ? `${c.venueBn}, ` : ''}{c.addressBn}</dd></div></div>
              <div className="flex gap-4"><Clock className="mt-1 h-5 w-5 shrink-0 text-plum" /><div><dt className="font-semibold">Visiting</dt><dd className="text-ink-2">{c.schedule}</dd></div></div>
              {next.length > 0 && (
                <div className="flex gap-4"><CalendarDays className="mt-1 h-5 w-5 shrink-0 text-plum" /><div><dt className="font-semibold">Upcoming OPD dates</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">{next.map((d, k) => <span key={k} className={`rounded-full px-3 py-1 text-sm font-semibold ${k === 0 ? 'bg-plum text-white' : 'bg-white text-ink ring-1 ring-line'}`}>{fmt(d)}</span>)}</dd></div></div>
              )}
              <div className="flex gap-4"><Phone className="mt-1 h-5 w-5 shrink-0 text-plum" /><div><dt className="font-semibold">Call to book</dt><dd className="text-ink-2"><a href={site.hotlineHref} className="hover:text-plum">{site.hotline}</a> · <a href={site.phone2Href} className="hover:text-plum">{site.phone2}</a></dd></div></div>
            </dl>
          </Reveal>
          <Reveal delay={0.1}>
            <iframe title={`Map of ${c.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-80 w-full rounded-panel border border-line grayscale-[30%] lg:h-full lg:min-h-[22rem]"
              src={`https://www.google.com/maps?q=${encodeURIComponent(c.map)}&z=15&output=embed`} />
          </Reveal>
        </div>
      </section>

      <section className="section bg-mist">
        <div className="container-x">
          <SectionHeader eyebrow="What you can do here" title={<>Care available at <em className="text-plum">{c.city}</em></>} text={`Best for: ${c.bestFor}.`} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.services.map((sv, i) => (
              <Reveal as="li" key={sv} delay={(i % 4) * 0.05} className="card flex items-center gap-3 p-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lilac text-plum"><Check className="h-4 w-4" /></span>
                <span className="font-medium">{sv}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {c.gallery && (
        <section className="section">
          <div className="container-x">
            <SectionHeader eyebrow="Inside the centre" title={<>Take a look <em className="text-plum">around</em></>} />
            <div className="grid gap-4 sm:grid-cols-3">
              {c.gallery.map((g, i) => (
                <Reveal key={g} delay={i * 0.06} className="overflow-hidden rounded-panel">
                  <img src={g} alt={`Inside ${c.name}`} loading="lazy" className="aspect-[3/4] w-full object-cover transition duration-700 hover:scale-105" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`section ${c.gallery ? 'bg-mist' : ''}`}>
        <div className="container-x">
          <SectionHeader eyebrow="Other centres" title="Closer to you, wherever you are." />
          <div className="grid gap-5 md:grid-cols-2">
            {others.map((o) => (
              <Link key={o.slug} to={`/centres/${o.slug}`} className="group card card-hover flex items-center gap-5 overflow-hidden p-3 pr-6">
                <img src={o.image} alt="" loading="lazy" className="h-28 w-36 shrink-0 rounded-card object-cover" />
                <div className="min-w-0">
                  <p className="text-eyebrow font-semibold uppercase text-plum">{o.kind}</p>
                  <h3 className="mt-1 font-display text-2xl">{o.name}</h3>
                  <p className="mt-1 truncate text-sm text-muted">{o.schedule}</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-plum transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CTABand />
    </>
  )
}
