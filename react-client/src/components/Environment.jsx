import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

function Environment({ backgroundColor }) {
  const { gl } = useThree();

  useEffect(() => {
    gl.setClearColor(backgroundColor); 
  }, [backgroundColor]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[500, 500, 500]} />
    </>
  );
}

export default Environment;
