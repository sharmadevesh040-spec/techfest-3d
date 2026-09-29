import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Float, MeshReflectorMaterial } from '@react-three/drei'
import { motion, useInView } from 'framer-motion'
import * as THREE from 'three'

const EVENTS = [
  {
    id: 1,
    category: 'Keynote',
    title: 'Neural Frontiers',
    subtitle: 'The Next Leap in AI',
    date: 'Oct 15',
    time: '10:00 AM',
    speaker: 'Dr. Aisha Patel',
    color: '#22d3ee',
    accent: '#0891b2',
    icon: '🧠',
    tags: ['AI', 'Neural Networks', 'Future'],
  },
  {
    id: 2,
    category: 'Workshop',
    title: 'Quantum Coders',
    subtitle: 'Build on Quantum Hardware',
    date: 'Oct 15',
    time: '2:00 PM',
    speaker: 'Prof. James Chen',
    color: '#a78bfa',
    accent: '#7c3aed',
    icon: '⚛️',
    tags: ['Quantum', 'Computing', 'Hands-on'],
  },
  {
    id: 3,
    category: 'Hackathon',
    title: 'Build The Future',
    subtitle: '72-Hour Innovation Sprint',
    date: 'Oct 15–17',
    time: 'All 3 Days',
    speaker: 'Open to All',
    color: '#f0abfc',
    accent: '#c026d3',
    icon: '🚀',
    tags: ['Hackathon', '$50K Prize', 'Teams'],
  },
  {
    id: 4,
    category: 'Panel',
    title: 'Web3 & Beyond',
    subtitle: 'Decentralized Everything',
    date: 'Oct 16',
    time: '11:00 AM',
    speaker: 'Multiple Speakers',
    color: '#6ee7b7',
    accent: '#059669',
    icon: '🔗',
    tags: ['Web3', 'Blockchain', 'DeFi'],
  },
  {
    id: 5,
    category: 'Demo',
    title: 'XR Playground',
    subtitle: 'Live AR/VR Showcase',
    date: 'Oct 16',
    time: '3:00 PM',
    speaker: 'Labs Open',
    color: '#fbbf24',
    accent: '#d97706',
    icon: '🥽',
    tags: ['AR', 'VR', 'Spatial Computing'],
  },
  {
    id: 6,
    category: 'Closing',
    title: 'Horizon 2030',
    subtitle: 'What Comes Next',
    date: 'Oct 17',
    time: '6:00 PM',
    speaker: 'TechFest Founders',
    color: '#fb7185',
    accent: '#e11d48',
    icon: '🌐',
    tags: ['Future', 'Vision', 'Closing'],
  },
]

/* ─── 3D Event cube in canvas ─── */
function EventCube({ color, accent, hovered }) {
  const meshRef = useRef()
  const edgesRef = useRef()
  const targetScale = hovered ? 1.08 : 1
  const targetGlow = hovered ? 3 : 1

  useFrame((state) => {
    const t = state.clock.elapsedTime
    meshRef.current.rotation.y = t * 0.4
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

    if (edgesRef.current) {
      edgesRef.current.rotation.y = -t * 0.6
      edgesRef.current.rotation.z = t * 0.2
    }
  })

  return (
    <group>
      {/* Main cube */}
      <mesh ref={meshRef}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color={color}
          emissive={accent}
          emissiveIntensity={hovered ? 1.5 : 0.6}
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh ref={edgesRef} scale={1.15}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2 : 0.5}
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>

      <pointLight position={[0, 0, 2]} color={color} intensity={hovered ? 3 : 1} />
    </group>
  )
}

/* ─── Individual Event Card ─── */
function EventCard({ event, index }) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group rounded-2xl overflow-hidden border transition-all duration-500 cursor-pointer"
      style={{
        borderColor: hovered ? event.color + '60' : 'rgba(255,255,255,0.08)',
        background: hovered
          ? `linear-gradient(135deg, ${event.color}10, ${event.accent}08)`
          : 'rgba(255,255,255,0.03)',
        boxShadow: hovered ? `0 0 40px ${event.color}25, 0 0 80px ${event.color}10` : 'none',
        transform: hovered ? 'translateY(-6px)' : 'none',
      }}
    >
      {/* 3D Canvas mini scene */}
      <div className="h-44 w-full relative">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.4} />
          <pointLight position={[2, 2, 2]} color={event.color} intensity={3} />
          <pointLight position={[-2, -2, 2]} color={event.accent} intensity={2} />
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <EventCube color={event.color} accent={event.accent} hovered={hovered} />
          </Float>
        </Canvas>
        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="font-mono text-xs tracking-widest px-3 py-1 rounded-full font-bold uppercase"
            style={{ background: event.color + '20', color: event.color, border: `1px solid ${event.color}40` }}
          >
            {event.category}
          </span>
        </div>
        {/* Icon */}
        <div className="absolute top-3 right-3 text-2xl z-10">{event.icon}</div>
      </div>

      {/* Card body */}
      <div className="p-5 pt-3">
        <h3 className="text-xl font-black text-white mb-1">{event.title}</h3>
        <p className="text-sm mb-3" style={{ color: event.color + 'cc' }}>{event.subtitle}</p>

        <div className="flex items-center gap-3 text-white/40 text-xs font-mono mb-4">
          <span>📅 {event.date}</span>
          <span>⏰ {event.time}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/50 text-sm">{event.speaker}</span>
          <div className="flex gap-1 flex-wrap justify-end">
            {event.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hover line accent */}
      <div
        className="absolute bottom-0 left-0 h-0.5 transition-all duration-500"
        style={{
          width: hovered ? '100%' : '0%',
          background: `linear-gradient(90deg, ${event.color}, ${event.accent})`,
        }}
      />
    </motion.div>
  )
}

export default function Events() {
  const titleRef = useRef()
  const inView = useInView(titleRef, { once: true })

  return (
    <section id="events" className="relative py-24 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-cyan-400/40" />

      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        {/* Section header */}
        <div className="text-center mb-16" ref={titleRef}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs tracking-[0.4em] text-cyan-400 uppercase"
          >
            What's happening
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl font-black mt-3 mb-4"
          >
            <span className="text-white">FEATURED</span>{' '}
            <span className="gradient-text">EVENTS</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-white/40 max-w-lg mx-auto"
          >
            Curated experiences across AI, quantum, Web3, and emerging tech.
            Hover each card to explore.
          </motion.p>
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVENTS.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-14"
        >
          <a
            href="#schedule"
            className="inline-flex items-center gap-2 font-mono text-sm text-cyan-400 hover:text-white border border-cyan-400/30 hover:border-cyan-400 px-6 py-3 rounded-full transition-all duration-300 hover:bg-cyan-400/10"
          >
            View Full Schedule
            <span className="text-xs">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
