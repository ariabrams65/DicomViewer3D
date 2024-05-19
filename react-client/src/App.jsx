import { useState } from 'react';
import Renderer from './components/Renderer';
import './styles/App.css';
import Toolbar from './components/Toolbar';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import IconButton from '@mui/material/IconButton';
import { Canvas, useLoader } from '@react-three/fiber';
import { Home } from '@mui/icons-material';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
   
      <div className="app-container">
        <Toolbar /> {/* Update */}
        <Renderer className='renderer'>3d Renderer </Renderer>
      </div>
    </>
  );
}

export default App;
