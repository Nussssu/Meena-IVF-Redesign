export type Session = { day: number; from: string; to: string } // day: 0 = Sunday … 6 = Saturday

export type Doctor = {
  slug: string
  name: string
  short: string
  title: string
  role: string
  experience: number
  image: string
  tint: 'lilac' | 'blush' | 'mist'
  focus: string[]
  qualificationsShort: string[]
  intro: string
  about: string[]
  stats: { value: string; label: string }[]
  qualifications: { title: string; detail: string }[]
  schedule: Session[]
  phone: string
  treatments: string[]
}

const satToThu = [6, 0, 1, 2, 3, 4]

export const doctors: Doctor[] = [
  {
    slug: 'dr-lubna-yasmin',
    name: 'Dr. Lubna Yasmin',
    short: 'Dr. Lubna',
    title: 'Chief Consultant',
    role: 'Gynecologist, Obstetrician & Infertility Specialist',
    experience: 15,
    image: '/img/dr-lubna.webp',
    tint: 'lilac',
    focus: ['IVF', 'ICSI', 'IUI', 'PCOS Management', 'Reproductive Endocrinology', 'Male & Female Infertility', 'Fertility Preservation'],
    qualificationsShort: ['MBBS, FCPS (Obstetrics & Gynaecology)', 'Diploma in ART, Mumbai', 'Advanced Training in ART – NOVA IVF, India'],
    intro: 'Dedicated to evidence-based fertility care with a patient-centered approach, helping couples achieve their dream of parenthood.',
    about: [
      'Dr. Lubna Yasmin is a highly experienced Gynecologist, Obstetrician and Infertility Specialist with extensive expertise in reproductive medicine and assisted reproductive technology. She completed her MBBS in 2001 and achieved her FCPS in Gynecology & Obstetrics from the Bangladesh College of Physicians and Surgeons (BCPS) in 2011.',
      'To strengthen her specialisation, she obtained a Diploma in Assisted Reproductive Technology from the International School of Reproductive Medicine & Embryology, Mumbai, and completed Advanced Training in ART at NOVA IVF Fertility, Ahmedabad.',
      'She is trained in gynecological laparoscopy, hysteroscopy and medical ultrasonography, enabling her to diagnose and treat complex infertility cases with minimally invasive techniques. She served as a Consultant at Motherhood Fertility East from March 2020 before becoming Chief Consultant at Meena IVF & Fertility Care.',
    ],
    stats: [
      { value: '15+', label: 'Years in gynecology' },
      { value: '8+', label: 'Years in infertility' },
      { value: '5000+', label: 'Patients treated' },
      { value: '4.9/5', label: 'Patient rating' },
    ],
    qualifications: [
      { title: 'MBBS', detail: 'Bachelor of Medicine and Bachelor of Surgery, 2001' },
      { title: 'FCPS (Obstetrics & Gynaecology)', detail: 'Bangladesh College of Physicians and Surgeons (BCPS), 2011' },
      { title: 'Diploma in Assisted Reproductive Technology', detail: 'International School of Reproductive Medicine & Embryology, Mumbai' },
      { title: 'Advanced Training in ART', detail: 'NOVA IVF Fertility, Ahmedabad, India' },
      { title: 'Gynecological Laparoscopy & Hysteroscopy', detail: 'Professional training in minimally invasive surgery' },
      { title: 'Medical Ultrasonography', detail: 'Diagnostic imaging for reproductive health' },
    ],
    schedule: satToThu.map((day) => ({ day, from: '9:00 AM', to: '5:00 PM' })),
    phone: '+8801318258807',
    treatments: ['ivf', 'icsi', 'iui', 'egg-freezing', 'semen-freezing', 'embryo-freezing', 'folliculometry'],
  },
  {
    slug: 'dr-natasha-tiluttoma-aleem',
    name: 'Dr. Natasha Tiluttoma Aleem',
    short: 'Dr. Natasha',
    title: 'Senior Consultant',
    role: 'Gynaecologist, Obstetrician & Infertility Specialist',
    experience: 15,
    image: '/img/dr-natasha.webp',
    tint: 'blush',
    focus: ['IVF', 'Infertility Treatment', 'ART', 'Laparoscopic Surgery', 'Hysteroscopic Surgery', 'Male & Female Infertility', 'Reproductive Health'],
    qualificationsShort: ['MBBS, FCPS (Gynaecology & Obstetrics)', 'Fellowship in ART (IVF), India', 'Diploma in ART, Germany'],
    intro: 'Specialised in assisted reproductive technology and laparoscopic & hysteroscopic surgery, delivering comprehensive fertility care with compassion.',
    about: [
      'Dr. Natasha Tiluttoma Aleem obtained her MBBS from Sher-E-Bangla Medical College and Hospital and her FCPS in Gynae & Obs from the Bangladesh College of Physicians and Surgeons (BCPS).',
      'She trained in assisted reproduction and infertility investigations at the Institute of Reproductive Medicine, India; in gynaecological laparoscopy at Apollo Hospitals, Dhaka; and in Gynae & Obs at ShSMC & Hospital and MCHTI, Azimpur.',
      'She holds a Fellowship in Infertility (IVF) from India and a Diploma in Assisted Reproductive Technology (IVF) from Germany, and is skilled in laparoscopic and hysteroscopic surgery. She serves at Meena IVF as Senior Consultant – Obs, Gynae and Infertility.',
    ],
    stats: [
      { value: '15+', label: 'Years clinical experience' },
      { value: '7000+', label: 'Fertility consultations' },
      { value: '1000+', label: 'Successful fertility cycles' },
      { value: '4.9/5', label: 'Patient rating' },
    ],
    qualifications: [
      { title: 'MBBS', detail: 'Sher-E-Bangla Medical College and Hospital' },
      { title: 'FCPS (Gynaecology & Obstetrics)', detail: 'Bangladesh College of Physicians and Surgeons (BCPS)' },
      { title: 'Fellowship in Advanced Gynaecological Laparoscopy & Hysteroscopy', detail: 'Delhi, India' },
      { title: 'Diploma in Assisted Reproductive Technology', detail: 'Diploma in ART (IVF), Germany' },
      { title: 'Assisted Reproduction Training', detail: 'Institute of Reproductive Medicine, India' },
      { title: 'Gynaecological Laparoscopy', detail: 'Apollo Hospitals, Dhaka' },
    ],
    schedule: [6, 1, 3].map((day) => ({ day, from: '6:00 PM', to: '10:00 PM' })),
    phone: '+8801318258807',
    treatments: ['ivf', 'laparoscopy', 'hysteroscopy', 'laparoscopic-myomectomy'],
  },
  {
    slug: 'prof-dr-mosammat-bilkis-parvin',
    name: 'Prof. Dr. Mosammat Bilkis Parvin',
    short: 'Prof. Dr. Bilkis',
    title: 'Consultant',
    role: 'Obstetrics, Gynaecology & Infertility Specialist',
    experience: 26,
    image: '/img/dr-bilkis.webp',
    tint: 'mist',
    focus: ['Obstetrics & Gynaecology', 'Infertility Treatment', 'ART', 'Laparoscopic Surgery', 'High-Risk Pregnancy', 'Hormonal Disorders'],
    qualificationsShort: ['MBBS – Rajshahi Medical College (1997)', 'DGO – BSMMU, 2001 · FCPS – BCPS, 2008', 'ART Training – NOVA IVF, India'],
    intro: 'A trusted name in women’s health and fertility care: precision diagnosis, ethical treatment and compassionate attention.',
    about: [
      'With over 26 years of clinical experience, Prof. Dr. Mosammat Bilkis Parvin is a highly respected specialist in Obstetrics, Gynaecology and Infertility Management, helping women with everything from routine gynecological concerns to complex fertility challenges.',
      'She is Professor of Obstetrics & Gynaecology at MH Samorita Medical College & Hospital, Dhaka, where she has led academic and clinical work since 2013. Before that she served at Apollo Hospital Dhaka (now Evercare) from 2005 to 2013 as Specialist, Senior Registrar and Registrar, working extensively at the Apollo Fertility Center.',
      'She has also served as Consultant at Gazi Medical College and Honorary Medical Officer at Khulna Medical College Hospital, and completed her internship at Rajshahi Medical College Hospital.',
    ],
    stats: [
      { value: '26+', label: 'Years clinical experience' },
      { value: '15000+', label: 'Patients treated' },
      { value: '8000+', label: 'Successful treatments' },
      { value: '4.9/5', label: 'Patient rating' },
    ],
    qualifications: [
      { title: 'MBBS', detail: 'Rajshahi Medical College, 1997' },
      { title: 'DGO (Obstetrics & Gynaecology)', detail: 'Bangabandhu Sheikh Mujib Medical University (BSMMU), 2001' },
      { title: 'FCPS (Obstetrics & Gynaecology)', detail: 'Bangladesh College of Physicians and Surgeons (BCPS), 2008' },
      { title: 'Assisted Reproductive Technology', detail: 'NOVA IVF, India' },
      { title: 'Fellowship in ART', detail: 'GGIRHR, Bengaluru' },
      { title: 'Gynaecological Laparoscopic Surgery', detail: 'Chennai, India' },
      { title: 'Apollo Hospital Dhaka (Evercare)', detail: 'Specialist, Senior Registrar & Registrar – Apollo Fertility Center (2005–2013)' },
      { title: 'Professor – MH Samorita Medical College', detail: 'Teaching and clinical leadership (2013–present)' },
    ],
    schedule: [0, 2, 4].map((day) => ({ day, from: '3:00 PM', to: '5:00 PM' })),
    phone: '+8801318258807',
    treatments: ['ivf', 'laparoscopy', 'medical-history-evaluation'],
  },
  {
    slug: 'lt-col-dr-julia-akhter-nira',
    name: 'Lt Col (Dr.) Julia Akhter Nira (Ret.)',
    short: 'Dr. Julia',
    title: 'Consultant',
    role: 'Infertility & Reproductive Medicine Specialist, Obstetrician & Gynaecologist',
    experience: 25,
    image: '/img/dr-julia.webp',
    tint: 'lilac',
    focus: ['IVF', 'ICSI', 'IUI', 'PESA & TESA', 'Male & Female Infertility', 'Laparoscopy & Hysteroscopy', 'TVS for Infertility', 'Reproductive Endocrinology'],
    qualificationsShort: ['MBBS – Dhaka Medical College (1999)', 'DGO, MCPS, FCPS (Obs & Gynae)', 'FCPS (Reproductive Endocrinology & Infertility)'],
    intro: 'A distinguished military medical professional bringing precision to infertility management and advanced assisted reproduction.',
    about: [
      'Lt Col (Dr.) Julia Akhter Nira is an Obstetrician, Gynaecologist and Infertility & Reproductive Medicine Specialist with over 25 years of service in military and civilian healthcare. After her MBBS from Dhaka Medical College (1999) she earned DGO, MCPS and FCPS in Obstetrics & Gynaecology, and a second FCPS in Reproductive Endocrinology & Infertility.',
      'She served for 17 years across Combined Military Hospitals, and from 2017 to 2019 was consultant at the Fertility Center, CMH Dhaka, under Brig (retd.) RK Sharma and Col (retd.) Pankaj Talwar, gaining experience in folliculometry by TVS, IUI, IVF, ICSI, PESA and TESA. She also served as Gynae Specialist with the UN mission in the Central African Republic (2019–2020).',
      'Her teaching career spans nearly two decades, up to Associate Professor and Head of Department at Armed Forces Medical College. She has 8 research publications and is a member of ASRM, the Indian Fertility Society and OGSB.',
    ],
    stats: [
      { value: '25+', label: 'Years clinical & military' },
      { value: '12000+', label: 'Patients treated' },
      { value: '8', label: 'Research publications' },
      { value: '4.9/5', label: 'Patient rating' },
    ],
    qualifications: [
      { title: 'MBBS (1999)', detail: 'Dhaka Medical College, Dhaka' },
      { title: 'Diploma in Gynae & Obs (2006)', detail: 'Dhaka University' },
      { title: 'MCPS (2006)', detail: 'Bangladesh College of Physicians & Surgeons' },
      { title: 'FCPS – Obstetrics & Gynaecology (2009)', detail: 'Bangladesh College of Physicians & Surgeons' },
      { title: 'Residency – Infertility & Reproductive Medicine (2013–2016)', detail: 'BSMMU, Dhaka' },
      { title: 'FCPS – Reproductive Endocrinology & Infertility (2017)', detail: 'Bangladesh College of Physicians & Surgeons' },
      { title: 'Fertility Center Consultant – CMH Dhaka (2017–2019)', detail: 'IVF, ICSI, PESA and TESA under Brig RK Sharma & Col Pankaj Talwar' },
      { title: 'UN Mission – Central African Republic (2019–2020)', detail: 'Gynae Specialist, UN peacekeeping mission' },
    ],
    schedule: [0, 2, 4].map((day) => ({ day, from: '6:00 PM', to: '10:00 PM' })),
    phone: '+8801326721181',
    treatments: ['ivf', 'icsi', 'iui', 'tesa', 'trial-tesa', 'pesa', 'tvs', 'folliculometry', 'laparoscopy', 'hysteroscopy'],
  },
  {
    slug: 'dr-shamima-nargis-neela',
    name: 'Dr. Shamima Nargis Neela',
    short: 'Dr. Shamima',
    title: 'Consultant',
    role: 'Obstetrician, Gynaecologist & Infertility Specialist',
    experience: 20,
    image: '/img/dr-shamima.webp',
    tint: 'blush',
    focus: ['Infertility Treatment', 'High Risk Pregnancy', 'Painless Normal Delivery', 'Laparoscopic Surgery', 'IUI', 'Ultrasonography', 'Colposcopy'],
    qualificationsShort: ['MBBS – Dhaka Medical College', 'MCPS & FCPS (Obstetrics & Gynaecology)', 'CCD (Diabetology) – BIRDEM'],
    intro: 'Two decades of obstetric and infertility care, from IUI and ultrasonography to high-risk pregnancy and laparoscopic surgery.',
    about: [
      'Dr. Shamima Nargis Neela brings more than 20 years of experience in obstetrics, gynaecology and infertility treatment. A graduate of Dhaka Medical College, she holds MCPS and FCPS in Obstetrics & Gynaecology and a CCD in Diabetology from BIRDEM.',
      'She has advanced training in laparoscopic surgery and assisted reproductive technology, and her practice covers infertility treatment, IUI, ultrasonography, colposcopy, high-risk pregnancy and painless normal delivery.',
    ],
    stats: [
      { value: '20+', label: 'Years experience' },
      { value: '2', label: 'Clinic days weekly' },
    ],
    qualifications: [
      { title: 'MBBS', detail: 'Dhaka Medical College' },
      { title: 'MCPS & FCPS (Obstetrics & Gynaecology)', detail: 'Bangladesh College of Physicians and Surgeons' },
      { title: 'CCD (Diabetology)', detail: 'BIRDEM' },
      { title: 'Advanced Laparoscopic Surgery & ART Training', detail: 'Specialised training' },
    ],
    schedule: [
      { day: 2, from: '9:00 AM', to: '12:00 PM' },
      { day: 4, from: '3:00 PM', to: '8:00 PM' },
    ],
    phone: '+8801318258807',
    treatments: ['iui', 'tvs', 'folliculometry', 'laparoscopy'],
  },
]

export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const dayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Current weekday in Asia/Dhaka, so "in clinic today" is right for patients in Bangladesh. */
export function dhakaDay(date = new Date()): number {
  const name = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Asia/Dhaka' }).format(date)
  return dayShort.indexOf(name)
}

export const sessionsOn = (d: Doctor, day: number) => d.schedule.filter((s) => s.day === day)

export function scheduleSummary(d: Doctor): string {
  const groups = new Map<string, number[]>()
  d.schedule.forEach((s) => {
    const k = `${s.from} – ${s.to}`
    groups.set(k, [...(groups.get(k) ?? []), s.day])
  })
  return [...groups.entries()]
    .map(([time, days]) => {
      const sorted = days.sort((a, b) => ((a + 1) % 7) - ((b + 1) % 7)) // week starts Saturday in BD
      const label = sorted.length === 6 ? 'Sat – Thu' : sorted.map((x) => dayShort[x]).join(', ')
      return `${label} · ${time}`
    })
    .join('  ·  ')
}

export const doctorBySlug = (slug?: string) => doctors.find((d) => d.slug === slug)
