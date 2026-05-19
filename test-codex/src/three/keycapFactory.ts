import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type KeycapPalette = {
  base: string;
  side: string;
  legend: string;
  accent: string;
  emissive: string;
};

export type KeycapObject = {
  root: THREE.Group;
  cap: THREE.Mesh;
  top: THREE.Mesh;
  legend: THREE.Sprite;
  glow: THREE.Mesh;
  underglow: THREE.Mesh;
  switchStem: THREE.Mesh;
  underlight: THREE.PointLight;
  palette: KeycapPalette;
  restingY: number;
};

const textureCache = new Map<string, THREE.CanvasTexture>();
let underglowTexture: THREE.CanvasTexture | null = null;

export function createKeycap(
  letter: string,
  palette: KeycapPalette,
  options: { size?: number; height?: number } = {},
): KeycapObject {
  // 키캡의 실제 크기입니다. size를 키우면 더 넓어지고, height를 키우면 더 두툼해집니다.
  const size = options.size ?? 1.08;
  const height = options.height ?? 0.62;
  const root = new THREE.Group();
  const ledColor = "#2f83ff";

  // 키캡의 메인 몸통입니다. 마지막 radius 값이 바깥 모서리의 둥근 정도를 결정합니다.
  const bodyGeometry = new RoundedBoxGeometry(size, height, size, 9, 0.19);
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: palette.base,
    roughness: 0.5,
    metalness: 0.0,
    clearcoat: 0.82,
    clearcoatRoughness: 0.28,
    reflectivity: 0.64,
    sheen: 0.28,
    sheenRoughness: 0.44,
  });

  const cap = new THREE.Mesh(bodyGeometry, bodyMaterial);
  cap.castShadow = true;
  cap.receiveShadow = true;
  cap.position.y = height * 0.5;
  root.add(cap);

  const switchGeometry = new RoundedBoxGeometry(size * 0.46, height * 0.72, size * 0.46, 5, 0.06);
  const switchMaterial = new THREE.MeshPhysicalMaterial({
    color: ledColor,
    emissive: ledColor,
    emissiveIntensity: 0.62,
    roughness: 0.12,
    metalness: 0,
    transmission: 0.48,
    transparent: true,
    opacity: 0.28,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    depthWrite: false,
  });
  const switchStem = new THREE.Mesh(switchGeometry, switchMaterial);
  switchStem.castShadow = false;
  switchStem.receiveShadow = false;
  switchStem.position.y = -height * 0.06;
  root.add(switchStem);

  const underlight = new THREE.PointLight(ledColor, 0.42, 2.2, 1.8);
  underlight.position.set(0, -height * 0.04, 0);
  underlight.castShadow = false;
  root.add(underlight);

  // 위쪽에 살짝 올라온 면입니다. 0.78 배율을 키우면 윗면이 더 크게 보입니다.
  const topGeometry = new RoundedBoxGeometry(size * 0.78, 0.08, size * 0.78, 8, 0.16);
  const topMaterial = new THREE.MeshPhysicalMaterial({
    color: palette.side,
    roughness: 0.46,
    clearcoat: 0.88,
    clearcoatRoughness: 0.22,
    reflectivity: 0.68,
  });

  const top = new THREE.Mesh(topGeometry, topMaterial);
  top.castShadow = true;
  top.receiveShadow = true;
  top.position.set(0, height + 0.02, 0);
  root.add(top);

  const legend = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: createLegendTexture(letter, palette.legend),
      transparent: true,
      depthWrite: false,
    }),
  );
  // 키캡 글자의 크기와 높이입니다. 글자가 윗면에 파묻히면 Y 위치를 살짝 올리면 됩니다.
  legend.scale.set(0.78, 0.42, 1);
  legend.position.set(0, height + 0.14, -0.012);
  root.add(legend);

  const glowGeometry = new THREE.RingGeometry(size * 0.52, size * 0.72, 72);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: palette.emissive,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = 0.05;
  root.add(glow);

  const underglowGeometry = new THREE.PlaneGeometry(size * 0.72, size * 0.72);
  const underglowMaterial = new THREE.MeshBasicMaterial({
    color: ledColor,
    map: createUnderglowTexture(),
    transparent: true,
    opacity: 0.045,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const underglow = new THREE.Mesh(underglowGeometry, underglowMaterial);
  underglow.rotation.x = -Math.PI / 2;
  underglow.position.y = 0.018;
  root.add(underglow);

  return {
    root,
    cap,
    top,
    legend,
    glow,
    underglow,
    switchStem,
    underlight,
    palette,
    restingY: 0,
  };
}

function createLegendTexture(letter: string, color: string) {
  const cacheKey = `${letter}:${color}`;
  const cached = textureCache.get(cacheKey);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d")!;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  context.font = "900 116px Inter, ui-sans-serif, system-ui, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(letter.toUpperCase(), canvas.width / 2, canvas.height / 2 + 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  textureCache.set(cacheKey, texture);
  return texture;
}

function createUnderglowTexture() {
  if (underglowTexture) return underglowTexture;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d")!;
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);

  gradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
  gradient.addColorStop(0.38, "rgba(255, 255, 255, 0.42)");
  gradient.addColorStop(0.68, "rgba(255, 255, 255, 0.12)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  underglowTexture = new THREE.CanvasTexture(canvas);
  underglowTexture.colorSpace = THREE.SRGBColorSpace;
  underglowTexture.needsUpdate = true;
  return underglowTexture;
}

export function createReusableKeycapAssetData() {
  return {
    geometry: {
      kind: "RoundedBoxGeometry",
      body: { width: 1.28, height: 0.52, depth: 1.28, segments: 9, radius: 0.18 },
      top: { width: 0.998, height: 0.08, depth: 0.998, segments: 8, radius: 0.16 },
    },
    materialChannels: [
      "base color",
      "roughness",
      "clearcoat",
      "clearcoatRoughness",
      "legend canvas texture",
      "accent glow",
      "transparent switch stem",
      "blue underglow plane",
    ],
    gltfNote:
      "Use GLTFExporter from three/examples/jsm/exporters/GLTFExporter.js on each KeycapObject.root after converting canvas labels to textures.",
  };
}
