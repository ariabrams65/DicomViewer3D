import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);


// STL Loader
const loader = new STLLoader();
function loadCallback(geometry) {
    const material = new THREE.MeshPhongMaterial({ color: 0x555555, specular: 0x111111, shininess: 200 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    camera.position.z = 300;
    camera.lookAt(mesh.position);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // this line is optional if you are animating the scene continuously
    animate();
}

//loader.load('/texture/output.stl', loadCallback);

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}

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
