import { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

/**
 * BrainMesh — anatomically accurate 3D brain as navigation.
 * 
 * Uses R3F's built-in event system (onClick, onPointerMove, onPointerOut)
 * which properly coexists with OrbitControls.
 */
export default function BrainMesh({ onHemisphereHover, onHemisphereClick }) {
    const groupRef = useRef();
    const centerRef = useRef();
    const [hoveredSide, setHoveredSide] = useState(null);
    const [clickAnim, setClickAnim] = useState(null);

    const { scene } = useGLTF('/scene.gltf');
    const { gl } = useThree();

    const customUniforms = useMemo(() => ({
        uTime: { value: 0 },
        uHoverSide: { value: 0 },
        uClickFlash: { value: 0 },
    }), []);

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                const material = new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color('#d4b4b8'),
                    emissive: new THREE.Color('#000000'),
                    roughness: 1.35,
                    metalness: 1.05,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.15,
                    transmission: 0.5,
                    thickness: 1.5,
                    ior: 1.4,
                });

                material.onBeforeCompile = (shader) => {
                    shader.uniforms.uTime = customUniforms.uTime;
                    shader.uniforms.uHoverSide = customUniforms.uHoverSide;
                    shader.uniforms.uClickFlash = customUniforms.uClickFlash;

                    shader.vertexShader = `
                        varying vec3 vWorldPositionCustom;
                        ${shader.vertexShader}
                    `.replace(
                        `#include <worldpos_vertex>`,
                        `
                        #include <worldpos_vertex>
                        vWorldPositionCustom = (modelMatrix * vec4(transformed, 1.0)).xyz;
                        `
                    );

                    shader.fragmentShader = `
                        uniform float uTime;
                        uniform float uHoverSide;
                        uniform float uClickFlash;
                        varying vec3 vWorldPositionCustom;

                        vec3 mod289f(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                        vec4 mod289f(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                        vec4 permute_f(vec4 x) { return mod289f(((x*34.0)+1.0)*x); }
                        vec4 taylorInvSqrt_f(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
                        float snoise(vec3 v) {
                            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                            vec3 i  = floor(v + dot(v, C.yyy));
                            vec3 x0 = v - i + dot(i, C.xxx);
                            vec3 g = step(x0.yzx, x0.xyz);
                            vec3 l = 1.0 - g;
                            vec3 i1 = min(g.xyz, l.zxy);
                            vec3 i2 = max(g.xyz, l.zxy);
                            vec3 x1 = x0 - i1 + C.xxx;
                            vec3 x2 = x0 - i2 + C.yyy;
                            vec3 x3 = x0 - D.yyy;
                            i = mod289f(i);
                            vec4 p = permute_f(permute_f(permute_f(
                                        i.z + vec4(0.0, i1.z, i2.z, 1.0))
                                      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                                      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                            float n_ = 0.142857142857;
                            vec3 ns = n_ * D.wyz - D.xzx;
                            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                            vec4 x_ = floor(j * ns.z);
                            vec4 y_ = floor(j - 7.0 * x_);
                            vec4 x = x_ *ns.x + ns.yyyy;
                            vec4 y = y_ *ns.x + ns.yyyy;
                            vec4 h = 1.0 - abs(x) - abs(y);
                            vec4 b0 = vec4(x.xy, y.xy);
                            vec4 b1 = vec4(x.zw, y.zw);
                            vec4 s0 = floor(b0)*2.0 + 1.0;
                            vec4 s1 = floor(b1)*2.0 + 1.0;
                            vec4 sh = -step(h, vec4(0.0));
                            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
                            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
                            vec3 p0 = vec3(a0.xy, h.x);
                            vec3 p1 = vec3(a0.zw, h.y);
                            vec3 p2 = vec3(a1.xy, h.z);
                            vec3 p3 = vec3(a1.zw, h.w);
                            vec4 norm = taylorInvSqrt_f(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
                            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
                            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                            m = m * m;
                            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
                        }

                        ${shader.fragmentShader}
                    `.replace(
                        `#include <dithering_fragment>`,
                        `
                        #include <dithering_fragment>

                        // Neural pulse
                        float noiseVal = snoise(vWorldPositionCustom * 5.0 - vec3(0.0, uTime * 1.5, 0.0));
                        float pulse = smoothstep(0.85, 1.0, noiseVal);
                        vec3 glowColor = vec3(0.3, 0.8, 1.0) * pulse * 2.5;
                        gl_FragColor = vec4(gl_FragColor.rgb + glowColor, gl_FragColor.a);

                        // Hemisphere hover highlight
                        if (uHoverSide != 0.0) {
                            float fragSide = sign(vWorldPositionCustom.x);
                            float isHovered = step(0.5, fragSide * uHoverSide);

                            vec3 leftGlow  = vec3(0.2, 0.6, 1.0);
                            vec3 rightGlow = vec3(1.0, 0.4, 0.7);
                            vec3 hoverGlow = uHoverSide > 0.0 ? leftGlow : rightGlow;

                            float hoverPulse = 0.5 + 0.5 * sin(uTime * 3.0);
                            float hoverIntensity = isHovered * (0.3 + hoverPulse * 0.4);
                            gl_FragColor.rgb += hoverGlow * hoverIntensity;

                            float isOpp = 1.0 - isHovered;
                            gl_FragColor.rgb *= 1.0 - isOpp * 0.3;
                        }

                        // Click flash animation
                        if (uClickFlash > 0.0) {
                            vec3 flashColor = uHoverSide > 0.0 
                                ? vec3(0.3, 0.7, 1.0) 
                                : (uHoverSide < 0.0 ? vec3(1.0, 0.5, 0.8) : vec3(1.0));
                            gl_FragColor.rgb += flashColor * uClickFlash * 1.5;
                            gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0), uClickFlash * 0.3);
                        }
                        `
                    );
                };

                child.material = material;
            }
        });
    }, [scene, customUniforms]);

    // ── Determine hemisphere from R3F event point ──
    const getSideFromEvent = (event) => {
        // R3F gives us the intersection point directly
        const worldPoint = event.point.clone();
        if (groupRef.current) {
            groupRef.current.worldToLocal(worldPoint);
        }
        return worldPoint.x > 0 ? 'left' : 'right';
    };

    // ── R3F Event Handlers (work properly with OrbitControls) ──
    const handlePointerMove = (event) => {
        if (clickAnim) return;
        event.stopPropagation();
        const side = getSideFromEvent(event);
        setHoveredSide(side);
        if (onHemisphereHover) onHemisphereHover(side);
    };

    const handlePointerOut = () => {
        if (clickAnim) return;
        setHoveredSide(null);
        if (onHemisphereHover) onHemisphereHover(null);
    };

    const handleClick = (event) => {
        if (clickAnim) return;
        event.stopPropagation();
        const side = getSideFromEvent(event);
        if (side) {
            const currentRotY = groupRef.current ? groupRef.current.rotation.y : 0;
            setClickAnim({ side, startTime: null, startRotY: currentRotY });
        }
    };

    // Animation duration in seconds
    const ANIM_DURATION = 1.8;

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        customUniforms.uTime.value = t;

        // Update hover uniform
        if (hoveredSide === 'left') {
            customUniforms.uHoverSide.value = 1.0;
        } else if (hoveredSide === 'right') {
            customUniforms.uHoverSide.value = -1.0;
        } else {
            customUniforms.uHoverSide.value = 0.0;
        }

        if (!groupRef.current) return;

        if (clickAnim) {
            if (clickAnim.startTime === null) {
                clickAnim.startTime = t;
            }

            const elapsed = t - clickAnim.startTime;
            const progress = Math.min(elapsed / ANIM_DURATION, 1.0);

            const ease = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            const targetRotY = clickAnim.side === 'left'
                ? clickAnim.startRotY - Math.PI * 0.4
                : clickAnim.startRotY + Math.PI * 0.4;

            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                clickAnim.startRotY, targetRotY, ease
            );

            const scalePulse = 1.0 + Math.sin(progress * Math.PI) * 0.15;
            groupRef.current.scale.setScalar(scalePulse);

            const flash = Math.sin(progress * Math.PI) * (1.0 - progress * 0.3);
            customUniforms.uClickFlash.value = flash;

            if (progress >= 1.0) {
                customUniforms.uClickFlash.value = 0;
                const side = clickAnim.side;
                setClickAnim(null);
                if (onHemisphereClick) onHemisphereClick(side);
            }
        } else {
            customUniforms.uClickFlash.value = 0;
            const pulse = 1.0 + Math.sin(t * 1.5) * 0.006;
            groupRef.current.scale.setScalar(pulse);
            groupRef.current.rotation.x = -0.15;
        }
    });

    // Change cursor on hover
    useEffect(() => {
        gl.domElement.style.cursor = hoveredSide ? 'pointer' : 'default';
    }, [hoveredSide, gl]);

    return (
        <group ref={groupRef}>
            <Center ref={centerRef}>
                {/* 
                  Use a wrapper group with R3F events.
                  These events use R3F's internal raycaster which works
                  alongside OrbitControls without conflicts.
                */}
                <group
                    onPointerMove={handlePointerMove}
                    onPointerOut={handlePointerOut}
                    onClick={handleClick}
                >
                    <primitive object={scene} scale={8.0} />
                </group>
            </Center>
        </group>
    );
}

useGLTF.preload('/scene.gltf');
