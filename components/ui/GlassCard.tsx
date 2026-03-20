'use client'

import { useRef, useState, type ReactNode, type MouseEvent as RMouseEvent } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

interface GlassCardProps {
  children: ReactNode
  className?: string
  tiltStrength?: number
  glowColor?: string
}

const SPRING_OPTS = { stiffness: 260, damping: 24, mass: 0.7 }

export default function GlassCard({
  children,
  className = '',
  tiltStrength = 10,
  glowColor = 'rgba(26,86,255,0.22)',
}: GlassCardProps) {
  const ref      = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Tilt
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [tiltStrength, -tiltStrength]),
    SPRING_OPTS,
  )
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-tiltStrength, tiltStrength]),
    SPRING_OPTS,
  )

  // Shine position follows cursor
  const shineX = useTransform(mouseX, [-0.5, 0.5], ['5%', '95%'])
  const shineY = useTransform(mouseY, [-0.5, 0.5], ['5%', '95%'])

  const onMouseMove = (e: RMouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width  - 0.5)
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5)
  }

  const onMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={() => setHovered(true)}
      data-hover="true"
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 900,
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Glass surface */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(13,13,31,0.45)',
          backdropFilter: 'blur(18px) saturate(170%)',
          WebkitBackdropFilter: 'blur(18px) saturate(170%)',
          border: hovered
            ? `1px solid ${glowColor}`
            : '1px solid rgba(232,232,240,0.055)',
          transition: 'border-color 0.35s ease',
          borderRadius: 'inherit',
        }}
      />

      {/* Cursor shine */}
      {hovered && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at ${shineX.get()} ${shineY.get()}, rgba(255,255,255,0.055) 0%, transparent 65%)`,
            pointerEvents: 'none',
            borderRadius: 'inherit',
          }}
        />
      )}

      {/* Glow halo */}
      <motion.div
        style={{
          position: 'absolute',
          inset: -1,
          borderRadius: 'inherit',
          opacity: hovered ? 1 : 0,
          boxShadow: `0 0 30px ${glowColor}, 0 0 80px ${glowColor}`,
          transition: 'opacity 0.35s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </motion.div>
  )
}
