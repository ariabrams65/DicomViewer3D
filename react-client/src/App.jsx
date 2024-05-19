import { useState } from 'react';
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

  return (
    <>
      <div className="app-container">
        <Toolbar setIDName={setIDName} setUploadSuccess={setUploadSuccess} />
        {/* <Renderer className='renderer'>3d Renderer </Renderer> */}
        {uploadSuccess &&
          (<Canvas className='renderer' camera={{ position: [-0.5, 1, 2] }} shadows >
            <Renderer  modelID={modelID} />
          </Canvas>)
        }
      </div>
    </>
  );
}

export default App;
