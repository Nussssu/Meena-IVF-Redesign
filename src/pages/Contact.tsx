import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { PageHero, Reveal, WhatsAppIcon, useMeta } from '../components/ui'
import { centres } from '../data/content'
import { site, waLink } from '../data/site'

export default function Contact() {
  useMeta('Contact', 'Contact Meena IVF & Fertility Care: hotline 01318-258807, WhatsApp, email and centre addresses.')
  const [sent, setSent] = useState(false)
  const [v, setV] = useState({ name: '', phone: '', msg: '' })
  const [t, setT] = useState<Record<string, boolean>>({})
  const err = {
    name: v.name.trim().length < 2 ? 'Please enter your name.' : '',
    phone: !/^(?:\+?88)?01[3-9]\d{8}$/.test(v.phone.replace(/[\s-]/g, '')) ? 'Enter a Bangladeshi mobile number, e.g. 01712-345678.' : '',
    msg: v.msg.trim().length < 5 ? 'Please write a short message.' : '',
  }
  const ok = !err.name && !err.phone && !err.msg

  return (
    <>
      <PageHero crumbs={[{ label: 'Contact' }]} eyebrow="Contact us" title={<>We are here to <em className="text-plum">listen</em>.</>}
        text="Call, message or visit. Our care team answers Saturday to Thursday and will help you choose the right specialist and centre." />
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal className="grid content-start gap-4 sm:grid-cols-2">
            {[
              [Phone, 'Hotline', site.hotline, site.hotlineHref],
              [Phone, 'Call centre', site.phone2, site.phone2Href],
              [Mail, 'Email', site.email, `mailto:${site.email}`],
              [Mail, 'Patient care', site.careEmail, `mailto:${site.careEmail}`],
            ].map(([I, k, val, href]) => { const Icon = I as typeof Phone; return (
              <a key={k as string} href={href as string} className="card card-hover p-6">
                <Icon className="h-5 w-5 text-plum" /><p className="mt-4 text-sm text-muted">{k as string}</p><p className="font-semibold text-ink">{val as string}</p>
              </a>
            ) })}
            <a href={waLink()} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-card bg-whatsapp p-6 text-whatsapp-ink transition hover:brightness-95 sm:col-span-2">
              <WhatsAppIcon className="h-8 w-8" /><span><span className="block font-semibold">Chat on WhatsApp</span><span className="text-sm text-whatsapp-ink/80">Usually replies within working hours</span></span><ArrowRight className="ml-auto h-5 w-5" />
            </a>
            <div className="card p-6 sm:col-span-2">
              <p className="flex items-center gap-2 font-semibold"><MapPin className="h-5 w-5 text-plum" /> Banani Centre</p>
              <p className="mt-2 text-ink-2">{site.address}</p>
              <p lang="bn" className="font-bn text-muted">{site.addressBn}</p>
              <p className="mt-3 flex items-center gap-2 text-sm text-ink-2"><Clock className="h-4 w-4 text-lavender" />{site.hours}</p>
              <p className="mt-4 text-sm text-muted">Also: {centres.filter((c) => c.monthly).map((c) => `${c.name} (${c.schedule.replace('Every month · ', '')})`).join(' · ')}. <Link to="/centres" className="font-semibold text-plum">See all centres</Link></p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card p-6 md:p-10">
              {sent ? (
                <div className="py-12 text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ok text-white"><Check className="h-7 w-7" /></span>
                  <p className="mt-5 font-display text-2xl">Message received.</p>
                  <p className="mt-2 text-muted">We will call {v.phone} soon. (Demo preview: nothing was sent.)</p>
                </div>
              ) : (
                <form noValidate onSubmit={(e) => { e.preventDefault(); setT({ name: true, phone: true, msg: true }); if (ok) setSent(true) }} className="grid gap-5">
                  <h2 className="h3">Send us a message</h2>
                  {([['name', 'Your name', 'text', 'name'], ['phone', 'Mobile number', 'tel', 'tel']] as const).map(([k, l, type, ac]) => (
                    <div key={k}>
                      <label htmlFor={`ct-${k}`} className="label">{l} <span className="text-plum">*</span></label>
                      <input id={`ct-${k}`} type={type} autoComplete={ac} className="field" value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} onBlur={() => setT({ ...t, [k]: true })} aria-invalid={!!(t[k] && err[k])} aria-describedby={`ct-${k}-err`} />
                      {t[k] && err[k] && <p id={`ct-${k}-err`} className="mt-1.5 text-sm text-err">{err[k]}</p>}
                    </div>
                  ))}
                  <div>
                    <label htmlFor="ct-msg" className="label">How can we help? <span className="text-plum">*</span></label>
                    <textarea id="ct-msg" rows={5} className="field !py-3" value={v.msg} onChange={(e) => setV({ ...v, msg: e.target.value })} onBlur={() => setT({ ...t, msg: true })} aria-invalid={!!(t.msg && err.msg)} aria-describedby="ct-msg-err" />
                    {t.msg && err.msg && <p id="ct-msg-err" className="mt-1.5 text-sm text-err">{err.msg}</p>}
                  </div>
                  <button type="submit" className="btn-primary justify-self-start">Send message <ArrowRight className="h-4 w-4" /></button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
      <iframe title="Map of Meena IVF Banani centre" loading="lazy" className="h-[380px] w-full border-0 grayscale-[30%]" src={`https://www.google.com/maps?q=${encodeURIComponent(centres[0].map)}&z=15&output=embed`} />
    </>
  )
}
