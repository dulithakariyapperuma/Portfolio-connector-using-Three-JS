import { Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import BrainMesh from './BrainMesh.jsx';
import OrbitalRings from './OrbitalRings.jsx';
import SynapticParticles from './SynapticParticles.jsx';
import StarField from './StarField.jsx';
import NeuralTendrils from './NeuralTendrils.jsx';
import SceneLighting from './SceneLighting.jsx';

/**
 * The Three.js scene wrapped in R3F Canvas.
 * onCreated fires as soon as the renderer is ready —
 * we use it to signal the parent to hide the loader.
 */
export default function BrainScene({ onReady, onHemisphereHover, onHemisphereClick }) {
    const handleCreated = useCallback(() => {
        // Slight delay so first frame is fully painted before hiding loader
        setTimeout(onReady, 600);
    }, [onReady]);

    return (
        <Canvas
            id="brain-canvas"
            camera={{ fov: 55, near: 0.1, far: 200, position: [0, 0, 4.5] }}
            gl={{
                antialias: true,
                alpha: true,
            }}
            onCreated={({ gl }) => {
                gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                // Tone-mapping
                const THREE = gl.constructor;
                gl.toneMapping = 4; // ACESFilmicToneMapping
                gl.toneMappingExposure = 1.1;
                handleCreated();
            }}
            style={{ position: 'fixed', inset: 0, background: '#050510' }}
        >
            {/* Fog */}
            <fogExp2 args={[0x050510, 0.045]} />

            <Suspense fallback={null}>
                <SceneLighting />
                <BrainMesh
                    onHemisphereHover={onHemisphereHover}
                    onHemisphereClick={onHemisphereClick}
                />
                <OrbitalRings />
                <SynapticParticles count={2800} />
                <StarField count={3500} />
                <NeuralTendrils count={180} />
            </Suspense>

            <OrbitControls
                enablePan={false}
                enableDamping
                dampingFactor={0.06}
                enableRotate={true}
                minPolarAngle={Math.PI / 2.2}
                maxPolarAngle={Math.PI / 1.8}
                minDistance={3.5}
                maxDistance={7}
            />
        </Canvas>
    );
}
