import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
