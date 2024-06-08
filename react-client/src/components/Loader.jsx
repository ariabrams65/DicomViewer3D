import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function Loader({ modelID, onLoad }) {
  const gltf = useLoader(GLTFLoader, `/textures/${modelID}/scene.gltf`);
  const [mesh, setMesh] = useState(null);

  useEffect(() => {
    setMesh(gltf.scene);
    onLoad(gltf.scene); // Notify parent when model is loaded
  }, [gltf, onLoad]);

  useEffect(() => {
    if (mesh) {
      processModel(mesh);
    }
  }, [mesh]);

  const processModel = (model) => {
    smoothMeshes(model);
    assignColorsToMeshes(model);
    setHighestGeometryTransparent(model);
    fetchSegmentNames(modelID)
      .then(segmentNames => {
        assignSegmentNames(model, segmentNames);
      })
      .catch(error => {
        console.error('Error fetching segment names:', error);
      });
  };

  const fetchSegmentNames = async (modelID) => {
    const response = await fetch(`/textures/${modelID}/segment_names.txt`);
    if (!response.ok) {
      throw new Error('Failed to fetch segment names');
    }
    const segmentNamesText = await response.text();
    return segmentNamesText.trim().split('\n');
  };

  const assignColorsToMeshes = (object) => {
    object.traverse((child) => {
      if (child.isMesh) {
        const minColorValue = 0.2;
        const colorize = new THREE.Color(
          minColorValue + Math.random() * (1 - minColorValue),
          minColorValue + Math.random() * (1 - minColorValue),
          minColorValue + Math.random() * (1 - minColorValue)
        );
        child.material = new THREE.MeshStandardMaterial({
          color: colorize,
          emissive: false,
          emissiveIntensity: 0,
          envMapIntensity: 0,
          flatShading: true,
        });
      }
    });
  };

  const setHighestGeometryTransparent = (object) => {
    let highestGeometryMesh = null;
    let maxYBound = -Infinity;

    object.traverse((child) => {
      if (child.isMesh) {
        const boundingBox = new THREE.Box3().setFromObject(child);
        const childMaxYBound = boundingBox.max.y;
        
        if (childMaxYBound > maxYBound) {
          maxYBound = childMaxYBound;
          highestGeometryMesh = child;
        }
      }
    });

    if (highestGeometryMesh) {
      highestGeometryMesh.material.transparent = true;
      highestGeometryMesh.material.opacity = 0.3;
    }
  };

  const assignSegmentNames = (object, segmentNames) => {
    let index = 0;
    object.traverse((child) => {
      if (child.isMesh) {
        const segmentName = segmentNames[index];
        child.name = segmentName;
        index++;
      }
    });
  };

  const smoothMeshes = (object) => {
    object.traverse((child) => {
      if (child.isMesh) {
        const geometry = child.geometry.clone();
        laplacianSmooth(geometry, 10);  // Adjust the number of iterations as needed
        child.geometry = geometry;
      }
    });
  };

  const laplacianSmooth = (geometry, iterations) => {
    const positions = geometry.attributes.position.array;
    const vertexCount = positions.length / 3;
    const neighborMap = new Map();

    // Build neighbor map
    for (let i = 0; i < geometry.index.array.length; i += 3) {
      const a = geometry.index.array[i];
      const b = geometry.index.array[i + 1];
      const c = geometry.index.array[i + 2];

      if (!neighborMap.has(a)) neighborMap.set(a, new Set());
      if (!neighborMap.has(b)) neighborMap.set(b, new Set());
      if (!neighborMap.has(c)) neighborMap.set(c, new Set());

      neighborMap.get(a).add(b).add(c);
      neighborMap.get(b).add(a).add(c);
      neighborMap.get(c).add(a).add(b);
    }

    for (let iter = 0; iter < iterations; iter++) {
      const newPositions = positions.slice();
      for (let i = 0; i < vertexCount; i++) {
        const neighbors = Array.from(neighborMap.get(i));
        const x = positions[i * 3];
        const y = positions[i * 3 + 1];
        const z = positions[i * 3 + 2];
        let nx = 0, ny = 0, nz = 0;

        neighbors.forEach((j) => {
          nx += positions[j * 3];
          ny += positions[j * 3 + 1];
          nz += positions[j * 3 + 2];
        });

        nx /= neighbors.length;
        ny /= neighbors.length;
        nz /= neighbors.length;

        newPositions[i * 3] = nx;
        newPositions[i * 3 + 1] = ny;
        newPositions[i * 3 + 2] = nz;
      }
      positions.set(newPositions);
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
  };

  return mesh ? ( 
    <primitive object={mesh} position={[0, 0, 0]} rotation-x={-Math.PI / 2} />
  ) : null;
}

export default Loader;