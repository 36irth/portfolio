import { useEffect, useRef, useState } from 'react';
import { SceneManager } from './SceneManager';
import {
  animateEntrance,
  animatePress,
  animateWrongKey,
  animateCompletionExit,
  startNextHighlight,
  clearNextHighlight,
} from './animations';
import { SEQUENCE, KEYCAP_CONFIGS } from './constants';
import { detectWebGL } from '../../utils/webgl';
import styles from './KeyboardIntro.module.css';
import TypeText from './TypeText';

let _instanceCount = 0;

export function KeyboardIntro({ onComplete }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const completedRef = useRef(false);
  const ownedRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [webglError, setWebglError] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

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
      onEntrance: (keycaps) => animateEntrance(keycaps),
      onPress: (keycap) => animatePress(keycap),
      onWrongKey: (index) => {
        const keycap = scene.keycaps[index];
        if (keycap) animateWrongKey(keycap);
      },
      onCompletion: () => {
        let didFinish = false;
        const finish = () => {
          if (didFinish) return;
          didFinish = true;
          handleComplete();
        };
        const fallback = window.setTimeout(finish, 3600);

        try {
          animateCompletionExit(scene.keycaps, () => {
            window.clearTimeout(fallback);
            finish();
          }, scene.switchLight);
        } catch (err) {
          window.clearTimeout(fallback);
          finish();
        }
      },
    });

    if (scene.keycaps[0]) startNextHighlight(scene.keycaps[0], scene.switchLight);

    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.key === 'Escape') {
        handleComplete();
        return;
      }
      scene.handleKey(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      ownedRef.current = false;
      _instanceCount -= 1;
      window.removeEventListener('keydown', handleKeyDown);
      scene.destroy();
      sceneRef.current = null;
    };
  }, [onComplete]);

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

  if (webglError) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.fallback}>
          <div className={styles.fallbackTitle}>chaei</div>
          <p className={styles.fallbackText}>
            This browser could not start the 3D intro.
          </p>
          <button className={styles.skipButton} onClick={() => onComplete?.()}>
            Skip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.introCopy}>
        <TypeText
          className={styles.introTitle}
          typingSpeed={70}
          initialDelay={400}
          cursorCharacter="|"
          cursorBlinkDuration={0.5}
          showCursor
          segments={[
            { text: 'CHAEI', className: styles.introStrong },
            { text: ' wants to', className: styles.introLight },
            { isBreak: true },
            { text: 'share a ', className: styles.introRegular },
            { text: 'portfolio', className: styles.introStrong },
            { isBreak: true },
            { text: 'with you.', className: styles.introLight },
          ]}
        />

        <p className={styles.introHint}>
          <span className={styles.introRegular}>Press any key</span>
          <span className={styles.introLight}> or </span>
          <span className={styles.introRegular}>click</span>
          <span className={styles.introLight}> CHAEI</span>
        </p>
      </div>

      <button className={styles.skipButton} onClick={() => onComplete?.()}>
        Skip
      </button>

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
          <div className={styles.completionTitle}>Complete</div>
          <div className={styles.completionSub}>Moving to main page...</div>
          <div className={styles.progressBarWrap}>
            <div className={styles.progressBarFill} />
          </div>
        </div>
      )}
    </div>
  );
}

export default KeyboardIntro;
