const brainFrag = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  varying float vNoise;
  varying float vSulcus;
  uniform float uTime;

  void main(){
    float py = vPos.y * 0.5 + 0.5;
    float px = vPos.x * 0.5 + 0.5;
    float pz = vPos.z * 0.5 + 0.5;

    float t = uTime * 0.1;

    // ── Sophisticated Organic / Tech Palette ────────────────────────────────
    // Pale lilac/pink base tones resembling brain matter, but slightly stylized
    vec3 colA = vec3(0.75, 0.65, 0.80); // soft lilac
    vec3 colB = vec3(0.85, 0.75, 0.85); // pale pinkish
    vec3 colC = vec3(0.65, 0.70, 0.85); // soft pale blue

    // Slowly shift the blend
    float blend1 = smoothstep(-1.0, 1.0, vPos.y + sin(px * 3.0 + t) * 0.5);
    float blend2 = smoothstep(-1.0, 1.0, vPos.x + cos(py * 2.0 + t) * 0.5);
    vec3 baseCol = mix(mix(colA, colB, blend1), colC, blend2);

    vec3 col = baseCol;

    // ── Sulcus Darkening ──────────────────────────────────────────────────
    // Valleys (grooves / sulci) are much darker, simulating deep crevices
    vec3 sulcusColor = vec3(0.25, 0.10, 0.30); // deep dark purple
    col = mix(col, sulcusColor, vSulcus * 0.9);

    // ── Fresnel / Rim Glow ────────────────────────────────────────────────
    // Soft outer glow to keep the portfolio's tech/space aesthetic
    float rim = 1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0);
    rim = pow(rim, 3.0);
    col += rim * vec3(0.40, 0.80, 1.00) * 0.4; // cyan tint on edges

    // ── Ridge Sheen ───────────────────────────────────────────────────────
    // Gyri (ridges) catch a subtle bright highlight, giving a wet/organic look
    float gyrus = clamp((1.0 - vSulcus) * 2.0 - 0.5, 0.0, 1.0);
    col += gyrus * vec3(1.0, 0.95, 0.95) * 0.25;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default brainFrag;
