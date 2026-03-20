'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollStore } from '@/lib/scroll-store'
import { useCursorStore } from '@/lib/cursor-store'
import { shardVertexShader, shardFragmentShader } from '@/lib/shaders/shard'

// ── Deterministic shard configs (no Math.random — stable across renders) ───
const SHARD_COUNT = 14

const shardConfigs = Array.from({ length: SHARD_COUNT }, (_, i) => {
  const fi    = i / SHARD_COUNT
  const angle = fi * Math.PI * 2.0 + i * 0.37
  const ring  = 2.2 + (i % 3) * 0.75

  return {
    // Position ring around the scene, biased toward edges
    x: Math.cos(angle) * ring * 1.1,
    y: ((i % 5) - 2) * 0.85,
    z: -0.5 - (i % 4) * 0.55,

    // Rotation (radians)
    rotX: (i * 0.49) % (Math.PI * 2),
    rotY: (i * 0.73) % (Math.PI * 2),
    rotZ: (i * 1.17) % (Math.PI * 2),

    // Per-shard rotation speed multiplier
    speedX: 0.08 + (i % 4) * 0.04,
    speedY: 0.06 + (i % 3) * 0.05,
    speedZ: 0.04 + (i % 5) * 0.025,

    // Geometry scale (thin sharp diamond shard)
    scaleX: 0.06 + (i % 3) * 0.055,
    scaleY: 0.28 + (i % 5) * 0.14,

    // Drift phase offset for organic motion
    driftOffset: i * 0.71,

    // Colour tint (0..1)
    tintShift: fi,
  }
})

// ── Custom shard geometry (flat diamond with 4 verts, 2 tris) ──────────────
function createShardGeometry(): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry()

  // Diamond: top · right · bottom · left
  const verts = new Float32Array([
     0.0,  1.0, 0.0,  // 0 top
     0.38, 0.1, 0.0,  // 1 right-upper
     0.28,-0.4, 0.0,  // 2 right-lower
     0.0, -1.0, 0.0,  // 3 bottom
    -0.28,-0.4, 0.0,  // 4 left-lower
    -0.38, 0.1, 0.0,  // 5 left-upper
  ])
  const idxs = new Uint16Array([
    0, 1, 5,
    1, 2, 5,
    2, 4, 5,
    2, 3, 4,
  ])
  const uvs = new Float32Array([
    0.5, 1.0,
    1.0, 0.55,
    0.85, 0.2,
    0.5, 0.0,
    0.15, 0.2,
    0.0, 0.55,
  ])
  const normals = new Float32Array(verts.length)
  for (let i = 0; i < normals.length; i += 3) {
    normals[i]     = 0
    normals[i + 1] = 0
    normals[i + 2] = 1
  }

  geo.setAttribute('position', new THREE.BufferAttribute(verts,   3))
  geo.setAttribute('uv',       new THREE.BufferAttribute(uvs,     2))
  geo.setAttribute('normal',   new THREE.BufferAttribute(normals, 3))
  geo.setIndex(new THREE.BufferAttribute(idxs, 1))
  return geo
}

// ── Single shard mesh ──────────────────────────────────────────────────────
interface ShardProps {
  config: typeof shardConfigs[0]
  geometry: THREE.BufferGeometry
  manifestoProgress: number
  scrollVelocity: number
  time: number
}

function Shard({ config, geometry, manifestoProgress, scrollVelocity, time }: ShardProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef  = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime:               { value: 0 },
      uManifestoProgress:  { value: 0 },
      uScrollVelocity:     { value: 0 },
      uDriftOffset:        { value: config.driftOffset },
      uTintShift:          { value: config.tintShift },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame(() => {
    if (!matRef.current || !meshRef.current) return

    const u = matRef.current.uniforms
    u.uTime.value              = time
    u.uManifestoProgress.value = manifestoProgress
    u.uScrollVelocity.value    = scrollVelocity

    // Continuous rotation
    meshRef.current.rotation.x += config.speedX * 0.012
    meshRef.current.rotation.y += config.speedY * 0.012
    meshRef.current.rotation.z += config.speedZ * 0.008
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={[config.x, config.y, config.z]}
      rotation={[config.rotX, config.rotY, config.rotZ]}
      scale={[config.scaleX, config.scaleY, 1]}
    >
      <shaderMaterial
        ref={matRef}
        vertexShader={shardVertexShader}
        fragmentShader={shardFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// ── ShardField (parent — reads global stores once) ─────────────────────────
export default function ShardField() {
  const manifestoProgress = useScrollStore((s) => s.manifestoProgress)
  const scrollVelocity    = useScrollStore((s) => s.scrollVelocity)
  const timeRef           = useRef(0)

  const shardGeo = useMemo(() => createShardGeometry(), [])

  useFrame(({ clock }) => {
    timeRef.current = clock.getElapsedTime()
  })

  // Skip render entirely when section not in view — saves draw calls
  if (manifestoProgress === 0) return null

  return (
    <group>
      {shardConfigs.map((cfg) => (
        <Shard
          key={cfg.driftOffset}
          config={cfg}
          geometry={shardGeo}
          manifestoProgress={manifestoProgress}
          scrollVelocity={scrollVelocity}
          time={timeRef.current}
        />
      ))}
    </group>
  )
}
