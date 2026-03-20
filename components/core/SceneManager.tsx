'use client'

import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function SceneManager() {
  const { scene, gl } = useThree()

  useEffect(() => {
    // Transparent background so the CSS obsidian bg shows through
    scene.background = null
    gl.setClearColor(0x000000, 0)

    return () => {
      scene.background = null
    }
  }, [scene, gl])

  return (
    <>
      {/* Dim blue-white ambient — sets the minimum illumination */}
      <ambientLight intensity={0.25} color={0x8899ff} />

      {/* Key light — cobalt from top-right-front */}
      <pointLight
        position={[4, 5, 4]}
        intensity={6}
        color={0x1a56ff}
        distance={20}
        decay={2}
      />

      {/* Fill light — soft mercury from bottom-left */}
      <pointLight
        position={[-5, -3, 2]}
        intensity={2.5}
        color={0xe8e8f0}
        distance={16}
        decay={2}
      />

      {/* Rim light — deep violet from behind */}
      <pointLight
        position={[0, 0, -6]}
        intensity={3}
        color={0x6b21d4}
        distance={12}
        decay={2}
      />
    </>
  )
}
