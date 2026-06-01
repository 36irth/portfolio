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
    this.keycapGroup = null;
    this.needsEntrance = false;

    this._rafId = null;
    this._resizeHandler = null;
    this._touchHandler = null;
    this._clickHandler = null;

    this._pressCallback = null;
    this._wrongKeyCallback = null;
    this._completionCallback = null;
    this._entranceCallback = null;

    this._init();
  }

  _init() {
    this._setupRenderer();
    this._setupScene();
    this._setupCamera();
    this._setupLighting();
    this._createKeycaps();
    this._setupResize();
    this._setupTouchRaycast();
    this._startLoop();
    this.needsEntrance = true;
  }

  _getRenderPixelRatio(width, height) {
    const dpr = window.devicePixelRatio || 1;
    const maxPixels = 760000;
    const areaRatio = Math.sqrt(maxPixels / Math.max(width * height, 1));
    return Math.max(0.68, Math.min(dpr, areaRatio, 0.9));
  }

  _setupRenderer() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });

    renderer.setSize(width, height, false);
    renderer.setPixelRatio(this._getRenderPixelRatio(width, height));
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.setClearColor(new THREE.Color(SCENE.bg), 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.renderer = renderer;
  }

  _setupScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(SCENE.bg);
    this.scene = scene;
    this.ground = null;
  }

  _getCameraFov(width, height) {
    const mobile = width < 600;
    const aspect = width / height;

    if (mobile) {
      const halfW = (3 * SCENE.mobileSpacing / 2) * 1.22;
      const dist = Math.sqrt(5.5 ** 2 + 6.0 ** 2);
      const hHalf = Math.atan(halfW / dist);
      return Math.max(60, Math.min(82,
        2 * Math.atan(Math.tan(hHalf) / aspect) * (180 / Math.PI),
      ));
    }

    const baseHFOVTan = Math.tan((SCENE.cameraFov / 2) * (Math.PI / 180)) * 1.78;
    return Math.max(36, Math.min(78,
      2 * Math.atan(baseHFOVTan / aspect) * (180 / Math.PI),
    ));
  }

  _setupCamera() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const mobile = width < 600;
    const aspect = width / height;

    const camera = new THREE.PerspectiveCamera(this._getCameraFov(width, height), aspect, 0.1, 200);
    camera.position.set(0, mobile ? 5.5 : SCENE.cameraY, mobile ? 6.0 : SCENE.cameraZ);
    camera.lookAt(0, 0, 0);
    this.camera = camera;
  }

  _setupLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.34);
    this.scene.add(ambient);

    const key = new THREE.DirectionalLight(0xFFFAF0, 2.45);
    key.position.set(-5, 9, 6);
    key.castShadow = false;
    key.shadow.mapSize.set(512, 512);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 40;
    key.shadow.camera.left = -12;
    key.shadow.camera.right = 12;
    key.shadow.camera.top = 10;
    key.shadow.camera.bottom = -10;
    key.shadow.bias = -0.0005;
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xFFD8A0, 0.78);
    fill.position.set(6, 2, 3);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight(0xC8D8FF, 0.42);
    rim.position.set(-3, -1, -6);
    this.scene.add(rim);

    const point = new THREE.PointLight(0xFFEED8, 0.58, 25);
    point.position.set(0, 7, 1);
    this.scene.add(point);

    const switchLight = new THREE.PointLight(0x7FDBFF, 0, 9);
    switchLight.position.set(0, -0.8, 0);
    this.scene.add(switchLight);
    this.switchLight = switchLight;

    this.lights = { ambient, key, fill, rim, point, switchLight };
  }

  _createKeycaps() {
    const mobile = window.innerWidth < 600;
    const group = new THREE.Group();
    this.keycapGroup = group;
    this.scene.add(group);

    if (mobile) {
      const rowY = [1.2, -1.0];
      const splits = [2, 3];
      let globalIdx = 0;

      splits.forEach((count, row) => {
        const rowWidth = (count - 1) * SCENE.mobileSpacing;
        for (let i = 0; i < count; i += 1) {
          const cfg = KEYCAP_CONFIGS[globalIdx];
          if (!cfg) return;

          const keycap = createKeycap(cfg, globalIdx);
          const x = -rowWidth / 2 + i * SCENE.mobileSpacing;
          const y = rowY[row];
          keycap.position.set(x, y, 0);
          keycap.userData.restY = y;

          if (row === 1 && keycap.userData.housing) {
            keycap.userData.housing.visible = false;
          }

          this.keycaps.push(keycap);
          group.add(keycap);
          globalIdx += 1;
        }
      });

      group.position.set(0, SCENE.mobileGroupOffsetY, 0);
      return;
    }

    const totalWidth = (KEYCAP_CONFIGS.length - 1) * SCENE.spacing;
    const centerIndex = (KEYCAP_CONFIGS.length - 1) / 2;

    KEYCAP_CONFIGS.forEach((cfg, i) => {
      const keycap = createKeycap(cfg, i);
      const x = -totalWidth / 2 + i * SCENE.spacing + SCENE.desktopOffsetX;
      const z = (i - centerIndex) * SCENE.desktopDepthStep + SCENE.desktopOffsetZ;
      const y = SCENE.desktopOffsetY;
      keycap.position.set(x, y, z);
      keycap.rotation.x = SCENE.desktopKeyRotationX || 0;
      keycap.rotation.y = SCENE.desktopKeyRotationY;
      keycap.userData.restY = y;
      this.keycaps.push(keycap);
      group.add(keycap);
    });
  }

  getKeycapScreenPos(keycap) {
    const worldPosition = new THREE.Vector3();
    keycap.getWorldPosition(worldPosition);
    worldPosition.y -= 0.25;
    worldPosition.project(this.camera);

    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      x: Math.round((worldPosition.x * 0.5 + 0.5) * w),
      y: Math.round((worldPosition.y * -0.5 + 0.5) * h),
    };
  }

  _setupTouchRaycast() {
    this._clickHandler = (e) => {
      const keycap = this._getKeycapAtPoint(e.clientX, e.clientY);
      if (keycap) this.handleKey(keycap.userData.letter.toLowerCase());
    };

    this._touchHandler = (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      if (!touch) return;
      const keycap = this._getKeycapAtPoint(touch.clientX, touch.clientY);
      if (keycap) this.handleKey(keycap.userData.letter.toLowerCase());
    };

    this.canvas.addEventListener('click', this._clickHandler);
    this.canvas.addEventListener('touchend', this._touchHandler, { passive: false });
  }

  _getKeycapAtPoint(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);

    const meshes = [];
    this.keycaps.forEach((group) => {
      group.traverse((obj) => {
        if (obj.isMesh) meshes.push(obj);
      });
    });

    const hits = raycaster.intersectObjects(meshes, false);
    if (!hits.length) return null;

    let obj = hits[0].object;
    while (obj && !obj.userData.letter) obj = obj.parent;
    return obj?.userData.letter ? obj : null;
  }

  setCharacterFocus() {
    if (this.switchLight) {
      gsap.killTweensOf(this.switchLight);
      this.switchLight.intensity = 0;
    }

    this.keycaps.forEach((keycap, index) => {
      gsap.killTweensOf(keycap.position);
      if (index === 0) {
        keycap.visible = true;
        keycap.traverse((obj) => {
          obj.visible = true;
        });
        return;
      }

      keycap.visible = false;
      keycap.position.x += 40;
      keycap.traverse((obj) => {
        obj.visible = false;
      });
    });
  }

  handleKey(key) {
    if (this.isCompleted) return;
    const expected = SEQUENCE[this.currentIndex];
    const pressed = (key || '').toLowerCase();

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
      }, 160);
    }
  }

  setAnimationCallbacks({ onPress, onWrongKey, onCompletion, onEntrance } = {}) {
    if (onPress) this._pressCallback = onPress;
    if (onWrongKey) this._wrongKeyCallback = onWrongKey;
    if (onCompletion) this._completionCallback = onCompletion;
    if (onEntrance) this._entranceCallback = onEntrance;

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
      const width = window.innerWidth;
      const height = window.innerHeight;
      const mobile = width < 600;
      const aspect = width / height;

      if (!mobile) {
        this.camera.fov = this._getCameraFov(width, height);
      }

      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
      this.renderer.setPixelRatio(this._getRenderPixelRatio(width, height));
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
    if (this._clickHandler) {
      this.canvas.removeEventListener('click', this._clickHandler);
      this._clickHandler = null;
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
            mat.forEach((m) => {
              m.map?.dispose?.();
              m.dispose?.();
            });
          } else if (mat) {
            mat.map?.dispose?.();
            mat.dispose?.();
          }
        }
      });
    }
    this.keycaps = [];

    if (this.keycapGroup) {
      this.scene.remove(this.keycapGroup);
      this.keycapGroup = null;
    }

    if (this.ground) {
      this.ground.geometry?.dispose?.();
      this.ground.material?.dispose?.();
    }

    this.renderer?.dispose?.();
  }
}
