'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollStore } from '@/lib/scroll-store'
import { particleVertexShader, particleFragmentShader } from '@/lib/shaders/particle'

const PARTICLE_COUNT = 1800

// Build all buffer attributes once — deterministic via index math (no Math.random)
function buildParticleBuffers(count: number) {
  const positions = new Float32Array(count * 3)
  const offsets   = new Float32Array(count)
  const speeds    = new Float32Array(count)
  const sizes     = new Float32Array(count)
  const lanes     = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    // Pseudo-random spread using prime-based hash
    const fi  = i / count
    const r1  = ((i * 127.1) % 1.0 + (i * 311.7 % 97.3) / 97.3) % 1.0
    const r2  = ((i * 269.5) % 1.0 + (i * 183.3 % 61.7) / 61.7) % 1.0
    const r3  = ((i * 419.2) % 1.0 + (i * 137.0 % 53.1) / 53.1) % 1.0
    const r4  = ((i *  73.9) % 1.0 + (i *  89.7 % 43.2) / 43.2) % 1.0

    // Initial X spread across the full visible range
    positions[i * 3]     = r1 * 14.0 - 7.0
    // Y: cluster in horizontal band with slight vertical scatter
    positions[i * 3 + 1] = (r2 - 0.5) * 4.2
    // Z: depth scatter
    positions[i * 3 + 2] = r3 * 1.2 - 0.6

    offsets[i] = fi          // phase offset so particles start spread out
    speeds[i]  = 0.06 + r4 * 0.10   // 0.06 – 0.16 speed range
    sizes[i]   = 1.2 + r1 * 2.4     // 1.2 – 3.6 px range
    lanes[i]   = r2                  // 0..1 lane for colour variation
  }

  return { positions, offsets, speeds, sizes, lanes }
}

export default function ParticleRiver() {
  const pointsRef = useRef<THREE.Points>(null)
  const matRef    = useRef<THREE.ShaderMaterial>(null)

  const collectiveProgress = useScrollStore((s) => s.collectiveProgress)
  const scrollVelocity     = useScrollStore((s) => s.scrollVelocity)

  const { geo, uniforms } = useMemo(() => {
    const { positions, offsets, speeds, sizes, lanes } =
      buildParticleBuffers(PARTICLE_COUNT)

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aOffset',  new THREE.BufferAttribute(offsets, 1))
    geometry.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1))
    geometry.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aLane',    new THREE.BufferAttribute(lanes, 1))

    const u = {
      uTime:               { value: 0 },
      uCollectiveProgress: { value: 0 },
      uScrollVelocity:     { value: 0 },
    }

    return { geo: geometry, uniforms: u }
  }, [])

  useFrame(({ clock }) => {
    if (!matRef.current) return
    const u = matRef.current.uniforms
    u.uTime.value               = clock.getElapsedTime()
    u.uCollectiveProgress.value = collectiveProgress
    u.uScrollVelocity.value     = scrollVelocity
  })

  if (collectiveProgress === 0) return null

  return (
    <points ref={pointsRef} geometry={geo}>
      <shaderMaterial
        ref={matRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={false}
      />
    </points>
  )
}
