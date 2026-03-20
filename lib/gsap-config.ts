import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

let registered = false

export function registerGSAPPlugins(): void {
  if (registered) return
  gsap.registerPlugin(ScrollTrigger)
  gsap.defaults({
    ease: 'power3.out',
    duration: 0.9,
  })
  registered = true
}

export { gsap, ScrollTrigger }
