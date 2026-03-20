import { create } from 'zustand'

interface ScrollState {
  scrollY: number
  scrollProgress: number
  scrollVelocity: number
  scrollDirection: number
  setScrollY: (y: number) => void
  setScrollProgress: (progress: number) => void
  setScrollVelocity: (velocity: number) => void
  setScrollDirection: (direction: number) => void
}

export const useScrollStore = create<ScrollState>()((set) => ({
  scrollY: 0,
  scrollProgress: 0,
  scrollVelocity: 0,
  scrollDirection: 0,
  setScrollY: (y) => set({ scrollY: y }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setScrollVelocity: (velocity) => set({ scrollVelocity: velocity }),
  setScrollDirection: (direction) => set({ scrollDirection: direction }),
}))
