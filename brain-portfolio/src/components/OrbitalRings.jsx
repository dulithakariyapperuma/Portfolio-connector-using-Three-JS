import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Three orbiting energy rings that slowly rotate as a group.
 */
function EnergyRing({ radius, color, rotX, rotZ }) {
    const geo = useMemo(() => new THREE.TorusGeometry(radius, 0.006, 8, 200), [radius]);
    const mat = useMemo(
        () =>
            new THREE.MeshBasicMaterial({
                color,
                transparent: true,
                opacity: 0.38,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            }),
        [color]
    );

    return <mesh geometry={geo} material={mat} rotation={[rotX, 0, rotZ]} />;
}

export default function OrbitalRings() {
    const groupRef = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.x = t * 0.07;
            groupRef.current.rotation.y = t * 0.12;
            groupRef.current.rotation.z = t * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            <EnergyRing radius={2.1} color={0xff6ef7} rotX={Math.PI / 2} rotZ={0.3} />
            <EnergyRing radius={2.3} color={0x56cfff} rotX={Math.PI / 3} rotZ={-0.8} />
            <EnergyRing radius={2.5} color={0x7fff6e} rotX={Math.PI * 0.15} rotZ={1.2} />
        </group>
    );
}
