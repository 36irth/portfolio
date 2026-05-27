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
import { SEQUENCE } from './constants';
import { detectWebGL } from '../../utils/webgl';
import styles from './KeyboardIntro.module.css';
import SplitText from './SplitText';

let _instanceCount = 0;

export function KeyboardIntro({ onComplete }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const completedRef = useRef(false);
  const ownedRef = useRef(false);
  const skipSequenceRef = useRef(null);
  const skipTimersRef = useRef([]);
  const isSkippingRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [webglError, setWebglError] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isTitleDone, setIsTitleDone] = useState(false);

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

    const clearSkipTimers = () => {
      skipTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      skipTimersRef.current = [];
    };

    const handleComplete = () => {
      if (completedRef.current) return;
      clearSkipTimers();
      completedRef.current = true;
      onComplete?.();
    };

    const runCompletionExit = () => {
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
    };

    scene.setAnimationCallbacks({
      onEntrance: (keycaps) => animateEntrance(keycaps),
      onPress: (keycap) => animatePress(keycap),
      onWrongKey: (index) => {
        const keycap = scene.keycaps[index];
        if (keycap) animateWrongKey(keycap);
      },
      onCompletion: runCompletionExit,
    });

    if (scene.keycaps[0]) startNextHighlight(scene.keycaps[0], scene.switchLight);

    skipSequenceRef.current = () => {
      if (completedRef.current || isSkippingRef.current) return;

      const remaining = SEQUENCE.slice(scene.currentIndex);
      if (!remaining.length) {
        runCompletionExit();
        return;
      }

      isSkippingRef.current = true;
      setIsSkipping(true);
      clearSkipTimers();
      scene.canvas.style.pointerEvents = 'none';

      remaining.forEach((key, idx) => {
        const timer = window.setTimeout(() => {
          scene.handleKey(key);
        }, 120 + idx * 180);
        skipTimersRef.current.push(timer);
      });
    };

    const handleKeyDown = (e) => {
      if (isSkippingRef.current) return;
      if (e.repeat) return;
      if (e.key === 'Escape') {
        handleComplete();
        return;
      }
      scene.handleKey(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      skipSequenceRef.current = null;
      clearSkipTimers();
      isSkippingRef.current = false;
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
            <span className={styles.skipLabel}>Skip</span>
          </button>
        </div>
      </div>
    );
  }

  const handleSkip = () => {
    skipSequenceRef.current?.();
  };

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.introCopy}>
        <SplitText
          className={styles.introTitle}
          stagger={0.012}
          duration={0.56}
          ease="power3.out"
          animationDelay={0.12}
          onComplete={() => setIsTitleDone(true)}
          segments={[
            { text: 'CHAEI', className: styles.titleAccent },
            { text: ' wants to', className: styles.titleLight },
            { isBreak: true },
            { text: 'share a ', className: styles.titleStrong },
            { text: 'PORTFOLIO', className: styles.titleAccent },
            { text: ' with you.', className: styles.titleLight },
          ]}
        />

        <p className={`${styles.introHint} ${isTitleDone ? styles.introHintReady : ''}`}>
          CHAEI를 입력하거나 키보드를 클릭해보세요.
        </p>
      </div>

      <div className={`${styles.introStage} ${isTitleDone ? styles.introStageReady : ''}`}>
        <div className={styles.messageRail}>
          <div className={styles.messageBubble}>CHAEI</div>
          <div className={styles.deliveryMeta}>Delivered</div>
        </div>
      </div>

      {!isSkipping && !showCompletion && (
        <button className={styles.skipButton} onClick={handleSkip}>
          <span className={styles.skipLabel}>skip</span>
        </button>
      )}

      {showCompletion && (
        <div className={styles.completionOverlay}>
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
