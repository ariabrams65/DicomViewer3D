import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const loader = new STLLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(1, 7, 11);
camera.lookAt(0, 2, 0);

// Lighting
const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(500, 500, 500);
directionalLight.castShadow = true;
scene.add(directionalLight)

const controls = new OrbitControls(camera, renderer.domElement);

let mesh = null;

function loadCallback(geometry) {
    if (mesh) {
        scene.remove(mesh);

        //not sure if this is needed
        mesh.geometry.dispose();
        mesh.material.dispose();
    }
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff});
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    camera.lookAt(mesh.position);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update()
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
