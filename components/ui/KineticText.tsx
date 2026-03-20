'use client'

import { useEffect, useRef, createElement, type ElementType, type ReactNode, type CSSProperties } from 'react'
import SplitType from 'split-type'
import { gsap, registerGSAPPlugins, ScrollTrigger } from '@/lib/gsap-config'

type AnimationType = 'rise' | 'fade' | 'slide'
type SplitBy      = 'chars' | 'words' | 'lines'

interface KineticTextProps {
  as?: ElementType
  children: ReactNode
  className?: string
  style?: CSSProperties
  splitBy?: SplitBy
  animation?: AnimationType
  stagger?: number
  delay?: number
  duration?: number
  scrub?: boolean
  threshold?: number
  once?: boolean
  'data-hover'?: string
}

export default function KineticText({
  as: Tag = 'div',
  children,
  className = '',
  style,
  splitBy = 'chars',
  animation = 'rise',
  stagger = 0.022,
  delay = 0,
  duration = 1.0,
  scrub = false,
  threshold = 0.25,
  once = true,
}: KineticTextProps) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    registerGSAPPlugins()
    const el = containerRef.current
    if (!el) return

    const split = new SplitType(el, { types: splitBy })
    const targets =
      splitBy === 'chars' ? split.chars
      : splitBy === 'words' ? split.words
      : split.lines

    if (!targets || targets.length === 0) return

    gsap.set(targets, getFromVars(animation))

    const tween = gsap.to(targets, {
      ...getToVars(animation, duration),
      stagger,
      delay,
      scrollTrigger: {
        trigger: el,
        start: `top ${(1 - threshold) * 100}%`,
        end: scrub ? 'bottom 30%' : undefined,
        scrub: scrub ? 1.2 : false,
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      },
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach((st) => { if (st.vars.trigger === el) st.kill() })
      split.revert()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // createElement avoids dynamic JSX tag TypeScript issues entirely
  return createElement(
    Tag as string,
    { ref: containerRef, className, style: { overflow: 'hidden', ...style } },
    children,
  )
}

function getFromVars(animation: AnimationType): gsap.TweenVars {
  switch (animation) {
    case 'rise':  return { y: '110%', opacity: 0, rotateX: -15 }
    case 'fade':  return { opacity: 0, filter: 'blur(8px)' }
    case 'slide': return { x: -32, opacity: 0 }
  }
}

function getToVars(animation: AnimationType, duration: number): gsap.TweenVars {
  switch (animation) {
    case 'rise':  return { y: '0%', opacity: 1, rotateX: 0, duration, ease: 'expo.out' }
    case 'fade':  return { opacity: 1, filter: 'blur(0px)', duration, ease: 'power3.out' }
    case 'slide': return { x: 0, opacity: 1, duration, ease: 'expo.out' }
  }
}
