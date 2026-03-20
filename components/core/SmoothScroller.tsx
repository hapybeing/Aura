'use client'

import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { registerGSAPPlugins, gsap, ScrollTrigger } from '@/lib/gsap-config'
import { lenisOptions } from '@/lib/lenis-config'
import { useScrollStore } from '@/lib/scroll-store'

interface SmoothScrollerProps {
  children: ReactNode
}

export default function SmoothScroller({ children }: SmoothScrollerProps) {
  const { setScrollY, setScrollProgress, setScrollVelocity, setScrollDirection } =
    useScrollStore()

  useEffect(() => {
    registerGSAPPlugins()

    const lenis = new Lenis(lenisOptions)

    const onScroll = () => {
      setScrollY(lenis.scroll)
      setScrollProgress(lenis.progress)
      setScrollVelocity(lenis.velocity)
      setScrollDirection(lenis.direction)
      ScrollTrigger.update()
    }

    lenis.on('scroll', onScroll)

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', onScroll)
      lenis.destroy()
      gsap.ticker.remove(tickerFn)
    }
  }, [setScrollY, setScrollProgress, setScrollVelocity, setScrollDirection])

  return <>{children}</>
}
