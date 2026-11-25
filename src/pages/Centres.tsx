import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CalendarDays, Check, Clock, MapPin, Phone } from 'lucide-react'
import { CTABand, CurveHero, Reveal, SectionHeader, useMeta } from '../components/ui'
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

  return (
    <>
      <CurveHero image={c.image} alt={c.name} title={c.name} subtitle={c.summary} crumbs={[{ label: 'Centres' }, { label: c.name }]} />

      <section className="py-12 md:py-16">
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

      <section className="bg-mist py-12 md:py-16">
        {c.slug === 'banani' ? (
        /* Banani keeps the original card grid */
        <div className="container-x">
          <SectionHeader title={<>Care available at <em className="text-plum">{c.city}</em></>} text={`Best for: ${c.bestFor}.`} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.services.map((sv, i) => (
              <Reveal as="li" key={sv} delay={(i % 4) * 0.05} className="group card flex cursor-default items-center gap-3 p-5 transition duration-300 hover:border-plum/40 hover:shadow-lift">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lilac text-plum transition duration-300 group-hover:bg-plum group-hover:text-white"><Check className="h-4 w-4" /></span>
                <span className="font-medium transition duration-300 group-hover:text-plum">{sv}</span>
              </Reveal>
            ))}
          </ul>
        </div>
        ) : (
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          {/* Left: heading */}
          <Reveal>
            <h2 className="h2 max-w-md text-balance">Care available at <em className="text-plum">{c.city}</em></h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-2">Best for: {c.bestFor}.</p>
          </Reveal>
          {/* Right: numbered list of services in one card */}
          <Reveal delay={0.1} className="card rounded-panel px-5 py-1 md:px-10 md:py-2">
            <ul className="divide-y divide-line">
              {c.services.map((sv, i) => (
                <li key={sv} className="group flex cursor-default items-center gap-5 py-4 md:gap-8 md:py-6">
                  <span className="w-6 shrink-0 font-display text-sm text-plum/50 transition duration-300 group-hover:text-plum">{String(i + 1).padStart(2, '0')}</span>
                  <span className="min-w-0 flex-1 font-display text-xl leading-snug text-ink transition duration-300 group-hover:text-plum md:text-[1.75rem]">{sv}</span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lilac text-plum transition duration-300 group-hover:bg-plum group-hover:text-white"><Check className="h-4 w-4" /></span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        )}
      </section>

      {c.gallery && (
        <section className="py-12 md:py-16">
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

      <section className={`bg-mist py-12 md:py-16 ${c.gallery ? '' : 'pt-0 md:pt-0 lg:pt-0'}`}>
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
