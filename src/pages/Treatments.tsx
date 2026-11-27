import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowUpRight, CalendarCheck, Check, Phone } from 'lucide-react'
import { Accordion, CTABand, CurveHero, PageHero, RL, Reveal, SectionHeader, SliderArrows, TwoTone, useMeta } from '../components/ui'
import { TodayBadge, TreatmentCard } from '../components/cards'
import { StepAnimation } from '../components/StepAnimation'
import { byGroup, groups, treatmentBySlug } from '../data/treatments'
import { doctors, scheduleSummary } from '../data/doctors'
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
                <h2 className="h2 mt-3 text-balance"><TwoTone text={g.title} /></h2>
                <p className="mt-3 text-ink-2">{g.blurb}</p>
              </Reveal>
              {/* phones: swipe slider (m-slider); tablet/desktop: three across */}
              <div className="m-slider grid gap-4 md:grid-cols-3">
                {byGroup(g.key).map((t, i) => <Reveal key={t.slug} delay={i * 0.06} className="[&>*]:h-full"><TreatmentCard t={t} index={i} /></Reveal>)}
              </div>
              <SliderArrows label="treatments" />
            </div>
          </section>
        ))}
      </div>
      <CTABand title="Not sure which treatment is right?" text="Most journeys begin with a careful evaluation of both partners. Book a consultation and we will recommend only what you need." />
    </>
  )
}

/** Hero photo per treatment, from the site's own image library */
const heroImage: Record<string, string> = {
  ivf: '/img/embryo-1.webp', icsi: '/img/semen-2.webp', iui: '/img/couple-doctor.webp',
  'egg-freezing': '/img/egg-1.webp', 'semen-freezing': '/img/semen-3.webp', 'embryo-freezing': '/img/embryo-3.webp',
  folliculometry: '/img/folliculometry.webp', tvs: '/img/egg-3.webp', 'ssg-sis': '/img/ssg.webp',
  laparoscopy: '/img/laparoscopy.webp', hysteroscopy: '/img/embryo-4.webp', 'laparoscopic-myomectomy': '/img/journey-preparing.webp',
  tesa: '/img/semen-1.webp', 'trial-tesa': '/img/semen-4.webp', pesa: '/img/embryo-2.webp',
  'psychological-counseling': '/img/journey-conceive.webp', 'financial-counseling': '/img/consult.webp', 'medical-history-evaluation': '/img/egg-4.webp',
}

/** Warm, relatable photo beside the benefits list on each treatment page */
const benefitImage: Record<string, string> = {
  ivf: '/img/hero-family.webp', icsi: '/img/hero-video-poster.webp', iui: '/img/journey-miscarriage.webp',
  'egg-freezing': '/img/egg-2.webp', 'semen-freezing': '/img/journey-freezing.webp', 'embryo-freezing': '/img/hero-video-poster.webp',
  folliculometry: '/img/tvs.webp', tvs: '/img/couple-doctor.webp', 'ssg-sis': '/img/consult.webp',
  laparoscopy: '/img/patient-care.webp', hysteroscopy: '/img/patient-care.webp', 'laparoscopic-myomectomy': '/img/hero-family.webp',
  tesa: '/img/couple-doctor.webp', 'trial-tesa': '/img/consult.webp', pesa: '/img/journey-miscarriage.webp',
  'psychological-counseling': '/img/journey-miscarriage.webp', 'financial-counseling': '/img/couple-doctor.webp', 'medical-history-evaluation': '/img/consult.webp',
}

export function TreatmentDetail() {
  const { slug } = useParams()
  const t = treatmentBySlug(slug)
  useMeta(t ? `${t.name} (${t.full})` : 'Not found', t?.short)
  if (!t) return <NotFound />
  const docs = doctors.filter((d) => d.treatments.includes(t.slug))
  const supportTeam = t.group === 'support' ? team.find((x) => x.key === 'coordination')!.members : []

  return (
    <>
      <CurveHero image={heroImage[t.slug] ?? t.image ?? '/img/consult.webp'} title={t.name} subtitle={t.short} />

      {/* In short + Who it can help, with the specialist card alongside */}
      <div className="container-x grid gap-14 pt-16 md:pt-24 lg:grid-cols-[1fr_340px]">
        <article className="min-w-0">
          <Reveal id="in-short" className="">
            <p className="eyebrow mb-4">In short</p>
            {/* phones: justified (hyphenated so narrow lines don't open wide gaps); 768px+ stays left-aligned */}
            <div className="space-y-5 text-[1.125rem] leading-[1.75] text-ink-2 max-md:text-justify max-md:[hyphens:auto]">
              {t.intro.map((p, i) => <p key={i} className={i === 0 ? 'font-display text-[1.45rem] leading-snug text-ink' : ''}>{p}</p>)}
            </div>
          </Reveal>

          <Reveal id="who" className="mt-16">
            <h2 className="h2 text-balance">Who it can <em className="text-plum">help</em></h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {t.whoFor.map((w) => (
                <li key={w} className="flex items-start gap-3 rounded-card border border-line bg-white p-4">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lilac text-plum"><Check className="h-3.5 w-3.5" strokeWidth={2.5} /></span>
                  <span className="text-[0.9375rem] text-ink">{w}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </article>

        {/* "Talk to a specialist" card: hidden on phones (768px+ shows it) */}
        <aside className="hidden md:block lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6 shadow-soft">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-lilac text-plum"><CalendarCheck className="h-5 w-5" /></span>
            <p className="mt-5 font-display text-2xl leading-tight">Talk to a specialist about {t.name}.</p>
            <p className="mt-2 text-sm text-muted">We will review your history and explain whether {t.name} is right for you.</p>
            <div className="btn-pair mt-6 sm:!grid sm:grid-cols-1 sm:!gap-2">
              <Link to={`/book?treatment=${t.slug}`} className="btn-primary sm:!w-full">Book<span className="hidden sm:inline">&nbsp;appointment</span></Link>
              <a href={site.hotlineHref} className="btn-secondary sm:!w-full"><Phone className="h-4 w-4" /> <RL short="Call" long={site.hotline} /></a>
            </div>
          </div>
        </aside>
      </div>

      <section id="how" className="mt-16">
        <StepAnimation slug={t.slug} steps={t.steps} />
      </section>

      {/* Benefits: soft lilac band; heading on top, checked list on the left, photo on the right lined up with the list */}
      <section id="benefits" className="mt-16 bg-[#F4EAF8] py-14 md:py-20">
        <Reveal className="container-x grid gap-x-12 gap-y-8 md:grid-cols-[1fr_1.15fr] lg:gap-x-16">
          <h2 className="h2 text-balance md:col-start-1">
            Benefits of <em className="text-plum">{t.name}</em>
          </h2>
          <ul className="divide-y divide-plum/15 md:col-start-1 md:row-start-2 md:self-center">
            {t.benefits.map((b) => (
              <li key={b} className="flex items-center gap-5 py-5 first:pt-0 last:pb-0 text-[1.125rem] leading-snug text-ink md:text-[1.25rem]">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#E7D3EE] text-plum"><Check className="h-5 w-5" strokeWidth={2.5} /></span>
                {b}
              </li>
            ))}
          </ul>
          <div className="relative min-h-[16rem] overflow-hidden rounded-[1.5rem] md:col-start-2 md:row-start-2 md:min-h-0">
            <img src={benefitImage[t.slug] ?? '/img/hero-family.webp'} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </Reveal>
      </section>

      {t.faqs && (
        <div className="container-x grid gap-14 pb-16 pt-16 md:pb-24 lg:grid-cols-[1fr_340px]">
          <article className="min-w-0">
            <Reveal id="faq">
              <h2 className="h2 mb-6 text-balance">Common <em className="text-plum">questions</em></h2>
              <Accordion items={t.faqs} defaultOpen={0} />
            </Reveal>
          </article>
        </div>
      )}

      {docs.length > 0 && (
        <section className="section bg-white">
          <div className="container-x">
            <SectionHeader eyebrow="Your specialists" title={`Consultants for ${t.name}`} />
            {/* phones: swipe slider (next card peeks in) when there are two or more specialists; a single card stays a
                normal full-width card. Tablet/desktop: grid */}
            <div className={`${docs.length > 1 ? 'm-slider ' : ''}grid gap-8 sm:grid-cols-2 lg:grid-cols-4`}>
              {docs.map((d) => <Reveal key={d.slug}><SpecialistCard d={d} /></Reveal>)}
            </div>
            {docs.length > 1 && <SliderArrows label="specialists" />}
          </div>
        </section>
      )}
      {supportTeam.length > 0 && (
        // tablet/desktop: both sections are white, so drop this one's top padding to close the gap under "Your specialists"
        <section className={`section bg-white max-md:bg-mist${docs.length > 0 ? ' md:pt-0 lg:pt-0' : ''}`}>
          {/* phones: lavender background, members in a swipe slider with arrows; tablet/desktop: white background, grid of
              cards in the same design as "Your specialists" above */}
          <div className="container-x">
            <SectionHeader eyebrow="Your support team" title="People who will guide you" />
            <div className="m-slider grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
              {supportTeam.map((m) => (
                <div key={m.name}>
                  {/* phones */}
                  <div className="md:hidden">
                    <img src={`/img/${m.img}.webp`} alt={m.name} loading="lazy" className="aspect-[4/5] w-full rounded-card object-cover object-top" />
                    <p className="mt-3 font-semibold">{m.name}</p><p className="text-sm text-muted">{m.role}</p>
                  </div>
                  {/* tablet/desktop: same card as SpecialistCard (lilac backdrop, arch behind the photo); the photos have a
                      white background, so multiply lets the lilac and the arch show through it */}
                  <Reveal className="group hidden md:block">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-lilac">
                      <div aria-hidden className="arch-full absolute inset-x-[13%] bottom-0 top-[5%] bg-white/55" />
                      <img src={`/img/${m.img}.webp`} alt={m.name} loading="lazy" className="absolute inset-x-0 bottom-0 mx-auto h-[94%] w-auto object-contain object-bottom mix-blend-multiply transition duration-700 ease-out group-hover:scale-[1.03]" />
                    </div>
                    <p className="mt-4 text-xs font-semibold text-plum">{m.role}</p>
                    <h3 className="mt-1.5 font-display text-[1.45rem] leading-tight">{m.name}</h3>
                  </Reveal>
                </div>
              ))}
            </div>
            <SliderArrows label="team members" />
          </div>
        </section>
      )}
      <div className="pt-16 md:pt-24"><CTABand /></div>
    </>
  )
}

/* Specialist card for treatment pages: one lavender backdrop for everyone, arch behind the photo, arrow button bottom-right */
function SpecialistCard({ d }: { d: (typeof doctors)[number] }) {
  return (
    <article className="group">
      <Link to={`/doctors/${d.slug}`} aria-label={`${d.name}, ${d.title}`} className="relative block aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-lilac">
        <div aria-hidden className="arch-full absolute inset-x-[13%] bottom-0 top-[5%] bg-white/55" />
        <img src={d.image} alt={d.name} loading="lazy" className="absolute inset-x-0 bottom-0 mx-auto h-[94%] w-auto object-contain object-bottom transition duration-700 ease-out group-hover:scale-[1.03]" />
        <div className="absolute left-3 top-3"><TodayBadge doctor={d} /></div>
        <span className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-plum text-white shadow-soft transition group-hover:bg-plum-700"><ArrowUpRight className="h-5 w-5" /></span>
      </Link>
      <p className="mt-4 text-xs font-semibold text-plum">{d.title} · {d.experience}+ yrs</p>
      <h3 className="mt-1.5 font-display text-[1.45rem] leading-tight"><Link to={`/doctors/${d.slug}`} className="hover:text-plum">{d.name}</Link></h3>
      <p className="mt-2 text-sm text-muted">{scheduleSummary(d)}</p>
    </article>
  )
}
