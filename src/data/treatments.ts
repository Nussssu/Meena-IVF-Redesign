export type GroupKey = 'treatments' | 'preservation' | 'diagnostics' | 'female' | 'male' | 'support'

export const groups: { key: GroupKey; label: string; title: string; blurb: string }[] = [
  { key: 'treatments', label: 'Fertility treatments', title: 'Core reproductive treatments', blurb: 'IUI, IVF and ICSI: the main pathways to pregnancy, matched to your diagnosis.' },
  { key: 'preservation', label: 'Fertility preservation', title: 'Options for future family planning', blurb: 'Freeze eggs, sperm or embryos with vitrification, and keep tomorrow open.' },
  { key: 'diagnostics', label: 'Diagnostic procedures', title: 'Evaluation and monitoring', blurb: 'Precise ultrasound-led tests that show what is happening, and when.' },
  { key: 'female', label: 'Female procedures', title: 'Surgical care for female fertility', blurb: 'Minimally invasive procedures that remove barriers to conception.' },
  { key: 'male', label: 'Male procedures', title: 'Male fertility procedures', blurb: 'Sperm retrieval options for azoospermia and severe male-factor infertility.' },
  { key: 'support', label: 'Support services', title: 'Support beyond treatment', blurb: 'Counselling, financial clarity and a careful first evaluation.' },
]

export type Treatment = {
  slug: string
  group: GroupKey
  name: string
  full: string
  short: string
  intro: string[]
  whoFor: string[]
  steps: { title: string; text: string }[]
  benefits: string[]
  facts?: { label: string; value: string }[]
  image?: string
  faqs?: { q: string; a: string }[]
}

export const treatments: Treatment[] = [
  // Fertility treatments
  {
    slug: 'ivf', group: 'treatments', name: 'IVF', full: 'In Vitro Fertilization',
    short: 'Eggs are fertilized with sperm in our laboratory and the healthiest embryo is transferred into the uterus.',
    intro: [
      'In vitro fertilization has transformed reproductive medicine. Eggs are retrieved from the ovaries and combined with sperm in the laboratory. The resulting embryos are carefully monitored, and a viable embryo is transferred back into the uterus.',
      'The journey can be emotionally and physically demanding, which is why every IVF cycle at Meena IVF comes with counselling, clear explanations and a team that stays with you from first consultation to pregnancy test.',
    ],
    whoFor: ['Blocked or damaged fallopian tubes', 'Severe male-factor infertility', 'Ovulation disorders or endometriosis', 'Unexplained infertility', 'Advanced maternal age', 'When IUI or other treatments have not worked'],
    steps: [
      { title: 'Ovarian stimulation', text: 'Hormone medication encourages the ovaries to produce several eggs, monitored by ultrasound.' },
      { title: 'Egg retrieval', text: 'Mature eggs are collected under sedation in our in-house operation theatre.' },
      { title: 'Fertilization', text: 'Eggs and prepared sperm are combined in the IVF laboratory.' },
      { title: 'Embryo development', text: 'Embryologists monitor growth and quality over several days.' },
      { title: 'Embryo transfer', text: 'The selected embryo is placed in the uterus with a thin catheter. Quick and usually painless.' },
      { title: 'Pregnancy test', text: 'Medication supports implantation; a pregnancy test follows 10–14 days later.' },
    ],
    benefits: ['Bypasses tubal and many sperm-related barriers', 'Embryos are assessed before transfer', 'Extra embryos can be frozen for later', 'Self-cycle approach recommended at Meena IVF'],
    facts: [{ label: 'Typical cycle', value: '4–6 weeks' }, { label: 'Egg retrieval', value: 'Under sedation' }, { label: 'Test after transfer', value: '10–14 days' }],
    image: '/img/lab-microscope.webp',
    faqs: [
      { q: 'Is IVF treatment painful?', a: 'Most IVF procedures cause minimal discomfort. Egg retrieval is usually performed under sedation to keep you comfortable.' },
      { q: 'What is the success rate of IVF?', a: 'It varies with age, the cause of infertility, egg and sperm quality and overall health. Your consultant will discuss realistic expectations for your situation.' },
      { q: 'What happens after embryo transfer?', a: 'You may be advised to rest and continue medication to support implantation. A pregnancy test is usually done 10–14 days later.' },
    ],
  },
  {
    slug: 'icsi', group: 'treatments', name: 'ICSI', full: 'Intracytoplasmic Sperm Injection',
    short: 'A specialised IVF technique where a single sperm is injected directly into each egg, often used for male infertility.',
    intro: [
      'ICSI is performed during an IVF cycle. Under a microscope, an embryologist selects a single motile sperm and uses micro-manipulation equipment to place it directly inside the egg.',
      'Because it bypasses poor sperm motility or abnormal morphology, ICSI gives couples facing severe male-factor infertility a real chance of fertilization and healthy embryo development.',
    ],
    whoFor: ['Low sperm count or poor motility', 'Abnormal sperm morphology', 'Sperm retrieved by TESA or PESA', 'Previous failed fertilization in IVF', 'Unexplained infertility'],
    steps: [
      { title: 'Stimulation & retrieval', text: 'As in IVF, eggs are matured and collected under sedation.' },
      { title: 'Sperm selection', text: 'The embryologist selects a single healthy, motile sperm.' },
      { title: 'Micro-injection', text: 'The sperm is injected directly into the cytoplasm of each mature egg.' },
      { title: 'Culture & transfer', text: 'Embryos develop in the lab; the best one is transferred to the uterus.' },
    ],
    benefits: ['Overcomes severe male-factor infertility', 'Works with surgically retrieved sperm', 'Can increase the number of viable embryos', 'Performed in our in-house embryology lab'],
    image: '/img/embryo-1.webp',
  },
  {
    slug: 'iui', group: 'treatments', name: 'IUI', full: 'Intrauterine Insemination',
    short: 'Carefully prepared sperm is placed directly into the uterus at ovulation to improve the chance of fertilization.',
    intro: [
      'IUI places specially prepared sperm directly into the uterus during the ovulation window, so more healthy sperm reach the egg.',
      'It is simpler, less invasive and more affordable than IVF, and for many couples it is the first step in treatment.',
    ],
    whoFor: ['Mild male-factor infertility', 'Ovulation problems', 'Unexplained infertility', 'Cervical mucus issues'],
    steps: [
      { title: 'Cycle monitoring', text: 'Ultrasound (folliculometry) and hormone tests identify the best day.' },
      { title: 'Sperm preparation', text: 'The sample is processed in the lab to concentrate the most motile sperm.' },
      { title: 'Insemination', text: 'A thin catheter places the sperm in the uterus. It takes a few minutes.' },
      { title: 'Follow-up', text: 'A pregnancy test follows about two weeks later.' },
    ],
    benefits: ['Simple, quick and generally painless', 'Lower cost than IVF', 'Little or no hormonal stimulation needed', 'A natural stepping stone before IVF'],
    image: '/img/consult.webp',
    faqs: [{ q: 'Is IUI painful?', a: 'IUI is generally simple and painless. Some women feel mild discomfort, similar to a routine gynecological examination.' }],
  },

  // Fertility preservation
  {
    slug: 'egg-freezing', group: 'preservation', name: 'Egg Freezing', full: 'Oocyte Cryopreservation',
    short: 'Store your eggs at a younger age for a pregnancy later, when you are ready.',
    intro: [
      'Egg freezing lets women store their eggs for a future pregnancy. At Meena IVF it is performed with advanced laboratory techniques and strict protocols to protect the quality of every egg.',
      'When you are ready, the eggs are thawed, fertilized through IVF and transferred into the uterus, giving you flexibility while preserving the quality of younger eggs.',
    ],
    whoFor: ['Delaying pregnancy for career or personal reasons', 'Before chemotherapy or other fertility-affecting treatment', 'A family history of early menopause', 'Wanting to preserve fertility at a younger age'],
    steps: [
      { title: 'Fertility evaluation', text: 'Tests and ultrasound assess ovarian reserve and reproductive health.' },
      { title: 'Ovarian stimulation', text: 'Hormone medication for about 8–12 days helps the ovaries produce several eggs.' },
      { title: 'Egg retrieval', text: 'A minimally invasive procedure under mild anaesthesia.' },
      { title: 'Freezing & storage', text: 'Eggs are frozen by vitrification and stored safely for future use.' },
    ],
    benefits: ['Preserves fertility at a younger age', 'Flexibility in family planning', 'Protects fertility before medical treatment', 'Safe, advanced vitrification technology'],
    facts: [{ label: 'Stimulation', value: '8–12 days' }, { label: 'Method', value: 'Vitrification' }],
    image: '/img/egg-1.webp',
  },
  {
    slug: 'semen-freezing', group: 'preservation', name: 'Semen Freezing', full: 'Sperm Cryopreservation',
    short: 'Safely store sperm for future IUI, IVF or ICSI treatment.',
    intro: [
      'Semen freezing allows men to store sperm for future use. The sample is collected, processed and frozen with modern cryopreservation technology so it can be preserved for many years.',
      'When you are ready to start a family, the frozen sperm can be thawed and used in IUI, IVF or ICSI.',
    ],
    whoFor: ['Before chemotherapy or radiation', 'Low sperm count, to keep a reserve', 'Before procedures that may affect fertility', 'Delaying parenthood while preserving fertility'],
    steps: [
      { title: 'Sample collection', text: 'Collected in a sterile container in a private room at the clinic.' },
      { title: 'Laboratory processing', text: 'The sample is analysed and mixed with a protective solution.' },
      { title: 'Freezing', text: 'Specialised cryopreservation at very low temperatures.' },
      { title: 'Storage', text: 'Kept in secure cryogenic tanks until needed.' },
    ],
    benefits: ['Preserves fertility for future planning', 'Protects sperm before medical treatment', 'Backup sperm for fertility treatment', 'Safe and widely used'],
    image: '/img/semen-3.webp',
  },
  {
    slug: 'embryo-freezing', group: 'preservation', name: 'Embryo Freezing', full: 'Embryo Cryopreservation',
    short: 'Preserve healthy embryos from your IVF cycle for future pregnancy attempts.',
    intro: [
      'During IVF, healthy embryos that are not transferred can be frozen with modern vitrification technology, preserving their quality for long-term storage.',
      'When you are ready, a frozen embryo is thawed and transferred through Frozen Embryo Transfer (FET), without repeating ovarian stimulation.',
    ],
    whoFor: ['Couples in IVF with additional healthy embryos', 'Patients planning pregnancy later', 'Preserving embryos for future family planning', 'Before medical treatment that may affect fertility'],
    steps: [
      { title: 'Embryo development', text: 'Embryos are monitored for several days after fertilization.' },
      { title: 'Embryo selection', text: 'Embryologists select healthy embryos for freezing.' },
      { title: 'Vitrification', text: 'Rapid freezing maintains embryo quality in storage.' },
      { title: 'Storage', text: 'Embryos are kept safely in cryogenic tanks until transfer.' },
    ],
    benefits: ['Extra chances from a single IVF cycle', 'Reduces repeated ovarian stimulation', 'Additional chances for pregnancy', 'Safe, widely used method'],
    image: '/img/embryo-3.webp',
  },

  // Diagnostics
  {
    slug: 'folliculometry', group: 'diagnostics', name: 'Folliculometry', full: 'Follicular Study',
    short: 'A series of ultrasound scans that tracks follicle growth and pinpoints ovulation.',
    intro: [
      'A folliculometry test uses a series of ultrasound scans to monitor how ovarian follicles grow during the menstrual cycle, with the main aim of pinpointing the day of ovulation.',
      'It is especially useful for assessing infertility, irregular cycles and conditions such as PCOS, and for timing intercourse or insemination precisely.',
    ],
    whoFor: ['Couples trying to time conception', 'Irregular menstrual cycles', 'PCOS', 'Monitoring during IUI or medication cycles'],
    steps: [
      { title: 'Scan schedule', text: 'Scans usually run between day 9 and day 20 of a 28-day cycle.' },
      { title: 'Ultrasound sessions', text: 'Each takes about 20 minutes; most cycles need 4 to 6 scans.' },
      { title: 'Tracking', text: 'Doctors follow each follicle as it matures toward ovulation.' },
      { title: 'Timing & adjustment', text: 'Results guide timing and any changes in medication.' },
    ],
    benefits: ['Predicts ovulation accurately', 'Optimises timing of insemination', 'Detects hormonal imbalance', 'Guides medication adjustment'],
    facts: [{ label: 'Per scan', value: '~20 min' }, { label: 'Scans per cycle', value: '4–6' }],
    image: '/img/folliculometry.webp',
  },
  {
    slug: 'tvs', group: 'diagnostics', name: 'TVS', full: 'Transvaginal Sonography',
    short: 'High-resolution pelvic ultrasound to evaluate the uterus, ovaries and early pregnancy.',
    intro: [
      'Transvaginal ultrasound uses high-frequency sound waves to create detailed images of the pelvic organs. It helps evaluate ovarian cysts, uterine fibroids and other growths by size, shape and nature.',
      'TVS is also used in early pregnancy to confirm the heartbeat and gestational age, and to investigate pelvic pain, abnormal bleeding and conditions that contribute to infertility.',
    ],
    whoFor: ['Fertility evaluation', 'Suspected cysts or fibroids', 'Early pregnancy assessment', 'Pelvic pain or abnormal bleeding'],
    steps: [
      { title: 'Preparation', text: 'A short, private procedure in our ultrasound room.' },
      { title: 'Scan', text: 'A slim probe gives clear, close images of the pelvic organs.' },
      { title: 'Review', text: 'Your doctor explains the findings and next steps.' },
    ],
    benefits: ['Detailed, high-resolution images', 'Minimally invasive', 'Fast results', 'Early detection and timely treatment'],
    image: '/img/tvs.webp',
  },
  {
    slug: 'ssg-sis', group: 'diagnostics', name: 'SSG / SIS', full: 'Saline Sonography',
    short: 'A saline-enhanced ultrasound that checks the uterine cavity and fallopian tubes.',
    intro: [
      'Sonosalpingography (SSG) introduces sterile saline into the uterus to make ultrasound images clearer, so doctors can see the uterine cavity and fallopian tubes in detail.',
      'It can reveal polyps, fibroids or blockages that may make pregnancy harder, and it is quick, safe and cost-effective.',
    ],
    whoFor: ['Women having difficulty conceiving', 'Checking tubal patency', 'Suspected polyps or fibroids', 'Before IUI or IVF'],
    steps: [
      { title: 'Saline introduction', text: 'Sterile saline is gently placed into the uterus.' },
      { title: 'Ultrasound', text: 'The saline outlines the cavity and tubes for clear images.' },
      { title: 'Discussion', text: 'Findings guide the next step in treatment.' },
    ],
    benefits: ['Safe and non-surgical', 'Takes about 30 minutes', 'Cost-effective', 'Informs treatment planning'],
    facts: [{ label: 'Duration', value: '~30 min' }],
    image: '/img/ssg.webp',
  },

  // Female procedures
  {
    slug: 'laparoscopy', group: 'female', name: 'Laparoscopy', full: 'Keyhole Surgery',
    short: 'Minimally invasive surgery to diagnose and treat fertility-related conditions.',
    intro: [
      'Laparoscopy uses a thin, lighted camera inserted through small incisions to give the surgeon a magnified view of the pelvic organs, allowing precise diagnosis and treatment.',
      'Compared with open surgery it means smaller scars, less pain, a lower risk of complications and a faster return to daily life. Several issues can often be treated in one operation.',
    ],
    whoFor: ['Suspected endometriosis', 'Tubal problems', 'Ovarian cysts', 'Unexplained infertility'],
    steps: [
      { title: 'Assessment', text: 'Your consultant confirms laparoscopy is the right approach.' },
      { title: 'Procedure', text: 'Performed in our in-house OT through small incisions.' },
      { title: 'Recovery', text: 'Often an outpatient procedure with quick recovery.' },
    ],
    benefits: ['Smaller scars', 'Less post-operative pain', 'Lower complication risk', 'Faster return to daily activities'],
    image: '/img/laparoscopy.webp',
  },
  {
    slug: 'hysteroscopy', group: 'female', name: 'Hysteroscopy', full: 'Uterine Endoscopy',
    short: 'A thin, lighted scope that examines and treats problems inside the uterus.',
    intro: [
      'Hysteroscopy gives a direct view of the uterus and cervix through a thin, lighted tube. It is both diagnostic and therapeutic.',
      'It plays a key role in investigating infertility and repeated miscarriage, identifying fibroids, polyps, scar tissue or a uterine septum, which can often be removed during the same procedure.',
    ],
    whoFor: ['Infertility investigation', 'Repeated miscarriage', 'Abnormal uterine bleeding', 'Suspected polyps, fibroids or septum'],
    steps: [
      { title: 'Visualisation', text: 'The hysteroscope is passed gently through the cervix.' },
      { title: 'Diagnosis', text: 'The uterine lining and cavity are examined directly.' },
      { title: 'Treatment', text: 'Polyps, fibroids or adhesions can be removed in the same sitting.' },
    ],
    benefits: ['No abdominal incisions', 'Diagnosis and treatment together', 'Evaluates the endometrial lining', 'Improves the uterine environment for pregnancy'],
  },
  {
    slug: 'laparoscopic-myomectomy', group: 'female', name: 'Laparoscopic Myomectomy', full: 'Fibroid Removal',
    short: 'Removes uterine fibroids through small incisions while preserving the uterus.',
    intro: [
      'Laparoscopic myomectomy removes uterine fibroids (noncancerous growths that can cause pain, heavy bleeding and fertility problems) through a few small incisions.',
      'Most patients go home the same day or within 24–48 hours, and many return to work in about four weeks.',
    ],
    whoFor: ['Pelvic pain from fibroids', 'Heavy or irregular bleeding', 'Frequent urination from fibroid pressure', 'Fibroids affecting fertility'],
    steps: [
      { title: 'Planning', text: 'Imaging maps the size and position of fibroids.' },
      { title: 'Surgery', text: 'Fibroids are removed laparoscopically, protecting surrounding tissue.' },
      { title: 'Recovery', text: 'Same-day or 24–48 hour stay; regular pain relief for a few days.' },
    ],
    benefits: ['Preserves the uterus', 'Less blood loss', 'Shorter hospital stay', 'Lower complication rates'],
    facts: [{ label: 'Hospital stay', value: '0–48 hrs' }, { label: 'Back to work', value: '~4 weeks' }],
  },

  // Male procedures
  {
    slug: 'tesa', group: 'male', name: 'TESA', full: 'Testicular Sperm Aspiration',
    short: 'A minimally invasive procedure to retrieve sperm directly from the testicles.',
    intro: [
      'TESA uses a fine needle under local anaesthesia to retrieve sperm directly from testicular tissue. It helps men whose sperm cannot reach the semen because of a prior vasectomy, congenital absence of the vas deferens or another obstruction.',
      'Retrieved sperm is used for IVF with ICSI, giving many couples a path to biological parenthood.',
    ],
    whoFor: ['Obstructive azoospermia', 'Prior vasectomy', 'Congenital absence of the vas deferens', 'Couples planning ICSI'],
    steps: [
      { title: 'Local anaesthesia', text: 'The area is numbed for comfort.' },
      { title: 'Aspiration', text: 'A fine needle collects sperm from testicular tissue.' },
      { title: 'Lab assessment', text: 'Embryologists check and prepare the sperm for ICSI or freezing.' },
    ],
    benefits: ['Minimally invasive', 'Quick recovery', 'Minimal complications', 'Enables ICSI with your own sperm'],
  },
  {
    slug: 'trial-tesa', group: 'male', name: 'Trial TESA', full: 'Trial Testicular Sperm Aspiration',
    short: 'A diagnostic retrieval that confirms whether sperm are present before treatment begins.',
    intro: [
      'Trial TESA determines whether sperm can be retrieved from the testicles in men with very low or zero sperm count (azoospermia).',
      'Confirming this before IVF or ICSI lets doctors plan the most suitable approach, and any sperm found can be frozen for later use.',
    ],
    whoFor: ['Azoospermia', 'Severe male infertility', 'No sperm on routine semen analysis', 'Planning IVF/ICSI'],
    steps: [
      { title: 'Sampling', text: 'A fine needle collects a small tissue sample under local anaesthesia.' },
      { title: 'Immediate microscopy', text: 'Embryologists examine the sample for sperm straight away.' },
      { title: 'Plan or preserve', text: 'Found sperm can be used for ICSI or frozen for the future.' },
    ],
    benefits: ['Clarifies the cause of male infertility', 'Enables accurate treatment planning', 'Quick and minimally invasive', 'Sperm can be preserved'],
  },
  {
    slug: 'pesa', group: 'male', name: 'PESA', full: 'Percutaneous Epididymal Sperm Aspiration',
    short: 'Retrieves sperm from the epididymis without surgical incisions.',
    intro: [
      'PESA retrieves sperm from the epididymis (the coiled tube that stores and matures sperm) using a thin needle under local anaesthesia. It is designed for obstructive azoospermia caused by vasectomy, congenital abnormalities or infection.',
      'The sperm can be used directly for ICSI or preserved for future use.',
    ],
    whoFor: ['Obstructive azoospermia', 'After vasectomy', 'Blockage from infection or congenital causes'],
    steps: [
      { title: 'Local anaesthesia', text: 'For a comfortable, quick procedure.' },
      { title: 'Aspiration', text: 'Fluid containing sperm is drawn from the epididymis.' },
      { title: 'Processing', text: 'Sperm is examined and prepared for ICSI or freezing.' },
    ],
    benefits: ['No surgical incision', 'Less pain, minimal recovery', 'Lower complication risk', 'Flexible: use now or freeze'],
  },

  // Support
  {
    slug: 'psychological-counseling', group: 'support', name: 'Psychological Counseling', full: 'Emotional Support',
    short: 'Support for the stress and anxiety that can come with infertility and treatment.',
    intro: [
      'Fertility treatment can be emotionally challenging. Our counsellors help you manage stress, anxiety and emotional concerns during diagnosis and treatment.',
      'The goal is a safe space to talk openly, receive guidance and build confidence together as a couple.',
    ],
    whoFor: ['Anyone feeling overwhelmed by infertility', 'Couples making treatment decisions', 'After an unsuccessful cycle or miscarriage'],
    steps: [
      { title: 'Listen', text: 'A private conversation about how you are feeling.' },
      { title: 'Support', text: 'Practical tools for stress and anxiety.' },
      { title: 'Continue', text: 'Ongoing sessions alongside treatment, as you need.' },
    ],
    benefits: ['Emotional support through treatment', 'Manages stress and anxiety', 'Supports informed decisions', 'Encourages open communication between partners'],
    image: '/img/patient-care.webp',
  },
  {
    slug: 'financial-counseling', group: 'support', name: 'Financial Counseling', full: 'Clear Cost Guidance',
    short: 'Understand costs, packages and payment options before you begin, with no hidden costs.',
    intro: [
      'Our financial counsellors explain treatment costs, available packages and payment options before your journey starts, so you can decide with confidence.',
      'Transparency reduces stress and lets you focus on treatment, with every possible additional procedure explained up front.',
    ],
    whoFor: ['Anyone planning fertility treatment', 'Comparing treatment packages', 'Planning payment schedules'],
    steps: [
      { title: 'Review', text: 'Your recommended treatment plan is explained in plain terms.' },
      { title: 'Packages', text: 'Costs, packages and possible add-ons are laid out clearly.' },
      { title: 'Plan', text: 'A payment schedule that works for your family.' },
    ],
    benefits: ['Clear treatment packages and costs', 'Helps plan expenses', 'Explains payment options', 'Full transparency, no hidden costs'],
    image: '/img/couple-doctor.webp',
  },
  {
    slug: 'medical-history-evaluation', group: 'support', name: 'Medical History Evaluation', full: 'Your First Assessment',
    short: 'A careful review of both partners’ history, the foundation of a personalised plan.',
    intro: [
      'Medical history evaluation is the first step in fertility assessment. Our medical officers review your medical history, lifestyle and previous treatments to understand possible causes of infertility.',
      'It helps identify underlying conditions and lets your consultant design a treatment plan for you specifically.',
    ],
    whoFor: ['Every new patient', 'Couples with previous treatment elsewhere', 'Anyone unsure where to start'],
    steps: [
      { title: 'History', text: 'Medical, menstrual, reproductive and family history.' },
      { title: 'Lifestyle', text: 'Health and lifestyle factors for both partners.' },
      { title: 'Next steps', text: 'Recommended tests or treatments based on the findings.' },
    ],
    benefits: ['Understands both partners’ reproductive health', 'Identifies underlying factors', 'Avoids unnecessary tests', 'Leads to a personalised plan'],
    image: '/img/consult.webp',
  },
]

export const treatmentBySlug = (slug?: string) => treatments.find((t) => t.slug === slug)
export const byGroup = (g: GroupKey) => treatments.filter((t) => t.group === g)
