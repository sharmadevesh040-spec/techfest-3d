import { Suspense } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Events from './components/Events'
import Experience from './components/Experience'
import Schedule from './components/Schedule'
import Register from './components/Register'
import Footer from './components/Footer'

/* Simple section divider */
function Divider({ from = '#22d3ee', to = '#7c3aed' }) {
  return (
    <div className="relative h-px w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(90deg, transparent, ${from}, ${to}, transparent)`, opacity: 0.3 }}
      />
    </div>
  )
}

/* Loading fallback */
function Loader() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
        <div className="font-mono text-xs text-white/30 tracking-widest uppercase">Initializing</div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <div className="bg-black min-h-screen">
        {/* Persistent navbar */}
        <Navbar />

        {/* Sections */}
        <Hero />

        <Divider from="#22d3ee" to="#7c3aed" />
        <About />

        <Divider from="#7c3aed" to="#a78bfa" />
        <Events />

        <Divider from="#a78bfa" to="#22d3ee" />
        <Experience />

        <Divider from="#22d3ee" to="#a78bfa" />
        <Schedule />

        <Divider from="#a78bfa" to="#f0abfc" />
        <Register />

        <Divider from="#f0abfc" to="#22d3ee" />
        <Footer />
      </div>
    </Suspense>
  )
}
