import { useState, Suspense } from 'react';
import Renderer from './components/Renderer';
import './styles/App.css';
import Toolbar from './components/Toolbar';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import IconButton from '@mui/material/IconButton';
import { Canvas, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Stats, OrbitControls, Circle } from '@react-three/drei'



function App() {
  const [modelID, setIDName] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const nearClippingDistance = 0.01; // Adjust as needed
  const farClippingDistance = 1000; // Adjust as needed

  const devId = '900cb49d-7543-4017-8165-fc5847b26f9a'

  return (
    <>
      <div className="app-container">
        <Toolbar setIDName={setIDName} setUploadSuccess={setUploadSuccess} />
        {/* <Renderer className='renderer'>3d Renderer </Renderer> */}
        {uploadSuccess &&
          (<Canvas className='renderer' camera={{ position: [0, 0, 50] }} shadows >
            <Suspense fallback={
              <mesh>
                <boxGeometry />
                <meshBasicMaterial color="blue" />
              </mesh>
            }>
              <Renderer modelID={modelID} />
            </Suspense>
          </Canvas>)
        } 
      </div>
    </>
  );
}

export default App;
