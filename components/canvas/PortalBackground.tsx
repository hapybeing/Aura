'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollStore } from '@/lib/scroll-store'
import { portalVertexShader, portalFragmentShader } from '@/lib/shaders/portal'

export default function PortalBackground() {
  const matRef      = useRef<THREE.ShaderMaterial>(null)
  const portalProgress = useScrollStore((s) => s.portalProgress)
  const { size }    = useThree()

  const uniforms = useMemo(
    () => ({
      uTime:           { value: 0 },
      uPortalProgress: { value: 0 },
      uResolution:     { value: new THREE.Vector2(size.width, size.height) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame(({ clock }) => {
    if (!matRef.current) return
    const u = matRef.current.uniforms
    u.uTime.value           = clock.getElapsedTime()
    u.uPortalProgress.value = portalProgress
    u.uResolution.value.set(size.width, size.height)
  })

  if (portalProgress === 0) return null

  return (
    <mesh position={[0, 0, -3]} renderOrder={-1}>
      {/* Large enough to fill camera FOV at z=-3 from z=5 */}
      <planeGeometry args={[28, 16]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={portalVertexShader}
        fragmentShader={portalFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  )
}
