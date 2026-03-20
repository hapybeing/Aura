'use client'

import { useEffect, useRef } from 'react'

interface NoiseSurfaceProps {
  opacity?: number
  /** pixels — smaller = finer grain, larger = coarser */
  tileSize?: number
}

/**
 * Canvas-based animated grain overlay.
 * Much sharper and more authentic than the CSS SVG approach,
 * especially on retina screens. Runs at ~12fps to save CPU.
 */
export default function NoiseSurface({
  opacity  = 0.032,
  tileSize = 256,
}: NoiseSurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number | null>(null)
  const lastRef   = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = tileSize
    const H = tileSize

    canvas.width  = W
    canvas.height = H

    const imageData = ctx.createImageData(W, H)
    const buffer    = imageData.data

    let frameCount = 0

    const draw = (now: number) => {
      rafRef.current = requestAnimationFrame(draw)

      // Throttle to ~14 fps — grain doesn't need more
      if (now - lastRef.current < 68) return
      lastRef.current = now
      frameCount++

      // Fill buffer with random grayscale noise
      for (let i = 0; i < buffer.length; i += 4) {
        const v   = Math.random() * 255 | 0
        buffer[i]     = v
        buffer[i + 1] = v
        buffer[i + 2] = v
        buffer[i + 3] = 255
      }

      ctx.putImageData(imageData, 0, 0)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [tileSize])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9997,
        opacity,
        // Tile the small canvas across the full viewport
        imageRendering: 'pixelated',
      }}
    />
  )
}
