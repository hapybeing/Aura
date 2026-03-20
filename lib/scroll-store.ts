import { create } from 'zustand'

interface ScrollState {
  scrollY: number
  scrollProgress: number
  scrollVelocity: number
  scrollDirection: number
  manifestoProgress: number
  collectiveProgress: number
  setScrollY: (y: number) => void
  setScrollProgress: (progress: number) => void
  setScrollVelocity: (velocity: number) => void
  setScrollDirection: (direction: number) => void
  setManifestoProgress: (v: number) => void
  setCollectiveProgress: (v: number) => void
}

export const useScrollStore = create<ScrollState>()((set) => ({
  scrollY: 0,
  scrollProgress: 0,
  scrollVelocity: 0,
  scrollDirection: 0,
  manifestoProgress: 0,
  collectiveProgress: 0,
  setScrollY: (y) => set({ scrollY: y }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setScrollVelocity: (velocity) => set({ scrollVelocity: velocity }),
  setScrollDirection: (direction) => set({ scrollDirection: direction }),
  setManifestoProgress: (v) => set({ manifestoProgress: v }),
  setCollectiveProgress: (v) => set({ collectiveProgress: v }),
}))
