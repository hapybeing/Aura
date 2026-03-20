'use client'

import { useEffect, useRef } from 'react'
import { registerGSAPPlugins, gsap, ScrollTrigger } from '@/lib/gsap-config'
import { useScrollStore } from '@/lib/scroll-store'
import KineticText from '@/components/ui/KineticText'

const PRINCIPLES = [
  {
    number: 'I',
    title:  'Entropy as Medium',
    body:   'We build systems that astonish their creators. Chaos is the brush. The output is always the surprise.',
  },
  {
    number: 'II',
    title:  'Computation as Ritual',
    body:   'Every render cycle is a ceremony. Code is liturgy. The GPU is the altar where light learns to feel.',
  },
  {
    number: 'III',
    title:  'The Living Artefact',
    body:   'Nothing we make is ever finished. Our works breathe, mutate, and respond. They are alive in the only way matter can be.',
  },
]

export default function Manifesto() {
  const sectionRef    = useRef<HTMLElement>(null)
  const dividerRef    = useRef<HTMLDivElement>(null)
  const principlesRef = useRef<HTMLDivElement>(null)
  const setManifestoProgress = useScrollStore((s) => s.setManifestoProgress)

  useEffect(() => {
    registerGSAPPlugins()
    const el = sectionRef.current
    if (!el) return

    const progressST = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      end:   'bottom 15%',
      onUpdate: (self) => {
        const raw = self.progress
        const eased =
          raw < 0.2 ? raw / 0.2
          : raw > 0.8 ? (1 - raw) / 0.2
          : 1
        setManifestoProgress(Math.min(1, Math.max(0, eased)))
      },
      onLeave:     () => setManifestoProgress(0),
      onLeaveBack: () => setManifestoProgress(0),
    })

    if (dividerRef.current) {
      gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: 'left center' })
      gsap.to(dividerRef.current, {
        scaleX: 1, duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: dividerRef.current, start: 'top 82%', toggleActions: 'play none none none' },
      })
    }

    if (principlesRef.current) {
      const cards = principlesRef.current.querySelectorAll('[data-principle]')
      gsap.set(cards, { y: 48, opacity: 0 })
      gsap.to(cards, {
        y: 0, opacity: 1, duration: 1.0, stagger: 0.16, ease: 'expo.out',
        scrollTrigger: { trigger: principlesRef.current, start: 'top 78%', toggleActions: 'play none none none' },
      })
    }

    return () => {
      progressST.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === el || st.vars.trigger === dividerRef.current || st.vars.trigger === principlesRef.current)
          st.kill()
      })
    }
  }, [setManifestoProgress])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-between px-6 md:px-12 lg:px-20 py-28 md:py-36"
    >
      <div className="flex items-center gap-6 mb-20">
        <span className="text-mono text-cobalt-400 text-xs tracking-[0.45em] uppercase">— 01 / Manifesto</span>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(26,86,255,0.35), transparent)' }} />
      </div>

      <div className="mb-16 md:mb-24">
        <KineticText
          as="div" splitBy="chars" animation="rise" stagger={0.018} duration={1.1}
          className="text-display leading-none select-none"
          style={{ fontSize: 'clamp(3.5rem, 10.5vw, 10.5rem)', WebkitTextStroke: '1px rgba(232,232,240,0.28)', color: 'transparent' }}
        >
          FORM
        </KineticText>

        <KineticText
          as="div" splitBy="chars" animation="rise" stagger={0.018} delay={0.1} duration={1.1}
          className="text-display text-mercury-100 leading-none select-none"
          style={{ fontSize: 'clamp(3.5rem, 10.5vw, 10.5rem)', letterSpacing: '-0.04em', marginTop: '-0.06em' }}
        >
          EMERGES
        </KineticText>

        <KineticText
          as="div" splitBy="chars" animation="rise" stagger={0.018} delay={0.18} duration={1.1}
          className="text-display leading-none select-none"
          style={{
            fontSize: 'clamp(3.5rem, 10.5vw, 10.5rem)',
            letterSpacing: '-0.04em',
            color: '#1A56FF',
            textShadow: '0 0 40px rgba(26,86,255,0.55), 0 0 120px rgba(26,86,255,0.20)',
            marginTop: '-0.06em',
          }}
        >
          FROM ENTROPY.
        </KineticText>
      </div>

      <div
        ref={dividerRef}
        style={{
          height: 1,
          background: 'linear-gradient(90deg, rgba(26,86,255,0.5) 0%, rgba(77,127,255,0.3) 50%, transparent 100%)',
          marginBottom: '4rem',
        }}
      />

      <div className="mb-20 max-w-2xl">
        <KineticText
          as="p" splitBy="words" animation="fade" stagger={0.04} duration={0.9}
          className="font-bricolage text-mercury-400 leading-relaxed"
          style={{ fontSize: 'clamp(1rem, 1.6vw, 1.35rem)' }}
        >
          We are not designers. We are not developers. We are the people who sit in the space between mathematics
          and sensation — and refuse to leave until something impossible exists that did not before.
        </KineticText>
      </div>

      <div ref={principlesRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {PRINCIPLES.map((p) => (
          <article
            key={p.number}
            data-principle="true"
            data-hover="true"
            className="glass group flex flex-col gap-4 p-7 rounded-sm cursor-default"
            style={{ border: '1px solid rgba(232,232,240,0.05)', transition: 'border-color 0.4s ease, box-shadow 0.4s ease' }}
          >
            <span className="text-mono text-cobalt-500/50 text-xs tracking-[0.4em] uppercase group-hover:text-cobalt-400 transition-colors duration-300">
              Principle {p.number}
            </span>
            <div style={{ height: 1, width: '100%', background: 'linear-gradient(90deg, rgba(26,86,255,0.3), transparent)' }} />
            <h3 className="font-syne text-mercury-100 font-semibold" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', lineHeight: 1.25 }}>
              {p.title}
            </h3>
            <p className="font-bricolage text-mercury-500 text-sm leading-relaxed group-hover:text-mercury-400 transition-colors duration-300">
              {p.body}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-20 flex justify-end">
        <span className="text-mono text-mercury-600 text-xs tracking-[0.32em] uppercase">Scroll to continue —→</span>
      </div>
    </section>
  )
}
