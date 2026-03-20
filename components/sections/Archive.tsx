'use client'

import { useEffect, useRef } from 'react'
import { registerGSAPPlugins, gsap, ScrollTrigger } from '@/lib/gsap-config'
import KineticText from '@/components/ui/KineticText'

// ── Work data ────────────────────────────────────────────────────────────────
const WORKS = [
  {
    id:      'resonance-field',
    number:  '001',
    title:   'Resonance Field',
    artist:  'VAEL',
    year:    '2026',
    medium:  'WebGL · Real-time Shader',
    desc:    'A study in how sound behaves when it forgets it is sound. Frequency data feeds a vertex displacement field — the mesh listens.',
    tags:    ['Audio-Reactive', 'GLSL', 'Generative'],
    accent:  '#1A56FF',
    palette: ['#04040A', '#0D0D1F', '#1A56FF', '#4D7FFF'],
  },
  {
    id:      'dark-topology',
    number:  '002',
    title:   'Dark Topology',
    artist:  'OSKAR',
    year:    '2025',
    medium:  'Three.js · Custom Geometry',
    desc:    'Manifolds of non-orientable surfaces rendered in absolute void. Every frame is a theorem that cannot be proven.',
    tags:    ['Topology', '3D', 'Mathematical'],
    accent:  '#6B21D4',
    palette: ['#04040A', '#12082A', '#6B21D4', '#9B51E0'],
  },
  {
    id:      'collapse-study',
    number:  '003',
    title:   'Collapse Study I',
    artist:  'MARA',
    year:    '2025',
    medium:  'Particle Systems · WASM',
    desc:    'Ten thousand particles given one instruction: find order. They never do. The search itself is the work.',
    tags:    ['Particles', 'Simulation', 'Emergent'],
    accent:  '#1A56FF',
    palette: ['#04040A', '#080818', '#1A56FF', '#E8E8F0'],
  },
  {
    id:      'live-inference',
    number:  '004',
    title:   'Live Inference',
    artist:  'EON',
    year:    '2026',
    medium:  'Neural Nets · Live Code',
    desc:    'A model trained on its own previous outputs performs live. The weights drift each session. It has never played the same piece twice.',
    tags:    ['AI', 'Live Performance', 'Generative'],
    accent:  '#00B48C',
    palette: ['#04040A', '#001A14', '#00B48C', '#00FFCC'],
  },
  {
    id:      'spectral-drift',
    number:  '005',
    title:   'Spectral Drift',
    artist:  'VAEL',
    year:    '2024',
    medium:  'WebGL · FFT Analysis',
    desc:    'Light decomposed. A prism made of code. The colour of a sound you have not heard yet.',
    tags:    ['Spectral', 'Light', 'Audio'],
    accent:  '#4D7FFF',
    palette: ['#04040A', '#060A1E', '#4D7FFF', '#B3CCFF'],
  },
  {
    id:      'weight-ritual',
    number:  '006',
    title:   'Weight Ritual',
    artist:  'EON',
    year:    '2024',
    medium:  'Neural Nets · Projection',
    desc:    'Gradient descent visualised as ceremony. Each epoch is a prayer. The loss function is a hymn to imperfection.',
    tags:    ['Neural', 'Ritual', 'Data Viz'],
    accent:  '#00B48C',
    palette: ['#04040A', '#001A14', '#00B48C', '#E8E8F0'],
  },
]

// ── Fake generative preview (CSS-only visual per work) ────────────────────
function WorkPreview({
  accent,
  palette,
  index,
}: {
  accent: string
  palette: string[]
  index: number
}) {
  // Each card gets a unique generative-looking CSS pattern
  const patterns = [
    // Concentric rings
    `radial-gradient(circle at 50% 50%, transparent 20%, ${accent}18 21%, transparent 22%),
     radial-gradient(circle at 50% 50%, transparent 38%, ${accent}12 39%, transparent 40%),
     radial-gradient(circle at 50% 50%, transparent 56%, ${accent}0A 57%, transparent 58%),
     radial-gradient(circle at 30% 70%, ${accent}22 0%, transparent 45%),
     radial-gradient(circle at 70% 30%, ${palette[2]}18 0%, transparent 40%)`,

    // Diagonal grid
    `repeating-linear-gradient(45deg, ${accent}08 0px, ${accent}08 1px, transparent 1px, transparent 18px),
     repeating-linear-gradient(-45deg, ${accent}05 0px, ${accent}05 1px, transparent 1px, transparent 18px),
     radial-gradient(ellipse at 60% 40%, ${accent}25 0%, transparent 55%)`,

    // Vertical bands
    `repeating-linear-gradient(90deg, ${accent}06 0px, ${accent}06 1px, transparent 1px, transparent 24px),
     linear-gradient(180deg, ${palette[2]}20 0%, transparent 60%),
     radial-gradient(circle at 40% 60%, ${accent}30 0%, transparent 40%)`,

    // Noise-like dots pattern
    `radial-gradient(circle at 25% 25%, ${accent}20 0%, transparent 8%),
     radial-gradient(circle at 75% 25%, ${accent}18 0%, transparent 6%),
     radial-gradient(circle at 50% 75%, ${accent}22 0%, transparent 10%),
     radial-gradient(circle at 85% 65%, ${accent}14 0%, transparent 7%),
     radial-gradient(circle at 15% 80%, ${accent}16 0%, transparent 9%),
     linear-gradient(135deg, ${palette[1]} 0%, ${palette[0]} 100%)`,

    // Horizontal scan-lines
    `repeating-linear-gradient(0deg, ${accent}06 0px, ${accent}06 1px, transparent 1px, transparent 12px),
     linear-gradient(90deg, transparent 0%, ${accent}20 50%, transparent 100%),
     radial-gradient(ellipse at 50% 30%, ${accent}28 0%, transparent 50%)`,

    // Cross-hatch fine
    `repeating-linear-gradient(0deg,   ${accent}04 0px, ${accent}04 1px, transparent 1px, transparent 10px),
     repeating-linear-gradient(90deg,  ${accent}04 0px, ${accent}04 1px, transparent 1px, transparent 10px),
     radial-gradient(circle at 70% 60%, ${accent}28 0%, transparent 48%)`,
  ]

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `${patterns[index % patterns.length]}, linear-gradient(160deg, ${palette[1]} 0%, ${palette[0]} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating orb */}
      <div
        style={{
          position: 'absolute',
          width: '55%',
          paddingBottom: '55%',
          borderRadius: '50%',
          top: '18%',
          left: '22%',
          background: `radial-gradient(circle at 38% 38%, ${accent}35, ${accent}08 55%, transparent 70%)`,
          filter: 'blur(18px)',
          animation: `breathe ${3.5 + (index % 3) * 0.8}s ease-in-out infinite`,
        }}
      />
      {/* Accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: '22%',
          left: '10%',
          right: '10%',
          height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}70, transparent)`,
        }}
      />
    </div>
  )
}

export default function Archive() {
  const sectionRef  = useRef<HTMLElement>(null)
  const trackRef    = useRef<HTMLDivElement>(null)
  const wrapRef     = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerGSAPPlugins()

    const section = sectionRef.current
    const track   = trackRef.current
    const wrap    = wrapRef.current
    if (!section || !track || !wrap) return

    // ── Measure how far the track needs to travel ───────────────────────
    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 160)

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start:   'top top',
          end:     () => `+=${Math.abs(getScrollAmount()) + window.innerHeight * 0.5}`,
          pin:     true,
          scrub:   1.1,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`
            }
          },
        },
      })

      tl.to(track, {
        x: () => getScrollAmount(),
        ease: 'none',
      })

      // Cards reveal as they enter the viewport during horizontal travel
      const cards = track.querySelectorAll('[data-work-card]')
      cards.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 32,
          scale: 0.96,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start:   () => `top top+=${i * 0.13 * (Math.abs(getScrollAmount()))}`,
            containerAnimation: tl,
            toggleActions: 'play none none none',
          },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ height: '100vh', overflow: 'hidden' }}
      className="relative w-full"
    >
      {/* ── HEADER — sits above the track ─────────────────────────────── */}
      <div
        ref={wrapRef}
        className="relative h-full flex flex-col"
      >
        {/* Top bar */}
        <div
          className="flex justify-between items-center px-6 md:px-12 lg:px-20 pt-10 pb-6 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(232,232,240,0.05)' }}
        >
          <div className="flex items-center gap-6">
            <span className="text-mono text-cobalt-400 text-xs tracking-[0.45em] uppercase">
              — 03 / Archive
            </span>
            <div
              style={{
                width: 1,
                height: 28,
                background: 'rgba(232,232,240,0.1)',
              }}
            />
            <KineticText
              as="span"
              splitBy="chars"
              animation="fade"
              stagger={0.025}
              duration={0.7}
              className="font-syne text-mercury-100 font-bold"
              style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.4rem)' } as React.CSSProperties}
            >
              SELECTED WORKS
            </KineticText>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <span className="text-mono text-mercury-600 text-xs tracking-[0.25em] uppercase">
              {WORKS.length} Works
            </span>
            <div
              style={{
                width: 32,
                height: 1,
                background: 'rgba(232,232,240,0.15)',
              }}
            />
            <span className="text-mono text-mercury-600 text-xs tracking-[0.25em] uppercase">
              Scroll →
            </span>
          </div>
        </div>

        {/* ── HORIZONTAL TRACK ──────────────────────────────────────────── */}
        <div className="flex-1 flex items-center overflow-hidden">
          <div
            ref={trackRef}
            className="flex items-stretch gap-5 pl-6 md:pl-12 lg:pl-20 pr-24"
            style={{ willChange: 'transform' }}
          >
            {WORKS.map((work, i) => (
              <article
                key={work.id}
                data-work-card="true"
                data-hover="true"
                style={{
                  // Cards vary slightly in height for rhythm
                  width:     'clamp(300px, 32vw, 440px)',
                  height:    i % 2 === 0 ? 'clamp(400px, 58vh, 540px)' : 'clamp(360px, 52vh, 490px)',
                  flexShrink: 0,
                  alignSelf:  i % 2 === 0 ? 'flex-start' : 'flex-end',
                  marginBottom: i % 2 === 0 ? 0 : 24,
                  position:  'relative',
                  cursor:    'none',
                }}
                className="group"
              >
                {/* Card shell */}
                <div
                  className="w-full h-full flex flex-col rounded-sm overflow-hidden
                             transition-all duration-500 group-hover:scale-[1.015]"
                  style={{
                    background: 'rgba(8,8,18,0.9)',
                    border: '1px solid rgba(232,232,240,0.06)',
                    boxShadow: `0 0 0 0 ${work.accent}00`,
                    transition: 'transform 0.5s cubic-bezier(0.19,1,0.22,1), box-shadow 0.4s ease, border-color 0.4s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.boxShadow = `0 0 40px ${work.accent}22, 0 0 80px ${work.accent}0A`
                    el.style.borderColor = `${work.accent}30`
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.boxShadow = `0 0 0 0 ${work.accent}00`
                    el.style.borderColor = 'rgba(232,232,240,0.06)'
                  }}
                >
                  {/* Preview pane — 58% height */}
                  <div style={{ height: '58%', position: 'relative', overflow: 'hidden' }}>
                    <WorkPreview
                      accent={work.accent}
                      palette={work.palette}
                      index={i}
                    />

                    {/* Overlay gradient */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        height: '50%',
                        background: 'linear-gradient(180deg, transparent, rgba(8,8,18,0.95))',
                      }}
                    />

                    {/* Number watermark */}
                    <span
                      className="absolute top-4 right-5 font-syne font-bold"
                      style={{
                        fontSize: 'clamp(3rem, 5vw, 4rem)',
                        color: `${work.accent}18`,
                        lineHeight: 1,
                        letterSpacing: '-0.04em',
                        userSelect: 'none',
                      }}
                    >
                      {work.number}
                    </span>
                  </div>

                  {/* Info pane — 42% height */}
                  <div className="flex flex-col justify-between flex-1 p-6">
                    <div className="flex flex-col gap-3">
                      {/* Artist + year */}
                      <div className="flex justify-between items-center">
                        <span
                          className="text-mono text-xs tracking-[0.32em] uppercase"
                          style={{ color: work.accent }}
                        >
                          {work.artist}
                        </span>
                        <span className="text-mono text-mercury-600 text-xs tracking-[0.2em]">
                          {work.year}
                        </span>
                      </div>

                      {/* Thin divider */}
                      <div
                        style={{
                          height: 1,
                          background: `linear-gradient(90deg, ${work.accent}40, transparent)`,
                        }}
                      />

                      {/* Title */}
                      <h3
                        className="font-syne text-mercury-100 font-bold leading-tight"
                        style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)' }}
                      >
                        {work.title}
                      </h3>

                      {/* Description */}
                      <p
                        className="font-bricolage text-mercury-500 text-xs leading-relaxed
                                   group-hover:text-mercury-400 transition-colors duration-300"
                      >
                        {work.desc}
                      </p>
                    </div>

                    {/* Tags + CTA */}
                    <div className="flex justify-between items-end mt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {work.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-mono text-mercury-600 text-xs px-2 py-0.5 rounded-sm"
                            style={{
                              fontSize: '0.6rem',
                              letterSpacing: '0.18em',
                              textTransform: 'uppercase',
                              border: '1px solid rgba(232,232,240,0.07)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        className="text-mono text-xs tracking-[0.25em] uppercase
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                   flex items-center gap-1.5"
                        style={{ color: work.accent, fontSize: '0.6rem' }}
                      >
                        View ↗
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* ── END CARD ──────────────────────────────────────────────── */}
            <div
              style={{
                width:      'clamp(260px, 28vw, 380px)',
                flexShrink: 0,
                display:    'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div className="flex flex-col items-center gap-6 text-center">
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    border: '1px solid rgba(26,86,255,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(26,86,255,0.04)',
                  }}
                >
                  <span
                    className="font-syne text-cobalt-400 font-bold"
                    style={{ fontSize: '1.4rem' }}
                  >
                    +
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className="font-syne text-mercury-400 font-semibold"
                    style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)' }}
                  >
                    More works
                  </span>
                  <span className="text-mono text-mercury-600 text-xs tracking-[0.25em] uppercase">
                    In Progress
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PROGRESS BAR ──────────────────────────────────────────────── */}
        <div
          className="flex-shrink-0 px-6 md:px-12 lg:px-20 pb-8 pt-4 flex items-center gap-5"
          style={{ borderTop: '1px solid rgba(232,232,240,0.05)' }}
        >
          {/* Track */}
          <div
            style={{
              flex: 1,
              height: 1,
              background: 'rgba(232,232,240,0.07)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              ref={progressRef}
              style={{
                position: 'absolute',
                inset: '0 auto 0 0',
                width: '0%',
                background:
                  'linear-gradient(90deg, #1A56FF, #4D7FFF)',
                transition: 'none', // GSAP drives this directly
              }}
            />
          </div>

          {/* Medium label */}
          <span className="text-mono text-mercury-600 text-xs tracking-[0.25em] uppercase flex-shrink-0">
            Drag or scroll →
          </span>
        </div>
      </div>

      {/* Breathe keyframe injected once */}
      <style>{`
        @keyframes breathe {
          0%,100% { opacity: 0.7; transform: scale(1);    }
          50%      { opacity: 1;   transform: scale(1.06); }
        }
      `}</style>
    </section>
  )
}
