import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sparkles, Trail, MeshDistortMaterial } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

/* ─── Orbiting Ring ─── */
function OrbitRing({ radius, speed, color, tilt = 0 }) {
  const ref = useRef()
  useFrame((state) => {
    ref.current.rotation.z = state.clock.elapsedTime * speed
  })
  return (
    <group rotation={[tilt, 0, 0]}>
      <mesh ref={ref}>
        <torusGeometry args={[radius, 0.012, 16, 120]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

/* ─── Orbiting Sphere on Ring ─── */
function OrbitingDot({ radius, speed, color, offset = 0 }) {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.z = Math.sin(t) * radius
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} />
    </mesh>
  )
}

/* ─── Inner Pulsing Core ─── */
function FuturisticCore() {
  const coreRef = useRef()
  const outerRef = useRef()
  const innerRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    coreRef.current.rotation.x = t * 0.3
    coreRef.current.rotation.y = t * 0.5
    outerRef.current.rotation.x = -t * 0.2
    outerRef.current.rotation.y = t * 0.4
    innerRef.current.rotation.z = t * 0.7

    // Pulsing scale
    const pulse = 1 + Math.sin(t * 2) * 0.04
    coreRef.current.scale.setScalar(pulse)
  })

  return (
    <group>
      {/* Main distorted core sphere */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.9, 4]} />
        <MeshDistortMaterial
          color="#06b6d4"
          emissive="#0891b2"
          emissiveIntensity={1.5}
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Outer wireframe shell */}
      <mesh ref={outerRef} scale={1.35}>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={0.8}
          wireframe={true}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Inner spinning octahedron */}
      <mesh ref={innerRef} scale={0.5}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={3}
          wireframe={true}
        />
      </mesh>

      {/* Orbital rings */}
      <OrbitRing radius={1.8} speed={0.4}  color="#22d3ee" tilt={0} />
      <OrbitRing radius={2.1} speed={-0.3} color="#a78bfa" tilt={Math.PI / 4} />
      <OrbitRing radius={1.6} speed={0.6}  color="#f0abfc" tilt={Math.PI / 3} />

      {/* Orbiting dots */}
      <OrbitingDot radius={1.8} speed={0.8}  color="#22d3ee" offset={0} />
      <OrbitingDot radius={2.1} speed={-0.6} color="#a78bfa" offset={2} />
      <OrbitingDot radius={1.6} speed={1.0}  color="#f0abfc" offset={4} />
    </group>
  )
}

/* ─── Background particles ─── */
function Particles() {
  const count = 300
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 30
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return arr
  }, [])

  const geoRef = useRef()
  useFrame((state) => {
    if (geoRef.current) {
      geoRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <points ref={geoRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#22d3ee" size={0.04} transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

/* ─── Scene ─── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]}   color="#22d3ee" intensity={4} />
      <pointLight position={[-5, -5, 5]} color="#7c3aed" intensity={4} />
      <pointLight position={[0, 0, 8]}   color="#ffffff" intensity={1} />
      <Sparkles count={80} scale={6} size={1.5} speed={0.3} color="#22d3ee" />
      <Particles />
      <FuturisticCore />
    </>
  )
}

/* ─── Hero Component ─── */
export default function Hero() {
  return (
    <section id="hero" className="relative w-full h-screen bg-black overflow-hidden scanline">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Scene />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.5}
            minPolarAngle={Math.PI / 4}
          />
        </Canvas>
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 80%)' }} />

      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-4"
        >
          <span className="font-mono text-sm tracking-[0.4em] text-cyan-400 uppercase border border-cyan-400/30 px-4 py-1 rounded-full bg-cyan-400/5">
            October 15–17, 2026
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
          className="text-[clamp(4rem,15vw,12rem)] font-black leading-none tracking-tighter mb-4"
        >
          <span className="gradient-text text-glow-cyan">TECH</span>
          <span className="text-white">FEST</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="font-mono text-lg text-white/60 max-w-xl mb-2"
        >
          WHERE INNOVATION IGNITES THE FUTURE
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-white/40 text-sm mb-10 max-w-md"
        >
          3 days · 50+ speakers · 20+ workshops · 1 epic hackathon
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <a
            href="#register"
            className="group relative px-8 py-3 bg-cyan-500 text-black font-bold text-sm tracking-widest uppercase rounded-full overflow-hidden transition-all duration-300 hover:scale-105 glow-cyan"
          >
            <span className="relative z-10">Register Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href="#events"
            className="px-8 py-3 border border-white/20 text-white/80 font-bold text-sm tracking-widest uppercase rounded-full hover:border-cyan-400/60 hover:text-cyan-400 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            Explore Events
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-xs text-white/30 tracking-widest">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-cyan-400/60 to-transparent animate-pulse" />
        </motion.div>
      </div>
    </section>
  )
}
