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

export function createKeycap({ letter, color, textColor, glow, emissive }, index) {
  const { keycapW, keycapH, keycapD, radius, bevelSegments } = SCENE;
  const group = new THREE.Group();

  const geo = new RoundedBoxGeometry(keycapW, keycapH, keycapD, bevelSegments, radius);
  const mat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(emissive),
    emissiveIntensity: 0,
    roughness: 0.16,
    metalness: 0,
    clearcoat: 0.95,
    clearcoatRoughness: 0.06,
    transparent: true,
    opacity: 1,
  });
  const body = new THREE.Mesh(geo, mat);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

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
  label.position.y = keycapH / 2 + 0.002;
  group.add(label);

  const glowGeo = new RoundedBoxGeometry(keycapW + 0.1, keycapH + 0.06, keycapD + 0.1, bevelSegments, radius + 0.05);
  const glowMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(glow),
    transparent: true,
    opacity: 0,
    side: THREE.BackSide,
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
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
