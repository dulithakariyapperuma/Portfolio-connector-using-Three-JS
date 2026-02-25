import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTendrils } from '../hooks/useSceneObjects.js';

/**
 * 180 neural tendril line-segments that flicker in opacity.
 */
export default function NeuralTendrils({ count = 180 }) {
    const ref = useRef();
    const geometry = useTendrils(count);

    const material = useMemo(
        () =>
            new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: 0.15,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            }),
        []
    );

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (ref.current) {
            ref.current.material.opacity = 0.1 + Math.sin(t * 0.8) * 0.08;
        }
    });

    return <lineSegments ref={ref} geometry={geometry} material={material} />;
}
