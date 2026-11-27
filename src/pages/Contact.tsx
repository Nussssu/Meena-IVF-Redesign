import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { CurveHero, Reveal, WhatsAppIcon, useMeta } from '../components/ui'
import { centres } from '../data/content'
import { site, waLink } from '../data/site'

// Meena IVF & Fertility Care on Google Maps (Banani): exact place and its link
const MAP_LAT = 23.7963453
const MAP_LNG = 90.4081888
const MAP_URL = 'https://www.google.com/maps/place/Meena+IVF+%26+Fertility+Care/@23.796345,90.408189,797m/data=!3m1!1e3!4m6!3m5!1s0x3755c7001bd7b959:0xe9e83e6b4ee336fe!8m2!3d23.7963453!4d90.4081888!16s%2Fg%2F11yf_pys47?hl=en&entry=ttu&g_ep=EgoyMDI2MTEyMy4wIKXMDSoASAFQAw%3D%3D'

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
      {/* hero in the treatment-page style: the reception photo behind, plum wash, curved bottom edge */}
      <CurveHero image="/img/contact-hero.webp" alt="The reception at Meena IVF"
        title={<>We are here to <em className="text-[#E7A6F0]">listen</em>.</>}
        subtitle="Call, message or visit. Our care team answers Saturday to Thursday and will help you choose the right specialist and centre." />
      <section className="section lg:pb-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* phones: the four contact cards two side by side; WhatsApp and the address stay full width */}
          <Reveal className="grid content-start grid-cols-2 gap-3 sm:gap-4">
            {[
              [Phone, 'Hotline', site.hotline, site.hotlineHref],
              [Phone, 'Call centre', site.phone2, site.phone2Href],
              [Mail, 'Email', site.email, `mailto:${site.email}`],
              [Mail, 'Patient care', site.careEmail, `mailto:${site.careEmail}`],
            ].map(([I, k, val, href]) => { const Icon = I as typeof Phone; return (
              <a key={k as string} href={href as string} className="card card-hover min-w-0 p-4 sm:p-6">
                <Icon className="h-5 w-5 text-plum" /><p className="mt-3 text-sm text-muted sm:mt-4">{k as string}</p><p className="break-words text-[0.875rem] font-semibold text-ink sm:text-base">{(val as string).replace('@', '@​')}</p>
              </a>
            ) })}
            <a href={waLink()} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-card bg-whatsapp p-6 text-whatsapp-ink transition hover:brightness-95 col-span-2">
              <WhatsAppIcon className="h-8 w-8" /><span><span className="block font-semibold">Chat on WhatsApp</span><span className="text-sm text-whatsapp-ink/80">Usually replies within working hours</span></span><ArrowRight className="ml-auto h-5 w-5" />
            </a>
            <div className="card col-span-2 p-6">
              <p className="flex items-center gap-2 font-semibold"><MapPin className="h-5 w-5 text-plum" /> Banani Centre</p>
              <p className="mt-2 text-ink-2">{site.address}</p>
              <p lang="bn" className="font-bn text-muted">{site.addressBn}</p>
              <p className="mt-3 flex items-center gap-2 text-sm text-ink-2"><Clock className="h-4 w-4 text-lavender" />{site.hours}</p>
              <p className="mt-4 text-sm text-muted">Also: {centres.filter((c) => c.monthly).map((c) => `${c.name} (${c.schedule.replace('Every month · ', '')})`).join(' · ')}. <Link to="/centres" className="font-semibold text-plum">See all centres</Link></p>
            </div>
          </Reveal>
          {/* desktop: the form card fills the column, so its top and bottom line up with the contact cards beside it */}
          <Reveal delay={0.1} className="lg:h-full">
            <div className="card p-6 md:p-10 lg:h-full">
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
      {/* map: full width on phones/tablets; on desktop it sits inside the content width (same edges as the columns above) */}
      {/* the map shows the clinic's exact Google Maps place; the button opens that place in Google Maps */}
      <div className="relative hidden lg:mx-auto lg:block lg:max-w-site lg:px-8 lg:pb-24 xl:px-10">
        <iframe title="Map of Meena IVF Banani centre" loading="lazy" className="block h-[380px] w-full border-0 grayscale-[30%] lg:rounded-panel" src={`https://maps.google.com/maps?q=${MAP_LAT},${MAP_LNG}&z=17&output=embed`} />
        <a href={MAP_URL} target="_blank" rel="noreferrer"
          className="absolute bottom-4 right-4 inline-flex min-h-[2.75rem] items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-ink shadow-soft ring-1 ring-line transition hover:text-plum lg:bottom-[calc(6rem+1rem)] lg:right-12 xl:right-14">
          <MapPin className="h-4 w-4 text-plum" /> Open in Google Maps
        </a>
      </div>
    </>
  )
}
