import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSynapticParticles } from '../hooks/useSceneObjects.js';

/**
 * 2,800 synaptic particles that slowly drift and rotate around the brain.
 */
export default function SynapticParticles({ count = 2800 }) {
    const ptsRef = useRef();
    const { geometry, speeds, material } = useSynapticParticles(count);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (!ptsRef.current) return;

        const posArr = ptsRef.current.geometry.attributes.position.array;
        for (let i = 0; i < posArr.length; i += 3) {
            posArr[i + 1] += Math.sin(t * speeds[i / 3] + i) * 0.0004;
        }
        ptsRef.current.geometry.attributes.position.needsUpdate = true;
        ptsRef.current.rotation.y += 0.0008;
    });

    return (
        <points ref={ptsRef} geometry={geometry} material={material} />
    );
}
