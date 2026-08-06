import { useRef } from "react";
import { Float, Sparkles, Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import * as THREE from "three";

function CameraRig() {
  const vec = new THREE.Vector3();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { camera, pointer } = state;

    vec.set(
      pointer.x * 0.6 + Math.sin(t * 0.15) * 0.08,
      pointer.y * 0.25 + 0.35 + Math.cos(t * 0.12) * 0.05,
      6 + Math.cos(t * 0.1) * 0.15,
    );
    camera.position.lerp(vec, 0.04);
    camera.lookAt(0, 0.1, 0);
  });

  return null;
}

function StylizedBoot() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.22;
  });

  const leather = { color: "#2a1e22", metalness: 0.85, roughness: 0.22 };
  const accent = { color: "#a87c7c", metalness: 0.72, roughness: 0.28 };
  const gold = { color: "#c9a96e", metalness: 0.95, roughness: 0.12 };

  return (
    <group ref={groupRef} rotation={[0.15, -0.35, 0.08]} scale={1.05}>
      <mesh position={[0, -0.55, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.18, 1.05]} />
        <meshStandardMaterial {...leather} />
      </mesh>
      <mesh position={[0.15, -0.42, 0.55]} rotation={[0.35, 0, 0]} castShadow>
        <boxGeometry args={[1.1, 0.12, 0.55]} />
        <meshStandardMaterial {...leather} />
      </mesh>
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[1.85, 1.15, 0.75]} />
        <meshStandardMaterial {...accent} />
      </mesh>
      <mesh position={[-0.55, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.42, 0.95, 24]} />
        <meshStandardMaterial {...leather} />
      </mesh>
      <mesh position={[0.55, 0.15, 0.12]} rotation={[0, 0, -0.25]} castShadow>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial {...gold} />
      </mesh>
      <mesh position={[0, 0.75, 0.38]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial {...gold} />
      </mesh>
    </group>
  );
}

function OrbitRing({
  radius,
  speed,
  tilt,
  color,
}: {
  radius: number;
  speed: number;
  tilt: [number, number, number];
  color: string;
}) {
  const ringRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = state.clock.elapsedTime * speed;
  });

  return (
    <mesh ref={ringRef} rotation={tilt}>
      <torusGeometry args={[radius, 0.018, 12, 120]} />
      <meshStandardMaterial color={color} metalness={1} roughness={0.15} emissive={color} emissiveIntensity={0.15} />
    </mesh>
  );
}

function FloatingParticles() {
  return (
    <>
      <Sparkles count={90} scale={[8, 4, 8]} size={2.2} speed={0.22} opacity={0.45} color="#c9a96e" />
      <Sparkles count={50} scale={[6, 3, 6]} size={1.4} speed={0.15} opacity={0.3} color="#a87c7c" />
      <Stars radius={40} depth={30} count={1200} factor={2.2} saturation={0.15} fade speed={0.35} />
    </>
  );
}

export function LandingHeroScene() {
  return (
    <>
      <color attach="background" args={["#0d0a0c"]} />
      <fog attach="fog" args={["#0d0a0c", 6, 18]} />

      <ambientLight intensity={0.35} />
      <spotLight position={[6, 8, 4]} angle={0.35} penumbra={1} intensity={2.2} color="#fff5f0" castShadow />
      <spotLight position={[-5, 3, -2]} angle={0.5} penumbra={1} intensity={1.4} color="#a87c7c" />
      <pointLight position={[0, 2, 3]} intensity={0.8} color="#c9a96e" />

      <CameraRig />
      <FloatingParticles />

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
        <StylizedBoot />
      </Float>

      <OrbitRing radius={2.8} speed={0.08} tilt={[Math.PI / 2.2, 0.2, 0]} color="#c9a96e" />
      <OrbitRing radius={3.4} speed={-0.05} tilt={[Math.PI / 2.5, -0.3, 0.4]} color="#a87c7c" />
      <OrbitRing radius={4.1} speed={0.03} tilt={[Math.PI / 2.8, 0.5, -0.2]} color="#f5e6dc" />
    </>
  );
}
