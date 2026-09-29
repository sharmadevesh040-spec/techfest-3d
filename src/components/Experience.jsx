import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, MeshDistortMaterial, OrbitControls } from '@react-three/drei'
import { motion, useInView } from 'framer-motion'
import * as THREE from 'three'

/* ─── Floating geometric shapes ─── */
function FloatingShape({ position, shape, color, speed, rotSpeed }) {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed
    meshRef.current.rotation.x += rotSpeed * 0.01
    meshRef.current.rotation.y += rotSpeed * 0.015
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.3
  })

  const geometry = useMemo(() => {
    switch (shape) {
      case 'tetra': return <tetrahedronGeometry args={[0.5, 0]} />
      case 'octa':  return <octahedronGeometry args={[0.4, 0]} />
      case 'dodeca': return <dodecahedronGeometry args={[0.4, 0]} />
      case 'icosa': return <icosahedronGeometry args={[0.45, 0]} />
      case 'torus': return <torusGeometry args={[0.35, 0.12, 12, 48]} />
      default:      return <boxGeometry args={[0.6, 0.6, 0.6]} />
    }
  }, [shape])

  return (
    <mesh ref={meshRef} position={position}>
      {geometry}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        metalness={0.9}
        roughness={0.05}
        wireframe={Math.random() > 0.5}
      />
    </mesh>
  )
}

/* ─── Particle field ─── */
function ParticleField() {
  const count = 600
  const pointsRef = useRef()

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const palette = [
      new THREE.Color('#22d3ee'),
      new THREE.Color('#a78bfa'),
      new THREE.Color('#f0abfc'),
      new THREE.Color('#6ee7b7'),
    ]
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12
      const c = palette[Math.floor(Math.random() * palette.length)]
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.04
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={count} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  )
}

/* ─── Central energy orb ─── */
function EnergyOrb() {
  const ref = useRef()
  const ringRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.rotation.x = t * 0.3
    ref.current.rotation.z = t * 0.2
    ringRef.current.rotation.z = t * 0.6
    ringRef.current.rotation.x = t * 0.4
  })

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#7c3aed"
          emissive="#4c1d95"
          emissiveIntensity={1.5}
          distort={0.6}
          speed={4}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>
      <mesh ref={ringRef} scale={1.6}>
        <torusGeometry args={[1, 0.03, 8, 100]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} />
      </mesh>
      <mesh scale={1.8} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1, 0.02, 8, 100]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

/* ─── Scene ─── */
const SHAPES = [
  { position: [-5, 1.5, -2],  shape: 'tetra',  color: '#22d3ee', speed: 0.5, rotSpeed: 1 },
  { position: [5, -1, -3],   shape: 'octa',   color: '#a78bfa', speed: 0.7, rotSpeed: -1.5 },
  { position: [-4, -2, -1],  shape: 'torus',  color: '#f0abfc', speed: 0.6, rotSpeed: 2 },
  { position: [4.5, 2, -2],  shape: 'icosa',  color: '#6ee7b7', speed: 0.4, rotSpeed: 0.8 },
  { position: [0, 3, -4],    shape: 'dodeca', color: '#fbbf24', speed: 0.8, rotSpeed: -1 },
  { position: [-2, -3, -2],  shape: 'tetra',  color: '#fb7185', speed: 0.5, rotSpeed: 1.2 },
  { position: [2.5, -2.5, -1], shape: 'box',  color: '#22d3ee', speed: 0.6, rotSpeed: -0.8 },
  { position: [-6, 0, -3],   shape: 'octa',   color: '#a78bfa', speed: 0.3, rotSpeed: 1.5 },
]

function ExperienceScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 4]}  color="#22d3ee" intensity={4} />
      <pointLight position={[5, 5, 3]}  color="#7c3aed" intensity={3} />
      <pointLight position={[-5, -5, 3]} color="#f0abfc" intensity={3} />
      <Sparkles count={100} scale={12} size={2} speed={0.2} color="#a78bfa" />
      <ParticleField />
      <EnergyOrb />
      {SHAPES.map((s, i) => (
        <Float key={i} speed={s.speed * 2} rotationIntensity={0.3} floatIntensity={0.8}>
          <FloatingShape {...s} />
        </Float>
      ))}
    </>
  )
}

/* ─── Feature item ─── */
function FeatureItem({ icon, title, desc, delay, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className="flex gap-4 items-start group"
    >
      <div className="text-2xl w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 flex-shrink-0 group-hover:border-cyan-400/40 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="text-white font-bold mb-1">{title}</h4>
        <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  )
}

const FEATURES = [
  { icon: '🎮', title: 'Interactive Labs', desc: 'Hands-on sessions with cutting-edge hardware and real-time demos.' },
  { icon: '🌐', title: 'Global Network', desc: 'Connect with 20,000+ attendees from 60+ countries in one place.' },
  { icon: '🏆', title: '$50K Hackathon', desc: 'Build the next big thing in 72 hours. Judges from top-tier tech firms.' },
  { icon: '🤝', title: 'Career Fair', desc: '100+ companies hiring. Bring your resume and your A-game.' },
]

export default function Experience() {
  const textRef = useRef()
  const inView = useInView(textRef, { once: true, margin: '-100px' })

  return (
    <section id="experience" className="relative py-0 bg-black overflow-hidden">
      {/* Full-height canvas background */}
      <div className="h-screen w-full relative">
        <Canvas
          camera={{ position: [0, 0, 7], fov: 65 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ExperienceScene />
          </Suspense>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>

        {/* Gradient overlays */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.8) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none grid-bg opacity-10" />

        {/* Central label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="font-mono text-xs tracking-[0.5em] text-cyan-400 uppercase mb-4"
          >
            The Experience
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-7xl md:text-9xl font-black gradient-text text-center leading-none"
          >
            IMMERSIVE
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-white/40 text-lg mt-4 text-center font-mono"
          >
            Feel the future. Live the tech.
          </motion.p>
        </div>
      </div>

      {/* Features below canvas */}
      <div className="relative bg-black py-20 px-8 lg:px-16" ref={textRef}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                className="text-4xl font-black text-white mb-3"
              >
                Beyond a <span className="gradient-text">Conference</span>
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="text-white/40 mb-10 max-w-md"
              >
                TECHFEST is an end-to-end immersive journey. Every corner of the venue is designed to spark curiosity and fuel collaboration.
              </motion.p>
              <div className="flex flex-col gap-6">
                {FEATURES.map((f, i) => (
                  <FeatureItem key={f.title} {...f} delay={0.3 + i * 0.15} inView={inView} />
                ))}
              </div>
            </div>

            {/* Stats column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative rounded-3xl border border-white/10 overflow-hidden p-8 bg-gradient-to-br from-white/5 to-transparent"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5" />
              <div className="relative space-y-8">
                {[
                  { num: '50+', label: 'World-class Speakers', bar: 85 },
                  { num: '20+', label: 'Live Workshops', bar: 70 },
                  { num: '100+', label: 'Exhibiting Companies', bar: 95 },
                  { num: '6', label: 'Stages & Arenas', bar: 60 },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-white/50 text-sm font-mono">{stat.label}</span>
                      <span className="text-2xl font-black gradient-text">{stat.num}</span>
                    </div>
                    <motion.div
                      className="h-1 rounded-full bg-white/10 overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${stat.bar}%` } : {}}
                        transition={{ delay: 0.8 + i * 0.1, duration: 1, ease: 'easeOut' }}
                      />
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
