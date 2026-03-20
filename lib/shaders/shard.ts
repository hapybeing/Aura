export const shardVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uManifestoProgress;
  uniform float uScrollVelocity;
  uniform float uDriftOffset;

  varying vec3  vNormal;
  varying vec3  vWorldPosition;
  varying float vFresnel;
  varying vec2  vUv;

  void main() {
    vUv    = uv;
    vNormal = normalize(normalMatrix * normal);

    vec3 pos = position;

    // Gentle vertical drift — faster as manifesto progresses
    float drift = uTime * 0.12 + uDriftOffset;
    pos.y += sin(drift) * 0.06;
    pos.x += cos(drift * 0.7) * 0.03;

    // Velocity tilt — shards lean with scroll inertia
    pos.x += uScrollVelocity * 0.003;

    // Rise in on manifesto enter
    pos.y += (1.0 - uManifestoProgress) * 0.5;

    vec3 worldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
    vWorldPosition = worldPos;

    vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
    vec3 viewDir     = normalize(cameraPosition - worldPos);
    float fresnelRaw = 1.0 - max(dot(worldNormal, viewDir), 0.0);
    vFresnel         = pow(fresnelRaw, 2.2);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export const shardFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uManifestoProgress;
  uniform float uTintShift;   // 0..1 per-shard colour variation

  varying vec3  vNormal;
  varying vec3  vWorldPosition;
  varying float vFresnel;
  varying vec2  vUv;

  void main() {
    // ── Palette ────────────────────────────────────────────
    vec3 cobalt   = vec3(0.102, 0.337, 1.000);
    vec3 cobaltLt = vec3(0.302, 0.498, 1.000);
    vec3 mercury  = vec3(0.910, 0.910, 0.941);
    vec3 violet   = vec3(0.420, 0.180, 0.900);

    // Per-shard tint variation
    vec3 tintA = mix(cobalt,   violet,   uTintShift);
    vec3 tintB = mix(cobaltLt, mercury, uTintShift);

    // ── Glass interior ─────────────────────────────────────
    // Simulate refracted interior colour using UV gradient
    float interior = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
    interior      *= smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);

    vec3 baseColor = mix(tintA * 0.06, tintB * 0.14, interior);

    // ── Fresnel edge glow ─────────────────────────────────
    vec3 edgeColor = mix(tintA, mercury, 0.35);
    baseColor += edgeColor * vFresnel * 0.55;

    // ── Shimmer line ──────────────────────────────────────
    float shimmerPos  = mod(uTime * 0.28 + uTintShift * 3.14, 2.5) - 0.5;
    float shimmerLine = smoothstep(0.06, 0.0, abs(vUv.y - shimmerPos));
    baseColor += mercury * shimmerLine * 0.18;

    // ── Alpha ──────────────────────────────────────────────
    float alpha  = mix(0.04, 0.46, vFresnel);
    alpha       += interior * 0.06;
    alpha       *= uManifestoProgress; // fade in with section
    alpha        = clamp(alpha, 0.0, 1.0);

    gl_FragColor  = vec4(baseColor, alpha);
  }
`
