import gsap from 'gsap';
import { SCENE } from './constants';
import { setKeycapDone } from './Keycap';

export function startNextHighlight(keycap, light) {
  const { glowMat, glowSpriteMat } = keycap.userData;
  gsap.killTweensOf(glowMat);
  gsap.set(glowMat, { opacity: 0 });

  // 3D 스프라이트 — 타이밍 이슈 없이 즉시 동작
  if (glowSpriteMat) {
    gsap.killTweensOf(glowSpriteMat);
    gsap.to(glowSpriteMat, {
      opacity: 0.75,
      duration: 0.9,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  // PointLight — 주변 키캡 면 조명
  if (light) {
    gsap.killTweensOf(light);
    light.position.set(
      keycap.position.x,
      keycap.userData.restY - 0.55,
      keycap.position.z,
    );
    gsap.to(light, {
      intensity: 2.8,
      duration: 0.95,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }
}

export function clearNextHighlight(keycap, light) {
  const { glowMat, glowSpriteMat } = keycap.userData;
  gsap.killTweensOf(glowMat);
  gsap.set(glowMat, { opacity: 0 });

  if (glowSpriteMat) {
    gsap.killTweensOf(glowSpriteMat);
    gsap.to(glowSpriteMat, { opacity: 0, duration: 0.18, ease: 'power2.out' });
  }

  if (light) {
    gsap.killTweensOf(light);
    gsap.to(light, { intensity: 0, duration: 0.18, ease: 'power2.out' });
  }
}

export function startFloat(keycap, index) {
  if (keycap.userData.isCompleting) return;
  const { restY } = keycap.userData;
  keycap.position.y = restY;
  gsap.to(keycap.position, {
    y: restY + 0.05,
    duration: 1.55 + index * 0.12,
    delay: index * 0.15,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  });
}

export function stopFloat(keycap) {
  gsap.killTweensOf(keycap.position);
}

export function animatePress(keycap) {
  if (keycap.userData.isCompleting) return null;
  stopFloat(keycap);
  const { bodyMat, glowMat, glowSpriteMat, restY, index, pressParts } = keycap.userData;
  gsap.killTweensOf(glowMat);
  gsap.killTweensOf(bodyMat);
  if (glowSpriteMat) gsap.killTweensOf(glowSpriteMat);
  if (pressParts) pressParts.forEach(({ obj }) => gsap.killTweensOf(obj.position));

  const tl = gsap.timeline({
    onComplete: () => {
      if (!keycap.userData.isCompleting) startFloat(keycap, index);
    },
  });
  const groupDepth = pressParts ? SCENE.pressDepth * 0.35 : SCENE.pressDepth;
  const capDepth = SCENE.pressDepth * 0.95;

  // 누름
  tl.to(keycap.position, { y: restY - groupDepth, duration: 0.07, ease: 'power3.in' }, 0);
  if (pressParts) {
    pressParts.forEach(({ obj, restY: partRestY }) => {
      tl.to(obj.position, { y: partRestY - capDepth, duration: 0.07, ease: 'power3.in' }, 0);
    });
  }
  tl.to(glowMat,         { opacity: 0.65,               duration: 0.07 }, 0);
  tl.to(bodyMat,         { emissiveIntensity: 0.35,      duration: 0.07 }, 0);
  if (glowSpriteMat) {
    tl.to(glowSpriteMat, { opacity: 0.95, duration: 0.07 }, 0);
    tl.to(glowSpriteMat, { opacity: 0,    duration: 0.4,  ease: 'power2.out' }, 0.07);
  }

  // 최저점에서 오렌지로 전환
  tl.call(() => setKeycapDone(keycap), [], 0.07);

  // 튀어오름
  tl.to(keycap.position, { y: restY + 0.06, duration: 0.20, ease: 'power2.out' });
  tl.to(glowMat,         { opacity: 0,      duration: 0.38, ease: 'power2.out' }, 0.07);
  tl.to(bodyMat,         { emissiveIntensity: 0.08, duration: 0.42, ease: 'power2.out' }, 0.07);
  if (pressParts) {
    pressParts.forEach(({ obj, restY: partRestY }) => {
      tl.to(obj.position, { y: partRestY, duration: 0.2, ease: 'power2.out' }, 0.07);
    });
  }
  tl.to(keycap.position, { y: restY,        duration: 0.14, ease: 'power2.inOut' });

  return tl;
}

export function animateWrongKey(keycap) {
  const baseX = keycap.position.x;
  const tl = gsap.timeline();
  [-0.05, 0.05, -0.04, 0.04, 0].forEach((dx) => {
    tl.to(keycap.position, { x: baseX + dx, duration: 0.05, ease: 'power1.inOut' });
  });
  return tl;
}

export function animateEntrance(keycaps) {
  keycaps.forEach((keycap, i) => {
    const { bodyMat, labelMat, restY } = keycap.userData;
    keycap.position.y = restY + 8;
    bodyMat.opacity = 0;
    bodyMat.transparent = true;
    labelMat.opacity = 0;
    labelMat.transparent = true;

    const d = 0.4 + i * 0.09;
    gsap.to(keycap.position, { y: restY, duration: 0.85, delay: d,        ease: 'power4.out' });
    gsap.to(bodyMat, {
      opacity: 1,
      duration: 0.4,
      delay: d,
      onComplete: () => {
        bodyMat.transparent = false;
        bodyMat.needsUpdate = true;
      },
    });
    gsap.to(labelMat,        { opacity: 1, duration: 0.5,  delay: d + 0.2 });
    const floatCall = gsap.delayedCall(d + 1.1, () => startFloat(keycap, i));
    keycap.userData.floatCall = floatCall;
  });
}

export function animateCompletionExit(keycaps, onDone, light) {
  let doneCalled = false;
  const finish = () => {
    if (doneCalled) return;
    doneCalled = true;
    if (typeof onDone === 'function') onDone();
  };

  keycaps.forEach((keycap) => {
    keycap.userData.isCompleting = true;
    keycap.userData.floatCall?.kill?.();
    keycap.userData.floatCall = null;
    stopFloat(keycap);
    gsap.killTweensOf(keycap.position);
    const { bodyMat, glowMat, labelMat, glowSpriteMat } = keycap.userData;
    if (bodyMat) gsap.killTweensOf(bodyMat);
    if (glowMat) gsap.killTweensOf(glowMat);
    if (labelMat) gsap.killTweensOf(labelMat);
    if (glowSpriteMat) {
      gsap.killTweensOf(glowSpriteMat);
      gsap.to(glowSpriteMat, { opacity: 0, duration: 0.22, ease: 'power2.out' });
    }
  });

  if (light) {
    gsap.killTweensOf(light);
    gsap.to(light, { intensity: 0, duration: 0.25, ease: 'power2.out' });
  }

  const waveStep = 0.08;
  const waveDuration = 0.72;
  const exitDelay = (keycaps.length - 1) * waveStep + waveDuration + 0.18;
  const tl = gsap.timeline({ onComplete: finish });

  keycaps.forEach((keycap, i) => {
    const { bodyMat, glowMat, restY } = keycap.userData;
    const at = i * waveStep;
    tl.to(keycap.position, { y: restY + 0.72, duration: 0.22, ease: 'power2.out' }, at);
    tl.to(keycap.position, { y: restY, duration: 0.5, ease: 'elastic.out(1,0.52)' }, at + 0.22);
    if (glowMat) {
      tl.to(glowMat, { opacity: 0.65, duration: 0.16, ease: 'power2.out' }, at);
      tl.to(glowMat, { opacity: 0, duration: 0.5, ease: 'power2.out' }, at + 0.18);
    }
    if (bodyMat) {
      tl.to(bodyMat, { emissiveIntensity: 0.5, duration: 0.16, ease: 'power2.out' }, at);
      tl.to(bodyMat, { emissiveIntensity: 0.08, duration: 0.5, ease: 'power2.out' }, at + 0.18);
    }
  });

  keycaps.forEach((keycap, i) => {
    const { bodyMat, labelMat } = keycap.userData;
    const at = exitDelay + i * 0.045;
    tl.to(keycap.position, { y: keycap.userData.restY + 9.5, duration: 0.62, ease: 'power4.in' }, at);
    if (bodyMat) {
      bodyMat.transparent = true;
      bodyMat.needsUpdate = true;
      tl.to(bodyMat, { opacity: 0, duration: 0.34, ease: 'power2.in' }, at + 0.22);
    }
    if (labelMat) {
      tl.to(labelMat, { opacity: 0, duration: 0.28, ease: 'power2.in' }, at + 0.2);
    }
  });

  gsap.delayedCall(exitDelay + keycaps.length * 0.045 + 1.0, finish);
  return tl;
}

export function animateCompletion(keycaps, onDone, light) {
  keycaps.forEach((kc) => {
    stopFloat(kc);
    const { glowSpriteMat } = kc.userData;
    if (glowSpriteMat) {
      gsap.killTweensOf(glowSpriteMat);
      gsap.to(glowSpriteMat, { opacity: 0, duration: 0.25 });
    }
  });

  // 언더글로우 종료
  if (light) {
    gsap.killTweensOf(light);
    gsap.to(light, { intensity: 0, duration: 0.3 });
  }

  // 오렌지 웨이브 바운스
  const waveStep = 0.07;
  keycaps.forEach((keycap, i) => {
    const { bodyMat, glowMat, restY } = keycap.userData;
    const tl = gsap.timeline({ delay: i * waveStep });
    tl.to(keycap.position, { y: restY + 0.7, duration: 0.22, ease: 'power2.out' }, 0);
    tl.to(glowMat,         { opacity: 0.65,  duration: 0.18 }, 0);
    tl.to(bodyMat,         { emissiveIntensity: 0.5, duration: 0.18 }, 0);
    tl.to(keycap.position, { y: restY,       duration: 0.45, ease: 'elastic.out(1,0.5)' }, 0.22);
    tl.to(glowMat,         { opacity: 0,     duration: 0.55, ease: 'power2.out' }, 0.18);
    tl.to(bodyMat,         { emissiveIntensity: 0.08, duration: 0.55 }, 0.18);
  });

  // 웨이브 완료 후 키캡 페이드 아웃
  const phase2 = (keycaps.length - 1) * waveStep + 0.67 + 0.9;
  let doneCalled = false;
  const finish = () => {
    if (doneCalled) return;
    doneCalled = true;
    if (typeof onDone === 'function') onDone();
  };

  gsap.delayedCall((keycaps.length - 1) * waveStep + 0.9, finish);
  return;

  keycaps.forEach((keycap, i) => {
    const { bodyMat, labelMat } = keycap.userData;
    const d = phase2 + i * 0.05;
    const isLast = i === keycaps.length - 1;
    gsap.to(keycap.position, { y: 12,      duration: 0.65, delay: d,        ease: 'power4.in' });
    gsap.to(bodyMat,         { opacity: 0,  duration: 0.38, delay: d + 0.27, ease: 'power2.in' });
    gsap.to(labelMat,        { opacity: 0,  duration: 0.3,  delay: d + 0.25,
      onComplete: isLast ? finish : undefined,
    });
  });

  gsap.delayedCall(phase2 + keycaps.length * 0.05 + 0.9, finish);
}
