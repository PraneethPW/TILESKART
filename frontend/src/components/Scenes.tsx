import { Float, MeshDistortMaterial, OrbitControls, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useState } from "react";

function RotatingTile() {
  const colors = ["#f8fafc", "#f59e0b", "#14b8a6", "#ef4444"];

  return (
    <group rotation={[0.2, -0.4, 0]}>
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <Float key={`${row}-${col}`} speed={1.4 + row * 0.12} rotationIntensity={0.35} floatIntensity={0.8}>
            <mesh position={[(col - 1.5) * 1.15, (row - 1.5) * 1.15, Math.sin(row + col) * 0.12]}>
              <boxGeometry args={[1, 1, 0.08]} />
              <MeshDistortMaterial color={colors[(row + col) % colors.length]} metalness={0.35} roughness={0.18} distort={0.16} speed={1.8} />
            </mesh>
          </Float>
        ))
      )}
    </group>
  );
}

function AnimatedMarble() {
  const [pulse, setPulse] = useState(0);
  useFrame((state) => setPulse(Math.sin(state.clock.elapsedTime) * 0.12));

  return (
    <mesh rotation={[0.8 + pulse, 0.2, -0.45]}>
      <torusKnotGeometry args={[1.25, 0.28, 180, 18]} />
      <meshStandardMaterial color="#e8eef2" metalness={0.45} roughness={0.16} />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }} className="hero-canvas">
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 4, 6]} intensity={2.6} />
      <pointLight position={[-4, -3, 4]} intensity={3} color="#f97316" />
      <Suspense fallback={null}>
        <RotatingTile />
        <Sparkles count={80} scale={7} size={3} speed={0.45} color="#fde68a" />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
    </Canvas>
  );
}

export function MiniScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 3, 4]} intensity={2} />
      <Float speed={2} rotationIntensity={0.7} floatIntensity={0.6}>
        <AnimatedMarble />
      </Float>
      <Sparkles count={35} scale={4} size={2} color="#22c55e" />
    </Canvas>
  );
}
