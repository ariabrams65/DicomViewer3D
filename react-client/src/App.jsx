import Renderer from './components/Renderer';
import './styles/App.css';
import Toolbar from './components/Toolbar';
import { Canvas } from '@react-three/fiber'

import React, {Suspense, useState} from 'react';
import {OrbitControls, PerspectiveCamera} from '@react-three/drei'
import Loader from "./components/Loader";
import Editor from "./components/Editor";
// import {Canvas} from "@react-three/fiber";
import {Object3D} from "three";
import {Panel} from "./components/MultiLeva";

function App() {
  const [selected, setSelected] = useState([]); 

  console.log(selected)

  return (
    <>

      <div className="app-container">
        <Toolbar /> {/* Update */}
        <div id='renderer'>
          <Canvas style={{ backgroundColor: 'lightblue' }}>
            <Suspense fallback={<Loader />}>
              <PerspectiveCamera makeDefault fov={75} aspect={window.innerWidth / window.innerHeight}
                position={[3, 0.15, 3]} near={1} far={5000} position-z={600}>
              </PerspectiveCamera>
              <Editor setSelected={setSelected} />
              <directionalLight color={0xffffff} position={[500, 500, 500]} />
              <ambientLight color={0xffffff} intensity={0.5}/>
            </Suspense>
            <OrbitControls />
          </Canvas>
          <Panel selected={selected} />
        </div>
      </div>
    </>
  );
}

export default App;
