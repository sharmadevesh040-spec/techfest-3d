import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sparkles } from '@react-three/drei'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

/* ─── Background orb ─── */
function BackgroundOrb() {
  const ref = useRef()
  const ring1 = useRef()
  const ring2 = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.rotation.x = t * 0.2
    ref.current.rotation.y = t * 0.3
    ring1.current.rotation.z = t * 0.5
    ring2.current.rotation.z = -t * 0.4
    ring2.current.rotation.x = t * 0.3
  })

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <MeshDistortMaterial
          color="#0f172a"
          emissive="#06b6d4"
          emissiveIntensity={0.3}
          distort={0.3}
          speed={2}
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh ref={ring1} scale={1.6}>
        <torusGeometry args={[1.8, 0.025, 8, 120]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} />
      </mesh>
      <mesh ref={ring2} scale={2.2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.8, 0.015, 8, 120]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={2} />
      </mesh>
      <Sparkles count={60} scale={5} size={2} speed={0.4} color="#22d3ee" />
    </group>
  )
}

const TIERS = [
  {
    name: 'Explorer',
    price: 'Free',
    color: '#22d3ee',
    features: ['All keynotes (live stream)', 'Community Discord access', 'Digital swag pack', 'Post-event recordings'],
    highlight: false,
    cta: 'Get Free Pass',
  },
  {
    name: 'Builder',
    price: '$299',
    color: '#a78bfa',
    features: ['Everything in Explorer', 'In-person access (all 3 days)', 'All workshops + labs', 'Hackathon entry', 'Networking events', 'Lunch & refreshments'],
    highlight: true,
    cta: 'Register Now',
  },
  {
    name: 'Innovator',
    price: '$799',
    color: '#f0abfc',
    features: ['Everything in Builder', 'VIP speaker lounge access', 'Private networking dinner', 'Mentorship sessions', '1-year community membership', 'Priority seating'],
    highlight: false,
    cta: 'Go VIP',
  },
]

function TierCard({ tier, index, inView }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2 + index * 0.15, duration: 0.7, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-3xl border p-8 transition-all duration-500 flex flex-col ${
        tier.highlight ? 'scale-105' : ''
      }`}
      style={{
        borderColor: hovered || tier.highlight ? tier.color + '60' : 'rgba(255,255,255,0.08)',
        background: tier.highlight
          ? `linear-gradient(135deg, ${tier.color}12, ${tier.color}06)`
          : hovered
          ? `linear-gradient(135deg, ${tier.color}08, transparent)`
          : 'rgba(255,255,255,0.02)',
        boxShadow: (hovered || tier.highlight) ? `0 0 40px ${tier.color}20, 0 0 80px ${tier.color}08` : 'none',
        transform: hovered && !tier.highlight ? 'translateY(-6px)' : tier.highlight ? 'scale(1.05)' : 'none',
      }}
    >
      {/* Popular badge */}
      {tier.highlight && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 font-mono text-xs tracking-widest uppercase px-5 py-1.5 rounded-full font-bold"
          style={{ background: tier.color, color: '#000' }}
        >
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: tier.color }}>
          {tier.name}
        </span>
        <div className="mt-2 flex items-end gap-1">
          <span className="text-5xl font-black text-white">{tier.price}</span>
          {tier.price !== 'Free' && <span className="text-white/40 mb-2">/person</span>}
        </div>
      </div>

      <ul className="flex-1 space-y-3 mb-8">
        {tier.features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-white/70">
            <span style={{ color: tier.color }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <button
        className="w-full py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105"
        style={
          tier.highlight
            ? { background: `linear-gradient(135deg, ${tier.color}, #7c3aed)`, color: '#fff' }
            : { border: `1px solid ${tier.color}40`, color: tier.color, background: `${tier.color}10` }
        }
      >
        {tier.cta}
      </button>
    </motion.div>
  )
}

export default function Register() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <section id="register" className="relative py-24 bg-black overflow-hidden">
      {/* Canvas background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="w-full h-full">
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
            <ambientLight intensity={0.2} />
            <pointLight position={[3, 3, 3]}   color="#22d3ee" intensity={4} />
            <pointLight position={[-3, -3, 3]} color="#7c3aed" intensity={4} />
            <BackgroundOrb />
          </Canvas>
        </div>
      </div>

      {/* Gradient */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-fuchsia-400/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="font-mono text-xs tracking-[0.4em] text-fuchsia-400 uppercase"
          >
            Secure your spot
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-7xl font-black mt-3 mb-4 leading-none"
          >
            <span className="text-white">JOIN THE</span>
            <br />
            <span className="gradient-text">REVOLUTION</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-white/40 max-w-lg mx-auto"
          >
            Over 2,000 early-bird spots claimed. Don't miss your chance to be part of the most important tech event of 2026.
          </motion.p>
        </div>

        {/* Countdown strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          {[
            { value: '16', label: 'Days' },
            { value: '04', label: 'Hours' },
            { value: '23', label: 'Minutes' },
            { value: '59', label: 'Seconds' },
          ].map((c) => (
            <div key={c.label} className="text-center">
              <div className="text-5xl font-black gradient-text font-mono">{c.value}</div>
              <div className="font-mono text-xs text-white/30 tracking-widest uppercase mt-1">{c.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Pricing tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-center">
          {TIERS.map((tier, i) => (
            <TierCard key={tier.name} tier={tier} index={i} inView={inView} />
          ))}
        </div>

        {/* Email CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-center max-w-xl mx-auto"
        >
          <p className="text-white/30 text-sm mb-6 font-mono">
            Or drop your email and we'll send you early-bird details
          </p>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col sm:flex-row gap-3"
                onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true) }}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white placeholder-white/20 font-mono text-sm focus:outline-none focus:border-cyan-400/50 focus:bg-cyan-400/5 transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-black text-sm tracking-widest uppercase rounded-full hover:scale-105 transition-transform glow-cyan"
                >
                  Notify Me
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 text-center"
              >
                <div className="text-4xl mb-3">🎉</div>
                <p className="text-cyan-400 font-mono text-sm">You're on the list! Check your inbox.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
