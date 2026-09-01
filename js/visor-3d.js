import * as THREE from 'three';
import { GLTFLoader } from '/lib/three/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '/lib/three/jsm/loaders/DRACOLoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/lib/three/jsm/libs/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

function initViewer(container) {
  const modelUrl = container.dataset.modelo3d;
  if (!modelUrl) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.01,
    100
  );
  camera.position.set(0, 0, 0.55);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
  keyLight.position.set(1, 1, 2);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
  fillLight.position.set(-1, 0.5, -1);
  scene.add(fillLight);

  const rotationGroup = new THREE.Group();
  scene.add(rotationGroup);
  const rotateSpeed = 0.5; // radians per second

  loader.load(
    modelUrl,
    (gltf) => {
      const model = gltf.scene;

      const rawSize = new THREE.Vector3();
      new THREE.Box3().setFromObject(model).getSize(rawSize);

      // the model spins around y, so its worst-case horizontal footprint
      // is the diagonal of its x/z extents, not just whichever is larger
      const verticalExtent = rawSize.y;
      const horizontalExtent = Math.sqrt(
        rawSize.x * rawSize.x + rawSize.z * rawSize.z
      );

      const cameraDistance = camera.position.z;
      const vFov = THREE.MathUtils.degToRad(camera.fov);
      const visibleHeight = 2 * Math.tan(vFov / 2) * cameraDistance;
      const visibleWidth = visibleHeight * camera.aspect;

      const margin = 0.75; // keep breathing room so nothing touches the edges
      const scale = Math.min(
        (visibleHeight * margin) / verticalExtent,
        (visibleWidth * margin) / horizontalExtent
      );
      model.scale.setScalar(scale);

      // recompute the box now that scale is applied, so the center used for
      // centering is in the same (post-scale) units as position
      const center = new THREE.Vector3();
      new THREE.Box3().setFromObject(model).getCenter(center);
      model.position.sub(center);

      rotationGroup.add(model);
      container.classList.add('is-loaded');
    },
    undefined,
    (error) => {
      console.error('no se pudo cargar el modelo 3D:', error);
      container.classList.add('has-error');
    }
  );

  function onResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize);

  let lastTime = performance.now();

  function animate(now) {
    requestAnimationFrame(animate);
    const delta = (now - lastTime) / 1000;
    lastTime = now;
    rotationGroup.rotation.y += rotateSpeed * delta;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
}

function initAllViewers() {
  document.querySelectorAll('[data-modelo3d]').forEach(initViewer);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllViewers);
} else {
  initAllViewers();
}

// render.js builds persona cards asynchronously after fetching the yaml,
// so also watch the DOM for viewers added after the initial page load
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType !== 1) return;
      if (node.matches?.('[data-modelo3d]')) initViewer(node);
      node.querySelectorAll?.('[data-modelo3d]').forEach(initViewer);
    });
  }
});
observer.observe(document.body, { childList: true, subtree: true });
