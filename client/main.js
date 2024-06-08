import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';


let camera, scene, renderer, mesh, cssRenderer;
const keyState = {};
let isFormSubmitted = false;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let popupElement = null;
let lastIntersectionObject = null;
const modelMeshes = [];
const simplifiedMeshes = [];
init();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(0, 0, 50);

    // Scene setup
    scene = new THREE.Scene();

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1); // Adjust the position as needed
    scene.add(directionalLight);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Adjust intensity as needed
    scene.add(ambientLight);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, pixelRatio: window.devicePixelRatio });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xadd8e6)); // Light blue color
    container.appendChild(renderer.domElement);

    // CSS3DRenderer setup
    cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = '0';
    container.appendChild(cssRenderer.domElement);

    // Create a 3D object
    const element = document.createElement('div');
    element.style.width = '50px'; // Adjust the width of the square
    element.style.height = '50px'; // Adjust the height of the square
    element.style.background = 'red';
    const cssObject = new CSS3DObject(element);
    cssObject.position.set(0, 0, -100); // Adjust the position of the square along the z-axis
    cssObject.visible = false;
    scene.add(cssObject);

    // PointerLockControls setup
    const controls = new PointerLockControls(camera, document.body);
    document.addEventListener('click', () => {
        controls.lock();
    });

    // Event listeners for controls
    document.addEventListener('keydown', (event) => {
        keyState[event.code] = true;
    });
    document.addEventListener('keyup', (event) => {
        keyState[event.code] = false;
    });

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Handle file upload
    const form = document.getElementById('upload');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (isFormSubmitted) {
            console.log('Form is already submitted.');
            return;
        }

        console.log('Submitting form...');
        isFormSubmitted = true;
        const body = new FormData(form);

        try {
            const response = await fetch('/api/dicom', { method: "POST", body });
            if (response.ok) {
                const result = await response.json();
                console.log('Upload successful.');
                console.log('Response:', result);
                const modelID = result.modelId;
                loadModel(modelID);
            } else {
                console.error('Upload failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error occurred during upload:', error);
        } finally {
            isFormSubmitted = true;
        }
    });

    // Start the update loop
    animate();
}



function checkIntersection() {
    if (!mesh) return;
    const cameraPosition = camera.position.clone();

    let intersectedObject = null;
    mesh.traverse((child) => {
        if (child.isMesh) {
            const boundingBox = child.geometry.boundingBox.clone();
            boundingBox.applyMatrix4(child.matrixWorld);

            if (boundingBox.containsPoint(cameraPosition)) {
                intersectedObject = child;
            }
        }
    });

    if (intersectedObject !== lastIntersectionObject) {
        if (intersectedObject) {
            const info = intersectedObject.name || 'No additional information'; // Retrieve object information
            console.log('Camera inside:', intersectedObject.name, info); // Print information
            displayPopup(info); // Pass object information to the popup function
        } else {
            console.log('No intersection detected');
            hidePopup(); // Hide popup if no intersections
        }
        lastIntersectionObject = intersectedObject;
    }
}

// Define variables for popup handling


// Function to display popup with information
function displayPopup(info) {
    hidePopup(); // Hide any existing popup

    // Create a new popup HTML element
    const popupDiv = document.createElement('div');
    popupDiv.innerHTML = info; // Display information in the popup
    popupDiv.style.position = 'absolute';
    popupDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    popupDiv.style.padding = '10px';
    popupDiv.style.borderRadius = '5px';
    popupDiv.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    
    // Position the popup at the center of the screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 5;
    popupDiv.style.left = `${centerX}px`;
    popupDiv.style.top = `${centerY}px`;
    
    // Append the popup to the CSS3DRenderer DOM element
    cssRenderer.domElement.appendChild(popupDiv);

    // Update the global variable to reference the new popup element
    popupElement = popupDiv;
}

// Function to hide the popup
function hidePopup() {
    // If there's a currently displayed popup, remove it from the DOM
    if (popupElement) {
        popupElement.remove();
        popupElement = null; // Reset the global variable
    }
}



async function loadModel(modelID) {
    const gltfLoader = new GLTFLoader();
    gltfLoader.setPath(`/textures/${modelID}/`);
    gltfLoader.load('scene.gltf', (gltf) => {
        console.log("Uploading mesh", gltf.scene);
        const loadedScene = gltf.scene;
        console.log("Loaded Scene:", loadedScene);
        loadedScene.position.set(0, 0, 0);
        loadedScene.rotation.x = -Math.PI / 2;
        scene.add(loadedScene);
        
        mesh = loadedScene;
        mesh.scale.set(100, 100, 100);
        assignColorsToMeshes(mesh);
        setHighestGeometryTransparent(mesh);

        mesh.traverse((child) => {
            if (child.isMesh) {
                console.log("Mesh child:", child); // Log each mesh child
                child.geometry.computeBoundingBox();
                const simplifiedMesh = new THREE.Mesh(child.geometry.clone(), child.material.clone());
                simplifiedMeshes.push(simplifiedMesh);
            }
        });
        
        console.log('Fetching segment names...');
        fetch(`/textures/${modelID}/segment_names.txt`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch segment names');
                }
                return response.text();
            })
            .then(segmentNamesText => {
                console.log('Segment names fetched successfully:', segmentNamesText);
                const segmentNamesArray = segmentNamesText.trim().split('\n');
                console.log('Segment names array:', segmentNamesArray);
                let index = 0;
                mesh.traverse((child) => {
                    console.log('Checking mesh child:', child);
                    if (child.isMesh) {
                        console.log('Mesh child is a Mesh:', child);
                        const segmentName = segmentNamesArray[index];
                        child.name = segmentName;
                        index++;
                        console.log(`Assigned name '${segmentName}' to mesh child`);
                        modelMeshes.push(child);
                    } else {
                        console.log('Mesh child is not a Mesh:', child);
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching segment names:', error);
            });

        // Log model scale and position
        console.log("Model scale:", mesh.scale.x, mesh.scale.y, mesh.scale.z);
        console.log("Model position:", mesh.position.x, mesh.position.y, mesh.position.z);

        animate();
    }, undefined, (error) => {
        console.error('An error occurred while loading the model:', error);
    });
}

function assignColorsToMeshes(object) {
    object.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(Math.random() * 0xffffff),
                emissive: false,
                emissiveIntensity: 0,
                envMapIntensity: 0,
                flatShading: true,
            });
        }
    });
}

function setHighestGeometryTransparent(object) {
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
}

function animate() {
    requestAnimationFrame(animate);
    updateCameraPosition();
    scaleModel();
    
    // Update raycaster
    if (performance.now() % 20 === 0) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(modelMeshes, true);
    
        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            const info = intersectedObject.name || 'No additional information';
            displayPopup(info);
        } else {
            hidePopup();
        }
    }
    
    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);
    checkIntersection();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateCameraPosition() {
    if (!mesh) return;
    
    // Increase moveSpeed for faster movement
    const moveSpeed = 0.1; // Adjust this value to increase movement speed
    
    const distanceToModel = camera.position.distanceTo(mesh.position);
    if (distanceToModel < 0.001) {
        const moveDirection = new THREE.Vector3();
        camera.getWorldDirection(moveDirection);
        camera.position.add(moveDirection.multiplyScalar(0.001 - distanceToModel));
    }
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction).normalize();
    const right = new THREE.Vector3().crossVectors(direction, camera.up).normalize();
    let moveDirection = new THREE.Vector3(0, 0, 0);
    if (keyState['KeyW']) moveDirection.add(direction);
    if (keyState['KeyS']) moveDirection.sub(direction);
    if (keyState['KeyA']) moveDirection.sub(right);
    if (keyState['KeyD']) moveDirection.add(right);
    
    // Multiply moveDirection by moveSpeed directly
    camera.position.add(moveDirection.multiplyScalar(moveSpeed));
    
    // Adjust the speed for vertical movement
    if (keyState['Space']) camera.position.y += moveSpeed * 2; // Increase vertical speed
    if (keyState['ShiftLeft'] || keyState['ShiftRight']) camera.position.y -= moveSpeed * 2; // Increase vertical speed
}

function scaleModel() {
    if (!mesh) return;
    const distance = camera.position.distanceTo(mesh.position);
    const scaleFactor = 3 / distance;
    const finalScale = Math.max(0.1, scaleFactor);
    mesh.scale.set(finalScale, finalScale, finalScale);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
}
