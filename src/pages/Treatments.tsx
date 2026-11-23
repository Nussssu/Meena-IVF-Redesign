import { useEffect, useState } from 'react'
import { ImageReveal } from '../components/motion'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowRight, CalendarCheck, Check, Phone } from 'lucide-react'
import { Accordion, CTABand, PageHero, RL, Reveal, SectionHeader, useMeta } from '../components/ui'
import { DoctorCard, TreatmentCard } from '../components/cards'
import { byGroup, groups, treatmentBySlug, treatments } from '../data/treatments'
import { doctors } from '../data/doctors'
import { team } from '../data/content'
import { site } from '../data/site'
import NotFound from './NotFound'
import { scrollToHash, scrollToTarget } from '../lib/smooth'

export function TreatmentsHub() {
  useMeta('Treatments', 'Explore 18 fertility treatments at Meena IVF: IVF, ICSI, IUI, egg, semen and embryo freezing, diagnostics, surgical and male fertility procedures, and support services.')
  const { hash } = useLocation()
  const [active, setActive] = useState(groups[0].key)

  useEffect(() => {
    if (hash) scrollToHash(hash.slice(1), -150)
  }, [hash])

  useEffect(() => {
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id as typeof active)), { rootMargin: '-40% 0px -55% 0px' })
    groups.forEach((g) => { const el = document.getElementById(g.key); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <PageHero crumbs={[{ label: 'Treatments' }]} eyebrow="Our services" title={<>Advanced fertility care, designed around <em className="text-plum">hope</em>, precision and care.</>}
        text="Eighteen services across treatment, preservation, diagnostics, surgery, male fertility and support, organised so you can see your whole journey in one place.">
        <Link to="/book" className="btn-primary"><RL short="Book now" long="Book a consultation" /></Link>
        <a href={site.hotlineHref} className="btn-secondary"><Phone className="h-4 w-4" /> <RL short="Ask us" long="Ask which is right for me" /></a>
      </PageHero>

      <div className="sticky top-[72px] z-30 border-b border-line bg-paper/90 backdrop-blur-xl">
        <nav aria-label="Treatment groups" className="container-x no-scrollbar flex gap-1 overflow-x-auto py-3">
          {groups.map((g) => (
            <a key={g.key} href={`#${g.key}`} onClick={(e) => { e.preventDefault(); scrollToTarget(g.key, { offset: -150 }) }}
              className={`inline-flex min-h-[2.75rem] items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold transition ${active === g.key ? 'bg-plum text-white' : 'text-ink-2 hover:bg-mist'}`}>{g.label}</a>
          ))}
        </nav>
      </div>

      <div className="container-x py-12 md:py-16">
        {groups.map((g, gi) => (
          <section key={g.key} id={g.key} className=" border-b border-line py-12 last:border-0 md:py-16">
            <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-14">
              <Reveal>
                <p className="font-display text-sm text-muted">0{gi + 1} / 06</p>
                <p className="eyebrow mt-3">{g.label}</p>
                <h2 className="h3 mt-3 text-balance md:text-[2rem]">{g.title}</h2>
                <p className="mt-3 text-ink-2">{g.blurb}</p>
              </Reveal>
              <div className="grid gap-4 md:grid-cols-3">
                {byGroup(g.key).map((t, i) => <Reveal key={t.slug} delay={i * 0.06}><TreatmentCard t={t} index={i} /></Reveal>)}
              </div>
            </div>
          </section>
        ))}
      </div>
      <CTABand title="Not sure which treatment is right?" text="Most journeys begin with a careful evaluation of both partners. Book a consultation and we will recommend only what you need." />
    </>
  )
}

export function TreatmentDetail() {
  const { slug } = useParams()
  const t = treatmentBySlug(slug)
  useMeta(t ? `${t.name} (${t.full})` : 'Not found', t?.short)
  if (!t) return <NotFound />
  const group = groups.find((g) => g.key === t.group)!
  const docs = doctors.filter((d) => d.treatments.includes(t.slug))
  const related = treatments.filter((x) => x.group === t.group && x.slug !== t.slug)
  const supportTeam = t.group === 'support' ? team.find((x) => x.key === 'coordination')!.members : []

  return (
    <>
      <section className="grain relative overflow-hidden bg-mist">
        <div aria-hidden className="pointer-events-none absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(closest-side,rgba(128,41,143,.10),transparent)]" />
        <div className="container-x relative grid gap-10 pb-14 pt-32 md:pb-20 md:pt-40 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <div>
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
              <Link to="/" className="inline-flex min-h-[2.75rem] items-center hover:text-plum">Home</Link> <span className="mx-1.5 opacity-50">/</span>
              <Link to="/treatments" className="inline-flex min-h-[2.75rem] items-center hover:text-plum">Treatments</Link> <span className="mx-1.5 opacity-50">/</span>
              <Link to={`/treatments#${group.key}`} className="inline-flex min-h-[2.75rem] items-center hover:text-plum">{group.label}</Link>
            </nav>
            <Reveal>
              <p className="eyebrow mb-5">{t.full}</p>
              <h1 className="display">{t.name}</h1>
              <p className="lead mt-6 max-w-2xl text-pretty">{t.short}</p>
              <div className="btn-pair mt-8">
                <Link to={`/book?treatment=${t.slug}`} className="btn-primary"><RL short="Book now" long="Book a consultation" /> <ArrowRight className="h-4 w-4" /></Link>
                <a href={site.hotlineHref} className="btn-secondary"><Phone className="h-4 w-4" /> <RL short="Call us" long={site.hotline} /></a>
              </div>
            </Reveal>
          </div>
          {t.facts && (
            <Reveal delay={0.15}>
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-line bg-line">
                {t.facts.map((f, i) => (
                  <div key={f.label} className={`bg-white p-5 ${t.facts!.length % 2 && i === t.facts!.length - 1 ? 'col-span-2' : ''}`}>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{f.label}</dt>
                    <dd className="mt-1 font-display text-2xl text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>
      </section>

      <div className="container-x grid gap-14 py-16 md:py-24 lg:grid-cols-[1fr_340px]">
        <article className="min-w-0">
          <Reveal id="in-short" className="">
            <p className="eyebrow mb-4">In short</p>
            <div className="space-y-5 text-[1.125rem] leading-[1.75] text-ink-2">
              {t.intro.map((p, i) => <p key={i} className={i === 0 ? 'font-display text-[1.45rem] leading-snug text-ink' : ''}>{p}</p>)}
            </div>
          </Reveal>

          {t.image && <ImageReveal src={t.image} className="mt-12 aspect-[16/9] rounded-panel" />}

          <Reveal id="who" className="mt-16">
            <h2 className="h3 md:text-[2rem]">Who it can help</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {t.whoFor.map((w) => (
                <li key={w} className="flex items-start gap-3 rounded-card border border-line bg-white p-4">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lilac text-plum"><Check className="h-3.5 w-3.5" strokeWidth={2.5} /></span>
                  <span className="text-[0.9375rem] text-ink">{w}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal id="how" className="mt-16">
            <h2 className="h3 md:text-[2rem]">How it works</h2>
            <ol className="relative mt-8 space-y-0 border-l border-line pl-8">
              {t.steps.map((s, i) => (
                <li key={s.title} className="relative pb-9 last:pb-0">
                  <span className="absolute -left-[49px] grid h-8 w-8 place-items-center rounded-full border border-plum bg-paper font-display text-sm text-plum">{i + 1}</span>
                  <h3 className="font-sans text-lg font-semibold tracking-normal">{s.title}</h3>
                  <p className="mt-1.5 text-ink-2">{s.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal id="benefits" className="mt-16">
            <div className="rounded-panel bg-plum-900 p-8 text-paper md:p-10">
              <h2 className="font-display text-2xl !text-paper md:text-3xl">Benefits</h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {t.benefits.map((b) => <li key={b} className="flex items-start gap-3 text-paper/85"><Check className="mt-1 h-4 w-4 shrink-0 text-lilac" />{b}</li>)}
              </ul>
            </div>
          </Reveal>

          {t.faqs && (
            <Reveal id="faq" className="mt-16">
              <h2 className="h3 mb-6 md:text-[2rem]">Common questions</h2>
              <Accordion items={t.faqs} defaultOpen={0} />
            </Reveal>
          )}
        </article>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <SectionIndex items={[['in-short', 'In short'], ['who', 'Who it helps'], ['how', 'How it works'], ['benefits', 'Benefits'], ...(t.faqs ? [['faq', 'Questions'] as [string, string]] : [])]} />
          <div className="card p-6 shadow-soft">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-lilac text-plum"><CalendarCheck className="h-5 w-5" /></span>
            <p className="mt-5 font-display text-2xl leading-tight">Talk to a specialist about {t.name}.</p>
            <p className="mt-2 text-sm text-muted">We will review your history and explain whether {t.name} is right for you.</p>
            <div className="btn-pair mt-6 sm:!grid sm:grid-cols-1 sm:!gap-2">
              <Link to={`/book?treatment=${t.slug}`} className="btn-primary sm:!w-full">Book<span className="hidden sm:inline">&nbsp;appointment</span></Link>
              <a href={site.hotlineHref} className="btn-secondary sm:!w-full"><Phone className="h-4 w-4" /> <RL short="Call" long={site.hotline} /></a>
            </div>
          </div>
          {related.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-eyebrow font-semibold uppercase text-muted">Also in {group.label.toLowerCase()}</p>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.slug}><Link to={`/treatments/${r.slug}`} className="group flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 transition hover:border-plum">
                    <span><span className="block font-semibold group-hover:text-plum">{r.name}</span><span className="text-xs text-muted">{r.full}</span></span>
                    <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-plum" />
                  </Link></li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {docs.length > 0 && (
        <section className="section bg-blush/60">
          <div className="container-x">
            <SectionHeader eyebrow="Your specialists" title={`Consultants for ${t.name}`} />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {docs.map((d) => <Reveal key={d.slug}><DoctorCard d={d} /></Reveal>)}
            </div>
          </div>
        </section>
      )}
      {supportTeam.length > 0 && (
        <section className="section bg-blush/60">
          <div className="container-x">
            <SectionHeader eyebrow="Your support team" title="People who will guide you" />
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              {supportTeam.map((m) => (
                <div key={m.name}>
                  <img src={`/img/${m.img}.webp`} alt={m.name} loading="lazy" className="aspect-[4/5] w-full rounded-card object-cover object-top" />
                  <p className="mt-3 font-semibold">{m.name}</p><p className="text-sm text-muted">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <div className="pt-16 md:pt-24"><CTABand /></div>
    </>
  )
}

function SectionIndex({ items }: { items: [string, string][] }) {
  const [active, setActive] = useState(items[0][0])
  useEffect(() => {
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-35% 0px -60% 0px' })
    items.forEach(([id]) => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => i[0]).join()])
  return (
    <nav aria-label="On this page" className="mb-6 hidden lg:block">
      <p className="mb-3 text-eyebrow font-semibold uppercase text-muted">On this page</p>
      <ol className="relative border-l border-line">
        {items.map(([id, label], i) => (
          <li key={id}>
            <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToTarget(id, { offset: -100 }) }} aria-current={active === id ? 'location' : undefined}
              className={`-ml-px flex min-h-[2.75rem] items-center gap-3 border-l-2 pl-4 text-sm transition duration-200 ${active === id ? 'border-plum font-semibold text-plum' : 'border-transparent text-ink-2 hover:text-plum'}`}>
              <span className="font-display text-xs text-muted">0{i + 1}</span>{label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
