import type { Metadata } from 'next'
import { Syne, Bricolage_Grotesque, DM_Mono } from 'next/font/google'
import './globals.css'
import SmoothScroller from '@/components/core/SmoothScroller'
import NoiseSurface from '@/components/ui/NoiseSurface'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-bricolage',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AURA — The Generative Sanctuary',
  description:
    'A digital art collective at the intersection of generative systems, liquid computation, and the sublime.',
  openGraph: {
    title: 'AURA — The Generative Sanctuary',
    description:
      'A digital art collective at the intersection of generative systems, liquid computation, and the sublime.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AURA — The Generative Sanctuary',
    description: 'Generative systems. Liquid computation. The sublime.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${bricolage.variable} ${dmMono.variable}`}
    >
      <body className="bg-obsidian-950 text-mercury-100 overflow-x-hidden">
        {/* Canvas-based grain overlay — sharper than CSS SVG on retina */}
        <NoiseSurface opacity={0.030} tileSize={200} />

        {/* Smooth scroll bridge — Lenis + GSAP ScrollTrigger */}
        <SmoothScroller>
          {children}
        </SmoothScroller>
      </body>
    </html>
  )
}
