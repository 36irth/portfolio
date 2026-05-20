import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { SCENE } from './constants';

function makeLetterTexture(letter, textColor) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = textColor;
  ctx.font = `700 ${Math.round(size * 0.44)}px "Inter", "SF Pro Display", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter.toUpperCase(), size / 2, size / 2 + size * 0.02);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

let _glowTexCache = null;
function getGlowTexture() {
  if (_glowTexCache) return _glowTexCache;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2, cy = size / 2;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
  grad.addColorStop(0.0,  'rgba(255, 200, 100, 1.0)');
  grad.addColorStop(0.2,  'rgba(255, 130,  40, 0.75)');
  grad.addColorStop(0.45, 'rgba(220,  80,  10, 0.30)');
  grad.addColorStop(0.7,  'rgba(180,  50,   0, 0.05)');
  grad.addColorStop(1.0,  'rgba(0,     0,   0, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  _glowTexCache = new THREE.CanvasTexture(canvas);
  return _glowTexCache;
}

let _housingTexCache = null;
function getHousingTexture() {
  if (_housingTexCache) return _housingTexCache;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2, cy = size / 2;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
  grad.addColorStop(0.0,  'rgba(255, 170,  70, 1.0)');
  grad.addColorStop(0.3,  'rgba(250, 120,  30, 0.75)');
  grad.addColorStop(0.6,  'rgba(220,  80,  10, 0.25)');
  grad.addColorStop(0.85, 'rgba(180,  50,   0, 0.05)');
  grad.addColorStop(1.0,  'rgba(0,     0,   0, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  _housingTexCache = new THREE.CanvasTexture(canvas);
  return _housingTexCache;
}

let _glassTextureCache = null;
function getGlassTexture() {
  if (_glassTextureCache) return _glassTextureCache;
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const wave = Math.sin(x * 0.09) * 8 + Math.cos(y * 0.07) * 7;
      const grain = ((x * 13 + y * 17 + ((x * y) % 37)) % 23) - 11;
      const value = Math.max(0, Math.min(255, 132 + wave + grain));
      imageData.data[i] = value;
      imageData.data[i + 1] = value;
      imageData.data[i + 2] = value;
      imageData.data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  _glassTextureCache = new THREE.CanvasTexture(canvas);
  _glassTextureCache.wrapS = THREE.RepeatWrapping;
  _glassTextureCache.wrapT = THREE.RepeatWrapping;
  _glassTextureCache.repeat.set(1.4, 1.4);
  _glassTextureCache.colorSpace = THREE.NoColorSpace;
  _glassTextureCache.needsUpdate = true;
  return _glassTextureCache;
}

let _springGeometryCache = null;
function getSpringGeometry(radius, height, turns) {
  if (_springGeometryCache) return _springGeometryCache;
  const points = [];
  const steps = 64;

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const angle = t * Math.PI * 2 * turns;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      (t - 0.5) * height,
      Math.sin(angle) * radius,
    ));
  }

  _springGeometryCache = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), steps, 0.01, 6, false);
  return _springGeometryCache;
}

function addBox(parent, geometry, material, position) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position.x || 0, position.y || 0, position.z || 0);
  parent.add(mesh);
  return mesh;
}

function addSwitchInside(group, { keycapW, keycapH, keycapD }) {
  const switchGroup = new THREE.Group();
  const glassTexture = getGlassTexture();
  const sx = keycapW / 1.42;
  const sy = sx;
  const sz = keycapD / 1.42;
  const scale = Math.min(sx, sz);
  const scaledBox = (w, h, d, radius, segments = 2) => (
    new RoundedBoxGeometry(w * sx, h * sy, d * sz, segments, radius * scale)
  );
  const scaledSpring = (radius, height, turns) => (
    getSpringGeometry(radius * scale, height * sy, turns)
  );

  const housingMat = new THREE.MeshPhysicalMaterial({
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
    specularColor: new THREE.Color('#FFFFFF'),
    transparent: true,
    opacity: 0.44,
    depthWrite: false,
  });

  const stemMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#efe8da'),
    emissive: new THREE.Color('#9f8965'),
    emissiveIntensity: 0.025,
    roughness: 0.18,
    metalness: 0,
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

  const glassDenseMat = housingMat.clone();
  glassDenseMat.opacity = 0.58;
  glassDenseMat.color = new THREE.Color('#cfd9db');

  addBox(
    switchGroup,
    scaledBox(1.42, 0.18, 1.42, 0.075, 3),
    glassDenseMat,
    { y: -0.74 * sy - 0.02 * sy },
  );
  addBox(
    switchGroup,
    scaledBox(0.74, 0.08, 0.74, 0.035, 2),
    housingMat,
    { y: -0.74 * sy + 0.11 * sy },
  );

  const housingY = -0.62 * sy;
  addBox(
    switchGroup,
    scaledBox(1.28, 0.12, 1.28, 0.065, 3),
    housingMat,
    { y: housingY - 0.28 * sy },
  );

  [
    { w: 1.28, h: 0.11, d: 0.18, x: 0, y: 0.04, z: -0.55 },
    { w: 1.28, h: 0.11, d: 0.18, x: 0, y: 0.04, z: 0.55 },
    { w: 0.18, h: 0.11, d: 1.28, x: -0.55, y: 0.04, z: 0 },
    { w: 0.18, h: 0.11, d: 1.28, x: 0.55, y: 0.04, z: 0 },
    { w: 1.12, h: 0.48, d: 0.15, x: 0, y: 0.18, z: -0.58 },
    { w: 1.12, h: 0.48, d: 0.15, x: 0, y: 0.18, z: 0.58 },
    { w: 0.15, h: 0.48, d: 1.12, x: -0.58, y: 0.18, z: 0 },
    { w: 0.15, h: 0.48, d: 1.12, x: 0.58, y: 0.18, z: 0 },
  ].forEach(({ w, h, d, x, y, z }) => {
    addBox(
      switchGroup,
      scaledBox(w, h, d, 0.035, 2),
      housingMat,
      { x: x * sx, y: housingY + y * sy, z: z * sz },
    );
  });

  [
    { w: 0.15, h: 0.42, d: 0.18, x: -0.76, y: -0.02, z: 0 },
    { w: 0.15, h: 0.42, d: 0.18, x: 0.76, y: -0.02, z: 0 },
    { w: 0.26, h: 0.18, d: 0.16, x: 0, y: -0.08, z: -0.76 },
    { w: 0.26, h: 0.18, d: 0.16, x: 0, y: -0.08, z: 0.76 },
  ].forEach(({ w, h, d, x, y, z }) => {
    addBox(
      switchGroup,
      scaledBox(w, h, d, 0.03, 2),
      glassDenseMat,
      { x: x * sx, y: housingY + y * sy, z: z * sz },
    );
  });

  const spring = new THREE.Mesh(
    scaledSpring(0.21, 0.72, 6.4),
    springMat,
  );
  spring.position.y = -0.28 * sy;
  switchGroup.add(spring);

  const stemY = 0.04 * sy;
  addBox(
    switchGroup,
    scaledBox(0.52, 0.12, 0.52, 0.025, 2),
    stemMat,
    { y: stemY - 0.1 * sy },
  );
  addBox(
    switchGroup,
    scaledBox(0.13, 0.58, 0.34, 0.025, 2),
    stemMat,
    { y: stemY + 0.16 * sy },
  );
  addBox(
    switchGroup,
    scaledBox(0.34, 0.58, 0.13, 0.025, 2),
    stemMat,
    { y: stemY + 0.16 * sy },
  );
  addBox(
    switchGroup,
    scaledBox(0.16, 0.44, 0.16, 0.025, 2),
    stemEdgeMat,
    { y: stemY + 0.06 * sy },
  );

  [
    [-0.25, -0.37, -0.25],
    [0.25, -0.37, -0.25],
    [-0.25, -0.37, 0.25],
    [0.25, -0.37, 0.25],
  ].forEach(([x, y, z]) => {
    addBox(
      switchGroup,
      scaledBox(0.1, 0.42, 0.1, 0.022, 2),
      stemMat,
      { x: x * sx, y: stemY + y * sy, z: z * sz },
    );
  });

  addBox(
    switchGroup,
    scaledBox(0.34, 0.06, 0.11, 0.018, 1),
    contactMat,
    { x: -0.19 * sx, y: housingY - 0.2 * sy, z: 0.24 * sz },
  );
  addBox(
    switchGroup,
    scaledBox(0.34, 0.06, 0.11, 0.018, 1),
    contactMat,
    { x: 0.19 * sx, y: housingY - 0.19 * sy, z: 0.15 * sz },
  );
  addBox(
    switchGroup,
    scaledBox(0.16, 0.34, 0.08, 0.018, 1),
    contactMat,
    { x: -0.26 * sx, y: housingY - 0.04 * sy, z: -0.15 * sz },
  );
  addBox(
    switchGroup,
    scaledBox(0.16, 0.34, 0.08, 0.018, 1),
    contactMat,
    { x: 0.26 * sx, y: housingY - 0.04 * sy, z: -0.18 * sz },
  );
  addBox(
    switchGroup,
    scaledBox(0.18, 0.42, 0.12, 0.025, 2),
    contactMat,
    { x: -0.24 * sx, y: -0.74 * sy - 0.28 * sy, z: 0.18 * sz },
  );
  addBox(
    switchGroup,
    scaledBox(0.18, 0.42, 0.12, 0.025, 2),
    contactMat,
    { x: 0.24 * sx, y: -0.74 * sy - 0.28 * sy, z: 0.05 * sz },
  );

  group.add(switchGroup);
  return switchGroup;
}

export function createKeycap({ letter, color, textColor, glow, emissive }, index) {
  const { keycapW, keycapH, keycapD, radius, bevelSegments } = SCENE;
  const group = new THREE.Group();
  const hasVisibleSwitch = true;
  const scale = keycapW / 1.42;
  const capH = 0.56 * scale;
  const capRadius = 0.2 * scale;
  const capLift = hasVisibleSwitch ? 0.62 * scale : 0;

  const geo = new RoundedBoxGeometry(keycapW, capH, keycapD, 6, capRadius);
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color('#fff7e8'),
    emissiveIntensity: 0,
    roughness: 0.22,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.09,
    transmission: 0,
    thickness: 0.1,
    ior: 1.49,
    specularIntensity: 1,
    specularColor: new THREE.Color('#FFFFFF'),
    transparent: false,
    opacity: 1,
    depthWrite: true,
  });
  const body = new THREE.Mesh(geo, mat);
  body.position.y = capLift;
  group.add(body);

  if (hasVisibleSwitch) {
    addSwitchInside(group, { keycapW, keycapH, keycapD });
  }

  const labelTex = makeLetterTexture(letter, textColor);
  const labelGeo = new THREE.PlaneGeometry(keycapW * 0.6, keycapD * 0.6);
  const labelMat = new THREE.MeshBasicMaterial({
    map: labelTex,
    transparent: true,
    depthWrite: false,
    opacity: 1,
  });
  const label = new THREE.Mesh(labelGeo, labelMat);
  label.rotation.x = -Math.PI / 2;
  label.position.y = capLift + capH / 2 + 0.004;
  group.add(label);

  const glowGeo = new RoundedBoxGeometry(keycapW + 0.1, capH + 0.06, keycapD + 0.1, bevelSegments, radius + 0.05);
  const glowMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(glow),
    transparent: true,
    opacity: 0,
    side: THREE.BackSide,
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  glowMesh.position.y = capLift;
  group.add(glowMesh);

  const housingGeo = new THREE.CircleGeometry(1.4, 64);
  const housingMat = new THREE.MeshBasicMaterial({
    map: getHousingTexture(),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const housing = new THREE.Mesh(housingGeo, housingMat);
  housing.rotation.x = -Math.PI / 2;
  housing.position.y = -(keycapH / 2) - 0.04;
  group.add(housing);

  const spriteMat = new THREE.SpriteMaterial({
    map: getGlowTexture(),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
  });
  const glowSprite = new THREE.Sprite(spriteMat);
  glowSprite.scale.set(5.0, 5.0, 1);
  glowSprite.position.y = -(keycapH / 2) - 0.12;
  group.add(glowSprite);

  group.userData = {
    body, bodyMat: mat,
    glowMat, labelMat,
    housing, housingMat,
    glowSprite, glowSpriteMat: spriteMat,
    pressParts: hasVisibleSwitch
      ? [
        { obj: body, restY: body.position.y },
        { obj: label, restY: label.position.y },
        { obj: glowMesh, restY: glowMesh.position.y },
      ]
      : null,
    index, restY: 0, letter,
  };
  return group;
}

export function setKeycapDone(keycap) {
  const { bodyMat, labelMat, letter } = keycap.userData;
  bodyMat.color.set(SCENE.pressedColor);
  bodyMat.emissive.set(SCENE.pressedEmissive);
  bodyMat.emissiveIntensity = 0.08;
  if (labelMat.map) labelMat.map.dispose();
  labelMat.map = makeLetterTexture(letter, '#FFFFFF');
  labelMat.needsUpdate = true;
}
