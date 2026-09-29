import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const LINKS = {
  Event: ['About', 'Schedule', 'Speakers', 'Workshops', 'Hackathon'],
  Company: ['Team', 'Press Kit', 'Sponsors', 'Partners', 'Careers'],
  Support: ['FAQ', 'Contact', 'Refund Policy', 'Code of Conduct', 'Accessibility'],
  Connect: ['Twitter/X', 'LinkedIn', 'Discord', 'YouTube', 'Instagram'],
}

const SPONSORS = [
  { name: 'NovaTech', tier: 'platinum' },
  { name: 'QuantumCore', tier: 'platinum' },
  { name: 'Nexus AI', tier: 'gold' },
  { name: 'ByteForge', tier: 'gold' },
  { name: 'VoidLabs', tier: 'gold' },
  { name: 'Orbit Cloud', tier: 'silver' },
  { name: 'Cyphernet', tier: 'silver' },
  { name: 'DataStream', tier: 'silver' },
]

export default function Footer() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <footer className="relative bg-black border-t border-white/5 overflow-hidden" ref={ref}>
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-10" />

      {/* Sponsors strip */}
      <div className="relative border-b border-white/5 py-12 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="text-center font-mono text-xs text-white/20 tracking-widest uppercase mb-8"
          >
            Trusted by world-class organizations
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {SPONSORS.map((s, i) => (
              <div
                key={s.name}
                className="px-6 py-3 rounded-xl border border-white/8 bg-white/3 hover:border-cyan-400/20 transition-colors cursor-pointer"
              >
                <span
                  className={`font-mono font-bold text-sm ${
                    s.tier === 'platinum'
                      ? 'gradient-text'
                      : s.tier === 'gold'
                      ? 'text-yellow-400/70'
                      : 'text-white/30'
                  }`}
                >
                  {s.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Main footer links */}
      <div className="relative py-16 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
              >
                <div className="text-3xl font-black mb-3">
                  <span className="gradient-text">TECH</span>
                  <span className="text-white">FEST</span>
                </div>
                <p className="text-white/30 text-sm leading-relaxed mb-6">
                  The future starts here. October 15–17, 2026.
                </p>
                <div className="flex gap-3">
                  {['𝕏', 'in', '⌨', '▶'].map((icon, i) => (
                    <button
                      key={i}
                      className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-cyan-400/40 hover:text-cyan-400 transition-all text-sm"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Links columns */}
            {Object.entries(LINKS).map(([category, links], colIdx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + colIdx * 0.1 }}
              >
                <h4 className="font-mono text-xs tracking-widest uppercase text-white/40 mb-5">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-white/30 text-sm hover:text-cyan-400 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/5 py-6 px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="font-mono text-xs text-white/20"
          >
            © 2026 TECHFEST. All rights reserved. Built with ♥ and Three.js.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="flex gap-6"
          >
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((t) => (
              <a key={t} href="#" className="font-mono text-xs text-white/20 hover:text-white/50 transition-colors">
                {t}
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Big background text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[18vw] font-black text-white/[0.015] leading-none select-none pointer-events-none whitespace-nowrap">
        TECHFEST
      </div>
    </footer>
  )
}
