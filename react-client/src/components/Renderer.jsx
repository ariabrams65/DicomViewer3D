import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber'; // Add useFrame
import { OrbitControls, Stats, Circle } from '@react-three/drei';
import Loader from './Loader';
import Controls from './Controls';
import Environment from './Environment';
import useKeyState from './useKeyState';
import * as THREE from 'three';



function Renderer({ modelID }) {
  const groupRef = useRef();
  const [model, setModel] = useState(null);
  const { moveForward, moveBackward, moveLeft, moveRight, moveUp, moveDown } = useKeyState();
  const { camera } = useThree(); // Get camera from useThree
  const [keyState, setKeyState] = useState({});
  // Camera movement speed (adjust as needed)
  const moveSpeed = 0.05;

  function handleModelLoad(loadedModel) {
    setModel(loadedModel);
  }

  useFrame(() => {
    if (model) { // Only update if model exists
      updateCameraPosition();
      scaleModel();
    }
  });

  const updateCameraPosition = () => {
    if (!model) return; // Don't update if model isn't loaded yet
    
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(direction, camera.up).normalize();

    const moveDirection = new THREE.Vector3(0, 0, 0);

    if (keyState['KeyW']) { 
      moveDirection.z -= moveSpeed; // Move forward
    }
    if (keyState['KeyS']) {
      moveDirection.z += moveSpeed; // Move backward
    }
    if (keyState['KeyA']) {
      moveDirection.x -= moveSpeed; // Move left
    }
    if (keyState['KeyD']) {
      moveDirection.x += moveSpeed; // Move right
    }
    if (keyState['Space']) {
      moveDirection.y += moveSpeed; // Move up
    }
    if (keyState['ShiftLeft'] || keyState['ShiftRight']) { // Either shift key
      moveDirection.y -= moveSpeed; // Move down
    }

    camera.position.add(moveDirection); 
  };

  const scaleModel = () => {
    if (!model) return;
    
    const distance = camera.position.distanceTo(model.position);
    const scaleFactor = 3 / distance;
    const minScale = 0.1;
    const finalScale = Math.max(minScale, scaleFactor);

    model.scale.set(finalScale, finalScale, finalScale);
  };

  return (
    <group ref={groupRef}>
      <Environment backgroundColor={0xadd8e6} />
      <Loader modelID={modelID} onLoad={handleModelLoad} />
      {/* ... other elements (Circle, OrbitControls, etc.) */}
      <Controls /> 
    </group>
  );
}

export default Renderer;
