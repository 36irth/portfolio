import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { KEYCAP_CONFIGS, SCENE } from '../components/KeyboardIntro/constants';

function makeGlassTexture() {
  const size = 96;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const wave = Math.sin(x * 0.1) * 8 + Math.cos(y * 0.08) * 7;
      const grain = ((x * 11 + y * 19 + ((x * y) % 31)) % 19) - 9;
      const value = Math.max(0, Math.min(255, 136 + wave + grain));
      imageData.data[i] = value;
      imageData.data[i + 1] = value;
      imageData.data[i + 2] = value;
      imageData.data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.4, 1.4);
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

function makeSpring(radius, height, turns) {
  const points = [];
  const steps = 72;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI * 2 * turns;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      (t - 0.5) * height,
      Math.sin(angle) * radius,
    ));
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 72, 0.014, 6, false);
}

function setExploded(parts, exploded) {
  const targets = exploded
    ? {
      cap: { y: 1.65, rz: -0.08 },
      stem: { y: 0.22, rz: 0 },
      spring: { y: -0.16, rz: 0 },
      switch: { y: -0.92, rz: 0.06 },
      base: { y: -1.24, rz: 0 },
    }
    : {
      cap: { y: SCENE.keycapH * 0.68, rz: 0 },
      stem: { y: 0.18, rz: 0 },
      spring: { y: -0.08, rz: 0 },
      switch: { y: -0.35, rz: 0 },
      base: { y: -0.68, rz: 0 },
    };

  Object.entries(parts).forEach(([name, obj], index) => {
    if (!obj?.position) return;
    gsap.to(obj.position, {
      y: targets[name].y,
      duration: 0.86,
      delay: index * 0.018,
      ease: exploded ? 'expo.out' : 'power3.inOut',
      onUpdate: parts.render,
    });
    gsap.to(obj.rotation, {
      z: targets[name].rz,
      duration: 0.86,
      ease: exploded ? 'expo.out' : 'power3.inOut',
      onUpdate: parts.render,
    });
  });
}

export function ExplodedKeyScene() {
  const canvasRef = useRef(null);
  const explodedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const keyConfig = KEYCAP_CONFIGS[0];
    const glassTexture = makeGlassTexture();
    const scene = new THREE.Scene();
    scene.background = null;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.82;
    renderer.shadowMap.enabled = false;

    const camera = new THREE.PerspectiveCamera(SCENE.cameraFov, 1, 0.1, 200);
    camera.position.set(0, SCENE.cameraY, SCENE.cameraZ);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.28));
    const keyLight = new THREE.DirectionalLight(0xFFFAF0, 2.1);
    keyLight.position.set(-4, 6, 5);
    scene.add(keyLight);

    const rim = new THREE.DirectionalLight(0xC8D8FF, 0.72);
    rim.position.set(4, 2, -4);
    scene.add(rim);

    const group = new THREE.Group();
    group.rotation.y = SCENE.desktopKeyRotationY;
    group.position.y = 0;
    group.scale.setScalar(1);
    scene.add(group);

    const capMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(keyConfig.color),
      emissive: new THREE.Color(keyConfig.emissive),
      emissiveIntensity: 0.02,
      roughness: 0.04,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.016,
      transmission: 0,
      thickness: 0.1,
      ior: 1.49,
      specularIntensity: 1,
      specularColor: new THREE.Color('#FFFFFF'),
      transparent: true,
      opacity: 0.88,
      depthWrite: true,
    });

    const switchMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F7FCFF'),
      emissive: new THREE.Color('#F5FBFF'),
      emissiveIntensity: 0.012,
      roughness: 0.035,
      roughnessMap: glassTexture,
      bumpMap: glassTexture,
      bumpScale: 0.006,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.025,
      transmission: 0,
      thickness: 0.1,
      ior: 1.48,
      specularIntensity: 1,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    });

    const stemMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F4F1E9'),
      emissive: new THREE.Color('#CBBFA4'),
      emissiveIntensity: 0.025,
      roughness: 0.13,
      metalness: 0,
      clearcoat: 0.85,
      clearcoatRoughness: 0.04,
    });

    const springMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D8C9AC'),
      roughness: 0.15,
      metalness: 0.65,
      clearcoat: 0.5,
    });

    const cap = new THREE.Mesh(
      new RoundedBoxGeometry(SCENE.keycapW, SCENE.keycapH, SCENE.keycapD, 3, SCENE.radius),
      capMat,
    );
    cap.position.y = SCENE.keycapH * 0.68;
    group.add(cap);

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(SCENE.keycapW * 0.12, SCENE.keycapW * 0.14, SCENE.keycapH * 0.34, 12),
      stemMat,
    );
    stem.position.y = 0.18;
    group.add(stem);

    const spring = new THREE.Mesh(makeSpring(0.16, 0.58, 5.2), springMat);
    spring.position.y = -0.08;
    group.add(spring);

    const switchBody = new THREE.Mesh(
      new RoundedBoxGeometry(SCENE.keycapW * 1.04, SCENE.keycapH * 0.58, SCENE.keycapD * 0.96, 2, 0.075),
      switchMat,
    );
    switchBody.position.y = -0.35;
    group.add(switchBody);

    const base = new THREE.Mesh(
      new RoundedBoxGeometry(SCENE.keycapW * 1.16, SCENE.keycapH * 0.18, SCENE.keycapD * 1.06, 2, 0.055),
      switchMat.clone(),
    );
    base.position.y = -0.68;
    group.add(base);

    let renderQueued = false;
    const render = () => {
      renderQueued = false;
      renderer.render(scene, camera);
    };
    const requestRender = () => {
      if (renderQueued) return;
      renderQueued = true;
      requestAnimationFrame(render);
    };

    const parts = { cap, stem, spring, switch: switchBody, base, render: requestRender };
    const hitTargets = [cap, stem, spring, switchBody, base];
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    gsap.from(group.rotation, {
      y: group.rotation.y - 0.28,
      duration: 1.05,
      delay: 0.18,
      ease: 'power3.out',
      onUpdate: requestRender,
    });
    gsap.from(group.position, {
      y: 4.8,
      duration: 1.05,
      delay: 0.18,
      ease: 'power4.out',
      onUpdate: requestRender,
    });
    gsap.from(group.scale, {
      x: 0.92,
      y: 0.92,
      z: 0.92,
      duration: 1.05,
      delay: 0.18,
      ease: 'back.out(1.4)',
      onUpdate: requestRender,
    });

    const setSize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      requestRender();
    };

    const toggle = () => {
      explodedRef.current = !explodedRef.current;
      setExploded(parts, explodedRef.current);
    };
    const isPointerOnKey = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(hitTargets, false).length > 0;
    };
    const pointerDown = (e) => {
      if (!isPointerOnKey(e)) return;
      toggle();
    };
    const pointerMove = (e) => {
      canvas.style.cursor = isPointerOnKey(e) ? 'pointer' : 'default';
    };
    const pointerLeave = () => {
      canvas.style.cursor = 'default';
    };

    canvas.addEventListener('pointerdown', pointerDown);
    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerleave', pointerLeave);
    window.addEventListener('resize', setSize);
    setSize();

    requestRender();

    return () => {
      window.removeEventListener('resize', setSize);
      canvas.removeEventListener('pointerdown', pointerDown);
      canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerleave', pointerLeave);
      gsap.killTweensOf([group.position, group.rotation, group.scale]);
      [cap, stem, spring, switchBody, base].forEach((part) => {
        gsap.killTweensOf(part.position);
        gsap.killTweensOf(part.rotation);
      });
      group.traverse((obj) => {
        if (!obj.isMesh) return;
        obj.geometry?.dispose?.();
        const mat = obj.material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => { m.map?.dispose?.(); m.dispose?.(); });
        } else {
          mat?.map?.dispose?.();
          mat?.dispose?.();
        }
      });
      glassTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="exploded-key-canvas" aria-label="Exploded Y key interaction" />;
}

export default ExplodedKeyScene;
