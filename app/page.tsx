'use client'

import dynamic from 'next/dynamic'
import Hero       from '@/components/sections/Hero'
import Manifesto  from '@/components/sections/Manifesto'
import Collective from '@/components/sections/Collective'
import Archive    from '@/components/sections/Archive'
import Portal     from '@/components/sections/Portal'
import CursorSystem from '@/components/core/CursorSystem'

// Three.js canvas — browser-only, no SSR
const SceneWrapper = dynamic(
  () => import('@/components/canvas/SceneWrapper'),
  { ssr: false, loading: () => null },
)

export default function Home() {
  return (
    <>
      {/* Magnetic cursor — no-op on touch */}
      <CursorSystem />

      {/* Single fixed WebGL canvas behind all layers */}
      <SceneWrapper />

      {/* Full scrollable site */}
      <main className="content-layer">
        <Hero />
        <Manifesto />
        <Collective />
        <Archive />
        <Portal />
      </main>
    </>
  )
}
