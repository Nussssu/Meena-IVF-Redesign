import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { Check, Mail, MapPin, Phone } from 'lucide-react'
import { CTABand, Reveal, useMeta } from '../components/ui'
import { dayNames, dhakaDay, doctorBySlug, sessionsOn } from '../data/doctors'
import { site } from '../data/site'
import NotFound from './NotFound'

const EASE = [0.22, 1, 0.36, 1] as const

/* Doctor profile: left column with photo, contact card and a dark weekly schedule; right column with About,
   areas of expertise and education & experience. */

export function DoctorProfile() {
  const { slug } = useParams()
  const d = doctorBySlug(slug)
  useMeta(d ? d.name : 'Not found', d?.intro)
  const reduce = useReducedMotion()
  // small items (paragraphs, schedule rows, chips, cards) rise in one after another as they scroll into view
  const rise = (i: number, y = 16) => reduce ? {} : {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '0px 0px -8% 0px' },
    transition: { duration: 0.7, delay: i * 0.06, ease: EASE },
  }
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

          <div className="mt-8 grid gap-10 lg:grid-cols-[400px_1fr] lg:gap-14">
            {/* left column (sticky: whichever column ends first stays in view, then both scroll up together) */}
            <div ref={leftCol} className="space-y-6 lg:sticky lg:self-start" style={{ top: tops[0] }}>
              <Reveal className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-lilac via-[#E3D3F1] to-[#C9A6E2]">
                {/* photo settles in from a gentle zoom */}
                <motion.img src={d.image} alt={d.name} className="mx-auto block aspect-[5/6] w-full origin-bottom object-contain object-bottom pt-6"
                  initial={reduce ? false : { scale: 1.12, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: EASE }} />
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
                  ].map(({ Icon, label, value, href }, i) => (
                    <motion.li key={label} {...rise(i + 1, 12)} className="flex items-center gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-plum text-white"><Icon className="h-5 w-5" /></span>
                      <span className="min-w-0">
                        <span className="block text-sm text-muted">{label}</span>
                        {href ? <a href={href} className="block truncate font-medium text-ink hover:text-plum">{value}</a> : <span className="block font-medium text-ink">{value}</span>}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="rounded-[1.5rem] bg-plum-900 p-7 text-paper md:p-8">
                <h3 className="font-display text-2xl !text-paper">Weekly schedule</h3>
                <ul className="mt-5">
                  {week.map((day, i) => {
                    const s = sessionsOn(d, day)
                    return (
                      <motion.li key={day} {...rise(i, 10)} className={`flex items-center justify-between gap-4 border-b border-white/15 py-3.5 text-[0.9375rem] ${day === today ? 'text-[#E7A6F0]' : ''}`}>
                        <span>{dayNames[day]}{day === today && <span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-xs">Today</span>}</span>
                        <span className={s.length ? '' : 'text-paper/50'}>{s.length ? s.map((x) => `${x.from} – ${x.to}`).join(', ') : 'Closed'}</span>
                      </motion.li>
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
                <div className="mt-6 space-y-5 text-[1.0625rem] leading-[1.75] text-ink-2 max-md:text-justify max-md:[hyphens:auto]">{d.about.map((p, i) => <motion.p key={i} {...rise(i + 1)}>{p}</motion.p>)}</div>
              </Reveal>


              <Reveal className="mt-14">
                <h2 className="h2 text-balance">Areas of <em className="text-plum">expertise</em></h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {d.focus.map((f, i) => (
                    <motion.li key={f} {...rise(i, 14)} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-ink">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-plum text-white"><Check className="h-4 w-4" strokeWidth={2.5} /></span>{f}
                    </motion.li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="mt-14">
                <h2 className="h2 text-balance">Education &amp; <em className="text-plum">experience</em></h2>
                {/* phones: two cards side by side (tighter padding and type); 640px+ unchanged */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {d.qualifications.map((q, i) => {
                    const yr = q.detail.match(/(19|20)\d{2}/)?.[0]
                    return (
                      <motion.div key={q.title} {...rise(i % 2 + Math.floor(i / 2), 22)} className="flex min-w-0 flex-col rounded-[1.25rem] bg-lilac/60 p-4 sm:p-6">
                        <span className="w-fit rounded-full bg-white px-2.5 py-0.5 text-xs text-ink sm:px-3 sm:py-1 sm:text-sm">{yr ?? 'Training'}</span>
                        <h3 className="mt-4 text-[0.9375rem] font-semibold leading-snug text-ink [overflow-wrap:anywhere] sm:mt-8 sm:text-lg">{q.title}</h3>
                        <p className="mt-1.5 text-[0.8125rem] leading-snug text-ink-2 [overflow-wrap:anywhere] sm:mt-2 sm:text-base sm:leading-[1.65]">{q.detail}</p>
                      </motion.div>
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
