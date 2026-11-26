import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useMeta } from '../components/ui'

export default function NotFound() {
  useMeta('Page not found')
  return (
    <section className="grain relative grid min-h-[80vh] place-items-center bg-mist px-5 pt-24 text-center">
      <div>
        <p className="font-display text-[8rem] italic leading-none text-lavender">404</p>
        <h1 className="h2 mt-4">This page took a different <em className="text-plum">path</em>.</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-2">The page you are looking for may have moved. Let us help you find your way.</p>
        <div className="btn-pair mx-auto mt-8 max-w-md sm:justify-center">
          <Link to="/" className="btn-primary">Go home <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/treatments" className="btn-secondary">Browse treatments</Link>
        </div>
      </div>
    </section>
  )
}
