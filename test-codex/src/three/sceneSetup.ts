import * as THREE from "three";

export function createRenderer(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // 전체 렌더 밝기입니다. 낮추면 더 무드있고, 높이면 더 밝은 제품 조명처럼 보입니다.
  renderer.toneMappingExposure = 1.06;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  return renderer;
}

export function disposeRenderer(renderer: THREE.WebGLRenderer) {
  renderer.dispose();
}

export function createCamera() {
  // 기본 카메라입니다. 실제 화면에서는 KeycapIntro가 캔버스 크기에 맞춰 다시 조정합니다.
  // FOV를 낮추면 줌인되고, 높이면 더 넓게 보이면서 원근감이 강해집니다.
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 8.1, 4.2);
  camera.lookAt(0, 0.18, 0);
  return camera;
}

export function addStudioLighting(scene: THREE.Scene) {
  // 스튜디오 조명 설정입니다. keyLight는 광택 하이라이트, rimLight는 파란 가장자리 빛을 만듭니다.
  const ambient = new THREE.HemisphereLight("#dfeaff", "#050914", 0.88);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight("#f7fbff", 3.65);
  keyLight.position.set(-3.8, 6.2, 4.6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 16;
  keyLight.shadow.camera.left = -7;
  keyLight.shadow.camera.right = 7;
  keyLight.shadow.camera.top = 7;
  keyLight.shadow.camera.bottom = -7;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight("#6fa2ff", 3.05);
  rimLight.position.set(4.5, 3.2, -4.4);
  scene.add(rimLight);

  const accent = new THREE.PointLight("#2f83ff", 1.65, 8);
  accent.position.set(2.4, 0.9, 2.2);
  scene.add(accent);

  return { ambient, keyLight, rimLight, accent };
}
