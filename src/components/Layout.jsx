import Link from 'next/link'
import { PROGRAM } from '@/data/modules'
import SearchBar from '@/components/SearchBar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <header className="bg-brand-navy text-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3 sm:gap-6">
          <Link href="/" className="flex flex-col leading-tight flex-shrink-0">
            <span className="text-lg font-bold tracking-tight">6th Ave Homes</span>
            <span className="hidden sm:block text-xs text-brand-taupe">{PROGRAM.title}</span>
          </Link>
          <div className="flex-1 flex justify-end sm:justify-center">
            <SearchBar />
          </div>
          <a
            href={PROGRAM.playbookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block flex-shrink-0 text-sm font-semibold bg-brand-coral px-4 py-2 rounded-full hover:bg-opacity-90 transition"
          >
            AI Playbook ↗
          </a>
        </div>
      </header>

      <main className="flex-1 w-full">{children}</main>

      <footer className="bg-white border-t border-gray-200 text-gray-500 text-xs py-8 mt-16">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-1">
          <p>{PROGRAM.copyright}</p>
          <p>{PROGRAM.license}</p>
        </div>
      </footer>
    </div>
  )
}
