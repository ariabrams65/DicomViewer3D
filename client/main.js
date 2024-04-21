import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

camera.position.set(1, 7, 11);
camera.lookAt(0, 2, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDisance = 5;
controls.minPolarAngle = 0.25;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide,
});

const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(groundMesh);

const spotLight = new THREE.SpotLight(0xffffff, 1000, 100, 0.2, 0.5);
spotLight.position.set(0, 20, 0);
scene.add(spotLight);

const loader = new GLTFLoader().setPath("texture/");
loader.load("output_4.gltf", (gltf) => {
  const mesh = gltf.scene;
  mesh.position.set(0, 3.5, 0);
  mesh.rotateX(300);
  scene.add(mesh);

  // Compute the bounding box after adding the model to the scene
  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  box.getSize(size);

  console.log("Size of the mesh:", size);
  console.log("Width:", size.x);
  console.log("Height:", size.y);
  console.log("Depth:", size.z);

  // Adjust the model's scale if it's too large or too small
  const desiredSize = 7; // Change this value to the desired size
  const scaleFactor = desiredSize / size.length(); // Compute a scale factor
  mesh.scale.multiplyScalar(scaleFactor); // Apply the scale transformation
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
