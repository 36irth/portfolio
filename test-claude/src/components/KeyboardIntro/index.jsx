import { useEffect, useRef, useState } from 'react';
import { SceneManager } from './SceneManager';
import {
  animateEntrance,
  animatePress,
  animateWrongKey,
  animateCompletion,
  startNextHighlight,
  clearNextHighlight,
} from './animations';
import { SEQUENCE, KEYCAP_CONFIGS } from './constants';
import { detectWebGL } from '../../utils/webgl';
import styles from './KeyboardIntro.module.css';

let _instanceCount = 0;

export function KeyboardIntro({ onComplete }) {
  const canvasRef    = useRef(null);
  const sceneRef     = useRef(null);
  const completedRef = useRef(false);
  const ownedRef     = useRef(false);

  const [progress,       setProgress]       = useState(0);
  const [webglError,     setWebglError]     = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // ── SceneManager 초기화 ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    detectWebGL();
    if (ownedRef.current) return;
    ownedRef.current = true;
    _instanceCount += 1;

    let scene;
    try {
      scene = new SceneManager(canvas, {
        onComplete: undefined,
        onProgress: (idx) => {
          setProgress(idx);
          if (idx >= SEQUENCE.length) setShowCompletion(true);
        },
      });
    } catch (err) {
      setWebglError(true);
      ownedRef.current = false;
      return;
    }

    sceneRef.current = scene;

    const handleComplete = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete?.();
    };

    scene.setAnimationCallbacks({
      onEntrance:   (keycaps) => animateEntrance(keycaps),
      onPress:      (keycap)  => animatePress(keycap),
      onWrongKey:   (index)   => {
        const keycap = scene.keycaps[index];
        if (keycap) animateWrongKey(keycap);
      },
      onCompletion: () => animateCompletion(scene.keycaps, handleComplete, scene.switchLight),
    });

    if (scene.keycaps[0]) startNextHighlight(scene.keycaps[0], scene.switchLight);

    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.key === 'Escape') { handleComplete(); return; }
      scene.handleKey(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      ownedRef.current = false;
      _instanceCount  -= 1;
      window.removeEventListener('keydown', handleKeyDown);
      scene.destroy();
      sceneRef.current = null;
    };
  }, [onComplete]);

  // ── 다음 키 하이라이트 ──────────────────────────────────────────────
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (progress > 0) {
      const prev = scene.keycaps[progress - 1];
      if (prev) clearNextHighlight(prev, scene.switchLight);
    }
    if (progress < SEQUENCE.length) {
      const next = scene.keycaps[progress];
      if (next) startNextHighlight(next, scene.switchLight);
    }
  }, [progress]);

  // ── Fallback UI ─────────────────────────────────────────────────────
  if (webglError) {
    return (
      <div className={styles.wrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.2rem', textAlign: 'center', padding: '2rem' }}>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 800 }}>
          yulssem
        </div>
        <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: '380px' }}>
          이 브라우저에서는 3D 인트로를 실행할 수 없습니다.<br />
          Chrome 설정에서 하드웨어 가속과 WebGL2 지원 상태를 확인해 주세요.
        </p>
        <button
          onClick={() => onComplete?.()}
          style={{ marginTop: '0.5rem', padding: '0.65rem 2rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.45)', borderRadius: '6px', cursor: 'pointer', letterSpacing: '0.12em', fontSize: '0.82rem' }}
        >
          인트로 건너뛰기
        </button>
      </div>
    );
  }

  // ── 정상 렌더 ───────────────────────────────────────────────────────
  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* 상단 Claude 브랜딩 */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>✳</span>
          <span className={styles.logoText}>Claude</span>
        </div>
        <div className={styles.subtitle}>
          <span className={styles.subtitleAccent}>yulssem</span>을 입력해보세요.
        </div>
      </div>

      {/* 하단 힌트 — 완료 전에만 표시 */}
      {!showCompletion && (
        <div className={styles.hint}>
          <span className={styles.hintDesktop}>
            <span className={styles.hintIcon}>ⓘ</span>
            실제 키보드로 입력하면 키가 눌립니다
          </span>
          <span className={styles.hintMobile}>
            <span className={styles.hintIcon}>ⓘ</span>
            키를 탭하여 입력하세요
          </span>
        </div>
      )}

      {/* 완료 오버레이 */}
      {showCompletion && (
        <div className={styles.completionOverlay}>
          <div className={styles.miniKeyRow}>
            {KEYCAP_CONFIGS.map((cfg, i) => (
              <span
                key={i}
                className={styles.miniKey}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {cfg.letter}
              </span>
            ))}
          </div>
          <div className={styles.completionTitle}>완료!</div>
          <div className={styles.completionSub}>메인 페이지로 이동합니다...</div>
          <div className={styles.progressBarWrap}>
            <div className={styles.progressBarFill} />
          </div>
        </div>
      )}
    </div>
  );
}

export default KeyboardIntro;
