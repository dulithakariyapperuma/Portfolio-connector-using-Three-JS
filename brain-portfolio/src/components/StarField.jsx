import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStarField } from '../hooks/useSceneObjects.js';

const starMaterial = new THREE.PointsMaterial({
    size: 0.065,
    color: 0xffffff,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
});

/**
 * Static star-field background — 3 500 points on a large sphere.
 */
export default function StarField({ count = 3500 }) {
    const geometry = useStarField(count);
    return <points geometry={geometry} material={starMaterial} />;
}
