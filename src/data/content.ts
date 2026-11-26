export type Centre = {
  slug: string
  name: string
  kind: 'Main treatment centre' | 'Regional OPD'
  city: string
  venue?: string
  venueBn?: string
  address: string
  addressBn: string
  schedule: string
  /** for OPDs: nth weekday of each month */
  monthly?: { nth: number; day: number }
  bestFor: string
  summary: string
  services: string[]
  image: string
  /** extra photos for the centre's own page */
  gallery?: string[]
  map: string
}

export const centres: Centre[] = [
  {
    slug: 'banani', name: 'Banani Centre', kind: 'Main treatment centre', city: 'Dhaka',
    address: 'House 11, Road 22, Block K, Banani, Dhaka 1213',
    addressBn: 'বাড়ি-১১, রোড-২২, ব্লক-কে, বনানী, ঢাকা-১২১৩',
    schedule: 'Saturday – Thursday · 9 AM – 5 PM (evening consultant chambers until 10 PM)',
    bestFor: 'Advanced evaluation, treatment and procedures',
    summary: 'Our flagship centre for comprehensive fertility evaluation, advanced treatment and specialised procedures, with an in-house IVF laboratory and operation theatre.',
    services: ['Advanced IVF laboratory', 'In-house operation theatre', 'Embryology laboratory', 'Ultrasound & diagnostics', 'Consultation rooms', 'Counselling & patient support', 'Comfortable waiting areas'],
    image: '/img/centre-banani-ref.webp',
    gallery: ['/img/banani-gallery-1.webp', '/img/banani-gallery-2.webp', '/img/banani-gallery-3.webp'],
    map: 'House 11, Road 22, Block K, Banani, Dhaka 1213',
  },
  {
    slug: 'khulna', name: 'Khulna OPD', kind: 'Regional OPD', city: 'Khulna',
    venue: 'Good Health Clinic, Diagnostic & Consultancy',
    venueBn: 'গুড হেলথ ক্লিনিক, ডায়াগনস্টিক এন্ড কনসালটেন্সি',
    address: '268 Khan Jahan Ali Road, Tutpara Koborkhana, Khulna 9100',
    addressBn: '২৬৮ খান জাহান আলী রোড, টুটপাড়া কবরখানা, খুলনা-৯১০০',
    schedule: 'Every month · 2nd Friday', monthly: { nth: 2, day: 5 },
    bestFor: 'Consultation & follow-up',
    summary: 'Consultation, initial evaluation, treatment guidance and follow-up for patients in Khulna and nearby regions, before advanced care in Dhaka when needed.',
    services: ['Fertility consultation', 'Initial evaluation', 'Treatment guidance', 'Follow-up visits'],
    image: '/img/centre-khulna-ref.webp',
    map: 'Good Health Clinic, 268 Khan Jahan Ali Road, Khulna',
  },
  {
    slug: 'cumilla', name: 'Cumilla OPD', kind: 'Regional OPD', city: 'Cumilla',
    venue: 'Comilla CT-Scan MRI Specialised Diagnostic & Dialysis Center',
    venueBn: 'কুমিল্লা সিটি স্ক্যান এমআরআই বিশেষায়িত ডায়াগনস্টিক ও ডায়ালাইসিস সেন্টার',
    address: 'Sel Fatima – Jahanara Tower (3rd Floor), Jhawtala, Cumilla',
    addressBn: 'সেল ফাতিমা – জাহানারা টাওয়ার (তৃতীয় তলা), ঝাউতলা, কুমিল্লা',
    schedule: 'Every month · 2nd Tuesday', monthly: { nth: 2, day: 2 },
    bestFor: 'Early consultation access',
    summary: 'Begin consultation, receive evaluation guidance and continue follow-up closer to home before moving to advanced treatment planning.',
    services: ['Initial consultation', 'Medical history review', 'Diagnostic guidance', 'Follow-up support'],
    image: '/img/centre-cumilla-ref.webp',
    map: 'Jahanara Tower, Jhawtala, Cumilla',
  },
]

/** Next N dates of the nth weekday of a month (e.g. 2nd Friday), from today. */
export function nextMonthly(nth: number, day: number, count = 3, from = new Date()): Date[] {
  const out: Date[] = []
  const d = new Date(from.getFullYear(), from.getMonth(), 1)
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  while (out.length < count) {
    const first = new Date(d.getFullYear(), d.getMonth(), 1)
    const offset = (day - first.getDay() + 7) % 7
    const date = new Date(d.getFullYear(), d.getMonth(), 1 + offset + (nth - 1) * 7)
    if (date >= today) out.push(date)
    d.setMonth(d.getMonth() + 1)
  }
  return out
}

export const journeys = [
  {
    key: 'conceive', label: 'Struggling to conceive',
    title: 'You are not alone. There is almost always a next step.',
    text: 'If you have been trying for a year (or six months if over 35), a careful evaluation of both partners is the right place to start. Many couples conceive with simpler treatment than they expect.',
    treatments: ['medical-history-evaluation', 'folliculometry', 'iui', 'ivf'],
    image: '/img/consult.webp',
  },
  {
    key: 'miscarriage', label: 'Trying again after miscarriage',
    title: 'Grief and hope can sit side by side. We go gently.',
    text: 'We look for treatable causes, such as uterine polyps, fibroids or a septum, and support you emotionally before you try again.',
    treatments: ['hysteroscopy', 'tvs', 'psychological-counseling', 'ivf'],
    image: '/img/patient-care.webp',
  },
  {
    key: 'preparing', label: 'Preparing for treatment',
    title: 'Clarity first: what to expect, what it costs, who will be with you.',
    text: 'Our team explains each step, gives you a transparent cost plan, and pairs you with a consultant who stays with you through the cycle.',
    treatments: ['financial-counseling', 'ivf', 'icsi', 'embryo-freezing'],
    image: '/img/doctors-duo.webp',
  },
  {
    key: 'freezing', label: 'Thinking about egg freezing',
    title: 'Keep tomorrow open, on your own timeline.',
    text: 'Egg freezing preserves the quality of your eggs today. It starts with a simple ovarian reserve check and a conversation, with no commitment.',
    treatments: ['egg-freezing', 'semen-freezing', 'embryo-freezing'],
    image: '/img/egg-2.webp',
  },
]

export const ivfJourney = [
  { title: 'Consultation', text: 'Meet your specialist. Share your history, concerns and goals.', when: 'Day 1' },
  { title: 'Evaluation', text: 'Hormone tests, ultrasound and semen analysis reveal the full picture.', when: 'Week 1' },
  { title: 'Stimulation', text: 'Medication helps the ovaries mature several eggs, tracked by scan.', when: '8–12 days' },
  { title: 'Egg retrieval', text: 'A short procedure under sedation in our in-house OT.', when: 'Day 0' },
  { title: 'In the lab', text: 'IVF or ICSI fertilisation, then embryos grow under expert watch.', when: 'Days 1–5' },
  { title: 'Transfer & test', text: 'A quick, painless embryo transfer. Pregnancy test 10–14 days later.', when: '4–6 weeks total' },
]

export const whyMeena = [
  { title: 'Self-cycle first', text: 'Self-cycle has always been our most recommended option for couples seeking reproductive treatment.' },
  { title: 'In-house OT & IVF lab', text: 'Egg retrieval, embryo transfer and sperm retrieval are performed safely under one roof.' },
  { title: 'Personalised plans', text: 'Every patient receives a plan designed around their medical history, condition and goals.' },
  { title: 'Transparent & affordable', text: 'Clear pricing with no hidden costs, explained by our financial counsellors.' },
  { title: 'Complete support', text: 'Psychological counselling and continuous guidance through every stage.' },
  { title: 'Proven protocols', text: 'Internationally recognised treatment protocols for consistent, positive outcomes.' },
]

export const testimonials = [
  { quote: 'Alhamdulillah, after a long journey we finally received proper care and guidance. The doctors were extremely supportive and professional throughout the process. Today we are filled with happiness and gratitude.', name: 'Nusrat Jahan', city: 'Dhaka', date: 'Feb 2026' },
  { quote: 'We almost lost hope, but this team gave us confidence again. Their care, clear guidance, and professionalism made everything easier. We are truly thankful for their support.', name: 'Suraiya Begum', city: 'Khulna', date: 'Jun 2025' },
  { quote: 'The environment was very comfortable and caring. Every step was explained clearly, and we always felt safe. Alhamdulillah, this journey brought happiness to our family.', name: 'Farhana Akter', city: 'Chattogram', date: 'Jan 2026' },
  { quote: 'The doctors listened carefully and guided us step by step. Their kindness and expertise gave us strength. We are grateful for everything they did for us.', name: 'Rima Sultana', city: 'Rajshahi', date: 'Dec 2025' },
]

export const faqs: { cat: string; q: string; a: string }[] = [
  { cat: 'Infertility', q: 'What is infertility?', a: 'Infertility is the inability to conceive after 12 months of regular unprotected intercourse. For women over 35, it may be considered after 6 months of trying.' },
  { cat: 'Infertility', q: 'Can infertility affect both men and women?', a: 'Yes. Infertility can affect both partners, and male infertility contributes to about 40–50% of cases.' },
  { cat: 'Infertility', q: 'Can lifestyle factors affect fertility?', a: 'Yes. Smoking, alcohol, stress, poor diet and obesity can affect fertility. A healthy lifestyle can improve outcomes.' },
  { cat: 'Consultation', q: 'When should we consult a fertility specialist?', a: 'If you have been trying for one year without success, the woman is over 35 and has been trying for six months, cycles are irregular, or there are known reproductive health issues.' },
  { cat: 'Consultation', q: 'What happens during the first consultation?', a: 'The doctor reviews your medical history, lifestyle and concerns, may recommend tests to find the cause, and discusses suitable treatment options.' },
  { cat: 'Consultation', q: 'What tests are required before treatment?', a: 'Common tests include hormone blood tests, ultrasound scans, semen analysis, ovarian reserve testing, and evaluation of the uterus and fallopian tubes.' },
  { cat: 'IVF', q: 'What is IVF?', a: 'Eggs are collected from the ovaries and fertilized with sperm in a laboratory. The resulting embryo is transferred into the uterus to achieve pregnancy.' },
  { cat: 'IVF', q: 'Who needs IVF?', a: 'Couples with blocked or damaged tubes, severe male infertility, ovulation disorders, endometriosis, unexplained infertility, advanced maternal age, or when treatments like IUI have not worked.' },
  { cat: 'IVF', q: 'How long does the IVF process take?', a: 'A typical cycle takes about 4 to 6 weeks, including stimulation, egg retrieval, fertilization, embryo development and transfer.' },
  { cat: 'IVF', q: 'Is IVF treatment painful?', a: 'Most procedures cause minimal discomfort. Egg retrieval is usually performed under sedation.' },
  { cat: 'IVF', q: 'What is the success rate of IVF?', a: 'It varies with age, cause of infertility, egg and sperm quality and overall health.' },
  { cat: 'Treatment process', q: 'What is embryo transfer?', a: 'A selected embryo is placed in the uterus with a thin catheter. It is usually quick and painless.' },
  { cat: 'Treatment process', q: 'What happens after embryo transfer?', a: 'You may be advised to rest and continue medication to support implantation. A pregnancy test is usually done 10–14 days later.' },
  { cat: 'IUI', q: 'What is IUI?', a: 'Specially prepared sperm is placed directly into the uterus during ovulation to increase the chance of fertilization.' },
  { cat: 'IUI', q: 'Who should consider IUI?', a: 'Couples with mild male infertility, ovulation problems, unexplained infertility, or cervical mucus issues.' },
  { cat: 'IUI', q: 'Is IUI painful?', a: 'IUI is generally simple and painless; some women feel mild discomfort similar to a routine examination.' },
  { cat: 'Appointment', q: 'How can I book an appointment?', a: 'Call our hotline 01318-258807, message us on WhatsApp, use the online booking form, or visit the Banani centre directly.' },
  { cat: 'Appointment', q: 'Do you offer consultations outside Dhaka?', a: 'Yes. Our Khulna OPD runs every 2nd Friday and our Cumilla OPD every 2nd Tuesday of the month. Online consultation is also available.' },
]

export type Member = { name: string; role: string; img?: string }
export const team: { key: string; label: string; title: string; text: string; members: Member[] }[] = [
  { key: 'consultant', label: 'Consultants', title: 'Expert fertility leadership', text: 'Senior consultants who guide every journey with expertise and compassion.', members: [
    { name: 'Dr. Lubna Yasmin', role: 'Chief Consultant', img: 't-lubna' },
    { name: 'Dr. Natasha Tiluttoma Aleem', role: 'Senior Consultant', img: 't-natasha' },
    { name: 'Dr. Shamima Nargis Neela', role: 'Consultant', img: 't-shamima' },
    { name: 'Prof. Dr. Bilkis Parvin', role: 'Consultant', img: 't-bilkis' },
  ] },
  { key: 'embryology', label: 'Embryology', title: 'Precision in every step', text: 'Skill, care and laboratory precision for the best possible outcomes.', members: [
    { name: 'Soumojit Paul', role: 'Head of Embryology', img: 'embryo-team' },
    { name: 'Shah Md Ariful Hoq', role: 'Embryologist', img: 't-ariful' },
    { name: 'Md. Sabbir Hossain', role: 'Trainee Embryologist', img: 't-sabbir' },
    { name: 'Md. Nayeem', role: 'Trainee Embryologist', img: 't-nayeem' },
    { name: 'Shaurov Mondal', role: 'Phlebotomist', img: 't-shaurov' },
  ] },
  { key: 'medical', label: 'Medical officers', title: 'Dedicated clinical support', text: 'Attentive, patient-focused care through every stage of treatment.', members: [
    { name: 'Dr. Iffat Ara', role: 'Senior Medical Officer', img: 't-iffat' },
    { name: 'Dr. Rebeka Sultana', role: 'Medical Officer', img: 't-rebeka' },
    { name: 'Dr. Rokeya S Jinia', role: 'Medical Officer', img: 't-jinia' },
    { name: 'Dr. Snigdha Haiat', role: 'Medical Officer', img: 't-snigdha' },
  ] },
  { key: 'coordination', label: 'Coordination & counselling', title: 'Seamless guidance, emotional care', text: 'Coordinators and counsellors who help you navigate with clarity and feel understood.', members: [
    { name: 'Synthya Afrin', role: 'Clinical Coordinator', img: 't-synthya' },
    { name: 'Stela Das', role: 'Clinical Coordinator', img: 't-stela' },
    { name: 'Fahmida Akter Eva', role: 'Psychological Counselor', img: 't-eva' },
  ] },
  { key: 'nursing', label: 'Nurse & OT', title: 'Skilled hands, caring hearts', text: 'Compassionate bedside care and procedural support.', members: [
    { name: 'Nishat Islam', role: 'Nurse (OPD In-Charge)', img: 't-nishat' },
    { name: 'Most. Tajkia Yesmin', role: 'Senior Staff Nurse', img: 't-tajkia' },
    { name: 'Simja Ritchil', role: 'Senior Staff Nurse', img: 't-simja' },
    { name: 'Asma Akter Shammy', role: 'A Grade Pharmacist', img: 't-shammy' },
    { name: 'Md Sumon', role: 'Senior Assistant (Lab & OT)', img: 't-sumon' },
    { name: 'Md Afzal Hossen Ashik', role: 'Staff Nurse', img: 't-ashik' },
    { name: 'Beli Ghagra', role: 'Staff Nurse', img: 't-beli' },
    { name: 'Hasna Islam Sathi', role: 'Medical Technologist', img: 't-sathi' },
    { name: 'Tonima Chisim', role: 'Staff Nurse', img: 't-tonima' },
  ] },
  { key: 'operations', label: 'Operations', title: 'Behind every smooth experience', text: 'Efficient daily processes that keep the centre running with excellence.', members: [
    { name: 'Mehmud Hasan Joy', role: 'Senior Manager', img: 't-joy' },
    { name: 'Tanij Mojumdar', role: 'Floor In-Charge', img: 't-tanij' },
    { name: 'Smriti Sarker', role: 'IPD Manager', img: 't-smriti' },
    { name: 'Mushfikur Rahaman', role: 'Senior Executive (Digital Marketing)', img: 't-mushfikur' },
    { name: 'Sonia Akter', role: 'Senior Executive (CC In-Charge)', img: 't-sonia' },
    { name: 'Jannatul Ferdous', role: 'Executive (CC & Billing)', img: 't-jannatul' },
    { name: 'Ismat Ara', role: 'Executive (CC & Billing)', img: 't-ismat' },
  ] },
  { key: 'business', label: 'Business development', title: 'Growth, strategy, partnerships', text: 'Unlocking partnerships that bring fertility care to more families.', members: [
    { name: 'Md Sariful Islam', role: 'Manager (Business Development)', img: 't-sariful' },
    { name: 'Rayhan Uddin', role: 'Executive', img: 't-rayhan' },
    { name: 'Mushfiquzzaman', role: 'Executive', img: 't-mushfiq' },
  ] },
  { key: 'facilities', label: 'Facilities', title: 'Clean, safe, comfortable', text: 'A hygienic, safe and welcoming environment for everyone.', members: [
    { name: 'Md. Selim Uddin', role: 'Security Guard', img: 't-selim' },
    { name: 'Kamrujjaman Kazi', role: 'Care Taker', img: 't-kamrul' },
    { name: 'Lipi Akter', role: 'Janitor', img: 't-lipi' },
    { name: 'Yeasmin Begum', role: 'Janitor', img: 't-yeasmin' },
  ] },
]

export const events = [
  { img: 'event-5', title: 'Agreement signing with Prime Bank PLC', cat: 'Partnerships' },
  { img: 'event-4', title: 'Agreement signing with Pubali Bank PLC', cat: 'Partnerships' },
  { img: 'event-mou', title: 'Media coverage: Prime Bank MOU', cat: 'Partnerships' },
  { img: 'event-cu', title: 'Visit from University of Chittagong, Biochemistry & Molecular Biology', cat: 'Partnerships' },
  { img: 'event-1', title: 'Patient awareness session at Banani', cat: 'Awareness' },
  { img: 'centre-khulna', title: 'Khulna OPD camp', cat: 'Awareness' },
  { img: 'event-2', title: 'The Meena IVF family', cat: 'Special moments' },
  { img: 'event-6', title: 'Our team at the Banani centre', cat: 'Special moments' },
  { img: 'event-7', title: 'Celebrating together', cat: 'Special moments' },
  { img: 'event-3', title: 'Welcoming guests', cat: 'Special moments' },
]

export const eventTypes = [
  { title: 'MOU partnerships', text: 'We collaborate with corporate organisations, hospitals and healthcare institutions to widen access to fertility care and awareness.' },
  { title: 'LTF free consultation', text: 'Limited Time Free consultation programmes let individuals, couples and corporate partners speak with our specialists at no cost.' },
  { title: 'Special moments', text: 'Women’s Day, awareness initiatives and community events that reflect our commitment to families.' },
]

export const videos = [
  { id: '7EyDjOzENQI', title: 'বন্ধ্যাত্ব চিকিৎসায় আইভিএফ ও তার খুঁটিনাটি', by: 'Dr. Lubna Yasmin' },
  { id: 'yCQIslCB3t0', title: 'Infertility awareness & IVF treatment', by: 'Meena IVF' },
]

// Every public video on the Meena IVF YouTube channel (youtube.com/@MeenaIVF), newest first; titles tidied (no hashtags or emoji)
export const channelVideos = [
  { id: 'ZjTCXipjjXE', title: 'Dr. Lubna Yasmin talks about infertility and treatments', by: 'Dr. Lubna Yasmin' },
  { id: '7EyDjOzENQI', title: 'DFI Test কি? কাদের জন্য?', by: 'Meena IVF' },
  { id: 'U0W_qTq0u88', title: 'বাচ্চা হচ্ছে না? কোন টেস্টগুলো আগে করা উচিত?', by: 'Meena IVF' },
  { id: 'kCrZMzvJc3w', title: 'Facts about PCOS', by: 'Dr. Lubna Yasmin' },
  { id: 'hGmfHXthxMc', title: 'Low AMH নিয়ে যত ভুল ধারণা', by: 'Meena IVF' },
  { id: 'vx_np_clnL4', title: 'Facts about PCOS', by: 'Meena IVF' },
  { id: 'RsD8Iy4S0DA', title: 'What is PGT in IVF?', by: 'Dr. Lubna Yasmin' },
]

export const milestones = [
  { year: '2025', title: 'The beginning', text: 'Meena IVF & Fertility Care began with a vision of trusted fertility care with compassion and expertise.' },
  { year: '2025', title: 'Service expansion', text: 'Clinical systems strengthened; fertility support expanded for patients seeking modern treatment.' },
  { year: '2026', title: 'Advanced treatment focus', text: 'Updated reproductive care pathways and more patient-centred support.' },
  { year: 'Today', title: 'Growing with trust', text: 'Three centres, a team of nearly 40 and families welcoming their babies.' },
]
