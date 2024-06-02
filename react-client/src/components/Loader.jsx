import { useState, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Loader({ modelID, onLoad }) {
  const gltf = useLoader(GLTFLoader, `/textures/${modelID}/model.gltf`);
  const [mesh, setMesh] = useState(null);

  useEffect(() => {
    setMesh(gltf.scene);
    onLoad(gltf.scene); // Notify parent when model is loaded
  }, [gltf, onLoad]);

  return mesh ? ( 
    <primitive object={mesh} position={[0, 0, 0]} rotation-x={-Math.PI / 2} />
  ) : null;
}

export default Loader;