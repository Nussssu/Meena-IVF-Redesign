import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Play, Search, X } from 'lucide-react'
import { Accordion, CTABand, PageHero, Reveal, SectionHeader, SliderArrows, useMeta } from '../components/ui'
import { TestimonialCard } from '../components/cards'
import { events, eventTypes, faqs, testimonials, videos } from '../data/content'
import blog from '../data/blog.json'
import NotFound from './NotFound'
import { lockScroll } from '../lib/smooth'

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

export function Blog() {
  useMeta('Fertility blog', 'Doctor-informed fertility articles in Bangla: AMH, azoospermia, IVF and success stories.')
  const cats = ['All', ...new Set(blog.flatMap((p) => p.categories))]
  const [c, setC] = useState('All')
  const posts = blog.slice().reverse().filter((p) => c === 'All' || p.categories.includes(c))
  const [feat, ...rest] = posts
  return (
    <>
      <PageHero crumbs={[{ label: 'Journeys', to: '/resources' }, { label: 'Blog' }]} eyebrow="Meena IVF blog" title={<>Fertility knowledge that <em className="text-plum">calms</em> the mind.</>}
        text={<span lang="bn" className="font-bn">নির্ভরযোগ্য fertility insights, IVF/IUI সচেতনতা, এবং চিকিৎসার প্রতিটি ধাপে সহায়ক তথ্য, বিশেষজ্ঞদের পরামর্শে।</span>} />
      <div className="container-x py-12 md:py-16">
        <div role="group" aria-label="Filter by category" className="no-scrollbar -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
          {cats.map((x) => <button key={x} onClick={() => setC(x)} aria-pressed={c === x} className={`whitespace-nowrap rounded-full border inline-flex min-h-[2.75rem] items-center px-4 text-sm font-semibold transition ${c === x ? 'border-plum bg-plum text-white' : 'border-line bg-white text-ink-2 hover:border-plum/40'}`}>{x}</button>)}
        </div>
        {feat && (
          <Reveal>
            <Link to={`/blog/${feat.slug}`} className="group grid overflow-hidden rounded-panel border border-line bg-white md:grid-cols-2">
              <div className="aspect-[16/10] overflow-hidden bg-mist md:aspect-auto"><img src={feat.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
              <div className="flex flex-col justify-center p-7 md:p-12">
                <p className="text-sm text-muted">{feat.categories.join(' · ')} · {feat.readMinutes} min read</p>
                <h2 lang="bn" className="mt-3 font-bn text-3xl font-semibold leading-snug group-hover:text-plum md:text-4xl">{feat.title}</h2>
                <p lang="bn" className="mt-4 line-clamp-3 font-bn text-lg text-ink-2">{feat.excerpt}</p>
                <p className="mt-6 text-sm text-muted">{feat.author} · {fmtDate(feat.date)}</p>
              </div>
            </Link>
          </Reveal>
        )}
        {/* phones: swipe slider; tablet/desktop: three across */}
        <div className="m-slider mt-10 grid gap-8 md:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link to={`/blog/${p.slug}`} className="group block">
                <div className="aspect-[16/10] overflow-hidden rounded-card bg-mist"><img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
                <p className="mt-4 text-sm text-muted">{p.categories.join(' · ')} · {p.readMinutes} min</p>
                <h3 lang="bn" className="mt-2 font-bn text-xl font-semibold leading-snug group-hover:text-plum">{p.title}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
        <SliderArrows label="articles" />
      </div>
      <CTABand title="Confused about symptoms, tests or treatment?" text="Talk to our specialists about your reports or treatment plan. The right guidance at the right time helps you decide with confidence." />
    </>
  )
}

export function BlogPost() {
  const { slug } = useParams()
  const p = blog.find((x) => x.slug === slug)
  useMeta(p?.title ?? 'Not found', p?.excerpt)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const on = () => { const h = document.documentElement; setProgress(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) }
    window.addEventListener('scroll', on, { passive: true }); return () => window.removeEventListener('scroll', on)
  }, [])
  if (!p) return <NotFound />
  const others = blog.filter((x) => x.slug !== p.slug).slice(0, 3)
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-plum" style={{ transform: `scaleX(${progress})` }} aria-hidden />
      <article className="pb-16 pt-28 md:pt-36">
        <header className="container-x max-w-5xl">
          <Link to="/blog" className="link-quiet mb-8"><ArrowLeft className="h-4 w-4" /> All articles</Link>
          <div className="flex flex-wrap gap-2">{p.categories.map((c) => <span key={c} className="chip">{c}</span>)}</div>
          <h1 lang="bn" className="mt-5 font-bn text-4xl font-semibold leading-tight tracking-normal md:text-5xl">{p.title}</h1>
          <p className="mt-5 text-muted">{p.author} · {fmtDate(p.date)} · {p.readMinutes} min read</p>
        </header>
        <div className="container-x mt-10 max-w-5xl"><img src={p.image} alt="" className="w-full rounded-panel" /></div>
        {/* article body (Bangla): justified */}
        <div lang="bn" className="container-x mt-12 max-w-5xl space-y-6 text-justify font-bn text-[1.1875rem] leading-[1.9] text-ink-2">
          {p.body.map((para, i) => <p key={i} className={i === 0 ? 'text-[1.3125rem] text-ink' : ''}>{para}</p>)}
        </div>
        <div className="container-x mt-14 max-w-5xl">
          <div className="rounded-panel bg-mist p-7 md:p-9">
            <p lang="bn" className="font-bn text-2xl font-semibold">আপনার প্রশ্ন আছে?</p>
            <p className="mt-2 text-ink-2">Talk to our fertility specialists for personalised guidance.</p>
            <Link to="/book" className="btn-primary mt-5">Book a consultation</Link>
          </div>
        </div>
      </article>
      <section className="section bg-white">
        <div className="container-x">
          <h2 className="h2 mb-10 text-balance">Keep <em className="text-plum">reading</em></h2>
          {/* phones: swipe slider; tablet/desktop: three across */}
          <div className="m-slider grid gap-8 md:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} to={`/blog/${o.slug}`} className="group block">
                <div className="aspect-[16/10] overflow-hidden rounded-card bg-mist"><img src={o.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
                <h3 lang="bn" className="mt-4 font-bn text-xl font-semibold leading-snug group-hover:text-plum">{o.title}</h3>
              </Link>
            ))}
          </div>
          <SliderArrows label="articles" />
        </div>
      </section>
    </>
  )
}

export function Videos() {
  useMeta('Videos', 'Infertility awareness and IVF treatment videos from Meena IVF specialists.')
  const [playing, setPlaying] = useState<string | null>(null)
  return (
    <>
      <PageHero crumbs={[{ label: 'Journeys', to: '/resources' }, { label: 'Videos' }]} eyebrow="Videos" title={<>Hear it from our <em className="text-plum">specialists</em>.</>}
        text="Awareness talks that demystify infertility: its causes, the treatment options, and why seeking help early matters." />
      <section className="section">
        <div className="container-x grid gap-8 md:grid-cols-2">
          {videos.map((v) => (
            <Reveal key={v.id}>
              <div className="overflow-hidden rounded-panel bg-plum-900">
                {playing === v.id ? (
                  <iframe className="aspect-video w-full" src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`} title={v.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                ) : (
                  <button onClick={() => setPlaying(v.id)} className="group relative block aspect-video w-full" aria-label={`Play video: ${v.title}`}>
                    <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover opacity-85 transition group-hover:opacity-100" />
                    <span className="absolute inset-0 grid place-items-center"><span className="grid h-20 w-20 place-items-center rounded-full bg-white/95 text-plum shadow-lift transition group-hover:scale-110"><Play className="ml-1 h-8 w-8" fill="currentColor" /></span></span>
                  </button>
                )}
              </div>
              <p className="mt-4 text-sm text-muted">{v.by}</p>
              <h2 lang="bn" className="mt-1 font-bn text-2xl font-semibold">{v.title}</h2>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section bg-mist">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-4">Male fertility</p>
            <h2 className="h2 text-balance">What is the <em className="text-plum">DFI test</em>?</h2>
            <p className="mt-5 text-lg text-ink-2">The DNA Fragmentation Index measures the percentage of sperm with damaged or fragmented DNA, going beyond standard count, motility and morphology. Meena IVF offers DFI testing as part of comprehensive male infertility assessment.</p>
            <p className="mt-6 font-semibold">Recommended for:</p>
            <ul className="mt-3 space-y-2 text-ink-2">
              <li>· Recurrent miscarriage or repeated IVF/ICSI failure</li>
              <li>· Unexplained male or couple infertility</li>
              <li>· Men aged 40+, smokers, alcohol users, varicocele, or toxin exposure</li>
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="grid gap-3 self-center">
            {[['Below 15–20%', 'Normal or high fertility potential', 'bg-ok/10 text-ok'], ['20–29%', 'Moderate or fair DNA integrity', 'bg-honey/15 text-[#8a5f0f]'], ['30% and above', 'High fragmentation; lowers natural and IVF/ICSI success', 'bg-err/10 text-err']].map(([r, d, c]) => (
              <div key={r} className="flex items-center gap-5 rounded-card bg-white p-5">
                <span className={`rounded-full px-3 py-1.5 font-display text-lg ${c}`}>{r}</span><span className="text-ink-2">{d}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
      <CTABand />
    </>
  )
}

export function Events() {
  useMeta('Events & gallery', 'MOU partnerships, free consultation programmes and special moments at Meena IVF.')
  const cats = ['All', ...new Set(events.map((e) => e.cat))]
  const [c, setC] = useState('All')
  const list = events.filter((e) => c === 'All' || e.cat === c)
  const [open, setOpen] = useState<number | null>(null)
  useEffect(() => () => lockScroll(false), [])
  useEffect(() => {
    lockScroll(open !== null)
    if (open === null) return
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((o) => (o! + 1) % list.length)
      if (e.key === 'ArrowLeft') setOpen((o) => (o! - 1 + list.length) % list.length)
    }
    window.addEventListener('keydown', on); return () => window.removeEventListener('keydown', on)
  }, [open, list.length])
  return (
    <>
      <PageHero crumbs={[{ label: 'Journeys', to: '/resources' }, { label: 'Events & gallery' }]} eyebrow="Events & gallery" title={<>Moments that bring care <em className="text-plum">closer</em>.</>}
        text="Partnerships, free consultation programmes and celebrations with the families and communities we serve." />
      <section className="section">
        <div className="container-x">
          {/* phones: swipe slider; tablet/desktop: three across */}
          <div className="m-slider grid gap-4 md:mb-14 md:grid-cols-3">
            {eventTypes.map((t, i) => <Reveal key={t.title} delay={i * 0.06} className="card p-7"><h2 className="font-display text-2xl">{t.title}</h2><p className="mt-3 text-ink-2">{t.text}</p></Reveal>)}
          </div>
          <SliderArrows className="mb-14" />
          <div role="group" aria-label="Filter gallery" className="no-scrollbar mb-8 flex gap-2 overflow-x-auto">
            {cats.map((x) => <button key={x} onClick={() => setC(x)} aria-pressed={c === x} className={`whitespace-nowrap rounded-full border inline-flex min-h-[2.75rem] items-center px-4 text-sm font-semibold transition ${c === x ? 'border-plum bg-plum text-white' : 'border-line bg-white text-ink-2'}`}>{x}</button>)}
          </div>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {list.map((e, i) => (
              <button key={e.img} onClick={() => setOpen(i)} className="group relative block w-full break-inside-avoid overflow-hidden rounded-card text-left" aria-label={`Open photo: ${e.title}`}>
                <img src={`/img/${e.img}.webp`} alt={e.title} loading="lazy" className="w-full transition duration-700 group-hover:scale-[1.03]" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum-900/85 to-transparent p-4 pt-12 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="block text-xs uppercase tracking-wider text-lilac">{e.cat}</span><span className="font-semibold">{e.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
      <AnimatePresence>
        {open !== null && (
          <motion.div data-lenis-prevent role="dialog" aria-modal="true" aria-label={list[open].title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] grid place-items-center bg-plum-900/95 p-4" onClick={() => setOpen(null)}>
            <button autoFocus className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close" onClick={() => setOpen(null)}><X className="h-6 w-6" /></button>
            <button className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + list.length) % list.length) }}><ChevronLeft className="h-6 w-6" /></button>
            <button className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % list.length) }}><ChevronRight className="h-6 w-6" /></button>
            <figure onClick={(e) => e.stopPropagation()} className="max-w-4xl">
              <img src={`/img/${list[open].img}.webp`} alt={list[open].title} className="max-h-[78vh] w-auto rounded-card" />
              <figcaption className="mt-4 text-center text-white"><span className="text-sm text-lilac">{list[open].cat} · {open + 1} / {list.length}</span><br />{list[open].title}</figcaption>
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
      <CTABand />
    </>
  )
}

export function Faq() {
  useMeta('FAQ', 'Answers to common questions about infertility, IVF, IUI, consultations and appointments at Meena IVF.')
  const cats = ['All', ...new Set(faqs.map((f) => f.cat))]
  const [c, setC] = useState('All')
  const [q, setQ] = useState('')
  const list = useMemo(() => faqs.filter((f) => (c === 'All' || f.cat === c) && (f.q + f.a).toLowerCase().includes(q.toLowerCase().trim())), [c, q])
  return (
    <>
      <PageHero crumbs={[{ label: 'Journeys', to: '/resources' }, { label: 'FAQ' }]} eyebrow="Frequently asked questions" title={<>Your questions, answered with <em className="text-plum">care</em>.</>}
        text="The most common questions about infertility, IVF, IUI, consultations, tests and treatment support." />
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-16">
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <label htmlFor="faq-search" className="sr-only">Search questions</label>
            <div className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><input id="faq-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions" className="field !pl-11" /></div>
            <div role="group" aria-label="Topics" className="no-scrollbar mt-4 flex gap-2 overflow-x-auto lg:flex-col">
              {cats.map((x) => <button key={x} onClick={() => setC(x)} aria-pressed={c === x} className={`whitespace-nowrap rounded-full inline-flex min-h-[2.75rem] items-center px-4 text-left text-sm font-semibold transition lg:rounded-xl ${c === x ? 'bg-plum text-white' : 'text-ink-2 hover:bg-mist'}`}>{x} <span className="opacity-60">{x === 'All' ? faqs.length : faqs.filter((f) => f.cat === x).length}</span></button>)}
            </div>
          </aside>
          <div className="min-w-0">
            {list.length ? <Accordion key={c + q} items={list} defaultOpen={0} /> : (
              <div className="rounded-panel border border-dashed border-line p-10 text-center">
                <p className="font-display text-2xl">No questions match “{q}”.</p>
                <p className="mt-2 text-muted">Try another word, or ask us directly. We are happy to help.</p>
                <button onClick={() => { setQ(''); setC('All') }} className="btn-secondary mt-6">Clear search</button>
              </div>
            )}
          </div>
        </div>
      </section>
      <CTABand title="Still have questions about fertility treatment?" text="Talk to our fertility experts for compassionate support, personalised guidance and the right treatment direction." />
    </>
  )
}

export function Stories() {
  useMeta('Patient stories', 'Success stories and reviews from families treated at Meena IVF & Fertility Care.')
  return (
    <>
      <PageHero crumbs={[{ label: 'Stories' }]} eyebrow="Patient stories" tone="blush" title={<>Every IVF baby carries a story of <em className="text-plum">faith</em> and determination.</>}
        text="Shared with the families’ consent, to give hope and guidance to others on the same journey." />
      <section className="section">
        <div className="container-x">
          <SectionHeader eyebrow="Miracles delivered" title="Welcome to the world." />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {['success-1', 'success-2', 'success-3', 'success-4'].map((s, i) => <Reveal key={s} delay={i * 0.06}><img src={`/img/${s}.webp`} alt="An IVF baby born to a Meena family" loading="lazy" className="aspect-square w-full rounded-card object-cover" /></Reveal>)}
          </div>
          <Reveal className="mt-6">
            <Link to="/blog/second-child-after-long-treatment" className="group grid items-center gap-6 overflow-hidden rounded-panel bg-mist md:grid-cols-[1fr_1.2fr]">
              <img src="/img/blog-second-child.webp" alt="" loading="lazy" className="h-full w-full object-cover" />
              <div className="p-7 md:p-10">
                <p className="eyebrow mb-3">Success story</p>
                <h3 lang="bn" className="font-bn text-2xl font-semibold leading-snug group-hover:text-plum md:text-3xl">দীর্ঘ চিকিৎসা গ্রহণের পর ২য় সন্তানের মুখ দেখলেন দম্পতি</h3>
                <p className="mt-3 text-ink-2">After years of trying for a second child, this couple found Dr. Lubna Yasmin and welcomed a baby boy through IVF.</p>
                <span className="link-quiet mt-5">Read the story <ArrowRight className="h-4 w-4" /></span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container-x">
          <SectionHeader eyebrow="In their words" title="What families say" />
          {/* phones: swipe slider; tablet/desktop: two across */}
          <div className="m-slider grid gap-5 md:grid-cols-2">{testimonials.map((t, i) => <Reveal key={t.name} delay={(i % 2) * 0.06} className="[&>*]:h-full"><TestimonialCard t={t} /></Reveal>)}</div>
          <SliderArrows label="stories" />
        </div>
      </section>
      <section className="section">
        <div className="container-x">
          <SectionHeader eyebrow="Patient reviews" title="Shared on WhatsApp and social media" text="Real messages from patients, shared with their permission." />
          <div className="columns-2 gap-4 md:columns-3 lg:columns-5 [&>*]:mb-4">
            {Array.from({ length: 10 }, (_, i) => <img key={i} src={`/img/review-${i + 1}.webp`} alt="A patient review message" loading="lazy" className="w-full break-inside-avoid rounded-card border border-line" />)}
          </div>
        </div>
      </section>
      <p className="container-x pb-10 text-sm text-muted">Disclaimer: all images are used with the clear consent of the individuals involved, solely for educational and informational purposes related to infertility.</p>
      <CTABand title="Your story can begin here." />
    </>
  )
}
