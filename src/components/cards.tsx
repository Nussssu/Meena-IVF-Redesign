import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Clock, Quote } from 'lucide-react'
import { type Doctor, dhakaDay, scheduleSummary, sessionsOn } from '../data/doctors'
import type { Treatment } from '../data/treatments'

const tintBg = { lilac: 'bg-lilac', blush: 'bg-blush', mist: 'bg-[#E6E0EF]' } as const

export function TodayBadge({ doctor }: { doctor: Doctor }) {
  const today = sessionsOn(doctor, dhakaDay())
  if (!today.length) return null
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ok shadow-soft backdrop-blur">
      <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok/60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-ok" /></span>
      In clinic today · {today[0].from}
    </span>
  )
}

export function DoctorCard({ d, compact = false }: { d: Doctor; compact?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col">
      <Link to={`/doctors/${d.slug}`} className="relative block overflow-hidden rounded-card" aria-label={`${d.name}, ${d.title}`}>
        <div className={`relative aspect-[4/5] overflow-hidden ${tintBg[d.tint]}`}>
          <div aria-hidden className="arch-full absolute inset-x-[10%] bottom-0 top-[14%] bg-white/50" />
          <img src={d.image} alt={d.name} loading="lazy" className="absolute inset-x-0 bottom-0 mx-auto h-[94%] w-auto object-contain object-bottom transition duration-700 ease-out group-hover:scale-[1.03]" />
          <div className="absolute left-3 top-3"><TodayBadge doctor={d} /></div>
          <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-plum opacity-0 shadow-soft transition group-hover:opacity-100"><ArrowUpRight className="h-5 w-5" /></span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <p className="text-sm font-semibold text-plum">{d.title} · {d.experience}+ yrs</p>
        <h3 className="mt-1 font-display text-[1.45rem] leading-tight"><Link to={`/doctors/${d.slug}`} className="hover:text-plum">{d.name}</Link></h3>
        {!compact && <p className="mt-2 text-[0.9375rem] text-muted">{d.focus.slice(0, 3).join(' · ')}</p>}
        <p className="mt-3 flex items-start gap-2 text-sm text-ink-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-lavender" />{scheduleSummary(d)}</p>
        {!compact && (
          <div className="mt-auto flex gap-2 pt-5">
            <Link to={`/book?doctor=${d.slug}`} className="btn-primary !min-h-[2.75rem] flex-1 !px-4 text-sm">Book</Link>
            <Link to={`/doctors/${d.slug}`} className="btn-secondary !min-h-[2.75rem] flex-1 !px-4 text-sm">Profile</Link>
          </div>
        )}
      </div>
    </article>
  )
}

export function TreatmentCard({ t, index }: { t: Treatment; index?: number }) {
  return (
    <Link to={`/treatments/${t.slug}`} className="card card-hover group flex h-full flex-col p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        {index !== undefined ? <span className="font-display text-sm text-muted">{String(index + 1).padStart(2, '0')}</span> : <span />}
        <span className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition group-hover:border-plum group-hover:bg-plum group-hover:text-white"><ArrowUpRight className="h-[18px] w-[18px]" /></span>
      </div>
      <h3 className="mt-8 font-display text-[1.75rem] leading-none">{t.name}</h3>
      <p className="mt-2 text-sm font-medium text-lavender-700">{t.full}</p>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-2">{t.short}</p>
    </Link>
  )
}

export function FeatureTreatment({ t, big = false }: { t: Treatment; big?: boolean }) {
  return (
    <Link to={`/treatments/${t.slug}`} className={`group relative flex flex-col justify-end overflow-hidden rounded-panel bg-plum-900 p-7 text-paper md:p-9 ${big ? 'min-h-[460px]' : 'min-h-[300px]'}`}>
      {t.image && <img src={t.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-[1.2s] ease-out group-hover:scale-105" />}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-plum-900 via-plum-900/60 to-transparent" />
      <div className="relative">
        <p className="text-eyebrow font-semibold uppercase text-lilac">{t.full}</p>
        <h3 className={`mt-3 font-display leading-none !text-paper ${big ? 'text-6xl md:text-7xl' : 'text-5xl'}`}>{t.name}</h3>
        <p className="mt-4 max-w-md text-paper/80">{t.short}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">Learn more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
      </div>
    </Link>
  )
}

export function TestimonialCard({ t }: { t: { quote: string; name: string; city: string; date: string } }) {
  return (
    <figure className="card flex h-full flex-col p-7 md:p-8">
      <Quote className="h-7 w-7 text-lavender" aria-hidden />
      <blockquote className="mt-5 flex-1 font-display text-[1.3rem] leading-snug text-ink">“{t.quote}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-lilac font-semibold text-plum">{t.name[0]}</span>
        <span><span className="block font-semibold">{t.name}</span><span className="text-sm text-muted">{t.city} · {t.date}</span></span>
      </figcaption>
    </figure>
  )
}
