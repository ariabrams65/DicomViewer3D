import React, { useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


function Scene() {
  const gltf = useLoader(GLTFLoader, 'the gltf loader')
  return <primitive object={gltf.scene} />
}

function Renderer(props) {
  useEffect(() => {
    const rendererElement = document.querySelector('.renderer');
    if (rendererElement) {
      rendererElement.style.backgroundColor = 'white'; 
    }
  }, []);

  return (
    <div className="renderer" style={{ height: '100%', width: '100%' }}> 
      {props.children} 
    </div>
  );
}

export default Renderer;
