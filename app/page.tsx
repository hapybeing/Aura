import dynamic from 'next/dynamic'
import Hero from '@/components/sections/Hero'
import CursorSystem from '@/components/core/CursorSystem'

// Three.js accesses browser APIs — must be client-only, no SSR
const SceneWrapper = dynamic(
  () => import('@/components/canvas/SceneWrapper'),
  { ssr: false, loading: () => null },
)

export default function Home() {
  return (
    <>
      {/* Custom cursor — renders nothing on touch devices */}
      <CursorSystem />

      {/* Fixed WebGL canvas behind all content */}
      <SceneWrapper />

      {/* Scrollable content layer */}
      <main className="content-layer">
        <Hero />
        {/* Manifesto, Collective, Archive, Portal — added in future sessions */}
      </main>
    </>
  )
}
