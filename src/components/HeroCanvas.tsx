import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function FloatingParticles() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 600;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.05 + pointer.x * 0.3;
    meshRef.current.rotation.x = pointer.y * 0.2;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#dc2626" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function GlowingSphere() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }) => {
    if (!ref.current) return;
    ref.current.position.x = pointer.x * 0.5;
    ref.current.position.y = pointer.y * 0.3 + Math.sin(clock.getElapsedTime() * 0.5) * 0.3;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.3} transparent opacity={0.12} wireframe />
    </mesh>
  );
}

function FloatingOctahedron() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.x = clock.getElapsedTime() * 0.3;
    ref.current.rotation.y = clock.getElapsedTime() * 0.2;
    ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.5;
  });

  return (
    <mesh ref={ref} position={[2.5, 0, -2]}>
      <octahedronGeometry args={[0.8, 0]} />
      <meshStandardMaterial color="#d97706" emissive="#d97706" emissiveIntensity={0.3} transparent opacity={0.25} wireframe />
    </mesh>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#dc2626" />
        <pointLight position={[-5, -3, 3]} intensity={0.3} color="#d97706" />
        <FloatingParticles />
        <GlowingSphere />
        <FloatingOctahedron />
      </Canvas>
    </div>
  );
}
