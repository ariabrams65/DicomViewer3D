//Renderer.jsx

import { Canvas } from '@react-three/fiber'

export default function Renderer() {
  return (
    <Canvas>
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </Canvas>
  );
}
