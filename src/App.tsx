import { lazy, type ComponentType } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// pages may also export non-component values (e.g. Resources exports RESOURCE_TABS), so only the picked export must be a component
const named = <T, K extends keyof T>(f: () => Promise<T>, k: K) => lazy(() => f().then((m) => ({ default: m[k] as unknown as ComponentType })))
const TreatmentsHub = named(() => import('./pages/Treatments'), 'TreatmentsHub')
const TreatmentDetail = named(() => import('./pages/Treatments'), 'TreatmentDetail')
const DoctorProfile = named(() => import('./pages/Doctors'), 'DoctorProfile')
const About = named(() => import('./pages/About'), 'About')
const WhyMeena = named(() => import('./pages/About'), 'WhyMeena')
const Team = named(() => import('./pages/About'), 'Team')
const Careers = named(() => import('./pages/About'), 'Careers')
const Blog = named(() => import('./pages/Resources'), 'FertilityBlog')
const BlogPost = named(() => import('./pages/Learn'), 'BlogPost')
const Videos = named(() => import('./pages/Learn'), 'Videos')
const Events = named(() => import('./pages/Learn'), 'Events')
const Faq = named(() => import('./pages/Learn'), 'Faq')
const Stories = named(() => import('./pages/Learn'), 'Stories')
const Resources = named(() => import('./pages/Resources'), 'Resources')
const CentreDetail =named(() => import('./pages/Centres'), 'CentreDetail')
const Book = lazy(() => import('./pages/Book'))
const Contact = lazy(() => import('./pages/Contact'))

// Old WordPress URLs → new routes (so existing links and search results keep working)
const legacy: Record<string, string> = {
  'about-us': '/about', 'why-meena-ivf': '/why-meena', 'why-meena-2': '/why-meena', 'meet-our-team': '/team', 'career': '/careers',
  'our-center': '/centres/banani', 'locations': '/centres/banani', 'banani': '/centres/banani', 'khulna-opd-camp': '/centres/khulna', 'cumilla-opd': '/centres/cumilla',
  'success-story': '/stories', 'patient-review': '/stories', 'fertility-blog': '/blog', 'doctors-speak': '/videos', 'gallery': '/events',
  'book-appointment': '/book', 'contact-us-2': '/contact', 'folliculometry-2': '/treatments/folliculometry',
  'dr-lubna-yasmin': '/doctors/dr-lubna-yasmin', 'dr-natasha-tiluttoma-aleem': '/doctors/dr-natasha-tiluttoma-aleem', 'dr-mosammat-bilkis-parvin': '/doctors/prof-dr-mosammat-bilkis-parvin',
  'dr-bilkis-parvin': '/doctors/prof-dr-mosammat-bilkis-parvin', 'dr-julia-akhter-nira': '/doctors/lt-col-dr-julia-akhter-nira', 'dr-shamima-nargis-neela': '/doctors/dr-shamima-nargis-neela',
  'fertility-treatments': '/treatments#treatments', 'fertility-preservation': '/treatments#preservation', 'diagnostic-procedure': '/treatments#diagnostics',
  'female-fertility-procedures': '/treatments#female', 'male-fertility-procedures': '/treatments#male', 'allied-specialties-support-services': '/treatments#support',
}
const legacyTreatments = ['ivf', 'icsi', 'iui', 'egg-freezing', 'semen-freezing', 'embryo-freezing', 'tvs', 'ssg-sis', 'laparoscopy', 'hysteroscopy', 'laparoscopic-myomectomy', 'tesa', 'trial-tesa', 'pesa', 'psychological-counseling', 'financial-counseling', 'medical-history-evaluation']

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/treatments', element: <TreatmentsHub /> },
      { path: '/treatments/:slug', element: <TreatmentDetail /> },
      { path: '/doctors/:slug', element: <DoctorProfile /> },
      { path: '/about', element: <About /> },
      { path: '/why-meena', element: <WhyMeena /> },
      { path: '/team', element: <Team /> },
      { path: '/careers', element: <Careers /> },
      { path: '/centres', element: <Navigate to="/centres/banani" replace /> },
      { path: '/centres/:slug', element: <CentreDetail /> },
      { path: '/stories', element: <Stories /> },
      { path: '/blog', element: <Blog /> },
      { path: '/blog/:slug', element: <BlogPost /> },
      { path: '/videos', element: <Videos /> },
      { path: '/events', element: <Events /> },
      { path: '/faq', element: <Faq /> },
      { path: '/resources', element: <Resources /> },
      { path: '/book', element: <Book /> },
      { path: '/contact', element: <Contact /> },
      ...Object.entries(legacy).map(([from, to]) => ({ path: `/${from}`, element: <Navigate to={to} replace /> })),
      ...legacyTreatments.map((s) => ({ path: `/${s}`, element: <Navigate to={`/treatments/${s}`} replace /> })),
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
