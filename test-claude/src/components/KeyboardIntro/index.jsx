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

const bubbleTail = 'https://www.figma.com/api/mcp/asset/9b0f7292-ef30-456a-9dd4-a66f93a46338';

let instanceCount = 0;

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
  const [isSkipping, setIsSkipping] = useState(false);
  const [isTitleDone, setIsTitleDone] = useState(false);

  const typedValue = SEQUENCE.slice(0, progress).join('').toUpperCase();
  const isDelivered = progress >= SEQUENCE.length;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    detectWebGL();
    if (ownedRef.current) return undefined;
    ownedRef.current = true;
    instanceCount += 1;

    let scene;
    try {
      scene = new SceneManager(canvas, {
        onComplete: undefined,
        onProgress: (idx) => {
          setProgress(idx);
        },
      });
    } catch (err) {
      setWebglError(true);
      ownedRef.current = false;
      return undefined;
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
      scene.canvas.style.pointerEvents = 'none';
      let didFinish = false;
      const finish = () => {
        if (didFinish) return;
        didFinish = true;
        handleComplete();
      };
      const fallback = window.setTimeout(finish, 2600);

      try {
        animateCompletionExit(
          scene.keycaps,
          () => {
            window.clearTimeout(fallback);
            finish();
          },
          scene.switchLight,
        );
      } catch (error) {
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

    if (scene.keycaps[0]) {
      startNextHighlight(scene.keycaps[0], scene.switchLight);
    }

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
      instanceCount -= 1;
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
          <p className={styles.fallbackText}>This browser could not start the 3D intro.</p>
          <button className={styles.skipButton} onClick={() => onComplete?.()}>
            <span className={styles.skipLabel}>skip</span>
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

      <div className={styles.layout}>
        <div className={styles.topRow}>
          <div className={styles.introCopy}>
            <SplitText
              className={styles.introTitle}
              stagger={0.012}
              duration={0.56}
              ease="power3.out"
              animationDelay={0.12}
              onComplete={() => setIsTitleDone(true)}
              segments={[
                { text: 'CHAEI', className: styles.titleChaei },
                { text: ' wants to', className: styles.titleWants },
                { isBreak: true },
                { text: 'share a', className: styles.titleShare },
                { text: ' ', className: styles.titleShare },
                { text: 'PORTFOLIO', className: styles.titlePortfolio },
                { text: ' with you.', className: styles.titleWithYou },
              ]}
            />

            <p className={`${styles.introHint} ${isTitleDone ? styles.introHintReady : ''}`}>
              <span className={styles.hintStrong}>CHAEI</span>
              <span className={styles.hintLight}>를 입력하거나 키보드를 </span>
              <span className={styles.hintStrong}>클릭</span>
              <span className={styles.hintLight}>해보세요.</span>
            </p>
          </div>

          {!isSkipping && (
            <button className={styles.skipButton} onClick={handleSkip}>
              <span className={styles.skipLabel}>skip</span>
            </button>
          )}
        </div>

        <div className={`${styles.bottomRow} ${isTitleDone ? styles.bottomRowReady : ''}`}>
          <div className={styles.introStage}>
            <div className={styles.messageRail}>
              <div className={styles.messageBubbleWrap}>
                <div className={styles.messageBubble}>{typedValue || '\u00a0'}</div>
                <img src={bubbleTail} alt="" className={styles.messageTail} />
              </div>
              {isDelivered && <div className={styles.deliveryMeta}>Delivered</div>}
            </div>
            <div className={styles.keyboardSlot} aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default KeyboardIntro;
