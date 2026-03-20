import type { Metadata } from 'next'
import { Syne, Bricolage_Grotesque, DM_Mono } from 'next/font/google'
import './globals.css'
import SmoothScroller from '@/components/core/SmoothScroller'

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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${bricolage.variable} ${dmMono.variable}`}
    >
      <body className="bg-obsidian-950 text-mercury-100 overflow-x-hidden">
        {/* Grain noise overlay */}
        <div className="grain-overlay" aria-hidden="true" />

        {/* SVG Noise filter definition (used by grain overlay) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', width: 0, height: 0 }}
          aria-hidden="true"
        >
          <defs>
            <filter id="grain-filter" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
        </svg>

        {/* Smooth scroll wrapper — bridges Lenis + GSAP */}
        <SmoothScroller>
          {children}
        </SmoothScroller>
      </body>
    </html>
  )
}
