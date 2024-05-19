import React, { useEffect, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Stats, OrbitControls, Circle } from '@react-three/drei'



function Renderer({ modelID }) {
  const gltf = useLoader(GLTFLoader, `textures/${modelID}/model.gltf`);
  const groupRef = useRef()
  useEffect(() => {
    const rendererElement = document.querySelector('.renderer');
    if (rendererElement) {
      rendererElement.style.backgroundColor = 'white'; 
    }
  }, []);

  return (
    <group ref={groupRef} dispose={null}> 
      {/*props.children*/} 
      <directionalLight
        position={[3.3, 1.0, 4.4]}
        castShadow
        intensity={Math.PI * 2}
      />
      <primitive
        object={gltf.scene}
        position={[0, 1, 0]}
        children-0-castShadow
      />
      <Circle args={[10]} rotation-x={-Math.PI / 2} receiveShadow>
        <meshStandardMaterial />
      </Circle>
      <OrbitControls target={[0, 1, 0]} />
      <axesHelper args={[5]} />
      <Stats />
      </group>
  );
}

export default Renderer;
