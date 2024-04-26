import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const loader = new STLLoader();

const scene = new THREE.Scene();
const nearClippingDistance = 0.01; // Adjust as needed
const farClippingDistance = 1000; // Adjust as needed
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, nearClippingDistance, farClippingDistance);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Set initial camera position and rotation
camera.position.set(0, 0, 0);
camera.rotation.set(0, 0, 0);

// Lighting
const directionalLight = new THREE.DirectionalLight(0xffffff); // Change light color to white
directionalLight.position.set(500, 500, 500);
scene.add(directionalLight);

// Set ambient light to brighten up the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Adjust intensity as needed
scene.add(ambientLight);

// Set background color to light blue
renderer.setClearColor(new THREE.Color(0xadd8e6)); // Light blue color

// Controls
const controls = new PointerLockControls(camera, document.body);

let mesh = null;

function loadCallback(geometry) {
    if (mesh) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
    }
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Set camera to an initial position
    camera.position.set(0, 0, 50); // Example initial position (adjust as needed)

    animate();
}

function animate() {
    try {
        requestAnimationFrame(animate);
        updateCameraPosition();
        scaleModel();
        renderer.render(scene, camera);
    } catch (error) {
        console.error("An error occurred:", error);
        
    }
}

// Key bindings for first-person controls
const keyState = {};
document.addEventListener('keydown', (event) => {
    keyState[event.code] = true;
});
document.addEventListener('keyup', (event) => {
    keyState[event.code] = false;
});

const minMoveSpeed = 0.04; // Minimum movement speed
const maxMoveSpeed = 0.05; // Maximum movement speed
const minDistanceToModel = 0.001;

function updateCameraPosition() {

    const distanceToModel = camera.position.distanceTo(mesh.position);
    if (distanceToModel < minDistanceToModel) {
        const moveDirection = new THREE.Vector3();
        camera.getWorldDirection(moveDirection);
        camera.position.add(moveDirection.multiplyScalar(minDistanceToModel - distanceToModel));
    }
    // Create a direction vector from the camera's rotation
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    // Normalize the direction vector to ensure consistent movement speed
    direction.normalize();

    // Calculate the right direction relative to the camera's rotation
    const right = new THREE.Vector3();
    right.crossVectors(direction, camera.up).normalize();

    // Calculate the movement speed based on the distance
    const moveSpeed = THREE.MathUtils.clamp(1 / camera.position.distanceTo(mesh.position), minMoveSpeed, maxMoveSpeed);

    // Move camera based on key input along global axes
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

    // Apply movement direction
    camera.position.add(moveDirection.multiplyScalar(moveSpeed));

    // Move camera up and down
    if (keyState['Space']) { 
        camera.position.y += moveSpeed;
    }
    if (keyState['ShiftLeft'] || keyState['ShiftRight']) { 
        camera.position.y -= moveSpeed;
    }

}

document.addEventListener('click', () => {
    controls.lock();
});

let isFormSubmitted = false; 

const form = document.getElementById('upload');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Check if form is already submitted
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
            console.log('Upload successful.');
            loader.load('/texture/output.stl', loadCallback);
        } else {
            console.error('Upload failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error occurred during upload:', error);
    } finally {
        isFormSubmitted = true;
    }
});





// Function to scale the model based on camera distance
function scaleModel() {
    if (!mesh) return;

    // Calculate the distance between the camera and the model
    const distance = camera.position.distanceTo(mesh.position);

    // Calculate the scaling factor based on the inverse of the distance
    const scaleFactor = 3 / distance; // Adjust the scaling factor as needed

    // Set a minimum scale to prevent the model from disappearing
    const minScale = 0.1;
    const finalScale = Math.max(minScale, scaleFactor);

    // Apply the scaling factor to the model
    mesh.scale.set(finalScale, finalScale, finalScale);

    // Disable shadows for the model
    mesh.castShadow = false;
    mesh.receiveShadow = false;
}

// Start the update loop
animate();
