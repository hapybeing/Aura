'use client'

import { useEffect, useRef, useState } from 'react'
import { registerGSAPPlugins, gsap, ScrollTrigger } from '@/lib/gsap-config'
import { useScrollStore } from '@/lib/scroll-store'
import KineticText from '@/components/ui/KineticText'
import MagneticButton from '@/components/ui/MagneticButton'

export default function Portal() {
  const sectionRef  = useRef<HTMLElement>(null)
  const lineRef     = useRef<HTMLDivElement>(null)
  const formRef     = useRef<HTMLDivElement>(null)
  const footerRef   = useRef<HTMLDivElement>(null)
  const setPortalProgress = useScrollStore((s) => s.setPortalProgress)

  const [email, setEmail]     = useState('')
  const [status, setStatus]   = useState<'idle' | 'sending' | 'done'>('idle')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    registerGSAPPlugins()
    const el = sectionRef.current
    if (!el) return

    const progressST = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      end:   'bottom bottom',
      onUpdate: (self) => setPortalProgress(Math.min(1, self.progress * 1.5)),
      onLeaveBack: () => setPortalProgress(0),
    })

    if (lineRef.current) {
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' })
      gsap.to(lineRef.current, {
        scaleX: 1, duration: 1.6, ease: 'expo.out',
        scrollTrigger: { trigger: lineRef.current, start: 'top 85%', toggleActions: 'play none none none' },
      })
    }

    if (formRef.current) {
      gsap.set(formRef.current, { y: 48, opacity: 0 })
      gsap.to(formRef.current, {
        y: 0, opacity: 1, duration: 1.1, ease: 'expo.out',
        scrollTrigger: { trigger: formRef.current, start: 'top 82%', toggleActions: 'play none none none' },
      })
    }

    if (footerRef.current) {
      const items = footerRef.current.querySelectorAll('[data-footer-item]')
      gsap.set(items, { y: 16, opacity: 0 })
      gsap.to(items, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: footerRef.current, start: 'top 90%', toggleActions: 'play none none none' },
      })
    }

    return () => {
      progressST.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === el || st.vars.trigger === lineRef.current || st.vars.trigger === formRef.current || st.vars.trigger === footerRef.current)
          st.kill()
      })
    }
  }, [setPortalProgress])

  const handleSubmit = () => {
    if (!email || status !== 'idle') return
    setStatus('sending')
    setTimeout(() => { setStatus('done'); setEmail('') }, 1400)
  }

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-between px-6 md:px-12 lg:px-20 pt-28 md:pt-40 pb-12">

      <div className="flex items-center gap-6 mb-16">
        <span className="text-mono text-cobalt-400 text-xs tracking-[0.45em] uppercase">— 04 / Portal</span>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(26,86,255,0.35), transparent)' }} />
      </div>

      <div className="flex flex-col gap-0 mb-12 md:mb-20">
        <KineticText as="div" splitBy="chars" animation="rise" stagger={0.014} duration={1.1}
          className="text-display text-mercury-100 leading-none"
          style={{ fontSize: 'clamp(3.2rem, 10vw, 10.5rem)' }}>
          ENTER
        </KineticText>
        <KineticText as="div" splitBy="chars" animation="rise" stagger={0.014} delay={0.07} duration={1.1}
          className="text-display leading-none"
          style={{ fontSize: 'clamp(3.2rem, 10vw, 10.5rem)', WebkitTextStroke: '1.5px rgba(26,86,255,0.5)', color: 'transparent', marginTop: '-0.05em' }}>
          THE VOID.
        </KineticText>
      </div>

      <div className="max-w-2xl mb-14 md:mb-20">
        <KineticText as="p" splitBy="words" animation="fade" stagger={0.032} duration={0.85}
          className="font-bricolage text-mercury-400 leading-relaxed"
          style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.2rem)' }}>
          AURA is not a platform. It is a practice. We exist in the margin between the last render frame and the next.
          If you have spent any part of your life making something that had no right to be beautiful — and making it
          beautiful anyway — you already belong here.
        </KineticText>
      </div>

      <div ref={lineRef} style={{ height: 1, background: 'linear-gradient(90deg, rgba(26,86,255,0.55), rgba(77,127,255,0.3) 50%, transparent)', marginBottom: '3.5rem' }} />

      <div ref={formRef} className="flex flex-col gap-5 mb-20 md:mb-28 max-w-xl">
        <p className="text-mono text-mercury-600 text-xs tracking-[0.35em] uppercase">Request access — limited cohort</p>
        <div
          className="flex gap-0 overflow-hidden rounded-sm"
          style={{
            border: focused ? '1px solid rgba(26,86,255,0.55)' : '1px solid rgba(232,232,240,0.10)',
            boxShadow: focused ? '0 0 30px rgba(26,86,255,0.15), 0 0 80px rgba(26,86,255,0.06)' : 'none',
            transition: 'border-color 0.3s ease, box-shadow 0.4s ease',
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="your@signal.here"
            disabled={status !== 'idle'}
            className="flex-1 bg-transparent text-mercury-100 font-bricolage text-sm px-5 py-4 outline-none placeholder:text-mercury-600 disabled:opacity-50"
          />
          <MagneticButton strength={12}>
            <button
              onClick={handleSubmit}
              disabled={status !== 'idle'}
              className="text-mono text-xs tracking-[0.28em] uppercase px-7 py-4 transition-all duration-300 disabled:opacity-40 cursor-none"
              style={{
                background: status === 'done' ? 'rgba(0,180,140,0.18)' : 'rgba(26,86,255,0.15)',
                color: status === 'done' ? '#00B48C' : '#4D7FFF',
                borderLeft: '1px solid rgba(232,232,240,0.06)',
              }}
            >
              {status === 'idle' && 'Request'}
              {status === 'sending' && '···'}
              {status === 'done' && 'Sent ✓'}
            </button>
          </MagneticButton>
        </div>
        {status === 'done' && (
          <p className="text-mono text-cobalt-400 text-xs tracking-[0.28em] uppercase" style={{ animation: 'fadeIn 0.5s ease' }}>
            Signal received — we will find you.
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-5 mb-20 md:mb-28 max-w-xl">
        {([{ num: '∅', label: 'Compromise' }, { num: '∞', label: 'Iterations' }, { num: '01', label: 'Principle' }] as const).map((s) => (
          <div key={s.label} className="flex flex-col gap-2 py-5 px-4"
            style={{ border: '1px solid rgba(232,232,240,0.055)', background: 'rgba(13,13,31,0.3)' }}>
            <span className="font-syne text-mercury-100 font-bold leading-none" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>{s.num}</span>
            <span className="text-mono text-mercury-600 text-xs tracking-[0.3em] uppercase">{s.label}</span>
          </div>
        ))}
      </div>

      <div ref={footerRef} className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 pt-8"
        style={{ borderTop: '1px solid rgba(232,232,240,0.06)' }}>
        <div data-footer-item className="flex flex-col gap-2">
          <span className="font-syne text-mercury-100 font-bold text-xl tracking-tight">AURA</span>
          <span className="text-mono text-mercury-600 text-xs tracking-[0.28em] uppercase">The Generative Sanctuary</span>
          <span className="text-mono text-mercury-600 text-xs tracking-[0.18em]">© 2026 — All systems nominal</span>
        </div>
        <div data-footer-item className="flex flex-col gap-3">
          <span className="text-mono text-mercury-600 text-xs tracking-[0.35em] uppercase mb-1">Navigate</span>
          {['Manifesto', 'Collective', 'Archive', 'Portal'].map((link) => (
            <a key={link} href="#" data-hover="true" className="font-bricolage text-mercury-500 text-sm hover:text-mercury-100 transition-colors duration-300">{link}</a>
          ))}
        </div>
        <div data-footer-item className="flex flex-col gap-3">
          <span className="text-mono text-mercury-600 text-xs tracking-[0.35em] uppercase mb-1">Signal</span>
          {[{ label: 'Are.na', href: '#' }, { label: 'GitHub', href: '#' }, { label: 'Twitter', href: '#' }].map((s) => (
            <a key={s.label} href={s.href} data-hover="true" className="font-bricolage text-mercury-500 text-sm hover:text-mercury-100 transition-colors duration-300">{s.label} ↗</a>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <span className="block w-1.5 h-1.5 rounded-full bg-cobalt-400" style={{ animation: 'footerPulse 2.8s ease-in-out infinite' }} />
            <span className="text-mono text-cobalt-400 text-xs tracking-[0.28em] uppercase">Systems Live</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <MagneticButton strength={20}>
          <button data-hover="true" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-mono text-mercury-600 text-xs tracking-[0.35em] uppercase flex flex-col items-center gap-2 hover:text-mercury-400 transition-colors duration-300">
            <span style={{ display: 'block', width: 1, height: 40, background: 'linear-gradient(0deg, rgba(26,86,255,0.5), transparent)', margin: '0 auto' }} />
            Return to Origin
          </button>
        </MagneticButton>
      </div>

      <style>{`
        @keyframes fadeIn      { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes footerPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
      `}</style>
    </section>
  )
}
