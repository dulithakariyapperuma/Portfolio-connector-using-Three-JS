const brainVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  varying float vNoise;
  varying float vSulcus;     // how deep inside a groove (0 = ridge, 1 = sulcus)
  uniform float uTime;

  // ── Perlin 3-D noise (compact) ──────────────────────────────────────────
  vec4 permute(vec4 x){ return mod(((x*34.)+1.)*x,289.); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159-.85373472095314*r; }
  vec3 fade(vec3 t){ return t*t*t*(t*(t*6.-15.)+10.); }

  float cnoise(vec3 P){
    vec3 Pi0=floor(P),Pi1=Pi0+1.;
    Pi0=mod(Pi0,289.); Pi1=mod(Pi1,289.);
    vec3 Pf0=fract(P), Pf1=Pf0-1.;
    vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
    vec4 iy=vec4(Pi0.yy,Pi1.yy);
    vec4 iz0=Pi0.zzzz, iz1=Pi1.zzzz;
    vec4 ixy=permute(permute(ix)+iy);
    vec4 ixy0=permute(ixy+iz0), ixy1=permute(ixy+iz1);
    vec4 gx0=ixy0/7., gy0=fract(floor(gx0)/7.)-.5;
    gx0=fract(gx0);
    vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);
    vec4 sz0=step(gz0,vec4(0.));
    gx0-=sz0*(step(0.,gx0)-.5); gy0-=sz0*(step(0.,gy0)-.5);
    vec4 gx1=ixy1/7., gy1=fract(floor(gx1)/7.)-.5;
    gx1=fract(gx1);
    vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);
    vec4 sz1=step(gz1,vec4(0.));
    gx1-=sz1*(step(0.,gx1)-.5); gy1-=sz1*(step(0.,gy1)-.5);
    vec3 g000=vec3(gx0.x,gy0.x,gz0.x),g100=vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010=vec3(gx0.z,gy0.z,gz0.z),g110=vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001=vec3(gx1.x,gy1.x,gz1.x),g101=vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011=vec3(gx1.z,gy1.z,gz1.z),g111=vec3(gx1.w,gy1.w,gz1.w);
    vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
    g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;
    vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
    g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;
    float n000=dot(g000,Pf0),n100=dot(g100,vec3(Pf1.x,Pf0.yz));
    float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));
    float n110=dot(g110,vec3(Pf1.xy,Pf0.z));
    float n001=dot(g001,vec3(Pf0.xy,Pf1.z));
    float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
    float n011=dot(g011,vec3(Pf0.x,Pf1.yz));
    float n111=dot(g111,Pf1);
    vec3 fade_xyz=fade(Pf0);
    vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
    vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
    return 2.2*mix(n_yz.x,n_yz.y,fade_xyz.x);
  }

  // Ridge noise: creates sharp raised ridges where Perlin crosses 0
  float ridge(vec3 p, float sharpness){
    return pow(1.0 - abs(cnoise(p)), sharpness);
  }

  void main(){
    vNormal = normalize(normalMatrix * normal);
    vPos    = position;

    vec3 pos = position;

    // ── 1. ANATOMICAL MASS SCULPTING ────────────────────────────────────────
    // A brain is naturally longer from front to back (Z) and slightly narrower laterally (X).
    pos.x *= 0.85; 
    pos.z *= 1.20;
    pos.y *= 0.90;

    // Flatten the base (bottom surface)
    float baseFlatten = smoothstep(0.2, -0.8, pos.y);
    pos.y -= baseFlatten * 0.35;

    // A. Frontal Lobe (+Z): Bulbous, rounded, and slightly tapered at the very front
    float frontalTip = smoothstep(0.5, 1.2, pos.z);
    pos.x *= (1.0 - frontalTip * 0.15);

    // B. Occipital Lobe (-Z): Taper towards the back
    float occipital = smoothstep(0.0, -1.2, pos.z);
    pos.x *= (1.0 - occipital * 0.20);
    pos.y *= (1.0 - occipital * 0.15);

    // C. Temporal Lobe Bulges: Flaring out on the sides
    float temporalMask = smoothstep(0.3, -0.5, pos.y) * (1.0 - abs(pos.z) * 0.6);
    pos.x += sign(pos.x) * temporalMask * 0.20;

    // D. Cerebellum: Two rounded masses at the base back
    float cerebellum = smoothstep(-0.2, -1.1, pos.z) 
                     * smoothstep(-0.1, -1.1, pos.y)
                     * smoothstep(0.0, 0.8, abs(pos.x));
    pos.y -= cerebellum * 0.20;
    pos.x += sign(pos.x) * cerebellum * 0.15;

    // ── 2. MAJOR GROOVES / FISSURES ─────────────────────────────────────────
    // Longitudinal Fissure (Sagittal split - the deep groove between left/right hemispheres)
    float fissureWidth = 0.12;
    float fissureStrength = smoothstep(fissureWidth, 0.0, abs(pos.x));
    float fissureHeight = smoothstep(-0.5, 1.0, pos.y); // deeper at the top
    float sagittalFissure = fissureStrength * fissureHeight;
    pos.x -= sign(pos.x) * sagittalFissure * 0.08; // pull horizontally away from center
    pos.y -= sagittalFissure * 0.40;               // indent deeply down

    // Sylvian Fissure (Lateral sulcus) - split on the sides
    float sylvian = smoothstep(0.15, -0.05, abs(pos.y)) 
                  * smoothstep(0.3, 1.0, abs(pos.x))
                  * smoothstep(-0.2, 0.6, pos.z);
    pos.y -= sylvian * 0.12;
    pos.x -= sign(pos.x) * sylvian * 0.05;

    // ── 3. LABYRINTHINE GYRI & SULCI (Warped Noise) ─────────────────────────
    vec3 animPos = pos; // warp based on the slightly sculpted pos
    float slow = uTime * 0.05;

    // Domain Warping: offset coordinates to create "winding" brain-like folds
    vec3 warp = vec3(
        cnoise(animPos * 2.5 + slow),
        cnoise(animPos * 2.5 + slow + 12.0),
        cnoise(animPos * 2.5 + slow + 24.0)
    ) * 0.25;

    vec3 p = (animPos + warp) * 3.0;

    // Using 'abs(cnoise)' produces rounded ridges (gyri) and sharp valleys (sulci).
    // The pow() function shapes the plumpness of the gyri.
    float g1 = pow(abs(cnoise(p)), 0.8) * 0.18;       // large primary folds
    float g2 = pow(abs(cnoise(p * 2.0)), 0.9) * 0.07; // secondary folds
    float g3 = pow(abs(cnoise(p * 4.0)), 1.0) * 0.02; // tertiary fine texture
    
    float wrinkle = g1 + g2 + g3;

    // Smooth out wrinkles near the base and deep inside fissures
    float baseTaper = smoothstep(-0.8, -0.2, pos.y);
    wrinkle *= baseTaper;
    wrinkle *= (1.0 - sagittalFissure * 0.9);
    wrinkle *= (1.0 - sylvian * 0.5);

    vNoise  = wrinkle;
    // Calculate a sulcus mask (1.0 when deep in a fold, 0.0 at the top of a gyrus)
    vSulcus = 1.0 - clamp(wrinkle * 4.5, 0.0, 1.0);

    // Apply the displacement
    pos += normalize(pos) * (wrinkle - 0.05);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export default brainVert;
