'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollStore } from '@/lib/scroll-store'
import { useCursorStore } from '@/lib/cursor-store'
import { blobVertexShader, blobFragmentShader } from '@/lib/shaders/blob'

export default function AuraBlob() {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef  = useRef<THREE.ShaderMaterial>(null)

  const scrollProgress = useScrollStore((s) => s.scrollProgress)
  const cursorNormX    = useCursorStore((s) => s.cursorNormX)
  const cursorNormY    = useCursorStore((s) => s.cursorNormY)

  const uniforms = useMemo(
    () => ({
      uTime:           { value: 0 },
      uScrollProgress: { value: 0 },
      uCursorNorm:     { value: new THREE.Vector2(0, 0) },
    }),
    [],
  )

  useFrame(({ clock }) => {
    if (!matRef.current) return
    const u = matRef.current.uniforms
    u.uTime.value           = clock.getElapsedTime()
    u.uScrollProgress.value = scrollProgress
    u.uCursorNorm.value.set(cursorNormX, cursorNormY)

    if (meshRef.current) {
      // Gentle autonomous rotation — cursor adds bias
      meshRef.current.rotation.y =
        clock.getElapsedTime() * 0.07 + cursorNormX * 0.15
      meshRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() * 0.04) * 0.12 + cursorNormY * 0.08
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/*
        IcosahedronGeometry(radius, detail)
        detail=5 → 20 480 triangles — smooth enough, perf-safe
      */}
      <icosahedronGeometry args={[1.8, 5]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={blobVertexShader}
        fragmentShader={blobFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
