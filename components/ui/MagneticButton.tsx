'use client'

import {
  useRef,
  useState,
  type ReactNode,
  type MouseEvent as RMouseEvent,
} from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number       // how far the element travels toward cursor (px)
  onClick?: () => void
  'data-hover'?: string
}

const SPRING = { stiffness: 220, damping: 18, mass: 0.6 }

export default function MagneticButton({
  children,
  className = '',
  strength = 28,
  onClick,
}: MagneticButtonProps) {
  const ref      = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  // Spring-driven raw values
  const rawX = useSpring(0, SPRING)
  const rawY = useSpring(0, SPRING)

  // Slightly amplify child content opposite to button motion (parallax)
  const contentX = useTransform(rawX, (v) => -v * 0.25)
  const contentY = useTransform(rawY, (v) => -v * 0.25)

  const onMouseMove = (e: RMouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect    = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width  * 0.5
    const centerY = rect.top  + rect.height * 0.5
    const distX   = e.clientX - centerX
    const distY   = e.clientY - centerY
    rawX.set(distX * (strength / (rect.width  * 0.5)))
    rawY.set(distY * (strength / (rect.height * 0.5)))
  }

  const onMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
    setActive(false)
  }

  const onMouseEnter = () => setActive(true)

  return (
    <motion.div
      ref={ref}
      style={{ x: rawX, y: rawY, display: 'inline-block' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      data-hover="true"
      className="cursor-none"
    >
      <motion.div style={{ x: contentX, y: contentY }}>
        <div
          className={className}
          data-active={active ? 'true' : undefined}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}
