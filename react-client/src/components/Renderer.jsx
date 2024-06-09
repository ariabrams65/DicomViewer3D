import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import Loader from './Loader';
import Controls from './Controls';
import Environment from './Environment';
import useKeyState from './useKeyState';
import * as THREE from 'three';

function Renderer({ modelID }) {
  const groupRef = useRef();
  const [model, setModel] = useState(null);
  const { camera, scene } = useThree();
  const keyState = useKeyState();
  const [intersectedObject, setIntersectedObject] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState(new THREE.Vector3());
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const css3DRendererRef = useRef();

  const moveSpeed = 0.15;

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Create CSS3DRenderer
    const css3DRenderer = new CSS3DRenderer();
    css3DRenderer.setSize(window.innerWidth, window.innerHeight);
    css3DRenderer.domElement.style.position = 'absolute';
    css3DRenderer.domElement.style.top = 0;
    css3DRenderer.domElement.style.pointerEvents = 'none';
    css3DRendererRef.current = css3DRenderer;

    // Append CSS3DRenderer's DOM element to the parent of the 3D scene
    const parentElement = groupRef.current?.parentElement;
    if (parentElement) {
      parentElement.appendChild(css3DRenderer.domElement);
      //console.log('CSS3DRenderer DOM element added to parent:', css3DRenderer.domElement);
    }

    // Clean up
    return () => {
      if (parentElement) {
        parentElement.removeChild(css3DRenderer.domElement);
      }
    };
  }, []);

  function handleModelLoad(loadedModel) {
    setModel(loadedModel);
  }

  useFrame(() => {
    if (model) {
      updateCameraPosition();
      scaleModel();
      performRaycast();

      // Render CSS3D
      css3DRendererRef.current?.render(scene, camera);
    }
  });

  const updateCameraPosition = () => {
    if (!model) return;

    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(direction, camera.up).normalize();

    let moveDirection = new THREE.Vector3(0, 0, 0);

    if (keyState['KeyW']) {
      moveDirection.add(direction);
    }
    if (keyState['KeyS']) {
      moveDirection.sub(direction);
    }
    if (keyState['KeyA']) {
      moveDirection.sub(right);
    }
    if (keyState['KeyD']) {
      moveDirection.add(right);
    }
    if (keyState['Space']) {
      moveDirection.y += moveSpeed;
    }
    if (keyState['ShiftLeft'] || keyState['ShiftRight']) {
      moveDirection.y -= moveSpeed;
    }

    moveDirection.normalize().multiplyScalar(moveSpeed);
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

  const performRaycast = () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(model.children, true);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      //console.log('Intersected object:', intersect.object);
      setIntersectedObject(intersect.object);
      setTooltipContent(intersect.object.name);
      const screenPosition = intersect.point.clone().project(camera);
      //console.log('Tooltip position:', screenPosition);
      setTooltipPosition(screenPosition);
    } else {
      setIntersectedObject(null);
      setTooltipContent('');
      setTooltipPosition(null);
    }
  };

  return (
    <group ref={groupRef}>
      <Environment backgroundColor={0xadd8e6} />
      <Loader modelID={modelID} onLoad={handleModelLoad} />
      <Controls />
      {tooltipContent && tooltipPosition && (
        <CSS3DTooltip content={tooltipContent} position={tooltipPosition} />
      )}
    </group>
  );
}

const CSS3DTooltip = ({ content, position }) => {
  const tooltipRef = useRef();

  useEffect(() => {
    const tooltipElement = document.createElement('div');
    tooltipElement.textContent = content;
    tooltipElement.style.position = 'absolute';
    tooltipElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    tooltipElement.style.color = 'white';
    tooltipElement.style.padding = '5px';
    tooltipElement.style.borderRadius = '5px';
    tooltipElement.style.transform = `translate(-50%, -50%)`;

    const screenX = (position.x * window.innerWidth) / 2 + window.innerWidth / 2;
    const screenY = (-position.y * window.innerHeight) / 2 + window.innerHeight / 2;
    tooltipElement.style.left = `${screenX}px`;
    tooltipElement.style.top = `${screenY - 100}px`;

    //console.log('Tooltip element:', tooltipElement);

    document.body.appendChild(tooltipElement);
    tooltipRef.current = tooltipElement;

    return () => {
      if (tooltipRef.current) {
        document.body.removeChild(tooltipRef.current);
      }
    };
  }, [content, position]);

  return null;
};

export default Renderer;