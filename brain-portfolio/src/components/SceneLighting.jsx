export default function SceneLighting() {
    return (
        <>
            {/* Gentle ambient glow (dark navy/ambient) */}
            <ambientLight intensity={0.15} color="#101530" />


            {/* Soft rim light from behind to highlight the silhouette */}
            <spotLight
                color="#6fa3ff"
                intensity={8.0}
                position={[0, 4, -6]}
                angle={0.6}
                penumbra={1}
                distance={20}
            />


            {/* Another rim light for the opposite side */}
            <spotLight
                color="#ff8fab"
                intensity={4.0}
                position={[-5, -2, -4]}
                angle={0.8}
                penumbra={1}
                distance={20}
            />


            {/* Subtle top light for volumetric highlighting */}
            <directionalLight
                color="#ffffff"
                intensity={1.2}
                position={[0, 5, 2]}
            />


            {/* Fill light from the front to bring out soft pink flesh details */}
            <pointLight
                color="#ffd1d8"
                intensity={0.8}
                distance={15}
                position={[0, -2, 4]}
            />


        </>
    );
}
