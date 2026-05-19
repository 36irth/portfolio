import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { SCENE } from './constants';

function makeLetterTexture(letter, textColor) {
  const size = 512;
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
  const size = 256;
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

function addSwitchInside(group, { keycapW, keycapH, keycapD }) {
  const switchGroup = new THREE.Group();
  switchGroup.position.y = -keycapH * 0.06;
  const glassTexture = getGlassTexture();

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
    opacity: 0.34,
    depthWrite: false,
  });

  const stemMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#F4F1E9'),
    emissive: new THREE.Color('#CBBFA4'),
    emissiveIntensity: 0.025,
    roughness: 0.16,
    metalness: 0,
    clearcoat: 0.8,
    clearcoatRoughness: 0.06,
  });

  const pinMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#D8C9AC'),
    roughness: 0.18,
    metalness: 0.55,
    clearcoat: 0.35,
  });

  const lowerCase = new THREE.Mesh(
    new RoundedBoxGeometry(keycapW * 1.08, keycapH * 0.58, keycapD * 0.98, 2, 0.075),
    housingMat,
  );
  lowerCase.position.y = -keycapH * 0.32;
  lowerCase.receiveShadow = true;
  switchGroup.add(lowerCase);

  const topPlate = new THREE.Mesh(
    new RoundedBoxGeometry(keycapW * 0.88, keycapH * 0.13, keycapD * 0.78, 1, 0.045),
    housingMat.clone(),
  );
  topPlate.position.y = keycapH * 0.03;
  topPlate.receiveShadow = true;
  switchGroup.add(topPlate);

  const bevelPrismMat = housingMat.clone();
  bevelPrismMat.opacity = 0.28;
  [-0.42, 0.42].forEach((x) => {
    const sideBlock = new THREE.Mesh(
      new RoundedBoxGeometry(keycapW * 0.08, keycapH * 0.42, keycapD * 0.76, 1, 0.025),
      bevelPrismMat,
    );
    sideBlock.position.set(keycapW * x, -keycapH * 0.28, 0);
    sideBlock.receiveShadow = true;
    switchGroup.add(sideBlock);
  });

  const innerRailMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#F3C186'),
    emissive: new THREE.Color('#8A3F12'),
    emissiveIntensity: 0.012,
    roughness: 0.08,
    roughnessMap: glassTexture,
    bumpMap: glassTexture,
    bumpScale: 0.008,
    metalness: 0.15,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    transmission: 0,
    thickness: 0.08,
    ior: 1.46,
    specularIntensity: 0.9,
    transparent: true,
    opacity: 0.56,
    depthWrite: false,
  });

  [-0.27, 0.27].forEach((x) => {
    const rail = new THREE.Mesh(
      new RoundedBoxGeometry(keycapW * 0.07, keycapH * 0.2, keycapD * 0.5, 1, 0.018),
      innerRailMat,
    );
    rail.position.set(keycapW * x, -keycapH * 0.12, 0);
    rail.receiveShadow = true;
    switchGroup.add(rail);
  });

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(keycapW * 0.12, keycapW * 0.14, keycapH * 0.34, 12),
    stemMat,
  );
  stem.position.y = keycapH * 0.25;
  stem.castShadow = true;
  stem.receiveShadow = true;
  switchGroup.add(stem);

  const crossX = new THREE.Mesh(
    new RoundedBoxGeometry(keycapW * 0.28, keycapH * 0.07, keycapD * 0.07, 2, 0.016),
    stemMat,
  );
  crossX.position.y = keycapH * 0.43;
  crossX.castShadow = true;
  switchGroup.add(crossX);

  const crossZ = new THREE.Mesh(
    new RoundedBoxGeometry(keycapW * 0.07, keycapH * 0.07, keycapD * 0.28, 2, 0.016),
    stemMat,
  );
  crossZ.position.y = keycapH * 0.43;
  crossZ.castShadow = true;
  switchGroup.add(crossZ);

  const pcbMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#FF9B3D'),
    transparent: true,
    opacity: 0.58,
    depthWrite: false,
  });
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(keycapW * 0.54, keycapH * 0.025, keycapD * 0.055), pcbMat);
  pcb.position.set(0, -keycapH * 0.55, keycapD * 0.26);
  switchGroup.add(pcb);

  [-0.18, 0.18].forEach((x) => {
    const pin = new THREE.Mesh(
      new THREE.BoxGeometry(keycapW * 0.045, keycapH * 0.2, keycapD * 0.22),
      pinMat,
    );
    pin.position.set(keycapW * x, -keycapH * 0.48, keycapD * 0.15);
    pin.castShadow = true;
    pin.receiveShadow = true;
    switchGroup.add(pin);
  });

  group.add(switchGroup);
  return switchGroup;
}

export function createKeycap({ letter, color, textColor, glow, emissive }, index) {
  const { keycapW, keycapH, keycapD, radius, bevelSegments } = SCENE;
  const group = new THREE.Group();
  const hasVisibleSwitch = true;
  const capLift = hasVisibleSwitch ? keycapH * 0.68 : 0;
  const glassTexture = getGlassTexture();

  const geo = new RoundedBoxGeometry(keycapW, keycapH, keycapD, bevelSegments, radius);
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(emissive),
    emissiveIntensity: 0,
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
  const body = new THREE.Mesh(geo, mat);
  body.position.y = capLift;
  body.castShadow = true;
  body.receiveShadow = true;
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
  label.position.y = keycapH / 2 + capLift + 0.002;
  group.add(label);

  const glowGeo = new RoundedBoxGeometry(keycapW + 0.1, keycapH + 0.06, keycapD + 0.1, bevelSegments, radius + 0.05);
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
