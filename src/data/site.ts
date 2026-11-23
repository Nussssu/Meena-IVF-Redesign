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
  { label: 'Doctors', to: '/doctors' },
  {
    label: 'About', to: '/about', children: [
      { label: 'About Meena IVF', to: '/about', desc: 'Our mission, leadership and story' },
      { label: 'Why Meena', to: '/why-meena', desc: 'What makes our care different' },
      { label: 'Our team', to: '/team', desc: 'The people behind every journey' },
      { label: 'Careers', to: '/careers', desc: 'Join the Meena family' },
    ],
  },
  { label: 'Centres', to: '/centres' },
  { label: 'Stories', to: '/stories' },
  {
    label: 'Learn', to: '/blog', children: [
      { label: 'Fertility blog', to: '/blog', desc: 'Doctor-informed articles in Bangla' },
      { label: 'Videos', to: '/videos', desc: 'Talks from our specialists' },
      { label: 'Events & gallery', to: '/events', desc: 'Camps, MOUs and special moments' },
      { label: 'FAQ', to: '/faq', desc: 'Your questions, answered with care' },
    ],
  },
] as const
