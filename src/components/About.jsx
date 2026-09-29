import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial, Float, Text3D, Center } from '@react-three/drei'
import { motion, useInView } from 'framer-motion'
import * as THREE from 'three'

/* ─── Camera rig that reacts to scroll within this section ─── */
function CameraRig({ scrollPct }) {
  const { camera } = useThree()
  const targetRef = useRef({ x: 0, y: 0, z: 5 })

  useFrame(() => {
    // Orbit camera around the object based on scroll %
    const angle = scrollPct * Math.PI * 1.4 - 0.2
    const radius = 5
    targetRef.current.x = Math.sin(angle) * radius
    targetRef.current.z = Math.cos(angle) * radius
    targetRef.current.y = scrollPct * 2 - 0.5

    camera.position.x += (targetRef.current.x - camera.position.x) * 0.05
    camera.position.y += (targetRef.current.y - camera.position.y) * 0.05
    camera.position.z += (targetRef.current.z - camera.position.z) * 0.05
    camera.lookAt(0, 0, 0)
  })

  return null
}

/* ─── Central DNA-like helix object ─── */
function HelixObject() {
  const groupRef = useRef()
  const count = 20

  useFrame((state) => {
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, i) => {
        const t = (i / count) * Math.PI * 4
        const r = 0.8
        const x1 = Math.cos(t) * r
        const x2 = Math.cos(t + Math.PI) * r
        const z1 = Math.sin(t) * r
        const z2 = Math.sin(t + Math.PI) * r
        const y = (i / count) * 4 - 2

        return (
          <group key={i}>
            {/* Strand 1 */}
            <mesh position={[x1, y, z1]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} />
            </mesh>
            {/* Strand 2 */}
            <mesh position={[x2, y, z2]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={2} />
            </mesh>
            {/* Connector bar */}
            {i % 3 === 0 && (
              <mesh position={[(x1 + x2) / 2, y, (z1 + z2) / 2]}
                rotation={[0, -t, 0]}
              >
                <cylinderGeometry args={[0.015, 0.015, r * 2, 6]} />
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} transparent opacity={0.6} />
              </mesh>
            )}
          </group>
        )
      })}

      {/* Core glow sphere */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <MeshDistortMaterial color="#06b6d4" emissive="#0e7490" emissiveIntensity={2} distort={0.5} speed={3} />
      </mesh>
    </group>
  )
}

/* ─── Floating stat card ─── */
function StatCard({ value, label, delay }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-center group hover:border-cyan-400/40 transition-all duration-300"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="text-4xl font-black gradient-text mb-1">{value}</div>
      <div className="text-white/50 text-sm font-mono tracking-wider uppercase">{label}</div>
    </motion.div>
  )
}

export default function About() {
  const sectionRef = useRef()
  const [scrollPct, setScrollPct] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const total = sectionRef.current.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      const pct = Math.max(0, Math.min(1, scrolled / total))
      setScrollPct(pct)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const textRef = useRef()
  const inView = useInView(textRef, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={sectionRef} className="relative min-h-screen bg-black overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Canvas */}
      <div className="sticky top-0 h-screen w-full pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
          <ambientLight intensity={0.3} />
          <pointLight position={[3, 3, 3]} color="#22d3ee" intensity={5} />
          <pointLight position={[-3, -3, 3]} color="#7c3aed" intensity={5} />
          <HelixObject />
          <CameraRig scrollPct={scrollPct} />
        </Canvas>

        {/* Radial fade */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 70% 50%, transparent, rgba(0,0,0,0.9) 70%)' }} />
      </div>

      {/* Text overlay — scrolls over the sticky canvas */}
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <div className="w-full max-w-7xl mx-auto px-8 lg:px-16">
          <div className="max-w-lg pointer-events-auto" ref={textRef}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <span className="font-mono text-xs tracking-[0.4em] text-cyan-400 uppercase">About the event</span>
              <h2 className="text-6xl font-black mt-3 mb-6 leading-none">
                <span className="text-white">THE FUTURE</span><br />
                <span className="gradient-text">STARTS HERE</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                TECHFEST 2026 is a three-day immersive experience where the brightest minds in technology, design, and innovation converge. Expect boundary-breaking talks, hands-on labs, and connections that last a lifetime.
              </p>
              <p className="text-white/40 text-base leading-relaxed mb-10">
                From AI breakthroughs and quantum computing to Web3 and sustainable tech — every topic that's reshaping civilization is on the table.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              <StatCard value="50+" label="Speakers" delay={0.5} />
              <StatCard value="20K+" label="Attendees" delay={0.6} />
              <StatCard value="72h" label="Hackathon" delay={0.7} />
              <StatCard value="3" label="Days" delay={0.8} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
