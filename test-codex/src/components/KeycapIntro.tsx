import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { useTypingSequence } from "../hooks/useTypingSequence";
import { createKeycap, type KeycapObject, type KeycapPalette } from "../three/keycapFactory";
import { addStudioLighting, createCamera, createRenderer, disposeRenderer } from "../three/sceneSetup";
import { getWebGLSupport, logWebGLDiagnostics } from "../utils/webgl";
import { WebGLIntro } from "./WebGLIntro";

const TARGET = "yulssem";

const palettes: KeycapPalette[] = [
  { base: "#090d17", side: "#111827", legend: "#f6f9ff", accent: "#3d7dff", emissive: "#2f83ff" },
  { base: "#17264a", side: "#244078", legend: "#dce8ff", accent: "#4c8fff", emissive: "#2f83ff" },
  { base: "#52617f", side: "#7988a8", legend: "#eef4ff", accent: "#6da3ff", emissive: "#2f83ff" },
  { base: "#07090f", side: "#101522", legend: "#f4f7ff", accent: "#3d7dff", emissive: "#2f83ff" },
  { base: "#0b1224", side: "#15213d", legend: "#9fc0ff", accent: "#4b8eff", emissive: "#2f83ff" },
  { base: "#182033", side: "#2b3550", legend: "#eef4ff", accent: "#75a8ff", emissive: "#2f83ff" },
  { base: "#0a0d15", side: "#111827", legend: "#f6f9ff", accent: "#3d7dff", emissive: "#2f83ff" },
];

type KeycapIntroProps = {
  onComplete: () => void;
};

export function KeycapIntro({ onComplete }: KeycapIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const keycapsRef = useRef<KeycapObject[]>([]);
  const floatGroupsRef = useRef<THREE.Group[]>([]);
  const rigRef = useRef<THREE.Group | null>(null);
  const wrongPulseRef = useRef<THREE.Group | null>(null);
  const completionStartedRef = useRef(false);
  const [isComplete, setIsComplete] = useState(false);
  const [sceneError, setSceneError] = useState<string | null>(null);

  const pressKeycap = useCallback((index: number) => {
    const keycap = keycapsRef.current[index];
    if (!keycap) {
      const fallback = document.querySelector<HTMLElement>(`[data-fallback-index="${index}"]`);
      if (fallback) {
        gsap
          .timeline()
          .to(fallback, { y: 10, scale: 0.94, duration: 0.08, ease: "power3.out" })
          .to(fallback, { y: 0, scale: 1, duration: 0.32, ease: "elastic.out(1, 0.5)" });
      }
      return;
    }

    const glowMaterial = keycap.glow.material as THREE.MeshBasicMaterial;
    const underglowMaterial = keycap.underglow.material as THREE.MeshBasicMaterial;
    const switchMaterial = keycap.switchStem.material as THREE.MeshPhysicalMaterial;
    const underlight = keycap.underlight;
    gsap.killTweensOf([
      keycap.root.position,
      keycap.root.rotation,
      keycap.root.scale,
      glowMaterial,
      underglowMaterial,
      switchMaterial,
      underlight,
    ]);

    gsap
      .timeline()
      .to(
        keycap.root.position,
        {
          y: keycap.restingY - 0.32,
          duration: 0.1,
          ease: "power3.out",
        },
        0,
      )
      .to(
        keycap.root.rotation,
        {
          x: keycap.root.rotation.x + 0.055,
          z: keycap.root.rotation.z - 0.025,
          duration: 0.08,
          ease: "power3.out",
        },
        0,
      )
      .to(
        keycap.root.scale,
        {
          x: 0.975,
          y: 0.92,
          z: 0.975,
          duration: 0.1,
          ease: "power3.out",
        },
        0,
      )
      .to(glowMaterial, { opacity: 0.55, duration: 0.08, ease: "power2.out" }, 0)
      .to(underglowMaterial, { opacity: 0.3, duration: 0.1, ease: "power2.out" }, 0)
      .to(switchMaterial, { opacity: 0.62, emissiveIntensity: 2.3, duration: 0.1, ease: "power2.out" }, 0)
      .to(underlight, { intensity: 2.35, duration: 0.1, ease: "power2.out" }, 0)
      .to(keycap.root.position, { y: keycap.restingY + 0.055, duration: 0.2, ease: "back.out(3)" })
      .to(keycap.root.position, { y: keycap.restingY, duration: 0.18, ease: "power2.out" })
      .to(keycap.root.rotation, { x: keycap.root.rotation.x, z: keycap.root.rotation.z, duration: 0.32, ease: "power2.out" }, 0.09)
      .to(keycap.root.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: "elastic.out(1, 0.55)" }, 0.09)
      .to(glowMaterial, { opacity: 0, duration: 0.35, ease: "power2.out" }, 0.12)
      .to(underglowMaterial, { opacity: 0.045, duration: 0.46, ease: "power2.out" }, 0.12)
      .to(switchMaterial, { opacity: 0.28, emissiveIntensity: 0.62, duration: 0.46, ease: "power2.out" }, 0.12)
      .to(underlight, { intensity: 0.42, duration: 0.46, ease: "power2.out" }, 0.12);
  }, []);

  const shakeRig = useCallback(() => {
    const rig = wrongPulseRef.current;
    if (!rig) {
      const fallback = document.querySelector<HTMLElement>(".fallback-keycaps");
      if (fallback) {
        gsap
          .timeline()
          .to(fallback, { x: -8, duration: 0.045, ease: "power2.out" })
          .to(fallback, { x: 8, duration: 0.055, ease: "power2.out" })
          .to(fallback, { x: 0, duration: 0.08, ease: "power2.out" });
      }
      return;
    }
    gsap.killTweensOf(rig.position);
    gsap
      .timeline()
      .to(rig.position, { x: -0.045, duration: 0.045, ease: "power2.out" })
      .to(rig.position, { x: 0.045, duration: 0.055, ease: "power2.out" })
      .to(rig.position, { x: 0, duration: 0.08, ease: "power2.out" });
  }, []);

  const completeIntro = useCallback(() => {
    if (completionStartedRef.current) return;
    completionStartedRef.current = true;

    const rig = rigRef.current;
    if (!rig) {
      setIsComplete(true);
      gsap.delayedCall(0.55, onComplete);
      return;
    }

    setIsComplete(true);
    keycapsRef.current.forEach((keycap, index) => {
      const glowMaterial = keycap.glow.material as THREE.MeshBasicMaterial;
      const underglowMaterial = keycap.underglow.material as THREE.MeshBasicMaterial;
      const switchMaterial = keycap.switchStem.material as THREE.MeshPhysicalMaterial;
      const underlight = keycap.underlight;
      gsap.to(glowMaterial, {
        opacity: 0.42,
        duration: 0.18,
        delay: index * 0.035,
        yoyo: true,
        repeat: 1,
      });
      gsap.to(underglowMaterial, {
        opacity: 0.18,
        duration: 0.18,
        delay: index * 0.035,
        yoyo: true,
        repeat: 1,
      });
      gsap.to(switchMaterial, {
        opacity: 0.5,
        emissiveIntensity: 1.65,
        duration: 0.18,
        delay: index * 0.035,
        yoyo: true,
        repeat: 1,
      });
      gsap.to(underlight, {
        intensity: 1.55,
        duration: 0.18,
        delay: index * 0.035,
        yoyo: true,
        repeat: 1,
      });
      gsap.to(keycap.root.position, {
        y: keycap.restingY + 0.18,
        duration: 0.55,
        delay: index * 0.035,
        ease: "power3.out",
      });
    });

    gsap
      .timeline({ delay: 0.42, onComplete })
      .to(rig.rotation, { x: -0.18, y: 0, z: 0, duration: 0.72, ease: "power3.inOut" }, 0)
      .to(rig.position, { y: 0.4, z: -0.7, duration: 0.72, ease: "power3.inOut" }, 0)
      .to(rig.scale, { x: 0.82, y: 0.82, z: 0.82, duration: 0.72, ease: "power3.inOut" }, 0);
  }, [onComplete]);

  const { cursor, progress, submitKey } = useTypingSequence({
    target: TARGET,
    enabled: !isComplete,
    onCorrect: pressKeycap,
    onWrong: shakeRig,
    onComplete: completeIntro,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setSceneError("Canvas element is not available.");
      return;
    }

    let disposed = false;
    let frame = 0;
    let keycaps: KeycapObject[] = [];
    let renderer: THREE.WebGLRenderer | null = null;
    let resize: (() => void) | null = null;

    const cleanup = () => {
      if (disposed) return;
      disposed = true;

      cancelAnimationFrame(frame);
      if (resize) {
        window.removeEventListener("resize", resize);
      }

      keycaps.forEach((keycap) => {
        gsap.killTweensOf([keycap.root.position, keycap.root.rotation, keycap.root.scale]);
        keycap.root.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      });

      if (renderer) {
        disposeRenderer(renderer);
      }

      sceneRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      keycapsRef.current = [];
      floatGroupsRef.current = [];
      rigRef.current = null;
      wrongPulseRef.current = null;
    };

    try {
      const webglSupport = getWebGLSupport();
      if (!webglSupport.webgl2) {
        logWebGLDiagnostics(webglSupport, {
          success: false,
          errorMessage: "WebGL2 is unavailable. three@0.181.2 WebGLRenderer requests a webgl2 context.",
        });
        setSceneError("WebGL2 unavailable");
        return cleanup;
      }

      const scene = new THREE.Scene();
      scene.background = null;
      scene.fog = new THREE.Fog("#07080b", 8, 18);
      sceneRef.current = scene;

      const camera = createCamera();
      cameraRef.current = camera;

      try {
        renderer = createRenderer(canvas);
        logWebGLDiagnostics(webglSupport, { success: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown WebGLRenderer creation error.";
        logWebGLDiagnostics(webglSupport, { success: false, errorMessage: message });
        setSceneError(`renderer failed: ${message}`);
        return cleanup;
      }

      rendererRef.current = renderer;

      addStudioLighting(scene);

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(18, 18),
        new THREE.ShadowMaterial({ color: "#05070b", opacity: 0.34 }),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.03;
      floor.receiveShadow = true;
      scene.add(floor);

      const rig = new THREE.Group();
      // 키캡 전체 줄의 위치와 각도입니다. 전체 제품샷 구도를 바꾸고 싶을 때 여기부터 조정하세요.
      // y를 키우면 줄이 위로 올라가고, z를 키우면 더 가까워 보이며, rotation.x는 내려다보는 각도입니다.
      rig.position.set(0, 0.18, 0.08);
      rig.rotation.x = -0.1;
      rig.rotation.z = -0.085;
      scene.add(rig);
      rigRef.current = rig;
      wrongPulseRef.current = rig;

      // 키캡 사이 간격입니다. 값을 줄이면 더 붙고, 키우면 더 넓게 퍼집니다.
      const spacing = 1.22;
      const totalWidth = (TARGET.length - 1) * spacing;
      const floatGroups: THREE.Group[] = [];
      keycaps = TARGET.split("").map((letter, index) => {
        const keycap = createKeycap(letter, palettes[index]);
        const floatGroup = new THREE.Group();
        keycap.root.traverse((child) => {
          child.userData.keycapIndex = index;
        });
        const x = index * spacing - totalWidth / 2;
        const offset = Math.sin(index * 0.9) * 0.12;
        floatGroup.position.set(x, 0, 0);
        keycap.root.position.set(0, offset, 0);
        keycap.restingY = offset;
        // 키캡마다 조금씩 다른 회전을 줘서 제품 렌더처럼 자연스럽게 휘어진 줄을 만듭니다.
        // 더 반듯한 키보드 줄을 원하면 아래 배율 숫자를 줄이면 됩니다.
        floatGroup.userData.baseRotationY = THREE.MathUtils.degToRad((index - 3) * -2.6);
        floatGroup.userData.baseRotationZ = THREE.MathUtils.degToRad((index - 3) * 1.2);
        floatGroup.rotation.y = floatGroup.userData.baseRotationY;
        floatGroup.rotation.z = floatGroup.userData.baseRotationZ;
        floatGroup.add(keycap.root);
        rig.add(floatGroup);
        floatGroups.push(floatGroup);
        return keycap;
      });
      keycapsRef.current = keycaps;
      floatGroupsRef.current = floatGroups;

      const layoutKeycaps = (width: number) => {
        const isMobile = width < 720;

        keycaps.forEach((keycap, index) => {
          const floatGroup = floatGroups[index];
          if (!floatGroup) return;
          const offset = Math.sin(index * 0.9) * 0.12;

          if (isMobile) {
            // 모바일에서는 yul(3개) + ssem(4개) 두 줄로 배치합니다.
            const firstRowCount = 3;
            const row = index < firstRowCount ? 0 : 1;
            const rowCount = row === 0 ? firstRowCount : TARGET.length - firstRowCount;
            const column = row === 0 ? index : index - firstRowCount;
            const mobileSpacing = row === 0 ? 1.22 : 0.94;
            const x = (column - (rowCount - 1) / 2) * mobileSpacing;
            const z = row === 0 ? -0.72 : 0.9;

            floatGroup.position.set(x, 0, z);
            keycap.root.position.set(0, offset, 0);
            keycap.restingY = offset;
            floatGroup.userData.baseRotationY = THREE.MathUtils.degToRad((column - (rowCount - 1) / 2) * -2.2);
            floatGroup.userData.baseRotationZ = THREE.MathUtils.degToRad((column - (rowCount - 1) / 2) * 1.1);
            floatGroup.rotation.y = floatGroup.userData.baseRotationY;
            floatGroup.rotation.z = floatGroup.userData.baseRotationZ;
            return;
          }

          // 데스크톱에서는 한 줄 제품샷 구도를 유지합니다.
          const x = index * spacing - totalWidth / 2;
          floatGroup.position.set(x, 0, 0);
          keycap.root.position.set(0, offset, 0);
          keycap.restingY = offset;
          floatGroup.userData.baseRotationY = THREE.MathUtils.degToRad((index - 3) * -2.6);
          floatGroup.userData.baseRotationZ = THREE.MathUtils.degToRad((index - 3) * 1.2);
          floatGroup.rotation.y = floatGroup.userData.baseRotationY;
          floatGroup.rotation.z = floatGroup.userData.baseRotationZ;
        });
      };

      gsap.fromTo(
        rig.position,
        { y: -0.18, z: 0.2 },
        { y: 0.1, z: 0, duration: 1.1, ease: "power3.out" },
      );
      gsap.fromTo(
        keycaps.map((keycap) => keycap.root.scale),
        { x: 0.82, y: 0.82, z: 0.82 },
        { x: 1, y: 1, z: 1, duration: 0.9, stagger: 0.045, ease: "back.out(2.2)" },
      );

      resize = () => {
        if (!renderer) return;
        const bounds = canvas.getBoundingClientRect();
        const width = Math.max(bounds.width, 1);
        const height = Math.max(bounds.height, 1);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        const aspect = width / height;
        layoutKeycaps(width);

        // 화면 크기별 카메라 구도입니다. 넓은 화면은 아래 첫 번째 조건을 사용합니다.
        // camera의 y/z 값을 키우면 키캡이 작아지고, 줄이면 더 확대됩니다.
        rig.position.z = aspect > 1.65 ? 0.28 : 0.08;
        rig.position.y = 0.18;

        if (aspect > 1.65) {
          // 데스크톱 와이드 화면용 카메라입니다.
          rig.scale.setScalar(0.5);
          camera.position.set(0, 4.85, 2.36);
        } else if (width < 720) {
          // 모바일: yul/ssem 두 줄이 잘리지 않도록 스케일을 줄이고 카메라를 뒤로 뺍니다.
          rig.scale.setScalar(0.44);
          camera.position.set(0, 7.25, 3.65);
        } else {
          // 태블릿 또는 중간 너비 브라우저용 카메라입니다.
          const fitScale = THREE.MathUtils.clamp(width / 1280, 0.42, 0.56);
          rig.scale.setScalar(fitScale);
          camera.position.set(0, 5.85, 2.92);
        }

        // 카메라가 바라보는 지점입니다. 키캡 줄이 화면에서 어긋나 보이면 이 값을 조정하세요.
        camera.lookAt(0, 0.1, 0.06);
        camera.updateProjectionMatrix();
      };

      resize();
      window.addEventListener("resize", resize);

      const clock = new THREE.Clock();
      const render = () => {
        frame = requestAnimationFrame(render);
        const elapsed = clock.getElapsedTime();
        rig.rotation.y = Math.sin(elapsed * 0.32) * 0.018;
        rig.position.x = Math.sin(elapsed * 0.26) * 0.018;
        floatGroups.forEach((floatGroup, index) => {
          const phase = index * 0.83;
          const drift = Math.sin(elapsed * (0.58 + index * 0.035) + phase);
          const sway = Math.cos(elapsed * (0.46 + index * 0.03) + phase);
          const baseRotationY = floatGroup.userData.baseRotationY ?? 0;
          const baseRotationZ = floatGroup.userData.baseRotationZ ?? 0;

          floatGroup.position.y = drift * 0.075;
          floatGroup.rotation.x = THREE.MathUtils.degToRad(sway * 1.4);
          floatGroup.rotation.y = baseRotationY + THREE.MathUtils.degToRad(Math.sin(elapsed * 0.37 + phase) * 1.1);
          floatGroup.rotation.z = baseRotationZ + THREE.MathUtils.degToRad(Math.cos(elapsed * 0.31 + phase) * 0.9);
        });
        renderer?.render(scene, camera);
      };

      render();

      return cleanup;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to initialize the Three.js scene.";
      setSceneError(message);
      console.error("KeycapIntro scene failed:", error);
      return cleanup;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    if (!canvas || !camera || isComplete) return;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerDown = (event: PointerEvent) => {
      const keycaps = keycapsRef.current;
      if (!keycaps.length) return;

      const bounds = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      const targets: THREE.Object3D[] = [];
      keycaps.forEach((keycap) => {
        keycap.root.traverse((child) => {
          if (child instanceof THREE.Mesh || child instanceof THREE.Sprite) {
            targets.push(child);
          }
        });
      });

      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(targets, false)[0];
      const index = hit?.object.userData.keycapIndex;
      if (typeof index !== "number") return;

      event.preventDefault();
      submitKey(TARGET[index]);
    };

    canvas.addEventListener("pointerdown", handlePointerDown, { passive: false });
    return () => canvas.removeEventListener("pointerdown", handlePointerDown);
  }, [isComplete, submitKey]);

  return (
    <section className="intro-stage" data-complete={isComplete}>
      <canvas ref={canvasRef} className="intro-canvas" data-disabled={Boolean(sceneError)} aria-hidden="true" />

      {sceneError ? (
        <WebGLIntro cursor={cursor} reason={sceneError} onKeyPress={submitKey} onSkip={completeIntro} />
      ) : null}

      <div className="intro-copy">
        <p className="eyebrow">type the sequence</p>
        <h1>yulssem</h1>
        <div className="sequence" aria-label={`Typing progress ${cursor} of ${TARGET.length}`}>
          {TARGET.split("").map((letter, index) => (
            <button
              key={`${letter}-${index}`}
              type="button"
              className="sequence-letter"
              data-active={cursor === index}
              data-done={cursor > index}
              disabled={isComplete}
              onClick={() => submitKey(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="progress-track" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
    </section>
  );
}
