'use client'

import { useEffect, useRef } from 'react'
import { registerGSAPPlugins, gsap, ScrollTrigger } from '@/lib/gsap-config'
import { useScrollStore } from '@/lib/scroll-store'
import KineticText from '@/components/ui/KineticText'
import GlassCard from '@/components/ui/GlassCard'
import MagneticButton from '@/components/ui/MagneticButton'

const ARTISTS = [
  {
    id: 'vael', handle: '@vael.systems', name: 'VAEL', role: 'Generative Architect',
    medium: 'WebGL · GLSL · Shader Art',
    bio: 'Builds luminous systems that breathe. Her work investigates the edge where mathematics becomes emotion.',
    works: ['Resonance Field', 'Null Basin', 'Spectral Drift'],
    accent: 'rgba(26,86,255,0.22)', index: '01',
  },
  {
    id: 'oskar', handle: '@oskar.void', name: 'OSKAR', role: 'Void Cartographer',
    medium: 'Three.js · Topology · Sound',
    bio: 'Maps territory that does not exist. Each piece is a coordinate system for spaces the eye cannot enter.',
    works: ['Dark Topology', 'Signal Loss', 'The Empty Formal'],
    accent: 'rgba(107,33,212,0.22)', index: '02',
  },
  {
    id: 'mara', handle: '@mara.entropy', name: 'MARA', role: 'Entropy Sculptor',
    medium: 'Particle Systems · WASM · Audio',
    bio: 'Gives chaos a face. Her sculptures are equations dressed as weather — unpredictable, inevitable.',
    works: ['Collapse Study I', 'After Order', 'Thermal Bloom'],
    accent: 'rgba(26,86,255,0.22)', index: '03',
  },
  {
    id: 'eon', handle: '@eon.signal', name: 'EON', role: 'Signal Weaver',
    medium: 'WGPU · Neural Nets · Live Code',
    bio: 'Writes programs that learn to feel. His performances are rituals — the code changes every time it runs.',
    works: ['Live Inference', 'Weight Ritual', 'Gradient Ceremony'],
    accent: 'rgba(0,180,140,0.20)', index: '04',
  },
]

const STATS = [
  { value: '2,400+', label: 'Works Generated' },
  { value: '18',     label: 'Active Members'  },
  { value: '4',      label: 'Years Running'   },
  { value: '∞',      label: 'Entropy Budget'  },
]

export default function Collective() {
  const sectionRef  = useRef<HTMLElement>(null)
  const statsRef    = useRef<HTMLDivElement>(null)
  const cardsRef    = useRef<HTMLDivElement>(null)
  const setCollectiveProgress = useScrollStore((s) => s.setCollectiveProgress)

  useEffect(() => {
    registerGSAPPlugins()
    const el = sectionRef.current
    if (!el) return

    const progressST = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      end:   'bottom 20%',
      onUpdate: (self) => {
        const raw = self.progress
        const eased = raw < 0.15 ? raw / 0.15 : raw > 0.85 ? (1 - raw) / 0.15 : 1
        setCollectiveProgress(Math.min(1, Math.max(0, eased)))
      },
      onLeave:     () => setCollectiveProgress(0),
      onLeaveBack: () => setCollectiveProgress(0),
    })

    if (statsRef.current) {
      gsap.set(statsRef.current, { opacity: 0, y: 28 })
      gsap.to(statsRef.current, {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo.out',
        scrollTrigger: { trigger: statsRef.current, start: 'top 82%', toggleActions: 'play none none none' },
      })
    }

    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('[data-card]')
      gsap.set(cards, { y: 64, opacity: 0, scale: 0.97 })
      gsap.to(cards, {
        y: 0, opacity: 1, scale: 1, duration: 1.05,
        stagger: { amount: 0.42, from: 'start' }, ease: 'expo.out',
        scrollTrigger: { trigger: cardsRef.current, start: 'top 76%', toggleActions: 'play none none none' },
      })
    }

    return () => {
      progressST.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === el || st.vars.trigger === statsRef.current || st.vars.trigger === cardsRef.current)
          st.kill()
      })
    }
  }, [setCollectiveProgress])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col px-6 md:px-12 lg:px-20 py-28 md:py-36 gap-20">

      <div className="flex flex-col gap-12">
        <div className="flex items-center gap-6">
          <span className="text-mono text-cobalt-400 text-xs tracking-[0.45em] uppercase">— 02 / Collective</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(26,86,255,0.35), transparent)' }} />
        </div>

        <div>
          <KineticText
            as="div" splitBy="chars" animation="rise" stagger={0.016} duration={1.0}
            className="text-display text-mercury-100 leading-none"
            style={{ fontSize: 'clamp(3rem, 9vw, 9rem)' }}
          >
            THE MINDS
          </KineticText>
          <KineticText
            as="div" splitBy="chars" animation="rise" stagger={0.016} delay={0.08} duration={1.0}
            className="text-display leading-none"
            style={{ fontSize: 'clamp(3rem, 9vw, 9rem)', WebkitTextStroke: '1px rgba(232,232,240,0.25)', color: 'transparent', marginTop: '-0.05em' }}
          >
            BEHIND AURA
          </KineticText>
        </div>

        <KineticText
          as="p" splitBy="words" animation="fade" stagger={0.035} duration={0.85}
          className="font-bricolage text-mercury-400 max-w-xl"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.2rem)', lineHeight: 1.7 }}
        >
          Four practitioners who refused to separate beauty from mathematics.
          Each one builds systems the other could not have imagined.
          Together they form the generative engine of AURA.
        </KineticText>
      </div>

      <div
        ref={statsRef}
        className="grid grid-cols-2 md:grid-cols-4 gap-px"
        style={{ border: '1px solid rgba(232,232,240,0.05)', background: 'rgba(232,232,240,0.05)', borderRadius: 2, overflow: 'hidden' }}
      >
        {STATS.map((s, i) => (
          <div key={i} className="flex flex-col gap-1 px-7 py-6" style={{ background: 'rgba(13,13,31,0.6)' }}>
            <span className="font-syne text-mercury-100 font-bold" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', lineHeight: 1 }}>
              {s.value}
            </span>
            <span className="text-mono text-mercury-600 text-xs tracking-[0.28em] uppercase">{s.label}</span>
          </div>
        ))}
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ARTISTS.map((artist) => (
          <div key={artist.id} data-card="true">
            <GlassCard className="rounded-sm" tiltStrength={7} glowColor={artist.accent}>
              <div className="flex flex-col gap-6 p-7 md:p-9">
                <div className="flex justify-between items-start">
                  <span className="text-mono text-cobalt-500/40 text-xs tracking-[0.38em]">{artist.index}</span>
                  <span className="text-mono text-mercury-600 text-xs tracking-[0.18em]">{artist.handle}</span>
                </div>
                <div style={{ height: 1, background: `linear-gradient(90deg, ${artist.accent}, transparent)` }} />
                <div className="flex flex-col gap-1">
                  <h3 className="font-syne text-mercury-100 font-bold leading-none tracking-tight" style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)' }}>
                    {artist.name}
                  </h3>
                  <p className="text-mono text-cobalt-400 text-xs tracking-[0.3em] uppercase">{artist.role}</p>
                </div>
                <p className="font-bricolage text-mercury-500 text-sm leading-relaxed">{artist.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {artist.medium.split(' · ').map((tag) => (
                    <span key={tag} className="text-mono text-mercury-600 text-xs tracking-[0.2em] uppercase px-3 py-1 rounded-sm"
                      style={{ border: '1px solid rgba(232,232,240,0.07)', background: 'rgba(232,232,240,0.03)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5 mt-1">
                  {artist.works.map((work) => (
                    <div key={work} className="flex items-center gap-3 group">
                      <div className="w-1 h-1 rounded-full bg-cobalt-500/50 group-hover:bg-cobalt-400 transition-colors duration-300" />
                      <span className="font-bricolage text-mercury-600 text-xs group-hover:text-mercury-300 transition-colors duration-300 tracking-wide">
                        {work}
                      </span>
                    </div>
                  ))}
                </div>
                <MagneticButton strength={18} className="self-start mt-2">
                  <button className="text-mono text-cobalt-400 text-xs tracking-[0.32em] uppercase flex items-center gap-3 group">
                    <span className="block w-5 h-px bg-cobalt-500/50 group-hover:w-8 transition-all duration-300" />
                    View Works
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">↗</span>
                  </button>
                </MagneticButton>
              </div>
            </GlassCard>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4">
        <span className="text-mono text-mercury-600 text-xs tracking-[0.32em] uppercase">— 4 Members Active</span>
        <MagneticButton strength={22}>
          <button className="glass text-mono text-mercury-400 text-xs tracking-[0.28em] uppercase px-6 py-3 rounded-sm hover:text-mercury-100 transition-colors duration-300">
            Join the Collective →
          </button>
        </MagneticButton>
      </div>
    </section>
  )
}
