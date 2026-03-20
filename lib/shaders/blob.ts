export const blobVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform vec2  uCursorNorm;

  varying vec3  vNormal;
  varying vec3  vWorldPosition;
  varying float vDisplacement;
  varying float vFresnel;

  // ── Simplex 3-D noise ──────────────────────────────────────
  vec3  mod289v3(vec3  x){ return x - floor(x*(1./289.))*289.; }
  vec4  mod289v4(vec4  x){ return x - floor(x*(1./289.))*289.; }
  vec4  permute(vec4   x){ return mod289v4(((x*34.)+1.)*x); }
  vec4  taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1./6., 1./3.);
    const vec4 D = vec4(0., .5, 1., 2.);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1. - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289v3(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0., i1.z, i2.z, 1.))
    + i.y + vec4(0., i1.y, i2.y, 1.))
    + i.x + vec4(0., i1.x, i2.x, 1.));

    float n_ = .142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j  = p - 49.*floor(p*ns.z*ns.z);
    vec4 x_ = floor(j*ns.z);
    vec4 y_ = floor(j - 7.*x_);

    vec4 x = x_*ns.x + ns.yyyy;
    vec4 y = y_*ns.x + ns.yyyy;
    vec4 h = 1. - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.+1.;
    vec4 s1 = floor(b1)*2.+1.;
    vec4 sh = -step(h, vec4(0.));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(
      dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(.6 - vec4(
      dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.);
    m = m*m;
    return 42.*dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  // ────────────────────────────────────────────────────────────

  void main(){
    float t   = uTime * 0.38;
    vec3  pos = position;

    // Multi-octave displacement
    float n1 = snoise(pos * 1.1 + t * 0.50);
    float n2 = snoise(pos * 2.3 - t * 0.28 + vec3(10.));
    float n3 = snoise(pos * 4.6 + t * 0.18 + vec3(20.));
    float displacement = n1*0.38 + n2*0.16 + n3*0.07;

    // Cursor warp
    float cursorD = dot(normalize(pos.xy), uCursorNorm) * 0.14;
    displacement += cursorD;

    // Scroll: shrink & flatten
    float scrollScale = 1. - uScrollProgress * 0.35;

    // Fresnel (view-space)
    vec3 worldNorm   = normalize(mat3(modelMatrix) * normal);
    vec3 worldPos    = (modelMatrix * vec4(pos, 1.)).xyz;
    vec3 viewDir     = normalize(cameraPosition - worldPos);
    float fresnelRaw = 1. - max(dot(worldNorm, viewDir), 0.);
    vFresnel         = pow(fresnelRaw, 2.5);

    vNormal       = normalize(normalMatrix * normal);
    vDisplacement = displacement;

    vec3 displaced    = pos + normal * displacement;
    displaced        *= scrollScale;
    vWorldPosition    = (modelMatrix * vec4(displaced, 1.)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.);
  }
`

export const blobFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uScrollProgress;

  varying vec3  vNormal;
  varying vec3  vWorldPosition;
  varying float vDisplacement;
  varying float vFresnel;

  void main(){
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = vFresnel;

    // ── Palette ──────────────────────────────────────────────
    vec3 obsidian = vec3(0.016, 0.016, 0.063);
    vec3 cobalt   = vec3(0.102, 0.337, 1.000);
    vec3 cobaltLt = vec3(0.302, 0.500, 1.000);
    vec3 mercury  = vec3(0.910, 0.910, 0.940);
    vec3 violet   = vec3(0.420, 0.200, 0.900);

    // ── Iridescence ──────────────────────────────────────────
    float iri1 = sin(vDisplacement * 9.  + uTime * 0.55)        * .5 + .5;
    float iri2 = sin(vDisplacement * 5.5 - uTime * 0.38 + 2.09) * .5 + .5;
    float iri3 = sin(vDisplacement * 14. + uTime * 0.70 + 4.19) * .5 + .5;

    // ── Base color build ─────────────────────────────────────
    vec3 color = mix(obsidian, cobalt,   fresnel * 0.90);
    color      = mix(color,   mercury,  fresnel * fresnel * 0.45);

    vec3 iriColor = mix(cobalt, cobaltLt, iri1);
    iriColor      = mix(iriColor, violet, iri2 * 0.28);
    iriColor      = mix(iriColor, mercury, iri3 * 0.15);
    color        += iriColor * fresnel * 0.40;

    // Displacement peak glow
    float peakGlow = smoothstep(0.18, 0.55, vDisplacement + 0.28);
    color += cobalt * peakGlow * 0.22;

    // Specular-ish hotspot
    vec3  lightDir = normalize(vec3(1., 1.5, 2.));
    float spec     = pow(max(dot(reflect(-lightDir, normalize(vNormal)), viewDir), 0.), 32.);
    color += mercury * spec * 0.18;

    // ── Alpha ─────────────────────────────────────────────────
    float alpha = mix(0.48, 0.94, fresnel);
    alpha *= (1. - uScrollProgress * 0.55);
    alpha  = clamp(alpha, 0., 1.);

    gl_FragColor = vec4(color, alpha);
  }
`
