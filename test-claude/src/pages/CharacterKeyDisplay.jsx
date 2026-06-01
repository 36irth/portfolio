import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { createKeycap, makeLetterTexture } from '../components/KeyboardIntro/Keycap';
import { KEYCAP_CONFIGS } from '../components/KeyboardIntro/constants';

const KEY_CONFIG = {
  ...KEYCAP_CONFIGS[0],
};
const KEY_REST_COLOR = new THREE.Color(KEY_CONFIG.color);
const KEY_REST_EMISSIVE = new THREE.Color('#ffffff');
const KEY_PRESSED_COLOR = new THREE.Color('#0188fb');
const KEY_PRESSED_EMISSIVE = new THREE.Color('#0168c0');

export function CharacterKeyDisplay({ pressed = false, scale = 1, className = 'characterKeyCanvas' }) {
  const canvasRef = useRef(null);
  const keycapRef = useRef(null);
  const switchPartsRef = useRef(null);
  const restRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const renderRef = useRef(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const width = canvas.clientWidth || 216;
    const height = canvas.clientHeight || 303;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.94;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(0.5, 4.9, 9.35);
    camera.lookAt(0.2, -0.12, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 0.56);
    const key = new THREE.DirectionalLight(0xfffaf0, 2.55);
    key.position.set(-4, 8, 6);
    const fill = new THREE.DirectionalLight(0xffd8a0, 0.8);
    fill.position.set(6, 2, 3);
    const rim = new THREE.DirectionalLight(0xc8d8ff, 0.44);
    rim.position.set(-3, -1, -6);
    const point = new THREE.PointLight(0xffeed8, 0.46, 20);
    point.position.set(0, 5, 1.5);
    scene.add(ambient, key, fill, rim, point);

    const keycap = createKeycap(KEY_CONFIG, 0);
    keycap.position.set(0.1, -0.62, 0);
    keycap.rotation.x = 0.16;
    keycap.rotation.y = -0.16;
    scene.add(keycap);
    keycap.scale.setScalar(scale);

    keycapRef.current = keycap;
    switchPartsRef.current = keycap.userData.pressParts || [];
    restRef.current = {
      groupY: keycap.position.y,
      bodyMat: keycap.userData.bodyMat,
      labelMat: keycap.userData.labelMat,
      labelFont: keycap.userData.labelFont,
      letter: keycap.userData.letter,
      pressParts: (keycap.userData.pressParts || []).map(({ obj, restY }) => ({ obj, restY })),
    };
    rendererRef.current = renderer;
    cameraRef.current = camera;

    let rafId = 0;
    const renderLoop = () => {
      rafId = window.requestAnimationFrame(renderLoop);
      renderer.render(scene, camera);
    };
    renderRef.current = () => {
      renderer.render(scene, camera);
    };
    renderLoop();

    const resize = () => {
      const nextWidth = canvas.clientWidth || 216;
      const nextHeight = canvas.clientHeight || 303;
      renderer.setSize(nextWidth, nextHeight, false);
      camera.aspect = nextWidth / nextHeight;
      camera.fov = 32;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(rafId);
      scene.traverse((obj) => {
        if (!obj.isMesh) return;
        obj.geometry?.dispose?.();
        const material = obj.material;
        if (Array.isArray(material)) {
          material.forEach((mat) => {
            mat.map?.dispose?.();
            mat.dispose?.();
          });
          return;
        }
        material?.map?.dispose?.();
        material?.dispose?.();
      });
      renderer.dispose();
    };
  }, [scale]);

  useEffect(() => {
    const keycap = keycapRef.current;
    const rest = restRef.current;
    if (!keycap || !rest) return;

    gsap.killTweensOf(keycap.position);
    if (rest.bodyMat) {
      gsap.killTweensOf(rest.bodyMat.color);
      gsap.killTweensOf(rest.bodyMat.emissive);
      gsap.killTweensOf(rest.bodyMat);
    }
    rest.pressParts.forEach(({ obj }) => gsap.killTweensOf(obj.position));

    if (pressed) {
      if (rest.bodyMat) {
        if (rest.labelMat) {
          rest.labelMat.map?.dispose?.();
          rest.labelMat.map = makeLetterTexture(rest.letter, '#FFFFFF', rest.labelFont);
          rest.labelMat.needsUpdate = true;
        }
        gsap.to(rest.bodyMat.color, {
          r: KEY_PRESSED_COLOR.r,
          g: KEY_PRESSED_COLOR.g,
          b: KEY_PRESSED_COLOR.b,
          duration: 0.16,
          ease: 'power2.out',
          onUpdate: renderRef.current,
        });
        gsap.to(rest.bodyMat.emissive, {
          r: KEY_PRESSED_EMISSIVE.r,
          g: KEY_PRESSED_EMISSIVE.g,
          b: KEY_PRESSED_EMISSIVE.b,
          duration: 0.16,
          ease: 'power2.out',
          onUpdate: renderRef.current,
        });
        gsap.to(rest.bodyMat, {
          emissiveIntensity: 0.08,
          duration: 0.16,
          ease: 'power2.out',
          onUpdate: renderRef.current,
        });
      }
      gsap.to(keycap.position, {
        y: rest.groupY - 0.11,
        duration: 0.22,
        ease: 'power2.out',
        onUpdate: renderRef.current,
      });
      rest.pressParts.forEach(({ obj, restY }) => {
        gsap.to(obj.position, {
          y: restY - 0.15,
          duration: 0.22,
          ease: 'power2.out',
          onUpdate: renderRef.current,
        });
      });
      return;
    }

    if (rest.bodyMat) {
      if (rest.labelMat) {
        rest.labelMat.map?.dispose?.();
        rest.labelMat.map = makeLetterTexture(rest.letter, '#1C1C1C', rest.labelFont);
        rest.labelMat.needsUpdate = true;
      }
      gsap.to(rest.bodyMat.color, {
        r: KEY_REST_COLOR.r,
        g: KEY_REST_COLOR.g,
        b: KEY_REST_COLOR.b,
        duration: 0.24,
        ease: 'power2.out',
        onUpdate: renderRef.current,
      });
      gsap.to(rest.bodyMat.emissive, {
        r: KEY_REST_EMISSIVE.r,
        g: KEY_REST_EMISSIVE.g,
        b: KEY_REST_EMISSIVE.b,
        duration: 0.24,
        ease: 'power2.out',
        onUpdate: renderRef.current,
      });
      gsap.to(rest.bodyMat, {
        emissiveIntensity: 0,
        duration: 0.24,
        ease: 'power2.out',
        onUpdate: renderRef.current,
      });
    }
    gsap.to(keycap.position, {
      y: rest.groupY,
      duration: 0.28,
      ease: 'power2.out',
      onUpdate: renderRef.current,
    });
    rest.pressParts.forEach(({ obj, restY }) => {
      gsap.to(obj.position, {
        y: restY,
        duration: 0.28,
        ease: 'power2.out',
        onUpdate: renderRef.current,
      });
    });
  }, [pressed]);

  return <canvas ref={canvasRef} className={className} />;
}

export default CharacterKeyDisplay;
