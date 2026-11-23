import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Building2, CalendarDays, Check, Clock, MapPin, Monitor, Phone, Stethoscope, User } from 'lucide-react'
import { Breadcrumbs, WhatsAppIcon, useMeta } from '../components/ui'
import { dayNames, doctorBySlug, doctors, sessionsOn, type Doctor } from '../data/doctors'
import { centres, nextMonthly } from '../data/content'
import { treatments, treatmentBySlug } from '../data/treatments'
import { site, waLink } from '../data/site'
import { scrollToTarget } from '../lib/smooth'

type Loc = 'banani' | 'khulna' | 'cumilla' | 'online'
const locations: { key: Loc; name: string; sub: string; icon: typeof Building2 }[] = [
  { key: 'banani', name: 'Banani, Dhaka', sub: 'Main centre · Sat – Thu', icon: Building2 },
  { key: 'khulna', name: 'Khulna OPD', sub: 'Every 2nd Friday', icon: MapPin },
  { key: 'cumilla', name: 'Cumilla OPD', sub: 'Every 2nd Tuesday', icon: MapPin },
  { key: 'online', name: 'Online consultation', sub: 'Video or phone · Sat – Thu', icon: Monitor },
]
const steps = ['Centre', 'Specialist', 'Date', 'Time', 'Your details']
const ANY = 'any'

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()
const fmt = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

function upcoming(days: number[], count = 14): Date[] {
  const out: Date[] = []
  const d = new Date(); d.setHours(0, 0, 0, 0)
  for (let i = 1; out.length < count && i < 60; i++) {
    const x = new Date(d); x.setDate(d.getDate() + i)
    if (days.includes(x.getDay())) out.push(x)
  }
  return out
}

export default function Book() {
  useMeta('Book an appointment', 'Book a consultation at Meena IVF & Fertility Care in Banani, Khulna, Cumilla or online.')
  const [params] = useSearchParams()
  const preDoctor = doctorBySlug(params.get('doctor') ?? '')
  const preTreatment = treatmentBySlug(params.get('treatment') ?? '')
  const reduce = useReducedMotion()

  const [step, setStep] = useState(preDoctor ? 2 : 0)
  const [loc, setLoc] = useState<Loc | null>(preDoctor ? 'banani' : null)
  const [doc, setDoc] = useState<string | null>(preDoctor?.slug ?? null)
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', reason: preTreatment?.slug ?? '', notes: '', consent: false })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [done, setDone] = useState<string | null>(null)

  const isOpd = loc === 'khulna' || loc === 'cumilla'
  const doctor: Doctor | undefined = doc && doc !== ANY ? doctorBySlug(doc) : undefined

  const dates = useMemo(() => {
    if (!loc) return []
    if (isOpd) { const c = centres.find((x) => x.slug === loc)!; return nextMonthly(c.monthly!.nth, c.monthly!.day, 3).filter((d) => d > new Date()) }
    return upcoming(doctor ? [...new Set(doctor.schedule.map((s) => s.day))] : [6, 0, 1, 2, 3, 4])
  }, [loc, isOpd, doctor])

  const times = useMemo(() => {
    if (!date) return []
    if (doctor) return sessionsOn(doctor, date.getDay()).map((s) => `${s.from} – ${s.to}`)
    if (isOpd) return ['Morning (10 AM – 1 PM)', 'Afternoon (2 PM – 5 PM)']
    return ['Morning (9 AM – 12 PM)', 'Afternoon (12 PM – 5 PM)', 'Evening (6 PM – 10 PM)']
  }, [date, doctor, isOpd])

  const errors = {
    name: form.name.trim().length < 2 ? 'Please enter your full name.' : '',
    phone: !/^(?:\+?88)?01[3-9]\d{8}$/.test(form.phone.replace(/[\s-]/g, '')) ? 'Enter a Bangladeshi mobile number, e.g. 01712-345678.' : '',
    email: form.email && !/^\S+@\S+\.\S+$/.test(form.email) ? 'This email address looks incomplete.' : '',
    consent: !form.consent ? 'Please confirm so we can contact you.' : '',
  }
  const formValid = !errors.name && !errors.phone && !errors.email && !errors.consent

  const canNext = [!!loc, !!doc, !!date, !!time, formValid][step]
  const go = (n: number) => { setStep(n); scrollToTarget(0) }

  const pickLoc = (l: Loc) => {
    setLoc(l); setDate(null); setTime(null)
    if (l === 'khulna' || l === 'cumilla') { setDoc(ANY); go(2) } else { if (doc && doc !== ANY) setDoc(doc); go(1) }
  }

  const summary = {
    Centre: locations.find((l) => l.key === loc)?.name,
    Specialist: isOpd ? 'Visiting specialist' : doc === ANY ? 'First available specialist' : doctor?.name,
    Date: date ? fmt(date) : undefined,
    Time: time ?? undefined,
  }

  const submit = () => {
    setTouched({ name: true, phone: true, email: true, consent: true })
    if (!formValid) return
    setDone('MIVF-' + Math.random().toString(36).slice(2, 7).toUpperCase())
    scrollToTarget(0)
  }

  const waText = `Assalamu alaikum, I would like to confirm an appointment request.\nName: ${form.name}\nPhone: ${form.phone}\nCentre: ${summary.Centre}\nSpecialist: ${summary.Specialist}\nDate: ${summary.Date}\nTime: ${summary.Time}${form.reason ? `\nRegarding: ${treatmentBySlug(form.reason)?.name}` : ''}`

  if (done) {
    return (
      <section className="grain relative min-h-[90vh] bg-mist pb-24 pt-32 md:pt-40">
        <div className="container-x max-w-2xl">
          <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8 shadow-lift md:p-12">
            <motion.span initial={reduce ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="grid h-16 w-16 place-items-center rounded-full bg-ok text-white"><Check className="h-8 w-8" strokeWidth={2.5} /></motion.span>
            <h1 className="h2 mt-6">Thank you, {form.name.split(' ')[0]}.</h1>
            <p className="mt-3 text-lg text-ink-2">Your request is with our care team. We will call <strong>{form.phone}</strong> within 24 hours to confirm.</p>
            <dl className="mt-8 divide-y divide-line rounded-card border border-line">
              {Object.entries({ Reference: done, ...summary }).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-5 py-3 text-sm"><dt className="text-muted">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>
              ))}
            </dl>
            <div className="btn-pair mt-8">
              <a href={waLink(`${waText}\nReference: ${done}`)} target="_blank" rel="noreferrer" className="btn bg-whatsapp text-whatsapp-ink hover:brightness-95"><WhatsAppIcon className="h-5 w-5" /> <span className="sm:hidden">WhatsApp</span><span className="hidden sm:inline">Confirm on WhatsApp</span></a>
              <a href={site.hotlineHref} className="btn-secondary"><Phone className="h-4 w-4" /> Call<span className="hidden sm:inline">&nbsp;{site.hotline}</span></a>
            </div>
            <p className="mt-6 rounded-xl bg-mist p-4 text-sm text-muted">Demo preview: this form is not yet connected to the clinic system, so no data has been sent. In the live site, requests go straight to the care team.</p>
            <Link to="/" className="link-quiet mt-6">Back to home</Link>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="grain relative min-h-screen bg-mist pb-16 pt-24 md:pb-28 md:pt-36">
      <div className="container-x">
        <Breadcrumbs items={[{ label: 'Book appointment' }]} />
        <div className="mb-6 max-w-2xl md:mb-10">
          <h1 className="h1">Book a consultation</h1>
          <p className="mt-2 text-base leading-relaxed text-ink-2 md:mt-3 md:text-lg">Five short steps. We will call you within 24 hours to confirm.</p>
        </div>

        <ol className="mb-3 grid grid-cols-5 gap-2 sm:mb-8" aria-label="Booking progress">
          {steps.map((s, i) => (
            <li key={s}>
              <button disabled={i > step || (isOpd && i === 1)} onClick={() => go(i)} aria-current={i === step ? 'step' : undefined} aria-label={`Step ${i + 1}: ${s}${i < step ? ' (done, go back)' : ''}`} className="group flex min-h-[2.75rem] w-full flex-col justify-center text-left disabled:cursor-default sm:min-h-0 sm:justify-start">
                <span className={`block h-1.5 rounded-full transition-colors ${i <= step ? 'bg-plum' : 'bg-ink/10'}`} />
                <span className={`mt-2 hidden text-sm font-semibold sm:block ${i === step ? 'text-plum' : i < step ? 'text-ink group-hover:text-plum' : 'text-muted'}`}>{i + 1}. {s}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mb-3 text-sm font-semibold text-plum sm:hidden">Step {step + 1} of 5 · {steps[step]}</p>
        {Object.values(summary).some(Boolean) && (
          <ul aria-label="Your choices so far" className="mb-4 flex flex-wrap gap-2 lg:hidden">
            {([[Building2, summary.Centre], [User, summary.Specialist], [CalendarDays, summary.Date], [Clock, summary.Time]] as const).filter(([, v]) => v).map(([I, v]) => (
              <li key={v as string} className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[0.8125rem] font-medium text-ink ring-1 ring-line">
                <I className="h-3.5 w-3.5 shrink-0 text-plum" /><span className="truncate">{v as string}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="card min-h-[22rem] min-w-0 p-5 sm:p-6 md:min-h-[420px] md:p-10">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={reduce ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                {step === 0 && (
                  <fieldset>
                    <legend className="h3 mb-6">Where would you like to be seen?</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {locations.map((l) => (
                        <button key={l.key} onClick={() => pickLoc(l.key)} aria-pressed={loc === l.key}
                          className={`flex items-start gap-4 rounded-card border p-5 text-left transition ${loc === l.key ? 'border-plum bg-lilac/50 ring-2 ring-plum/20' : 'border-line hover:border-plum/40 hover:bg-mist/50'}`}>
                          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${loc === l.key ? 'bg-plum text-white' : 'bg-mist text-plum'}`}><l.icon className="h-5 w-5" /></span>
                          <span><span className="block font-semibold">{l.name}</span><span className="text-sm text-muted">{l.sub}</span></span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 1 && (
                  <fieldset>
                    <legend className="h3 mb-6">Choose your specialist</legend>
                    <div className="grid grid-cols-[minmax(0,1fr)] gap-3">
                      <button onClick={() => { setDoc(ANY); setDate(null); setTime(null); go(2) }} aria-pressed={doc === ANY}
                        className={`flex items-center gap-4 rounded-card border p-4 text-left transition ${doc === ANY ? 'border-plum bg-lilac/50 ring-2 ring-plum/20' : 'border-line hover:border-plum/40'}`}>
                        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-mist text-plum"><Stethoscope className="h-6 w-6" /></span>
                        <span><span className="block font-semibold">First available specialist</span><span className="text-sm text-muted">We will match you with the right consultant</span></span>
                      </button>
                      {doctors.map((d) => (
                        <button key={d.slug} onClick={() => { setDoc(d.slug); setDate(null); setTime(null); go(2) }} aria-pressed={doc === d.slug}
                          className={`flex items-center gap-4 rounded-card border p-4 text-left transition ${doc === d.slug ? 'border-plum bg-lilac/50 ring-2 ring-plum/20' : 'border-line hover:border-plum/40'}`}>
                          <img src={d.image} alt="" className="h-14 w-14 shrink-0 rounded-full bg-lilac object-cover object-top" />
                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold">{d.name}</span>
                            <span className="block text-sm text-muted">{d.title} · {[...new Set(d.schedule.map((s) => dayNames[s.day].slice(0, 3)))].join(', ')}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 2 && (
                  <fieldset>
                    <legend className="h3 mb-2">Pick a date</legend>
                    <p className="mb-6 text-sm text-muted">{isOpd ? 'OPD camps run once a month. Showing the next dates.' : doctor ? `Showing days when ${doctor.short} has chambers.` : 'Banani centre is open Saturday to Thursday.'}</p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                      {dates.map((d) => {
                        const sel = date && sameDay(date, d)
                        return (
                          <button key={d.toISOString()} onClick={() => { setDate(d); setTime(null); go(3) }} aria-pressed={!!sel} aria-label={fmt(d)}
                            className={`rounded-card border px-2 py-3 text-center transition ${sel ? 'border-plum bg-plum text-white' : 'border-line hover:border-plum/40 hover:bg-mist/50'}`}>
                            <span className={`block text-xs font-semibold uppercase ${sel ? 'text-lilac' : 'text-muted'}`}>{d.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                            <span className="block font-display text-2xl">{d.getDate()}</span>
                            <span className={`block text-xs ${sel ? 'text-white/80' : 'text-muted'}`}>{d.toLocaleDateString('en-GB', { month: 'short' })}</span>
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>
                )}

                {step === 3 && (
                  <fieldset>
                    <legend className="h3 mb-2">Preferred time</legend>
                    <p className="mb-6 text-sm text-muted">{date && fmt(date)}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {times.map((t) => (
                        <button key={t} onClick={() => { setTime(t); go(4) }} aria-pressed={time === t}
                          className={`flex items-center gap-3 rounded-card border p-5 text-left font-semibold transition ${time === t ? 'border-plum bg-lilac/50 ring-2 ring-plum/20' : 'border-line hover:border-plum/40'}`}>
                          <Clock className="h-5 w-5 text-plum" />{t}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}

                {step === 4 && (
                  <form onSubmit={(e) => { e.preventDefault(); submit() }} noValidate>
                    <h2 className="h3 mb-6">Your details</h2>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field id="name" label="Full name" required error={touched.name ? errors.name : ''}>
                        <input id="name" autoComplete="name" className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} onBlur={() => setTouched({ ...touched, name: true })} aria-invalid={!!(touched.name && errors.name)} aria-describedby="name-err" />
                      </Field>
                      <Field id="phone" label="Mobile number" required error={touched.phone ? errors.phone : ''}>
                        <input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="01XXX-XXXXXX" className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} onBlur={() => setTouched({ ...touched, phone: true })} aria-invalid={!!(touched.phone && errors.phone)} aria-describedby="phone-err" />
                      </Field>
                      <Field id="email" label="Email" hint="Optional" error={touched.email ? errors.email : ''}>
                        <input id="email" type="email" autoComplete="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onBlur={() => setTouched({ ...touched, email: true })} aria-invalid={!!(touched.email && errors.email)} aria-describedby="email-err" />
                      </Field>
                      <Field id="reason" label="What is it about?" hint="Optional">
                        <select id="reason" className="field" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}>
                          <option value="">General fertility consultation</option>
                          {treatments.map((t) => <option key={t.slug} value={t.slug}>{t.name}: {t.full}</option>)}
                        </select>
                      </Field>
                      <div className="sm:col-span-2">
                        <Field id="notes" label="Anything we should know?" hint="Optional">
                          <textarea id="notes" rows={3} className="field !py-3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="e.g. trying for 2 years, previous IUI…" />
                        </Field>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-2">
                          <input type="checkbox" checked={form.consent} onChange={(e) => { setForm({ ...form, consent: e.target.checked }); setTouched({ ...touched, consent: true }) }} className="mt-0.5 h-5 w-5 shrink-0 accent-plum" aria-describedby="consent-err" />
                          I agree that Meena IVF may call or message me about this appointment. My information stays confidential.
                        </label>
                        {touched.consent && errors.consent && <p id="consent-err" className="mt-1.5 text-sm text-err">{errors.consent}</p>}
                      </div>
                    </div>
                    <button type="submit" className="btn-primary mt-8 w-full sm:w-auto">Request appointment <ArrowRight className="h-4 w-4" /></button>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>

            {step > 0 && step < 4 && (
              <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5 md:mt-10 md:pt-6">
                <button onClick={() => go(isOpd && step === 2 ? 0 : step - 1)} className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Back</button>
                <button onClick={() => go(step + 1)} disabled={!canNext} className="btn-primary">Continue <ArrowRight className="h-4 w-4" /></button>
              </div>
            )}
            {step === 4 && <button onClick={() => go(3)} className="link-quiet mt-6"><ArrowLeft className="h-4 w-4" /> Back</button>}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card hidden p-6 lg:block">
              <p className="text-eyebrow font-semibold uppercase text-muted">Your appointment</p>
              <ul className="mt-4 space-y-4">
                {[
                  [Building2, 'Centre', summary.Centre],
                  [User, 'Specialist', summary.Specialist],
                  [CalendarDays, 'Date', summary.Date],
                  [Clock, 'Time', summary.Time],
                ].map(([I, k, v]) => { const Icon = I as typeof Building2; return (
                  <li key={k as string} className="flex gap-3">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${v ? 'bg-plum text-white' : 'bg-mist text-muted'}`}><Icon className="h-4 w-4" /></span>
                    <span className="text-sm"><span className="block text-muted">{k as string}</span><span className={`font-semibold ${v ? 'text-ink' : 'text-muted/60'}`}>{(v as string) ?? 'Not chosen yet'}</span></span>
                  </li>
                ) })}
              </ul>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-card bg-plum-900 p-5 text-paper lg:mt-4 lg:block lg:p-6">
              <div>
                <p className="font-display text-xl">Prefer to talk?</p>
                <p className="mt-1 text-sm text-paper/70">Every day except Friday.</p>
              </div>
              <a href={site.hotlineHref} className="btn-light shrink-0 !px-4 lg:mt-4 lg:w-full" aria-label={`Call ${site.hotline}`}><Phone className="h-4 w-4" /><span className="hidden lg:inline">{site.hotline}</span><span className="lg:hidden">Call</span></a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Field({ id, label, required, hint, error, children }: { id: string; label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}{required && <span className="text-plum"> *</span>}{hint && <span className="ml-1.5 font-normal text-muted">({hint})</span>}</label>
      {children}
      {error && <p id={`${id}-err`} className="mt-1.5 text-sm text-err">{error}</p>}
    </div>
  )
}
