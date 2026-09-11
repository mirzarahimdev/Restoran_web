import { Link } from 'react-router-dom'
import { Icon } from '../components/ui/Icon'

type PlaceholderProps = {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderProps) {
  return (
    <div className="container-fooduz flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-fixed text-on-primary-fixed">
        <Icon name="construction" className="text-[32px]" />
      </div>
      <h1 className="text-headline-lg font-bold text-on-surface">{title}</h1>
      <p className="mt-2 max-w-md text-body-lg text-on-surface-variant">{description}</p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-container px-6 py-3 text-label-lg font-semibold text-on-primary transition-colors hover:bg-tertiary"
      >
        <Icon name="arrow_back" />
        Bosh sahifaga qaytish
      </Link>
    </div>
  )
}
