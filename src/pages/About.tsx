import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Eye, FlaskConical, HeartHandshake, Lock, MessageCircle, Target, Upload, Users } from 'lucide-react'
import { CTABand, Counter, PageHero, Reveal, SectionHeader, useMeta } from '../components/ui'
import { ImageReveal } from '../components/motion'
import { milestones, team, whyMeena } from '../data/content'
import { site } from '../data/site'

export function About() {
  useMeta('About us', 'Meena IVF & Fertility Care Ltd.: advanced fertility care with compassion, trust and hope.')
  return (
    <>
      <PageHero crumbs={[{ label: 'About' }]} eyebrow="About Meena IVF & Fertility Care Ltd." image="/img/doctors-duo.webp"
        title={<>Advanced fertility care with compassion, <em className="text-plum">trust</em> and hope.</>}
        text="We help individuals and couples move closer to parenthood through ethical guidance, modern reproductive treatment and deeply compassionate care.">
        <Link to="/book" className="btn-primary">Book appointment</Link>
        <Link to="/team" className="btn-secondary">Meet our team</Link>
      </PageHero>

      <section className="section">
        <div className="container-x">
          <SectionHeader eyebrow="Who we are" title="A trusted destination for fertility and reproductive care." text="We combine modern fertility treatment with emotional sensitivity, clinical precision and a patient-first approach." />
          <div className="grid gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {[
              [HeartHandshake, 'Compassionate care', 'Every journey is handled with empathy, privacy and respect.'],
              [FlaskConical, 'Advanced technology', 'Modern fertility methods and updated clinical systems for safer, precise treatment.'],
              [Target, 'Personalised treatment', 'A care plan tailored to your condition and goals.'],
              [Eye, 'Transparent guidance', 'Clear communication, ethical advice and trust at every stage.'],
            ].map(([I, t, d], i) => { const Icon = I as typeof Eye; return (
              <Reveal key={t as string} delay={i * 0.06} className="bg-paper p-7">
                <Icon className="h-6 w-6 text-plum" strokeWidth={1.75} />
                <h3 className="mt-6 font-display text-xl">{t as string}</h3>
                <p className="mt-2 text-[0.9375rem] text-ink-2">{d as string}</p>
              </Reveal>
            ) })}
          </div>
        </div>
      </section>

      <section className="section bg-mist">
        <div className="container-x">
          <SectionHeader align="center" eyebrow="Our foundation" title="Mission, vision and values" />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ['Our mission', 'To provide advanced fertility care with compassion, precision and trust, helping every patient feel supported throughout their journey.'],
              ['Our vision', 'To be a leading fertility care centre known for ethical treatment, modern reproductive solutions and patient-centred excellence.'],
              ['Our values', 'Compassion, professionalism, transparency, quality, safety and continuous improvement guide everything we do.'],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08}>
                <div className="arch flex h-full flex-col items-center bg-white px-8 pb-10 pt-16 text-center shadow-soft">
                  <span className="font-display text-5xl italic text-lavender">0{i + 1}</span>
                  <h3 className="mt-4 font-display text-2xl">{t}</h3>
                  <p className="mt-3 text-ink-2">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {[
        { img: '/img/chairman.webp', eyebrow: 'Message from the Chairman', title: 'A commitment to hope, dignity and care.', name: 'Md. Moniruzzaman', role: 'Chairman', body: ['At Meena IVF & Fertility Care, we believe fertility care is about more than treatment. It is about trust, emotional strength and responsible medical guidance.', 'Our vision has always been to build a centre where every patient feels respected, supported and confident in the care they receive. We remain committed to ethical treatment, advanced reproductive support and a warm, reassuring environment for every family that places their trust in us.'] },
        { img: '/img/director.webp', eyebrow: 'Message from the Director', title: 'Guiding every journey with expertise and compassion.', name: 'Farhin Zaman', role: 'Director', body: ['We see fertility care as a responsibility that goes beyond clinical treatment: understanding emotions, respecting individual journeys and delivering care with honesty, empathy and precision.', 'Every patient who walks through our doors deserves clarity, confidence and reassurance. Your trust is the foundation of our work, and we remain dedicated to supporting you with integrity at every step toward parenthood.'] },
      ].map((m, i) => (
        <section key={m.name} className="section">
          <div className={`container-x grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
            <Reveal><div className="arch mx-auto aspect-[4/5] max-w-[420px] overflow-hidden bg-lilac"><img src={m.img} alt={m.name} loading="lazy" className="h-full w-full object-cover object-top" /></div></Reveal>
            <Reveal delay={0.1}>
              <p className="eyebrow mb-5">{m.eyebrow}</p>
              <h2 className="h2 text-balance">{m.title}</h2>
              <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-ink-2">{m.body.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}</div>
              <p className="mt-8 font-display text-2xl">{m.name}</p>
              <p className="text-sm text-muted">{m.role}, {site.legal}</p>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="section bg-plum-900 text-paper">
        <div className="container-x">
          <SectionHeader light eyebrow="Our journey" title="Milestones that shape our story" />
          <ol className="grid gap-8 md:grid-cols-4">
            {milestones.map((m, i) => (
              <Reveal as="li" key={m.title} delay={i * 0.1} className="border-t border-white/20 pt-6">
                <p className="font-display text-4xl text-lilac">{m.year}</p>
                <h3 className="mt-4 font-display text-xl !text-paper">{m.title}</h3>
                <p className="mt-2 text-paper/70">{m.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <div className="pt-20 md:pt-28"><CTABand title="Let Meena IVF guide your next step." /></div>
    </>
  )
}

export function WhyMeena() {
  useMeta('Why Meena', 'Why families choose Meena IVF: experienced specialists, in-house OT and IVF lab, self-cycle first, transparent pricing and complete support.')
  return (
    <>
      <PageHero crumbs={[{ label: 'About', to: '/about' }, { label: 'Why Meena' }]} eyebrow="Why Meena IVF" image="/img/reception-wide.webp" tone="blush"
        title={<>Built around expertise, trust and <em className="text-plum">patient-centred</em> care.</>}
        text="Fertility treatment is more than a medical service. It needs trust, sensitivity, precision, and a team that understands your journey.">
        <Link to="/book" className="btn-primary">Book appointment</Link>
      </PageHero>
      <section className="border-b border-line bg-white">
        <div className="container-x grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x">
          {site.stats.map((s) => <div key={s.label} className="py-7 md:px-8 md:first:pl-0"><p className="font-display text-5xl"><Counter to={s.value} suffix={s.suffix} /></p><p className="mt-1 text-sm text-muted">{s.label}</p></div>)}
        </div>
      </section>
      <section className="section">
        <div className="container-x grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {whyMeena.map((w, i) => (
            <Reveal key={w.title} delay={(i % 3) * 0.06}>
              <div className="card h-full p-8">
                <span className="font-display text-sm text-muted">0{i + 1}</span>
                <h3 className="mt-6 font-display text-2xl">{w.title}</h3>
                <p className="mt-3 text-ink-2">{w.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      {[
        { img: '/img/doctors-duo.webp', eyebrow: 'Expert-led care', title: 'Guided by experienced fertility professionals.', text: 'Accurate diagnosis, ethical treatment planning and a patient-first approach that builds confidence at every stage.', points: ['Clear evaluation and treatment explanation', 'Structured, evidence-based fertility planning', 'Professional care with compassion and transparency'] },
        { img: '/img/lab-microscope.webp', eyebrow: 'Technology & precision', title: 'An in-house OT and modern IVF laboratory.', text: 'Egg retrieval, embryo transfer and sperm retrieval are performed safely under controlled conditions, without moving between facilities.', points: ['Advanced IVF, IUI and ICSI procedures', 'Embryology lab with vitrification', 'Precision-driven, quality-focused systems'] },
        { img: '/img/patient-care.webp', eyebrow: 'Comfort & support', title: 'A journey designed with sensitivity and respect.', text: 'Privacy, comfort, respectful care and continuous support, plus psychological and financial counselling when you need it.', points: ['Respectful, confidential environment', 'Transparent communication and realistic guidance', 'Support from first visit to treatment and beyond'] },
      ].map((b, i) => (
        <section key={b.title} className={`section ${i % 2 ? 'bg-mist' : ''}`}>
          <div className={`container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
            <ImageReveal src={b.img} className="aspect-[5/4] rounded-panel" />
            <Reveal delay={0.1}>
              <p className="eyebrow mb-5">{b.eyebrow}</p>
              <h2 className="h2 text-balance">{b.title}</h2>
              <p className="mt-5 text-lg text-ink-2">{b.text}</p>
              <ul className="mt-7 space-y-3">{b.points.map((p) => <li key={p} className="flex items-start gap-3"><span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lilac text-plum"><Check className="h-3.5 w-3.5" strokeWidth={2.5} /></span>{p}</li>)}</ul>
            </Reveal>
          </div>
        </section>
      ))}
      <section className="section">
        <div className="container-x">
          <SectionHeader align="center" eyebrow="How it works" title="From first conversation to confident next step" />
          <div className="grid gap-4 md:grid-cols-4">
            {[[MessageCircle, 'Consultation', 'Understand your fertility concerns clearly'], [Eye, 'Diagnosis', 'Identify the most suitable treatment path'], [FlaskConical, 'Treatment', 'Receive a personalised fertility care plan'], [Lock, 'Support', 'Move forward with confidence and guidance']].map(([I, t, d], i) => { const Icon = I as typeof Eye; return (
              <Reveal key={t as string} delay={i * 0.08} className="card p-7 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-lilac text-plum"><Icon className="h-6 w-6" /></span>
                <p className="mt-5 font-display text-xl">{t as string}</p><p className="mt-2 text-sm text-ink-2">{d as string}</p>
              </Reveal>
            ) })}
          </div>
        </div>
      </section>
      <CTABand />
    </>
  )
}

export function Team() {
  useMeta('Our team', 'Meet the people behind Meena IVF & Fertility Care: consultants, embryologists, medical officers, nurses, counsellors and support teams.')
  const [f, setF] = useState('all')
  const shown = f === 'all' ? team : team.filter((t) => t.key === f)
  const total = team.reduce((n, t) => n + t.members.length, 0)
  return (
    <>
      <PageHero crumbs={[{ label: 'About', to: '/about' }, { label: 'Our team' }]} eyebrow="Meet our team" image="/img/event-2.webp"
        title={<>The people behind <em className="text-plum">every</em> journey.</>}
        text={`${total} consultants, embryologists, medical officers, nurses, coordinators, counsellors and support staff, each contributing to trusted, compassionate fertility care.`} />
      <div className="sticky top-[72px] z-30 border-b border-line bg-paper/90 backdrop-blur-xl">
        <div role="group" aria-label="Filter by department" className="container-x no-scrollbar flex gap-1 overflow-x-auto py-3">
          {[{ key: 'all', label: 'Everyone' }, ...team].map((t) => (
            <button key={t.key} onClick={() => setF(t.key)} aria-pressed={f === t.key} className={`whitespace-nowrap rounded-full inline-flex min-h-[2.75rem] items-center px-4 text-sm font-semibold transition ${f === t.key ? 'bg-plum text-white' : 'text-ink-2 hover:bg-mist'}`}>{t.label}</button>
          ))}
        </div>
      </div>
      <div className="container-x py-12 md:py-16">
        {shown.map((g) => (
          <section key={g.key} className="border-b border-line py-12 last:border-0">
            <div className="mb-8 flex flex-col justify-between gap-2 md:flex-row md:items-end">
              <div><p className="eyebrow mb-3">{g.label}</p><h2 className="h3 md:text-[2rem]">{g.title}</h2></div>
              <p className="max-w-md text-ink-2">{g.text}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {g.members.map((m, i) => (
                <Reveal key={m.name} delay={(i % 5) * 0.04}>
                  <div className="group">
                    <div className="overflow-hidden rounded-card bg-mist">
                      {m.img ? <img src={`/img/${m.img}.webp`} alt={m.name} loading="lazy" className="aspect-[4/5] w-full object-cover object-top transition duration-700 group-hover:scale-[1.03]" /> : <div className="grid aspect-[4/5] place-items-center"><Users className="h-8 w-8 text-muted" /></div>}
                    </div>
                    <p className="mt-3 font-semibold leading-snug">{m.name}</p>
                    <p className="text-sm text-muted">{m.role}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
      <CTABand title="Want to join this team?" text="We are always looking for caring, talented people in reproductive healthcare." />
    </>
  )
}

export function Careers() {
  useMeta('Careers', 'Join Meena IVF & Fertility Care Ltd. Careers for medical officers, nurses, embryologists and more.')
  const [sent, setSent] = useState(false)
  const [file, setFile] = useState('')
  const [fileErr, setFileErr] = useState(false)
  return (
    <>
      <PageHero crumbs={[{ label: 'About', to: '/about' }, { label: 'Careers' }]} eyebrow="Careers" title={<>Help families <em className="text-plum">begin</em>.</>}
        text="Join a passionate team that believes in compassionate care, professional excellence and continuous growth." />
      <section className="section">
        <div className="container-x grid gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <Reveal>
            <h2 className="h2">Why join our team</h2>
            <p className="mt-5 text-lg text-ink-2">We provide advanced fertility treatment and compassionate care to every patient, and a supportive environment for every professional.</p>
            <p className="mt-4 text-ink-2">We are always looking for talented, motivated and caring people who want to make a real difference in reproductive healthcare.</p>
            <div className="mt-8 flex flex-wrap gap-2">{['Medical Officer', 'Nurse', 'Embryologist', 'Administration', 'Marketing', 'Customer Support'].map((d) => <span key={d} className="chip">{d}</span>)}</div>
            <img src="/img/event-6.webp" alt="The Meena IVF team at the Banani centre" loading="lazy" className="mt-10 aspect-[4/3] w-full rounded-panel object-cover" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card p-6 md:p-10">
              {sent ? (
                <div className="py-10 text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ok text-white"><Check className="h-7 w-7" /></span>
                  <p className="mt-5 font-display text-2xl">Application received.</p>
                  <p className="mt-2 text-muted">Demo preview: in the live site this goes to {site.careersEmail}.</p>
                </div>
              ) : (
                <form noValidate onSubmit={(e) => { e.preventDefault(); const f = e.target as HTMLFormElement; setFileErr(!file); const valid = f.reportValidity(); if (valid && file) setSent(true) }} className="grid gap-5 sm:grid-cols-2">
                  <h2 className="h3 sm:col-span-2">Submit your CV</h2>
                  <div><label htmlFor="c-name" className="label">Full name <span className="text-plum">*</span></label><input id="c-name" required autoComplete="name" className="field" /></div>
                  <div><label htmlFor="c-email" className="label">Email <span className="text-plum">*</span></label><input id="c-email" type="email" required autoComplete="email" className="field" /></div>
                  <div><label htmlFor="c-phone" className="label">Phone <span className="text-plum">*</span></label><input id="c-phone" type="tel" required autoComplete="tel" className="field" /></div>
                  <div><label htmlFor="c-dept" className="label">Position <span className="text-plum">*</span></label>
                    <select id="c-dept" required className="field" defaultValue=""><option value="" disabled>Select department</option>{['Medical Officer', 'Nurse', 'Embryologist', 'Administration', 'Marketing', 'Customer Support'].map((d) => <option key={d}>{d}</option>)}</select></div>
                  <div className="sm:col-span-2"><label htmlFor="c-exp" className="label">Years of experience</label><input id="c-exp" type="number" min={0} max={50} className="field" /></div>
                  <div className="sm:col-span-2"><label htmlFor="c-msg" className="label">Short message</label><textarea id="c-msg" rows={3} className="field !py-3" /></div>
                  <div className="sm:col-span-2">
                    <span className="label">CV <span className="text-plum">*</span></span>
                    <label htmlFor="c-cv" className="flex cursor-pointer items-center gap-4 rounded-card border border-dashed border-ink/20 p-5 transition hover:border-plum hover:bg-mist/50">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-lilac text-plum"><Upload className="h-5 w-5" /></span>
                      <span className="text-sm"><span className="block font-semibold">{file || 'Upload your CV'}</span><span className="text-muted">PDF or Word, up to 5 MB</span></span>
                    </label>
                    <input id="c-cv" type="file" accept=".pdf,.doc,.docx" className="sr-only" aria-describedby="c-cv-err" onChange={(e) => { setFile(e.target.files?.[0]?.name ?? ''); setFileErr(false) }} />
                    {fileErr && <p id="c-cv-err" className="mt-1.5 text-sm text-err">Please attach your CV.</p>}
                  </div>
                  <button className="btn-primary sm:col-span-2 sm:justify-self-start">Submit application <ArrowRight className="h-4 w-4" /></button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
