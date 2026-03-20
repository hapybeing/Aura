'use client'

import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { Suspense } from 'react'
import AuraBlob from './AuraBlob'
import ShardField from './ShardField'
import ParticleRiver from './ParticleRiver'
import SceneManager from '../core/SceneManager'

export default function SceneWrapper() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneManager />
          <AuraBlob />
          <ShardField />
          <ParticleRiver />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  )
}
