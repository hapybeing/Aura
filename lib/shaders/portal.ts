export const portalVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv         = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const portalFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uPortalProgress;
  uniform vec2  uResolution;

  varying vec2 vUv;

  // ── Compact 2-D simplex noise ────────────────────────────────────────
  vec3 permute3(vec3 x){ return mod(((x*34.)+1.)*x, 289.); }

  float snoise2(vec2 v){
    const vec4 C = vec4(0.211325, 0.366025, -0.577350, 0.024390);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.,0.) : vec2(0.,1.);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy  -= i1;
    i  = mod(i, 289.);
    vec3 p  = permute3(permute3(i.y + vec3(0., i1.y, 1.))
              + i.x + vec3(0., i1.x, 1.));
    vec3 m  = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.);
    m = m*m; m = m*m;
    vec3 x = 2.*fract(p * C.www) - 1.;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284 - 0.85373*(a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x*x0.x    + h.x*x0.y;
    g.yz = a0.yz*x12.xz + h.yz*x12.yw;
    return 130. * dot(m, g);
  }
  // ────────────────────────────────────────────────────────────────────

  void main() {
    vec2 uv  = vUv;
    float ar = uResolution.x / uResolution.y;

    // Aspect-corrected UV
    vec2 suv = vec2(uv.x * ar, uv.y);

    // ── Multi-layer noise field ─────────────────────────────────────
    float t   = uTime * 0.22;
    float n1  = snoise2(suv * 1.4 + vec2(t,       t * 0.6)) * 0.50;
    float n2  = snoise2(suv * 2.8 - vec2(t * 0.7, t * 1.1)) * 0.30;
    float n3  = snoise2(suv * 5.5 + vec2(t * 1.3, t * 0.4)) * 0.20;
    float n   = (n1 + n2 + n3) * 0.5 + 0.5;          // 0..1

    // ── Base void colour ────────────────────────────────────────────
    vec3 voidCol    = vec3(0.016, 0.016, 0.050);
    vec3 deepCol    = vec3(0.008, 0.008, 0.028);
    vec3 cobalt     = vec3(0.102, 0.337, 1.000);
    vec3 cobaltDark = vec3(0.038, 0.110, 0.400);
    vec3 violet     = vec3(0.260, 0.090, 0.560);

    vec3 base = mix(deepCol, voidCol, n);

    // ── Radial cobalt bloom centered bottom-center ──────────────────
    vec2  center    = vec2(0.5 * ar, 0.08);
    float dist      = length(suv - center);
    float bloom     = pow(1.0 - smoothstep(0.0, 1.6, dist), 2.8);
    base += cobaltDark * bloom * 1.8 * uPortalProgress;

    // ── Noise-driven colour veins ───────────────────────────────────
    float vein  = smoothstep(0.46, 0.54, n);
    base       += cobalt * vein * 0.09 * uPortalProgress;
    float vein2 = smoothstep(0.62, 0.68, n);
    base       += violet * vein2 * 0.06 * uPortalProgress;

    // ── Horizontal scan-line shimmer ────────────────────────────────
    float scan     = abs(sin(uv.y * 180.0 + uTime * 0.6)) * 0.012;
    base          += scan * cobalt;

    // ── Vignette ────────────────────────────────────────────────────
    vec2  vig      = uv - 0.5;
    float vignette = 1.0 - dot(vig, vig) * 2.2;
    vignette       = clamp(vignette, 0.0, 1.0);
    base          *= vignette;

    // ── Fade in with portal progress ───────────────────────────────
    float alpha = uPortalProgress * 0.92;

    gl_FragColor = vec4(base, alpha);
  }
`
