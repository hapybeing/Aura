import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Force webpack — Turbopack doesn't support raw GLSL asset/source loading yet
  // Remove this line only after migrating GLSL imports to turbopack rules
  transpilePackages: [
    'three',
    '@react-three/fiber',
    '@react-three/drei',
    '@react-three/postprocessing',
    'postprocessing',
  ],
  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vert|frag|vs|fs)$/,
      type: 'asset/source',
      exclude: /node_modules/,
    })
    return config
  },
}

export default nextConfig
