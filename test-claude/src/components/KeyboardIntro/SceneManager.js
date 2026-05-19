import * as THREE from 'three';
import gsap from 'gsap';
import { SCENE, KEYCAP_CONFIGS, SEQUENCE } from './constants';
import { createKeycap } from './Keycap';

export class SceneManager {
  constructor(canvas, { onComplete, onProgress } = {}) {
    this.canvas = canvas;
    this.onComplete = onComplete;
    this.onProgress = onProgress;

    this.currentIndex = 0;
    this.isCompleted = false;
    this.keycaps = [];
    this.needsEntrance = false;

    this._rafId = null;
    this._resizeHandler = null;
    this._touchHandler = null;

    this._pressCallback = null;
    this._wrongKeyCallback = null;
    this._completionCallback = null;
    this._entranceCallback = null;

    this._init();
  }

  _init() {
    try {
      this._setupRenderer();
      this._setupScene();
      this._setupCamera();
      this._setupLighting();
      this._createKeycaps();
      this._setupResize();
      this._setupTouchRaycast();
      this._startLoop();
      this.needsEntrance = true;
    } catch (err) {
      throw err;
    }
  }

  _setupRenderer() {
    const width  = window.innerWidth;
    const height = window.innerHeight;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: false });
    } catch (err) {
      throw err;
    }

    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setClearColor(new THREE.Color(SCENE.bg), 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.renderer = renderer;
  }

  _setupScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(SCENE.bg);

    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.1;
    ground.receiveShadow = true;
    scene.add(ground);

    this.scene = scene;
    this.ground = ground;
  }

  _setupCamera() {
    const width  = window.innerWidth;
    const height = window.innerHeight;
    const mobile = width < 600;
    const aspect = width / height;

    let fov;
    if (mobile) {
      // 모바일: 4-key 행 기준 동적 FOV
      const halfW  = (3 * SCENE.mobileSpacing / 2) * 1.22;
      const dist   = Math.sqrt(5.5 ** 2 + 6.0 ** 2);
      const hHalf  = Math.atan(halfW / dist);
      fov = Math.max(60, Math.min(82,
        2 * Math.atan(Math.tan(hHalf) / aspect) * (180 / Math.PI),
      ));
    } else {
      const baseHFOVTan = Math.tan((SCENE.cameraFov / 2) * (Math.PI / 180)) * 1.78;
      fov = Math.max(36, Math.min(78,
        2 * Math.atan(baseHFOVTan / aspect) * (180 / Math.PI),
      ));
    }

    const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 200);
    camera.position.set(0, mobile ? 5.5 : SCENE.cameraY, mobile ? 6.0 : SCENE.cameraZ);
    camera.lookAt(0, 0, 0);
    this.camera = camera;
  }

  _setupLighting() {
    // 전체 베이스 밝기
    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(ambient);

    // 메인 키 라이트 — 위 좌측에서 따뜻한 빛
    const key = new THREE.DirectionalLight(0xFFFAF0, 3.2);
    key.position.set(-5, 9, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far  = 40;
    key.shadow.camera.left   = -12;
    key.shadow.camera.right  =  12;
    key.shadow.camera.top    =  10;
    key.shadow.camera.bottom = -10;
    key.shadow.bias = -0.0005;
    this.scene.add(key);

    // 필 라이트 — 앰버 워밍
    const fill = new THREE.DirectionalLight(0xFFD8A0, 1.1);
    fill.position.set(6, 2, 3);
    this.scene.add(fill);

    // 림 라이트 — 뒤쪽 푸른 반사 (엣지 분리감)
    const rim = new THREE.DirectionalLight(0xC8D8FF, 0.55);
    rim.position.set(-3, -1, -6);
    this.scene.add(rim);

    // 상단 포인트 라이트
    const point = new THREE.PointLight(0xFFEED8, 0.9, 25);
    point.position.set(0, 7, 1);
    this.scene.add(point);

    // 현재 키 아래 언더글로우 — startNextHighlight 에서 이동/펄스
    const switchLight = new THREE.PointLight(0xFF6010, 0, 9);
    switchLight.position.set(0, -0.8, 0);
    this.scene.add(switchLight);
    this.switchLight = switchLight;

    this.lights = { ambient, key, fill, rim, point, switchLight };
  }

  _createKeycaps() {
    const mobile = window.innerWidth < 600;

    if (mobile) {
      // 모바일: yul(3개) 윗줄 + ssem(4개) 아랫줄
      const rowY   = [1.2, -1.0];
      const splits = [3, 4];
      let globalIdx = 0;
      splits.forEach((count, row) => {
        const rowWidth = (count - 1) * SCENE.mobileSpacing;
        for (let i = 0; i < count; i++) {
          const cfg    = KEYCAP_CONFIGS[globalIdx];
          const keycap = createKeycap(cfg, globalIdx);
          const x      = -rowWidth / 2 + i * SCENE.mobileSpacing;
          const y      = rowY[row];
          keycap.position.set(x, y, 0);
          keycap.userData.restY = y;
          // 아랫줄 housing은 ground 클리핑으로 숨김
          if (row === 1 && keycap.userData.housing) {
            keycap.userData.housing.visible = false;
          }
          this.keycaps.push(keycap);
          this.scene.add(keycap);
          globalIdx++;
        }
      });
    } else {
      // 데스크톱: 한 줄
      const totalWidth = (KEYCAP_CONFIGS.length - 1) * SCENE.spacing;
      KEYCAP_CONFIGS.forEach((cfg, i) => {
        const keycap = createKeycap(cfg, i);
        const x      = -totalWidth / 2 + i * SCENE.spacing + SCENE.desktopOffsetX;
        keycap.position.set(x, SCENE.desktopOffsetY, 0);
        keycap.userData.restY = SCENE.desktopOffsetY;
        this.keycaps.push(keycap);
        this.scene.add(keycap);
      });
    }
  }

  // 키캡 월드 좌표 → 스크린 픽셀 좌표 변환
  getKeycapScreenPos(keycap) {
    const pos = new THREE.Vector3(
      keycap.position.x,
      keycap.userData.restY - 0.25,  // 키캡 아래쪽
      0,
    );
    pos.project(this.camera);
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      x: Math.round((pos.x *  0.5 + 0.5) * w),
      y: Math.round((pos.y * -0.5 + 0.5) * h),
    };
  }

  // ── 터치 탭으로 3D 키캡 직접 입력 ──────────────────────────
  _setupTouchRaycast() {
    this._touchHandler = (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      if (!touch) return;
      const keycap = this._getKeycapAtPoint(touch.clientX, touch.clientY);
      if (keycap) this.handleKey(keycap.userData.letter.toLowerCase());
    };
    this.canvas.addEventListener('touchend', this._touchHandler, { passive: false });
  }

  _getKeycapAtPoint(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x =  ((clientX - rect.left) / rect.width)  * 2 - 1;
    const y = -((clientY - rect.top)  / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);

    const meshes = [];
    this.keycaps.forEach((group) => {
      group.traverse((obj) => { if (obj.isMesh) meshes.push(obj); });
    });

    const hits = raycaster.intersectObjects(meshes, false);
    if (!hits.length) return null;

    let obj = hits[0].object;
    while (obj && !obj.userData.letter) obj = obj.parent;
    return obj?.userData.letter ? obj : null;
  }

  handleKey(key) {
    if (this.isCompleted) return;
    const expected = SEQUENCE[this.currentIndex];
    const pressed  = (key || '').toLowerCase();

    if (pressed !== expected) {
      this._wrongKeyCallback?.(this.currentIndex);
      return;
    }

    const keycap = this.keycaps[this.currentIndex];
    this.currentIndex += 1;
    this.onProgress?.(this.currentIndex);
    this._pressCallback?.(keycap);

    if (this.currentIndex >= SEQUENCE.length) {
      this.isCompleted = true;
      setTimeout(() => {
        this._completionCallback?.();
        this.onComplete?.();
      }, 500);
    }
  }

  setAnimationCallbacks({ onPress, onWrongKey, onCompletion, onEntrance } = {}) {
    if (onPress)      this._pressCallback      = onPress;
    if (onWrongKey)   this._wrongKeyCallback   = onWrongKey;
    if (onCompletion) this._completionCallback = onCompletion;
    if (onEntrance)   this._entranceCallback   = onEntrance;

    if (this.needsEntrance && this._entranceCallback) {
      this.needsEntrance = false;
      this._entranceCallback(this.keycaps);
    }
  }

  _startLoop() {
    const tick = () => {
      this._rafId = requestAnimationFrame(tick);
      this.renderer.render(this.scene, this.camera);
    };
    this._rafId = requestAnimationFrame(tick);
  }

  _setupResize() {
    this._resizeHandler = () => {
      const width  = window.innerWidth;
      const height = window.innerHeight;
      const mobile = width < 600;
      const aspect = width / height;

      if (!mobile) {
        const baseHFOVTan = Math.tan((SCENE.cameraFov / 2) * (Math.PI / 180)) * 1.78;
        this.camera.fov = Math.max(36, Math.min(78,
          2 * Math.atan(baseHFOVTan / aspect) * (180 / Math.PI),
        ));
      }

      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
    };
    window.addEventListener('resize', this._resizeHandler);
  }

  destroy() {
    if (this._rafId != null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
      this._resizeHandler = null;
    }
    if (this._touchHandler) {
      this.canvas.removeEventListener('touchend', this._touchHandler);
      this._touchHandler = null;
    }

    gsap.killTweensOf(this.keycaps.map((k) => k.position));
    gsap.killTweensOf(this.keycaps.map((k) => k.userData.housingMat).filter(Boolean));
    gsap.killTweensOf(this.keycaps.map((k) => k.userData.glowSpriteMat).filter(Boolean));
    if (this.switchLight) gsap.killTweensOf(this.switchLight);

    for (const keycap of this.keycaps) {
      keycap.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose?.();
          const mat = obj.material;
          if (Array.isArray(mat)) {
            mat.forEach((m) => { m.map?.dispose?.(); m.dispose?.(); });
          } else if (mat) {
            mat.map?.dispose?.();
            mat.dispose?.();
          }
        }
      });
      this.scene.remove(keycap);
    }
    this.keycaps = [];

    if (this.ground) {
      this.ground.geometry?.dispose?.();
      this.ground.material?.dispose?.();
    }

    this.renderer?.dispose?.();
  }
}
