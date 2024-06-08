import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stats, Circle } from '@react-three/drei';
import Loader from './Loader';
import Controls from './Controls';
import Environment from './Environment';
import useKeyState from './useKeyState'; // Import the useKeyState hook
import * as THREE from 'three';

function Renderer({ modelID }) {
  const groupRef = useRef();
  const [model, setModel] = useState(null);
  const { camera } = useThree(); // Get camera from useThree
  const keyState = useKeyState(); // Use the useKeyState hook to track key states

  // Camera movement speed (adjust as needed)
  const moveSpeed = 0.1;

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
    camera.getWorldDirection(direction); // Get the direction the camera is facing
    direction.normalize();
  
    const right = new THREE.Vector3();
    right.crossVectors(direction, camera.up).normalize(); // Get the right vector
  
    let moveDirection = new THREE.Vector3(0, 0, 0); // Initialize the movement direction
  
    // Adjust moveDirection based on key presses
    if (keyState['KeyW']) {
      moveDirection.add(direction); // Move forward
    }
    if (keyState['KeyS']) {
      moveDirection.sub(direction); // Move backward
    }
    if (keyState['KeyA']) {
      moveDirection.sub(right); // Move left
    }
    if (keyState['KeyD']) {
      moveDirection.add(right); // Move right
    }
    if (keyState['Space']) {
      moveDirection.y += moveSpeed; // Move up
    }
    if (keyState['ShiftLeft'] || keyState['ShiftRight']) {
      moveDirection.y -= moveSpeed; // Move down
    }
  
    // Normalize and scale the movement vector
    moveDirection.normalize().multiplyScalar(moveSpeed);
  
    // Move the camera
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