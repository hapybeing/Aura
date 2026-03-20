'use client'

import { useEffect, useRef, useState } from 'react'
import { useCursorStore } from '@/lib/cursor-store'

export default function CursorSystem() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const rafRef  = useRef<number | null>(null)

  const mouse = useRef({ x: -200, y: -200 })
  const ring  = useRef({ x: -200, y: -200 })

  const { setCursor, setIsHovering } = useCursorStore()

  // Detect touch — render nothing on touch devices
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  useEffect(() => {
    if (isTouch) return

    // Hide the native cursor globally
    document.documentElement.style.cursor = 'none'

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      setCursor(e.clientX, e.clientY)

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      }
    }

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('a, button, [data-hover]')
      if (el) {
        setIsHovering(true)
        dotRef.current?.classList.add('hovering')
        ringRef.current?.classList.add('hovering')
      }
    }

    const onOut = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('a, button, [data-hover]')
      if (el) {
        setIsHovering(false)
        dotRef.current?.classList.remove('hovering')
        ringRef.current?.classList.remove('hovering')
      }
    }

    // RAF loop: ring lags behind mouse with lerp
    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.09
      ring.current.y += (mouse.current.y - ring.current.y) * 0.09

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      document.documentElement.style.cursor = ''
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isTouch, setCursor, setIsHovering])

  if (isTouch) return null

  return (
    <>
      {/* Inner dot — snaps instantly to cursor */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: '#E8E8F0',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          willChange: 'transform',
          transition: 'width 0.25s ease, height 0.25s ease',
        }}
        className="cursor-dot"
      />

      {/* Outer ring — lags behind */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 38,
          height: 38,
          borderRadius: '50%',
          border: '1px solid rgba(232,232,240,0.35)',
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform',
          transition: 'width 0.35s ease, height 0.35s ease, border-color 0.3s ease',
        }}
        className="cursor-ring"
      />

      <style>{`
        .cursor-dot.hovering  { width: 4px !important; height: 4px !important; }
        .cursor-ring.hovering { width: 68px !important; height: 68px !important; border-color: rgba(26,86,255,0.55) !important; }
        @media (pointer: coarse) { .cursor-dot, .cursor-ring { display: none; } }
      `}</style>
    </>
  )
}
