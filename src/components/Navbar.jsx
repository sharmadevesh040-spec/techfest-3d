import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'About',      href: '#about' },
  { label: 'Events',     href: '#events' },
  { label: 'Experience', href: '#experience' },
  { label: 'Schedule',   href: '#schedule' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)

      // Detect active section
      const sections = ['hero', 'about', 'events', 'experience', 'schedule', 'register']
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-16 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
              <span className="text-xs font-black text-black">TF</span>
            </div>
            <span className="font-black text-lg">
              <span className="gradient-text">TECH</span>
              <span className="text-white">FEST</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const id = href.replace('#', '')
              return (
                <a
                  key={label}
                  href={href}
                  className={`relative px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors duration-300 rounded-full ${
                    activeSection === id
                      ? 'text-cyan-400'
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {label}
                  {activeSection === id && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full bg-cyan-400/10 border border-cyan-400/20"
                    />
                  )}
                </a>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Date badge */}
            <span className="hidden lg:block font-mono text-xs text-white/20">Oct 15–17, 2026</span>

            {/* CTA */}
            <a
              href="#register"
              className="hidden md:block px-5 py-2 bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-bold text-xs tracking-widest uppercase rounded-full hover:scale-105 transition-transform"
            >
              Register
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block w-5 h-px bg-white origin-center transition-all"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-5 h-px bg-white"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="block w-5 h-px bg-white origin-center transition-all"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10 py-6 px-6 flex flex-col gap-2"
          >
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="py-3 px-4 font-mono text-sm tracking-widest uppercase text-white/60 hover:text-cyan-400 border-b border-white/5 transition-colors"
              >
                {label}
              </a>
            ))}
            <a
              href="#register"
              onClick={() => setMobileOpen(false)}
              className="mt-4 py-3 text-center bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-bold text-sm tracking-widest uppercase rounded-full"
            >
              Register Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
