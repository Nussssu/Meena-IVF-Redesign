export const site = {
  name: 'Meena IVF & Fertility Care',
  legal: 'Meena IVF & Fertility Care Ltd.',
  tagline: 'Where family begins',
  hotline: '01318-258807',
  hotlineHref: 'tel:+8801318258807',
  phone2: '+88 09611 678979',
  phone2Href: 'tel:+8809611678979',
  whatsapp: '8801318258807',
  email: 'info@meenaivf.com',
  careEmail: 'care@meenaivf.com',
  careersEmail: 'careers@meenaivf.com',
  address: 'House 11, Road 22, Block K, Banani, Dhaka 1213, Bangladesh',
  addressBn: 'বাড়ি-১১, রোড-২২, ব্লক-কে, বনানী, ঢাকা-১২১৩, বাংলাদেশ',
  hours: 'Saturday – Thursday, 9 AM – 5 PM',
  social: {
    facebook: 'https://www.facebook.com/meenaivf',
    instagram: 'https://www.instagram.com/meenaivfandfertilitycare/',
    youtube: 'https://www.youtube.com/@MeenaIVF',
    linkedin: 'https://www.linkedin.com/company/71332479',
  },
  // Figures published on the clinic's current website.
  stats: [
    { value: 300, suffix: '+', label: 'IVF babies born' },
    { value: 65, suffix: '%', label: 'Success rate' },
    { value: 5, suffix: '', label: 'Senior fertility consultants' },
    { value: 3, suffix: '', label: 'Centres across Bangladesh' },
  ],
}

export const waLink = (text = 'Hello Meena IVF, I would like to know more about fertility consultation.') =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`

export const nav = [
  { label: 'Treatments', to: '/treatments', mega: true },
  {
    label: 'About', to: '/about', children: [
      { label: 'About Meena IVF', to: '/about', desc: 'Our mission, leadership and story' },
      { label: 'Why Meena', to: '/why-meena', desc: 'What makes our care different' },
      { label: 'Our team', to: '/team', desc: 'The people behind every journey' },
    ],
  },
  {
    label: 'Centres', to: '/centres', children: [
      { label: 'Banani Centre', to: '/centres/banani', desc: 'Main treatment centre, Dhaka' },
      { label: 'Khulna OPD', to: '/centres/khulna', desc: 'Monthly OPD · 2nd Friday' },
      { label: 'Cumilla OPD', to: '/centres/cumilla', desc: 'Monthly OPD · 2nd Tuesday' },
    ],
  },
  { label: 'Blog', to: '/blog' },
  { label: 'Journeys', to: '/resources' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
] as const
