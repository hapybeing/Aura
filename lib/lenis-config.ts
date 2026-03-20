export const lenisOptions = {
  duration: 1.4,
  easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.6,
  infinite: false,
} as const
