import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Builds the synaptic particle system geometry + speeds array (memoised).
 * Returns { geometry, speeds, material }.
 */
export function useSynapticParticles(count = 2800) {
    return useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const speeds = new Float32Array(count);

        const palette = [
            new THREE.Color(0xff6ef7),
            new THREE.Color(0x56cfff),
            new THREE.Color(0x7fff6e),
            new THREE.Color(0xffc85e),
            new THREE.Color(0xff4d8b),
            new THREE.Color(0x38f5e8),
        ];

        for (let i = 0; i < count; i++) {
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const r = 1.5 + Math.random() * 1.8;

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);

            const c = palette[Math.floor(Math.random() * palette.length)];
            col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
            sizes[i] = Math.random() * 3.5 + 0.5;
            speeds[i] = Math.random() * 0.6 + 0.2;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.028,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        return { geometry: geo, speeds, material };
    }, [count]);
}

/**
 * Builds the star-field geometry (memoised).
 */
export function useStarField(count = 3500) {
    return useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 35 + Math.random() * 60;
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        return geo;
    }, [count]);
}

/**
 * Builds the neural-tendril LineSegments geometry (memoised).
 */
export function useTendrils(count = 180) {
    return useMemo(() => {
        const positions = [];
        const colors = [];
        const palette = [0xff6ef7, 0x56cfff, 0x7fff6e, 0xffc85e];

        for (let i = 0; i < count; i++) {
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const r0 = 1.35;
            const ox = r0 * Math.sin(phi) * Math.cos(theta);
            const oy = r0 * Math.sin(phi) * Math.sin(theta);
            const oz = r0 * Math.cos(phi);

            const ext = 1.6 + Math.random() * 1.2;
            const ex = ox * ext + (Math.random() - 0.5) * 0.4;
            const ey = oy * ext + (Math.random() - 0.5) * 0.4;
            const ez = oz * ext + (Math.random() - 0.5) * 0.4;

            positions.push(ox, oy, oz, ex, ey, ez);
            const c = new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);
            colors.push(c.r, c.g, c.b, c.r, c.g, c.b);
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
        return geo;
    }, [count]);
}
