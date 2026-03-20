export const particleVertexShader = /* glsl */ `
  attribute float aOffset;
  attribute float aSpeed;
  attribute float aSize;
  attribute float aLane;

  uniform float uTime;
  uniform float uCollectiveProgress;
  uniform float uScrollVelocity;

  varying float vAlpha;
  varying float vLane;
  varying float vProgress;

  void main() {
    vLane = aLane;

    // ── River flow: each particle travels along X, loops ──────────
    float speed   = aSpeed * (1.0 + uScrollVelocity * 0.04);
    float rawX    = mod(position.x + uTime * speed + aOffset * 18.0, 14.0) - 7.0;

    // ── Lane: sine-wave path per particle ─────────────────────────
    float waveAmp = 0.18 + aLane * 0.09;
    float waveY   = sin(rawX * 0.9 + aOffset * 3.14 + uTime * 0.28) * waveAmp;
    float y       = position.y + waveY;

    // ── Depth scatter ──────────────────────────────────────────────
    float z = position.z;

    // ── Fade in on collective enter ────────────────────────────────
    float appear = uCollectiveProgress;

    // Edge fade: particles near X extents fade out so loop is invisible
    float edgeFade = smoothstep(0.0, 1.8, rawX + 7.0) *
                     smoothstep(0.0, 1.8, 7.0 - rawX);

    // Vertical fade: dim particles far from center lane
    float vertFade = 1.0 - smoothstep(0.0, 2.6, abs(y));

    vAlpha    = edgeFade * vertFade * appear * 0.72;
    vProgress = (rawX + 7.0) / 14.0;

    vec4 mvPosition = modelViewMatrix * vec4(rawX, y, z, 1.0);
    gl_PointSize    = aSize * (280.0 / -mvPosition.z);
    gl_Position     = projectionMatrix * mvPosition;
  }
`

export const particleFragmentShader = /* glsl */ `
  uniform float uTime;

  varying float vAlpha;
  varying float vLane;
  varying float vProgress;

  void main() {
    // ── Soft round particle ────────────────────────────────────────
    vec2  uv   = gl_PointCoord - 0.5;
    float dist = length(uv);
    float disc = 1.0 - smoothstep(0.35, 0.5, dist);
    if (disc < 0.01) discard;

    // ── Colour: cobalt core → mercury edge ────────────────────────
    vec3 cobalt  = vec3(0.102, 0.337, 1.000);
    vec3 cobaltL = vec3(0.302, 0.498, 1.000);
    vec3 mercury = vec3(0.910, 0.910, 0.941);
    vec3 violet  = vec3(0.45,  0.18,  0.90);

    // Lane drives hue variation
    vec3 laneColor = mix(cobalt, violet, vLane * 0.45);
    laneColor      = mix(laneColor, cobaltL, vProgress);

    // Glow: brighter toward center
    float glow  = 1.0 - smoothstep(0.0, 0.35, dist);
    vec3  color = mix(laneColor, mercury, glow * 0.35);
    color      += mercury * glow * glow * 0.12;

    float alpha = disc * vAlpha;
    gl_FragColor = vec4(color, alpha);
  }
`
