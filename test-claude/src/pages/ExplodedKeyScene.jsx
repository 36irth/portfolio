import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { KEYCAP_CONFIGS } from '../components/KeyboardIntro/constants';

const EXPLODED_TARGETS = {
  cap: { y: 1.84, rz: -0.045 },
  stem: { y: 0.5, rz: 0.015 },
  spring: { y: -0.18, rz: 0 },
  housing: { y: -0.94, rz: 0.035 },
  base: { y: -1.18, rz: 0 },
};

const ASSEMBLED_TARGETS = {
  cap: { y: 0.48, rz: 0 },
  stem: { y: 0.04, rz: 0 },
  spring: { y: -0.28, rz: 0 },
  housing: { y: -0.62, rz: 0 },
  base: { y: -0.74, rz: 0 },
};

function makeNoiseTexture(size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const i = (y * size + x) * 4;
      const wave = Math.sin(x * 0.12) * 7 + Math.cos(y * 0.09) * 6;
      const grain = ((x * 13 + y * 17 + ((x * y) % 37)) % 23) - 11;
      const value = Math.max(0, Math.min(255, 138 + wave + grain));
      imageData.data[i] = value;
      imageData.data[i + 1] = value;
      imageData.data[i + 2] = value;
      imageData.data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.7, 1.7);
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

function makeLegendTexture(letter, textColor) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = textColor;
  ctx.font = '700 118px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, size / 2, size / 2 + 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeSpringGeometry(radius, height, turns) {
  const points = [];
  const steps = 104;

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const angle = t * Math.PI * 2 * turns;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      (t - 0.5) * height,
      Math.sin(angle) * radius,
    ));
  }

  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), steps, 0.013, 8, false);
}

function makeRoundedBox(w, h, d, radius, segments = 3) {
  return new RoundedBoxGeometry(w, h, d, segments, radius);
}

function addBox(parent, geometry, material, position, scale) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position.x || 0, position.y || 0, position.z || 0);
  if (scale) mesh.scale.set(scale.x || 1, scale.y || 1, scale.z || 1);
  parent.add(mesh);
  return mesh;
}

function createKeycap(materials, keyConfig) {
  const group = new THREE.Group();

  addBox(
    group,
    makeRoundedBox(1.42, 0.56, 1.42, 0.2, 6),
    materials.cap,
    { y: -0.03 },
  );

  const innerLip = addBox(
    group,
    makeRoundedBox(0.82, 0.12, 0.82, 0.035, 2),
    materials.capShadow,
    { y: -0.38 },
  );
  innerLip.castShadow = false;

  const legendMap = makeLegendTexture(keyConfig.letter, keyConfig.textColor);
  const legend = new THREE.Mesh(
    new THREE.PlaneGeometry(0.42, 0.42),
    new THREE.MeshBasicMaterial({
      map: legendMap,
      transparent: true,
      depthWrite: false,
    }),
  );
  legend.rotation.x = -Math.PI / 2;
  legend.position.y = 0.255;
  legend.position.z = -0.03;
  group.add(legend);

  group.userData.texture = legendMap;
  return group;
}

function createStem(materials) {
  const group = new THREE.Group();
  addBox(group, makeRoundedBox(0.52, 0.12, 0.52, 0.025, 2), materials.stem, { y: -0.1 });
  addBox(group, makeRoundedBox(0.13, 0.58, 0.34, 0.025, 2), materials.stem, { y: 0.16 });
  addBox(group, makeRoundedBox(0.34, 0.58, 0.13, 0.025, 2), materials.stem, { y: 0.16 });
  addBox(group, makeRoundedBox(0.16, 0.44, 0.16, 0.025, 2), materials.stemEdge, { y: 0.06 });

  [
    [-0.25, -0.37, -0.25],
    [0.25, -0.37, -0.25],
    [-0.25, -0.37, 0.25],
    [0.25, -0.37, 0.25],
  ].forEach(([x, y, z]) => {
    addBox(group, makeRoundedBox(0.1, 0.42, 0.1, 0.022, 2), materials.stem, { x, y, z });
  });

  addBox(group, makeRoundedBox(0.1, 0.5, 0.08, 0.018, 2), materials.stemEdge, { x: -0.16, y: -0.1, z: 0 });
  addBox(group, makeRoundedBox(0.1, 0.5, 0.08, 0.018, 2), materials.stemEdge, { x: 0.16, y: -0.1, z: 0 });
  return group;
}

function createHousing(materials) {
  const housing = new THREE.Group();
  const wallH = 0.48;
  const y = 0.04;

  addBox(housing, makeRoundedBox(1.28, 0.12, 1.28, 0.065, 3), materials.glass, { y: -0.28 });
  addBox(housing, makeRoundedBox(1.28, 0.11, 0.18, 0.035, 2), materials.glass, { y, z: -0.55 });
  addBox(housing, makeRoundedBox(1.28, 0.11, 0.18, 0.035, 2), materials.glass, { y, z: 0.55 });
  addBox(housing, makeRoundedBox(0.18, 0.11, 1.28, 0.035, 2), materials.glass, { x: -0.55, y });
  addBox(housing, makeRoundedBox(0.18, 0.11, 1.28, 0.035, 2), materials.glass, { x: 0.55, y });

  addBox(housing, makeRoundedBox(1.12, wallH, 0.15, 0.04, 2), materials.glass, { y: 0.18, z: -0.58 });
  addBox(housing, makeRoundedBox(1.12, wallH, 0.15, 0.04, 2), materials.glass, { y: 0.18, z: 0.58 });
  addBox(housing, makeRoundedBox(0.15, wallH, 1.12, 0.04, 2), materials.glass, { x: -0.58, y: 0.18 });
  addBox(housing, makeRoundedBox(0.15, wallH, 1.12, 0.04, 2), materials.glass, { x: 0.58, y: 0.18 });

  addBox(housing, makeRoundedBox(0.34, 0.06, 0.11, 0.018, 1), materials.contact, { x: -0.19, y: -0.2, z: 0.24 });
  addBox(housing, makeRoundedBox(0.34, 0.06, 0.11, 0.018, 1), materials.contact, { x: 0.19, y: -0.19, z: 0.15 });
  addBox(housing, makeRoundedBox(0.16, 0.34, 0.08, 0.018, 1), materials.contact, { x: -0.26, y: -0.04, z: -0.15 });
  addBox(housing, makeRoundedBox(0.16, 0.34, 0.08, 0.018, 1), materials.contact, { x: 0.26, y: -0.04, z: -0.18 });

  addBox(housing, makeRoundedBox(0.15, 0.42, 0.18, 0.03, 2), materials.glassDense, { x: -0.76, y: -0.02 });
  addBox(housing, makeRoundedBox(0.15, 0.42, 0.18, 0.03, 2), materials.glassDense, { x: 0.76, y: -0.02 });
  addBox(housing, makeRoundedBox(0.26, 0.18, 0.16, 0.03, 2), materials.glassDense, { z: -0.76, y: -0.08 });
  addBox(housing, makeRoundedBox(0.26, 0.18, 0.16, 0.03, 2), materials.glassDense, { z: 0.76, y: -0.08 });

  return housing;
}

function createBase(materials) {
  const base = new THREE.Group();
  addBox(base, makeRoundedBox(1.42, 0.18, 1.42, 0.075, 3), materials.glassDense, { y: -0.02 });
  addBox(base, makeRoundedBox(0.74, 0.08, 0.74, 0.035, 2), materials.glass, { y: 0.11 });
  addBox(base, makeRoundedBox(0.18, 0.42, 0.12, 0.025, 2), materials.contact, { x: -0.24, y: -0.28, z: 0.18 });
  addBox(base, makeRoundedBox(0.18, 0.42, 0.12, 0.025, 2), materials.contact, { x: 0.24, y: -0.28, z: 0.05 });
  return base;
}

function moveParts(parts, exploded) {
  const targets = exploded ? EXPLODED_TARGETS : ASSEMBLED_TARGETS;

  Object.entries(parts).forEach(([name, part], index) => {
    if (!targets[name]) return;
    gsap.to(part.position, {
      y: targets[name].y,
      duration: 0.94,
      delay: index * 0.018,
      ease: exploded ? 'expo.out' : 'power3.inOut',
      onUpdate: parts.render,
    });
    gsap.to(part.rotation, {
      z: targets[name].rz,
      duration: 0.94,
      ease: exploded ? 'expo.out' : 'power3.inOut',
      onUpdate: parts.render,
    });
  });
}

export function ExplodedKeyScene() {
  const canvasRef = useRef(null);
  const explodedRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const keyConfig = KEYCAP_CONFIGS[0];
    const noiseTexture = makeNoiseTexture();
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090806, 0.055);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.shadowMap.enabled = false;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 120);
    camera.position.set(0.18, 6.35, 4.75);
    camera.lookAt(0, -0.16, 0);

    scene.add(new THREE.HemisphereLight(0xfff4dc, 0x1c1d24, 0.48));
    const keyLight = new THREE.DirectionalLight(0xfff3d6, 3.2);
    keyLight.position.set(-3.8, 6.2, 4.2);
    scene.add(keyLight);

    const rim = new THREE.DirectionalLight(0xbfd6ff, 1.55);
    rim.position.set(4.2, 2.2, -3.4);
    scene.add(rim);

    const warmPin = new THREE.PointLight(0xffa640, 1.5, 7);
    warmPin.position.set(1.8, -0.75, 2.8);
    scene.add(warmPin);

    const group = new THREE.Group();
    group.rotation.set(-0.18, -0.42, 0.02);
    group.position.set(0.03, -0.05, 0);
    group.scale.setScalar(0.84);
    scene.add(group);

    const capMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(keyConfig.color),
      emissive: new THREE.Color('#fff7e8'),
      emissiveIntensity: 0.02,
      roughness: 0.22,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.09,
      specularIntensity: 1,
    });

    const capShadowMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#d7cebd'),
      roughness: 0.36,
      clearcoat: 0.6,
      clearcoatRoughness: 0.18,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#dfe8ec'),
      roughness: 0.08,
      roughnessMap: noiseTexture,
      bumpMap: noiseTexture,
      bumpScale: 0.006,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      transmission: 0,
      thickness: 0.28,
      ior: 1.46,
      specularIntensity: 1,
      transparent: true,
      opacity: 0.44,
      depthWrite: false,
    });

    const glassDenseMat = glassMat.clone();
    glassDenseMat.opacity = 0.58;
    glassDenseMat.color = new THREE.Color('#cfd9db');

    const stemMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#efe8da'),
      emissive: new THREE.Color('#9f8965'),
      emissiveIntensity: 0.025,
      roughness: 0.18,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
    });

    const stemEdgeMat = stemMat.clone();
    stemEdgeMat.color = new THREE.Color('#d7ccbb');

    const springMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#f0d99f'),
      roughness: 0.18,
      metalness: 0.72,
      clearcoat: 0.45,
    });

    const contactMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#c99745'),
      roughness: 0.2,
      metalness: 0.82,
      clearcoat: 0.35,
    });

    const materials = {
      cap: capMat,
      capShadow: capShadowMat,
      glass: glassMat,
      glassDense: glassDenseMat,
      stem: stemMat,
      stemEdge: stemEdgeMat,
      spring: springMat,
      contact: contactMat,
    };

    const cap = createKeycap(materials, keyConfig);
    const stem = createStem(materials);
    const spring = new THREE.Group();
    const springMesh = new THREE.Mesh(makeSpringGeometry(0.21, 0.72, 6.4), springMat);
    spring.add(springMesh);
    const housing = createHousing(materials);
    const base = createBase(materials);

    Object.entries(EXPLODED_TARGETS).forEach(([name, target]) => {
      const part = { cap, stem, spring, housing, base }[name];
      part.position.y = target.y;
      part.rotation.z = target.rz;
      group.add(part);
    });

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

    const parts = { cap, stem, spring, housing, base, render: requestRender };
    const setSize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.18));
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      if (width < 760) {
        group.scale.setScalar(0.66);
        group.position.y = -0.08;
        camera.position.set(0.12, 6.6, 5.35);
      } else {
        group.scale.setScalar(0.84);
        group.position.y = -0.1;
        camera.position.set(0.18, 6.35, 4.75);
      }
      camera.lookAt(0, -0.16, 0);
      requestRender();
    };

    const toggle = () => {
      explodedRef.current = !explodedRef.current;
      moveParts(parts, explodedRef.current);
    };

    const pointerDown = () => toggle();
    canvas.style.cursor = 'pointer';

    gsap.from(group.rotation, {
      x: group.rotation.x - 0.12,
      y: group.rotation.y - 0.18,
      duration: 1.2,
      ease: 'power3.out',
      onUpdate: requestRender,
    });
    gsap.from(group.position, {
      y: group.position.y + 1.8,
      duration: 1.15,
      ease: 'power4.out',
      onUpdate: requestRender,
    });

    canvas.addEventListener('pointerdown', pointerDown);
    window.addEventListener('resize', setSize);
    setSize();
    requestRender();

    return () => {
      window.removeEventListener('resize', setSize);
      canvas.removeEventListener('pointerdown', pointerDown);
      gsap.killTweensOf([group.position, group.rotation]);
      Object.values(parts).forEach((part) => {
        if (!part?.position) return;
        gsap.killTweensOf(part.position);
        gsap.killTweensOf(part.rotation);
      });
      group.traverse((obj) => {
        if (!obj.isMesh && !obj.isLine) return;
        obj.geometry?.dispose?.();
        const mat = obj.material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => {
            m.map?.dispose?.();
            m.roughnessMap?.dispose?.();
            m.bumpMap?.dispose?.();
            m.dispose?.();
          });
        } else {
          mat?.map?.dispose?.();
          mat?.roughnessMap?.dispose?.();
          mat?.bumpMap?.dispose?.();
          mat?.dispose?.();
        }
      });
      cap.userData.texture?.dispose?.();
      noiseTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="exploded-key-canvas" aria-label="Exploded C key switch" />;
}

export default ExplodedKeyScene;
