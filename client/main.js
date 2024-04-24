import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const loader = new STLLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
    camera.position.set(0, 0, 100); // Example initial position (adjust as needed)

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    updateCameraPosition();
    scaleModel();
    renderer.render(scene, camera);
}

// Key bindings for first-person controls
const keyState = {};
document.addEventListener('keydown', (event) => {
    keyState[event.code] = true;
});
document.addEventListener('keyup', (event) => {
    keyState[event.code] = false;
});

const minMoveSpeed = 0.1; // Minimum movement speed
const maxMoveSpeed = 0.05; // Maximum movement speed

function updateCameraPosition() {
    // Create a direction vector from the camera's rotation
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    // Normalize the direction vector to ensure consistent movement speed
    direction.normalize();

    // Calculate the right direction relative to the camera's rotation
    const right = new THREE.Vector3();
    right.crossVectors(direction, camera.up).normalize();

    // Calculate the distance between the camera and the model
    const distance = camera.position.distanceTo(mesh.position);

    // Calculate the movement speed based on the distance
    const moveSpeed = THREE.MathUtils.clamp(1 / distance, minMoveSpeed, maxMoveSpeed);

    // Move camera based on key input along global axes
    if (keyState['KeyW']) {
        camera.position.add(direction.multiplyScalar(moveSpeed));
    }
    if (keyState['KeyS']) {
        camera.position.add(direction.multiplyScalar(-moveSpeed));
    }
    if (keyState['KeyA']) {
        camera.position.add(right.multiplyScalar(-moveSpeed));
    }
    if (keyState['KeyD']) {
        camera.position.add(right.multiplyScalar(moveSpeed));
    }
}

document.addEventListener('click', () => {
    controls.lock();
});

const form = document.getElementById('upload');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('here');
    const body = new FormData(form);

    const response = await fetch(
        '/api/upload',
        { method: "POST", body }
    );
    loader.load('/texture/output.stl', loadCallback);
});

// Function to scale the model based on camera distance
function scaleModel() {
    if (!mesh) return;

    // Calculate the distance between the camera and the model
    const distance = camera.position.distanceTo(mesh.position);

    // Calculate the scaling factor based on the inverse of the distance
    const scaleFactor = 1 / distance; // Adjust the scaling factor as needed

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