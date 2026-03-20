export default function Home() {
  return (
    <main className="content-layer min-h-screen flex flex-col items-center justify-center gap-8">
      {/* Foundation verification screen — replaced in Session 2 */}
      <p className="text-mono text-mercury-400 text-xs tracking-[0.3em] uppercase">
        System Online
      </p>
      <h1 className="text-display text-mercury-100" style={{ fontSize: 'clamp(5rem, 15vw, 14rem)' }}>
        AURA
      </h1>
      <p className="font-bricolage text-mercury-400 text-sm tracking-widest uppercase">
        The Generative Sanctuary
      </p>
      <div
        className="mt-8 w-px bg-cobalt-500"
        style={{ height: '60px', animation: 'drawLine 1.5s ease-out forwards' }}
      />
    </main>
  )
}
