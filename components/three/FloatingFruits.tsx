"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/**
 * Each fruit is built from primitive geometries + MeshPhysicalMaterial so
 * there are no external model/texture assets to load — keeps first paint
 * fast, which matters more here than photorealism.
 */

function Apple({ position }: { position: [number, number, number] }) {
  const stemRef = useRef<THREE.Mesh>(null);
  return (
    <group position={position}>
      <mesh castShadow receiveShadow scale={[1, 0.95, 1]}>
        <sphereGeometry args={[0.9, 48, 48]} />
        <meshPhysicalMaterial color="#E64A19" roughness={0.25} clearcoat={0.6} clearcoatRoughness={0.3} />
      </mesh>
      <mesh ref={stemRef} position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.35, 8]} />
        <meshStandardMaterial color="#6D4C41" roughness={0.8} />
      </mesh>
      <mesh position={[0.18, 0.85, 0]} rotation={[0, 0, -0.6]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#8FBF3F" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Orange({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.85, 48, 48]} />
        <meshPhysicalMaterial color="#F57C00" roughness={0.45} clearcoat={0.3} />
      </mesh>
      <mesh position={[0, 0.82, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#8FBF3F" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Avocado({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0, 0.15]}>
      <mesh castShadow receiveShadow scale={[0.8, 1.1, 0.8]}>
        <sphereGeometry args={[0.85, 48, 48]} />
        <meshPhysicalMaterial color="#3E5A2E" roughness={0.55} />
      </mesh>
      <mesh scale={[0.62, 0.62, 0.62]} position={[0, -0.1, 0.15]}>
        <sphereGeometry args={[0.7, 12]} />
        <meshStandardMaterial color="#7A4B2C" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Strawberry({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow scale={[0.75, 0.95, 0.75]}>
        <coneGeometry args={[0.65, 1.1, 32]} />
        <meshPhysicalMaterial color="#D6304C" roughness={0.35} clearcoat={0.5} />
      </mesh>
      <mesh position={[0, 0.58, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.45, 0.25, 6]} />
        <meshStandardMaterial color="#6FA83A" roughness={0.6} />
      </mesh>
    </group>
  );
}

const FRUITS: { Comp: typeof Apple; position: [number, number, number]; speed: number }[] = [
  { Comp: Avocado, position: [-2.4, 0.6, -1], speed: 0.7 },
  { Comp: Orange, position: [2.2, 1.1, 0], speed: 0.9 },
  { Comp: Strawberry, position: [1.4, -0.8, 1], speed: 1.1 },
  { Comp: Apple, position: [-0.6, 0.2, 1.4], speed: 0.6 },
  { Comp: Orange, position: [-2, -1.1, 0.4], speed: 0.8 },
];

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1.4} castShadow />
      <pointLight position={[-4, -2, 2]} intensity={0.4} color="#8FBF3F" />
      {FRUITS.map((f, i) => (
        <Float key={i} speed={f.speed} rotationIntensity={0.6} floatIntensity={1.1}>
          <f.Comp position={f.position} />
        </Float>
      ))}
      <ContactShadows position={[0, -2, 0]} opacity={0.35} scale={10} blur={2.5} far={4} />
      <Environment preset="city" />
    </>
  );
}

export default function FloatingFruits() {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 0, 7], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.8]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
