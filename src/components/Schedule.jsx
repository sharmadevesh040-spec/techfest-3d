import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const DAYS = [
  {
    day: 'Day 01',
    date: 'October 15',
    theme: 'Ignition',
    color: '#22d3ee',
    events: [
      { time: '09:00', title: 'Registration & Welcome Kit', type: 'admin', speaker: '' },
      { time: '10:00', title: 'Opening Keynote: Neural Frontiers', type: 'keynote', speaker: 'Dr. Aisha Patel' },
      { time: '11:30', title: 'Panel: The Age of Generative AI', type: 'panel', speaker: 'Multiple' },
      { time: '13:00', title: 'Networking Lunch + Expo Open', type: 'social', speaker: '' },
      { time: '14:00', title: 'Workshop: Quantum Coders', type: 'workshop', speaker: 'Prof. James Chen' },
      { time: '16:00', title: 'Lightning Talks: 10 Ideas in 10 Min', type: 'talk', speaker: 'Various' },
      { time: '18:00', title: 'Hackathon Kickoff 🚀', type: 'hackathon', speaker: '' },
      { time: '20:00', title: 'Welcome Party + AR Demo Night', type: 'social', speaker: '' },
    ],
  },
  {
    day: 'Day 02',
    date: 'October 16',
    theme: 'Elevation',
    color: '#a78bfa',
    events: [
      { time: '09:00', title: 'Morning Yoga + Networking Breakfast', type: 'social', speaker: '' },
      { time: '10:00', title: 'Keynote: Sustainable Tech in 2030', type: 'keynote', speaker: 'Maya Ruiz' },
      { time: '11:30', title: 'Panel: Web3 & Beyond', type: 'panel', speaker: 'Multiple' },
      { time: '13:00', title: 'Lunch + Hackathon Check-in', type: 'hackathon', speaker: '' },
      { time: '14:00', title: 'Workshop: Build with LLMs', type: 'workshop', speaker: 'Team Anthropic' },
      { time: '16:00', title: 'XR Playground: Live AR/VR Showcase', type: 'demo', speaker: 'Labs Open' },
      { time: '18:00', title: 'Career Fair Opens', type: 'social', speaker: '' },
      { time: '21:00', title: 'Hackathon Midnight Hack', type: 'hackathon', speaker: '' },
    ],
  },
  {
    day: 'Day 03',
    date: 'October 17',
    theme: 'Ascension',
    color: '#f0abfc',
    events: [
      { time: '09:00', title: 'Hackathon Final Submissions', type: 'hackathon', speaker: '' },
      { time: '10:00', title: 'Keynote: Human + Machine Intelligence', type: 'keynote', speaker: 'Dr. Kenji Ota' },
      { time: '11:30', title: 'Workshop: Design for the AI Era', type: 'workshop', speaker: 'Sara Lindqvist' },
      { time: '13:00', title: 'Hackathon Demo Day', type: 'hackathon', speaker: 'All Teams' },
      { time: '15:00', title: 'Awards Ceremony 🏆', type: 'keynote', speaker: '' },
      { time: '16:30', title: 'Closing Panel: Horizon 2030', type: 'panel', speaker: 'Founders' },
      { time: '18:00', title: 'Closing Keynote', type: 'keynote', speaker: 'TechFest Founders' },
      { time: '19:30', title: 'Grand Finale Celebration 🎉', type: 'social', speaker: '' },
    ],
  },
]

const TYPE_STYLES = {
  keynote:  { bg: 'bg-cyan-400/10',   border: 'border-cyan-400/30',   text: 'text-cyan-400',   label: 'Keynote'  },
  panel:    { bg: 'bg-violet-400/10', border: 'border-violet-400/30', text: 'text-violet-400', label: 'Panel'    },
  workshop: { bg: 'bg-fuchsia-400/10',border: 'border-fuchsia-400/30',text: 'text-fuchsia-400',label: 'Workshop' },
  hackathon:{ bg: 'bg-orange-400/10', border: 'border-orange-400/30', text: 'text-orange-400', label: 'Hackathon'},
  talk:     { bg: 'bg-green-400/10',  border: 'border-green-400/30',  text: 'text-green-400',  label: 'Talk'     },
  demo:     { bg: 'bg-yellow-400/10', border: 'border-yellow-400/30', text: 'text-yellow-400', label: 'Demo'     },
  social:   { bg: 'bg-white/5',       border: 'border-white/10',      text: 'text-white/40',   label: 'Social'   },
  admin:    { bg: 'bg-white/5',       border: 'border-white/10',      text: 'text-white/30',   label: 'Info'     },
}

function TimelineEvent({ event, index, dayColor, inView }) {
  const [expanded, setExpanded] = useState(false)
  const style = TYPE_STYLES[event.type] || TYPE_STYLES.talk
  const isLeft = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.05 * index, duration: 0.5, ease: 'easeOut' }}
      className={`flex items-start gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse md:flex-row'}`}
    >
      {/* Time */}
      <div className="w-16 flex-shrink-0 text-right">
        <span className="font-mono text-xs text-white/30">{event.time}</span>
      </div>

      {/* Dot on timeline */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-3 h-3 rounded-full border-2 mt-0.5 transition-all duration-300"
          style={{ borderColor: dayColor, background: expanded ? dayColor : 'transparent', boxShadow: expanded ? `0 0 12px ${dayColor}` : 'none' }}
        />
      </div>

      {/* Card */}
      <motion.button
        className={`flex-1 text-left p-4 rounded-xl border transition-all duration-300 ${style.bg} ${style.border} hover:scale-[1.02] cursor-pointer mb-3`}
        onClick={() => setExpanded(!expanded)}
        style={{ boxShadow: expanded ? `0 0 20px ${dayColor}20` : 'none' }}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-mono text-xs px-2 py-0.5 rounded-full border text-[10px] tracking-widest uppercase ${style.text} ${style.border} bg-white/5`}>
                {style.label}
              </span>
            </div>
            <h4 className="text-white font-semibold text-sm">{event.title}</h4>
            {event.speaker && (
              <p className="text-white/40 text-xs mt-1 font-mono">{event.speaker}</p>
            )}
          </div>
          <span className="text-white/20 text-xs mt-1 flex-shrink-0">{expanded ? '▲' : '▼'}</span>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-white/50 text-xs">
                  Add this to your personal schedule. Capacity is limited for workshops — register early.
                </p>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className={`mt-3 text-xs font-mono px-3 py-1 rounded-full border ${style.border} ${style.text} hover:bg-white/5 transition-colors`}
                >
                  + Add to My Schedule
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}

function DayColumn({ day, dayIndex, inView }) {
  return (
    <div className="flex-1 min-w-0">
      {/* Day header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: dayIndex * 0.2, duration: 0.6 }}
        className="text-center mb-8 pb-6 border-b border-white/10"
      >
        <div
          className="inline-block font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full mb-2"
          style={{ background: day.color + '15', color: day.color, border: `1px solid ${day.color}30` }}
        >
          {day.day}
        </div>
        <h3 className="text-white text-xl font-black">{day.date}</h3>
        <p className="font-mono text-xs mt-1" style={{ color: day.color + 'aa' }}>
          Theme: {day.theme}
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative pl-2">
        {/* Vertical line */}
        <motion.div
          className="absolute left-[4.5rem] top-0 bottom-0 w-px"
          style={{ background: `linear-gradient(180deg, ${day.color}60, transparent)` }}
          initial={{ scaleY: 0, originY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ delay: 0.3 + dayIndex * 0.2, duration: 1.2, ease: 'easeOut' }}
        />
        {day.events.map((event, i) => (
          <TimelineEvent key={i} event={event} index={i} dayColor={day.color} inView={inView} />
        ))}
      </div>
    </div>
  )
}

export default function Schedule() {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [activeFilter, setActiveFilter] = useState('all')

  const filters = ['all', 'keynote', 'workshop', 'panel', 'hackathon', 'demo']

  return (
    <section id="schedule" className="relative py-24 bg-black overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-15" />

      {/* Top separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-violet-400/40" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="font-mono text-xs tracking-[0.4em] text-violet-400 uppercase"
          >
            3 days of innovation
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl font-black mt-3 mb-4"
          >
            <span className="text-white">FULL</span>{' '}
            <span className="gradient-text">SCHEDULE</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-white/40 max-w-lg mx-auto mb-8"
          >
            Click any event to expand details and add to your personal schedule.
          </motion.p>

          {/* Filter pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`font-mono text-xs tracking-widest uppercase px-4 py-2 rounded-full border transition-all duration-300 ${
                  activeFilter === f
                    ? 'bg-cyan-400/20 border-cyan-400/60 text-cyan-400'
                    : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/60'
                }`}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>

        {/* 3-column timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {DAYS.map((day, i) => (
            <DayColumn key={i} day={day} dayIndex={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
