import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const container = document.getElementById("hero3d");
const canvas = document.getElementById("hero3d-canvas");

if (container && canvas && window.WebGLRenderingContext) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.4, 9);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const keyLight = new THREE.DirectionalLight(0xffe1f0, 2.4);
  keyLight.position.set(5, 6, 8);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0x7b337e, 6, 30);
  fillLight.position.set(-6, -3, 4);
  scene.add(fillLight);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const palette = [0xf5d5e0, 0x7b337e, 0xffffff, 0xe3b9d3, 0x9c4a96];

  const geometries = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.TorusGeometry(0.85, 0.32, 24, 80),
    new RoundedBoxGeometry(1.5, 1.5, 1.5, 4, 0.18),
    new THREE.SphereGeometry(0.95, 48, 48),
    new THREE.OctahedronGeometry(1.05, 0),
    new THREE.CapsuleGeometry(0.5, 1, 8, 16),
  ];

  const layout = [
    { x: 3.6, y: 1.6, z: 0.5, s: 0.85 },
    { x: 5.4, y: -1.2, z: -0.6, s: 1.05 },
    { x: 1.6, y: -2.0, z: 0.8, s: 0.7 },
    { x: -4.6, y: 2.4, z: -1, s: 0.6 },
    { x: 4.6, y: 3.0, z: -0.8, s: 0.65 },
    { x: -2.4, y: -2.6, z: 0.4, s: 0.55 },
  ];

  const group = new THREE.Group();
  const meshes = [];

  layout.forEach((pos, i) => {
    const geometry = geometries[i % geometries.length];
    const color = palette[i % palette.length];
    const material = new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0,
      roughness: 0.08,
      transmission: 1,
      thickness: 1.2,
      ior: 1.4,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.1,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.scale.setScalar(pos.s);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.userData = {
      baseY: pos.y,
      speed: 0.4 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.25,
    };
    group.add(mesh);
    meshes.push(mesh);
  });

  scene.add(group);

  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  let scrollFactor = 0;
  window.addEventListener(
    "scroll",
    () => {
      scrollFactor = window.scrollY / Math.max(window.innerHeight, 1);
    },
    { passive: true }
  );

  const clock = new THREE.Clock();

  function renderFrame() {
    const t = clock.getElapsedTime();
    meshes.forEach((mesh) => {
      const { baseY, speed, phase, rotSpeed } = mesh.userData;
      mesh.position.y = baseY + Math.sin(t * speed + phase) * 0.35;
      mesh.rotation.x += rotSpeed * 0.01;
      mesh.rotation.y += rotSpeed * 0.015;
    });
    group.position.y = -scrollFactor * 1.4;
    group.rotation.y = scrollFactor * 0.2;
    renderer.render(scene, camera);
  }

  if (reduceMotion) {
    renderFrame();
  } else {
    renderer.setAnimationLoop(renderFrame);
  }
}
