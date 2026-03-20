import { create } from 'zustand'

interface CursorState {
  cursorX: number
  cursorY: number
  cursorNormX: number
  cursorNormY: number
  isHovering: boolean
  setCursor: (x: number, y: number) => void
  setIsHovering: (v: boolean) => void
}

export const useCursorStore = create<CursorState>()((set) => ({
  cursorX: 0,
  cursorY: 0,
  cursorNormX: 0,
  cursorNormY: 0,
  isHovering: false,
  setCursor: (x, y) =>
    set({
      cursorX: x,
      cursorY: y,
      cursorNormX: (x / (typeof window !== 'undefined' ? window.innerWidth : 1)) * 2 - 1,
      cursorNormY: -(
        (y / (typeof window !== 'undefined' ? window.innerHeight : 1)) * 2 - 1
      ),
    }),
  setIsHovering: (v) => set({ isHovering: v }),
}))
