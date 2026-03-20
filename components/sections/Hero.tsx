'use client'

import { useEffect, useRef } from 'react'
import { gsap, registerGSAPPlugins } from '@/lib/gsap-config'
import SplitType from 'split-type'

export default function Hero() {
  const navRef        = useRef<HTMLElement>(null)
  const eyebrowRef    = useRef<HTMLParagraphElement>(null)
  const line1Ref      = useRef<HTMLDivElement>(null)
  const line2Ref      = useRef<HTMLDivElement>(null)
  const dividerRef    = useRef<HTMLDivElement>(null)
  const taglineRef    = useRef<HTMLParagraphElement>(null)
  const ctaRef        = useRef<HTMLDivElement>(null)
  const bottomBarRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerGSAPPlugins()

    const line1El = line1Ref.current
    const line2El = line2Ref.current
    if (!line1El || !line2El) return

    // Split both title lines into characters
    const split1 = new SplitType(line1El, { types: 'chars' })
    const split2 = new SplitType(line2El, { types: 'chars' })

    // Set initial hidden state
    if (split1.chars) gsap.set(split1.chars, { y: 90, opacity: 0 })
    if (split2.chars) gsap.set(split2.chars, { y: 90, opacity: 0 })

    gsap.set(navRef.current,      { y: -24, opacity: 0 })
    gsap.set(eyebrowRef.current,  { y: 16,  opacity: 0 })
    gsap.set(dividerRef.current,  { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(taglineRef.current,  { y: 24,  opacity: 0 })
    gsap.set(ctaRef.current,      { y: 18,  opacity: 0 })
    gsap.set(bottomBarRef.current,{ opacity: 0 })

    const tl = gsap.timeline({ delay: 0.15 })

    tl.to(navRef.current, {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
      })
      .to(eyebrowRef.current, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
      }, '-=0.5')
      .to(split1.chars, {
        y: 0, opacity: 1,
        duration: 1.05,
        stagger: 0.022,
        ease: 'expo.out',
      }, '-=0.4')
      .to(split2.chars, {
        y: 0, opacity: 1,
        duration: 1.05,
        stagger: 0.022,
        ease: 'expo.out',
      }, '-=0.88')
      .to(dividerRef.current, {
        scaleX: 1, duration: 1.1, ease: 'expo.out',
      }, '-=0.5')
      .to(taglineRef.current, {
        y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
      }, '-=0.7')
      .to(ctaRef.current, {
        y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
      }, '-=0.6')
      .to(bottomBarRef.current, {
        opacity: 1, duration: 0.8, ease: 'power2.out',
      }, '-=0.5')

    return () => {
      tl.kill()
      split1.revert()
      split2.revert()
    }
  }, [])

  return (
    <section
      style={{ minHeight: '100svh' }}
      className="relative flex flex-col justify-between px-6 md:px-12 lg:px-20 pt-7 pb-8 select-none"
    >
      {/* ── NAV ─────────────────────────────────────────── */}
      <nav
        ref={navRef}
        className="flex justify-between items-center"
      >
        {/* Logo */}
        <span
          className="text-mono text-mercury-100 text-xs tracking-[0.35em] uppercase"
          style={{ letterSpacing: '0.38em' }}
        >
          AURA
        </span>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10">
          {['Collective', 'Archive', 'Portal'].map((label) => (
            <a
              key={label}
              href="#"
              className="text-mono text-mercury-400 text-xs tracking-[0.22em] uppercase
                         hover:text-mercury-100 transition-colors duration-300"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Status pill */}
        <div
          className="glass flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ border: '1px solid rgba(26,86,255,0.18)' }}
        >
          <span
            className="block w-1.5 h-1.5 rounded-full bg-cobalt-400"
            style={{ animation: 'pulse 2.4s ease-in-out infinite' }}
          />
          <span className="text-mono text-cobalt-400 text-xs tracking-[0.2em] uppercase">
            Live
          </span>
        </div>
      </nav>

      {/* ── HERO CONTENT ────────────────────────────────── */}
      <div className="flex flex-col items-center text-center gap-5 flex-1 justify-center py-16">

        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="text-mono text-cobalt-400 text-xs tracking-[0.45em] uppercase"
        >
          Collective &nbsp;·&nbsp; 2026 &nbsp;·&nbsp; Generative Systems
        </p>

        {/* Title line 1 — filled */}
        <div style={{ overflow: 'hidden', lineHeight: '0.92' }}>
          <div
            ref={line1Ref}
            className="text-display text-mercury-100"
            style={{ fontSize: 'clamp(3.8rem, 11.5vw, 11.5rem)' }}
          >
            THE GENERATIVE
          </div>
        </div>

        {/* Title line 2 — outlined (stroke only) */}
        <div style={{ overflow: 'hidden', lineHeight: '0.92', marginTop: '-0.06em' }}>
          <div
            ref={line2Ref}
            className="text-display"
            style={{
              fontSize: 'clamp(3.8rem, 11.5vw, 11.5rem)',
              WebkitTextStroke: '1.5px rgba(232,232,240,0.5)',
              color: 'transparent',
            }}
          >
            SANCTUARY
          </div>
        </div>

        {/* Animated divider */}
        <div
          ref={dividerRef}
          style={{
            height: 1,
            width: 'clamp(280px, 40vw, 520px)',
            background:
              'linear-gradient(90deg, transparent, rgba(26,86,255,0.6) 40%, rgba(77,127,255,0.4) 60%, transparent)',
            marginTop: '0.5rem',
          }}
        />

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="font-bricolage text-mercury-400 max-w-sm text-base md:text-lg"
          style={{ lineHeight: '1.65', marginTop: '0.25rem' }}
        >
          Where liquid computation meets the sublime.
          <br />
          A sanctuary for generative minds.
        </p>

        {/* CTA buttons */}
        <div ref={ctaRef} className="flex flex-wrap justify-center gap-3 mt-4">
          <button
            className="glass-cobalt text-mono text-mercury-100 text-xs
                       tracking-[0.28em] uppercase px-8 py-4 rounded-sm
                       transition-all duration-300
                       hover:bg-cobalt-500/25 hover:scale-105 active:scale-95"
            style={{
              boxShadow:
                '0 0 22px rgba(26,86,255,0.28), 0 0 70px rgba(26,86,255,0.09)',
            }}
            data-hover="true"
          >
            Enter the Sanctuary
          </button>
          <button
            className="glass text-mono text-mercury-400 text-xs
                       tracking-[0.28em] uppercase px-8 py-4 rounded-sm
                       transition-all duration-300
                       hover:text-mercury-100 hover:scale-105 active:scale-95"
            data-hover="true"
          >
            View Collective
          </button>
        </div>
      </div>

      {/* ── BOTTOM BAR ──────────────────────────────────── */}
      <div
        ref={bottomBarRef}
        className="flex justify-between items-end"
      >
        {/* Left — system info */}
        <div className="flex flex-col gap-1">
          <span className="text-mono text-mercury-600 text-xs tracking-[0.25em] uppercase">
            System Active
          </span>
          <span className="text-mono text-mercury-600 text-xs tracking-[0.15em]">
            v2.6.0 — Obsidian Build
          </span>
        </div>

        {/* Center — scroll indicator */}
        <div className="flex flex-col items-center gap-2">
          <span
            className="text-mono text-mercury-600 text-xs tracking-[0.32em] uppercase"
          >
            Scroll
          </span>
          <div
            style={{
              position: 'relative',
              width: 1,
              height: 52,
              background: 'rgba(152,152,176,0.18)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '0 0 auto 0',
                height: '50%',
                background:
                  'linear-gradient(180deg, rgba(26,86,255,0) 0%, #1A56FF 100%)',
                animation: 'scrollDrop 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        {/* Right — coordinates */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-mono text-mercury-600 text-xs tracking-[0.15em]">
            48.8566° N, 2.3522° E
          </span>
          <span className="text-mono text-mercury-600 text-xs tracking-[0.25em] uppercase">
            Paris Node
          </span>
        </div>
      </div>

      {/* Inline keyframes used only in this section */}
      <style>{`
        @keyframes scrollDrop {
          0%   { transform: translateY(-100%); opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translateY(250%);  opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1;   transform: scale(1);   }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
      `}</style>
    </section>
  )
}
